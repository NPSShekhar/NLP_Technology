const assert = require("node:assert/strict");
const { test } = require("node:test");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const validation = require("../utils/contactValidation");

// Run the real controller and validator with isolated database/SMTP boundaries.
// These tests never connect to a database or send real email.
const source = readFileSync(path.join(__dirname, "../controllers/contactController.js"), "utf8");
const validBody = {
  name: "Test Customer",
  email: " Customer@Example.com ",
  phone: "+919876543210",
  address: "Example Company",
  message: "Please provide a quotation.",
};

async function submit({ body = validBody, failMail, failCommit = false, file } = {}) {
  const queries = [];
  const mails = [];
  let releases = 0;
  const client = {
    async query(sql) {
      queries.push(sql.trim());
      if (failCommit && sql === "COMMIT") throw new Error("Commit failed");
      return { rows: [{ id: 42, email_sent: sql.includes("UPDATE") }] };
    },
    release() { releases++; },
  };
  const dependencies = {
    "../config/db": { async connect() { return client; } },
    "../config/mailer": {
      async sendMail(options) {
        mails.push(options);
        if (mails.length === 2) {
          assert.equal(queries.at(-1), "COMMIT");
          assert.equal(releases, 1);
        }
        if (mails.length === failMail) throw new Error("SMTP unavailable");
        return { accepted: [options.to] };
      },
    },
    "../utils/contactValidation": validation,
  };
  const sandbox = {
    require(id) {
      assert.ok(Object.hasOwn(dependencies, id), `Unexpected dependency: ${id}`);
      return dependencies[id];
    },
    module: { exports: {} },
    process: { env: { MAIL_FROM: "sender@example.com", ADMIN_EMAIL: "admin@example.com" } },
    console: { log() {}, error() {} },
  };
  vm.runInNewContext(source, sandbox);
  const res = {
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
  };
  await sandbox.module.exports.createContactEnquiry({ body, file }, res);
  return { queries, mails, releases, res };
}

test("sends a separate confirmation to the entered email after saving the enquiry", async () => {
  const file = { originalname: "quote.pdf", buffer: Buffer.from("example attachment") };
  const { res, mails, releases } = await submit({ file });
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.confirmationEmailSent, true);
  assert.equal(mails.length, 2);
  assert.equal(mails[0].to, "admin@example.com");
  assert.equal(mails[0].replyTo, "customer@example.com");
  assert.equal(mails[0].attachments[0].content, file.buffer);
  assert.equal(mails[1].to.address, "customer@example.com");
  assert.equal(mails[1].from, "sender@example.com");
  assert.equal(mails[1].replyTo, "admin@example.com");
  assert.match(mails[1].text, /Hi Test Customer/);
  assert.doesNotMatch(mails[1].text, /Enquiry reference/i);
  assert.doesNotMatch(mails[1].html, /Enquiry reference/i);
  assert.match(mails[1].html, /We received your enquiry/);
  assert.equal(mails[1].attachments, undefined);
  assert.equal(releases, 1);
});

test("confirmation failure keeps the enquiry saved and explains that resubmission is unnecessary", async () => {
  const { res, queries, releases } = await submit({ failMail: 2 });
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.confirmationEmailSent, false);
  assert.match(res.body.message, /do not need to submit again/);
  assert.equal(queries.includes("ROLLBACK"), false);
  assert.equal(releases, 1);
});

test("invalid submissions do not send either email", async () => {
  const { res, queries, mails } = await submit({ body: { ...validBody, email: "invalid" } });
  assert.equal(res.statusCode, 400);
  assert.equal(mails.length, 0);
  assert.equal(queries.length, 0);
});

test("admin email failure preserves existing failure behavior without sending confirmation", async () => {
  const { res, queries, mails, releases } = await submit({ failMail: 1 });
  assert.equal(res.statusCode, 500);
  assert.equal(mails.length, 1);
  assert.equal(queries.at(-1), "ROLLBACK");
  assert.equal(releases, 1);
});

test("database commit failure never sends a customer confirmation", async () => {
  const { res, mails, releases } = await submit({ failCommit: true });
  assert.equal(res.statusCode, 500);
  assert.equal(mails.length, 1);
  assert.equal(releases, 1);
});
