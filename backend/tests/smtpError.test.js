const { test } = require('node:test');
const assert = require('node:assert/strict');
const smtpError = require('../utils/smtpError');
test('SMTP diagnostics preserve server rejection while removing passwords and AUTH payloads', () => {
 const password=' test-secret! ';
 const env={SMTP_APP_PASSWORD:password,SMTP_USER:'test-user'};
 const result=smtpError({code:'EAUTH',command:'AUTH PLAIN '+Buffer.from('\0test-user\0'+password).toString('base64'),responseCode:535,response:'535 5.7.8 Authentication failed',message:'Login failed '+password+' '+Buffer.from(password).toString('base64')},env);
 assert.equal(result.response,'535 5.7.8 Authentication failed');
 assert.equal(result.code,'EAUTH');
 assert.equal(result.responseCode,'535');
 assert.ok(!JSON.stringify(result).includes(password));
 assert.ok(!JSON.stringify(result).includes(Buffer.from(password).toString('base64')));
 assert.equal(result.command,'AUTH PLAIN [REDACTED]');
});
