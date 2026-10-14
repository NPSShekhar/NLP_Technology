const { test } = require("node:test");
const assert = require("node:assert/strict");
const createImageUrl = require("../utils/serviceImageUrl");

const request = (protocol, host) => ({ protocol, get: () => host });

test("new and legacy service uploads use the current backend origin", () => {
  for (const [protocol, host] of [
    ["http", "localhost:5001"],
    ["https", "nlptech.netopsys.in"],
    ["https", "staging.example.com"],
  ]) {
    for (const path of [
      "/uploads/services/photo.png",
      "uploads/services/photo.png",
      "/api/uploads/services/photo.png",
      "api/uploads/services/photo.png",
      "http://nlptech.netopsys.in/uploads/services/photo.png",
      "https://nlptech.netopsys.in/api/uploads/services/photo.png",
    ]) {
      assert.equal(createImageUrl(request(protocol, host), path),
        `${protocol}://${host}/api/uploads/services/photo.png`);
    }
  }
});

test("preserves external images and handles empty images", () => {
  const req = request("http", "localhost:5001");
  for (const url of ["https://cdn.example.com/photo.png", "https://nlptech.netopsys.in.example.com/uploads/photo.png"]) {
    assert.equal(createImageUrl(req, url), url);
  }
  assert.equal(createImageUrl(req, null), null);
  assert.equal(createImageUrl(req, ""), null);
});
