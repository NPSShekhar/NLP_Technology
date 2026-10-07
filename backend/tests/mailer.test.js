const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../config/mailer.js'), 'utf8');
const env = { SMTP_HOST: 'mail.nlptec.com', SMTP_PORT: '587', SMTP_SECURE: 'false', SMTP_REQUIRE_TLS: 'true', SMTP_USER: 'webmailer.nlptec.com', SMTP_APP_PASSWORD: '  test-only-secret  ', MAIL_FROM: 'Approved Sender <sender@example.com>', ADMIN_EMAIL: 'sales@tariustechnology.com', MAIL_SUBJECT: 'Enquiry from NLPTech Website' };
function load() {
  let options;
  const sandbox = { process: { env }, module: { exports: {} }, require: name => name === "./env" ? {} : ({ createTransport(value) { options = value; return {}; } }) };
  vm.runInNewContext(source, sandbox);
  return { options, validate: sandbox.module.exports.validateConfiguration };
}
test('client SMTP uses STARTTLS with verified certificates and environment credentials', () => {
  const { options, validate } = load();
  assert.equal(options.service, undefined);
  assert.equal(options.host, env.SMTP_HOST);
  assert.equal(options.port, 587);
  assert.equal(options.secure, false);
  assert.equal(options.requireTLS, true);
  assert.equal(options.tls.rejectUnauthorized, true);
  assert.equal(options.auth.user, env.SMTP_USER);
  assert.equal(options.auth.pass, env.SMTP_APP_PASSWORD);
  assert.doesNotThrow(() => validate(env));
});
test('missing fields and invalid STARTTLS/sender fail without leaking values', () => {
  const { validate } = load();
  for (const key of Object.keys(env)) {
    assert.throws(() => validate({ ...env, [key]: '' }), error => error.code === 'SMTP_CONFIG_INVALID' && !error.message.includes(env.SMTP_APP_PASSWORD));
  }
  for (const overrides of [{ SMTP_PORT: 'bad' }, { SMTP_SECURE: 'true' }, { SMTP_REQUIRE_TLS: 'false' }, { MAIL_FROM: env.SMTP_USER }, { MAIL_FROM: 'sender@example.com\r\nBcc:other@example.com' }]) {
    assert.throws(() => validate({ ...env, ...overrides }), error => error.code === 'SMTP_CONFIG_INVALID');
  }
});
