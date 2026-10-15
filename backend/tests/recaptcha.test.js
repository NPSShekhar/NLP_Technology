const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const express = require('express');

function verifier(reply, env = {}, reject = false) {
  const sandbox = {
    module: { exports: {} }, URLSearchParams, AbortController,
    process: { env: { RECAPTCHA_SECRET_KEY: 'test-secret', RECAPTCHA_ALLOWED_HOSTNAMES: 'localhost', ...env } },
    setTimeout: fn => setTimeout(fn, 10), clearTimeout,
    fetch: async (url, options) => {
      assert.equal(url, 'https://www.google.com/recaptcha/api/siteverify');
      assert.equal(options.method, 'POST');
      assert.equal(options.body.get('secret'), 'test-secret');
      if (reject) return new Promise((resolve, fail) => options.signal.addEventListener('abort', () => fail(new Error('timeout'))));
      return { ok: true, json: async () => reply };
    },
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../middleware/verifyRecaptcha.js'), 'utf8'), sandbox);
  return sandbox.module.exports;
}
const valid = () => ({ success: true, score: 0.8, action: 'enquiry_submit', hostname: 'localhost', challenge_ts: new Date().toISOString() });
async function check(middleware, token = 'test-token') {
  let status = 200, passed = false;
  const res = { set() {}, status(code) { status = code; return this; }, json() {} };
  await middleware({ get: () => token }, res, () => { passed = true; });
  return { status, passed };
}
test('valid verification and configured threshold', async () => {
  assert.deepEqual(await check(verifier(valid())('enquiry_submit')), { status: 200, passed: true });
  assert.equal((await check(verifier({ ...valid(), score: 0.5 })('enquiry_submit'))).passed, true);
});
test('missing, invalid, low score, wrong action/host, stale/future/malformed and duplicate tokens fail closed', async () => {
  assert.equal((await check(verifier(valid())('enquiry_submit'), '')).status, 403);
  for (const override of [
    { success: false }, { success: 'true' }, { score: 0.49 }, { score: '0.9' }, { score: 2 },
    { action: 'admin_login' }, { hostname: 'localhost.attacker.com' },
    { challenge_ts: new Date(Date.now() - 121000).toISOString() },
    { challenge_ts: new Date(Date.now() + 60000).toISOString() }, { challenge_ts: 'bad' },
    { 'error-codes': ['timeout-or-duplicate'] },
  ]) assert.deepEqual(await check(verifier({ ...valid(), ...override })('enquiry_submit')), { status: 403, passed: false });
});
test('Google timeout and invalid configuration fail closed', async () => {
  assert.equal((await check(verifier(valid(), {}, true)('enquiry_submit'))).status, 503);
  for (const env of [{ RECAPTCHA_SECRET_KEY: '' }, { RECAPTCHA_ALLOWED_HOSTNAMES: '' }, { RECAPTCHA_MIN_SCORE: 'bad' }, { RECAPTCHA_MIN_SCORE: '' }, { RECAPTCHA_MIN_SCORE: '1.1' }]) {
    assert.equal((await check(verifier(valid(), env)('enquiry_submit'))).status, 503);
  }
});
test('actual routes gate multipart and authentication before side effects', async () => {
  let creates = 0, auth = 0;
  const controllers = { createContactEnquiry(req, res) { creates++; assert.equal(req.file.originalname, 'test.txt'); res.sendStatus(201); }, getAllContactEnquiries() {}, getContactFile() {}, deleteContactEnquiry() {} };
  let result = valid();
  const gate = action => (req, res, next) => verifier(result)(action)(req, res, next);
  const sandbox = { module: { exports: {} }, require: name => name.includes('contactController') ? controllers : name.includes('verifyRecaptcha') ? gate : name.includes('requireAdmin') ? (req, res, next) => { auth++; next(); } : require(name) };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../routes/contactRoutes.js'), 'utf8'), sandbox);
  const app = express(); app.use('/enquiries', sandbox.module.exports);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}/enquiries`;
  try {
    // Malformed multipart must be rejected before multer sees it.
    assert.equal((await fetch(url, { method: 'POST', headers: { 'Content-Type': 'multipart/form-data' }, body: 'bad' })).status, 403);
    assert.equal(creates, 0);
    const form = new FormData(); form.append('file', new Blob(['hello']), 'test.txt');
    assert.equal((await fetch(url, { method: 'POST', headers: { 'X-Recaptcha-Token': 'fresh' }, body: form })).status, 201);
    result = { success: false, 'error-codes': ['timeout-or-duplicate'] };
    assert.equal((await fetch(url, { method: 'POST', headers: { 'X-Recaptcha-Token': 'fresh' }, body: form })).status, 403);
    assert.equal(creates, 1);
    assert.equal((await fetch(url + '/access', { method: 'POST' })).status, 403);
    assert.equal(auth, 0);
    result = { ...valid(), action: 'admin_login' };
    assert.equal((await fetch(url + '/access', { method: 'POST', headers: { 'X-Recaptcha-Token': 'login' } })).status, 200);
    assert.equal(auth, 1);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
