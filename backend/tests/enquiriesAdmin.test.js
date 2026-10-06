const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const express = require("express");
const requireAdmin = require("../middleware/requireAdmin");

test("enquiry routes protect personal data and validate/delete only the selected record", async () => {
  process.env.ADMIN_USERNAME = "test-admin";
  process.env.ADMIN_PASSWORD = "test-password";
  const queries = [];
  let fail = false;
  const dependencies = {
    "../config/db": { async query(sql, values) {
      queries.push({ sql, values });
      if (fail) throw new Error("Database unavailable");
      return { rows: sql.startsWith("DELETE") ? values[0] === 7 ? [{ id: 7 }] : [] : [{ id: 7, name: "Example", message: "Private enquiry" }] };
    } },
    "../config/mailer": {},
    "../utils/contactValidation": {},
  };
  const sandbox = { module: { exports: {} }, require: name => dependencies[name], console: { error() {} } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../controllers/contactController.js"), "utf8"), sandbox);
  const routeSandbox = { module: { exports: {} }, require: name => name === "../controllers/contactController" ? sandbox.module.exports : name === "../middleware/requireAdmin" ? requireAdmin : require(name) };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../routes/contactRoutes.js"), "utf8"), routeSandbox);
  const app = express();
  app.use("/enquiries", routeSandbox.module.exports);
  const server = app.listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  const url = `http://127.0.0.1:${server.address().port}/enquiries`;
  const headers = { Authorization: `Basic ${Buffer.from("test-admin:test-password").toString("base64")}` };
  try {
    for (const [method, suffix] of [["GET", ""], ["DELETE", "/7"], ["POST", "/access"]]) {
      const response = await fetch(url + suffix, { method });
      assert.equal(response.status, 401);
    }
    assert.equal(queries.length, 0);
    assert.equal((await fetch(url, { headers: { Authorization: "Basic invalid" } })).status, 401);
    assert.equal((await fetch(url + "/access", { method: "POST", headers })).status, 200);
    const list = await fetch(url, { headers });
    assert.equal(list.headers.get("cache-control"), "no-store");
    assert.equal((await list.json()).enquiries[0].message, "Private enquiry");
    assert.match(queries[0].sql, /ORDER BY created_at DESC/);
    for (const id of ["0", "-1", "abc", "2147483648", "1%20OR%201=1"]) {
      assert.equal((await fetch(url + "/" + id, { method: "DELETE", headers })).status, 400);
    }
    assert.equal(queries.length, 1);
    assert.equal((await fetch(url + "/7", { method: "DELETE", headers })).status, 200);
    assert.equal(queries.at(-1).sql, "DELETE FROM contact_enquiries WHERE id = $1 RETURNING id");
    assert.equal(queries.at(-1).values[0], 7);
    assert.equal((await fetch(url + "/99", { method: "DELETE", headers })).status, 404);
    fail = true;
    assert.equal((await fetch(url + "/7", { method: "DELETE", headers })).status, 500);
  } finally {
    await new Promise(resolve => server.close(resolve));
    delete process.env.ADMIN_USERNAME;
    delete process.env.ADMIN_PASSWORD;
  }
});
