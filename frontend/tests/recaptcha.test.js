import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync(new URL('../src/lib/recaptcha.js', import.meta.url), 'utf8')
  .replace('import.meta.env.VITE_RECAPTCHA_SITE_KEY', 'siteKeyForTest')
  .replaceAll('export async function', 'async function')
  .replaceAll('export function', 'function');
function setup({ key = 'public-key', fail = false, hang = false } = {}) {
  let scripts = 0, executions = 0;
  const sandbox = { siteKeyForTest: key, setTimeout: fn => setTimeout(fn, 20), clearTimeout,
    window: { grecaptcha: { ready: cb => cb(), execute: async (site, { action }) => { executions++; assert.equal(site, key); if (fail) throw Error('upstream'); return `${action}-${executions}`; } } },
    document: { createElement: () => ({ remove() {} }), head: { appendChild(script) { scripts++; if (!hang) script.onload(); } } },
  };
  vm.runInNewContext(source, sandbox);
  return { load: sandbox.loadRecaptcha, get: sandbox.getRecaptchaToken, counts: () => ({ scripts, executions }) };
}
test('loads script once and generates fresh tokens for each action/submission', async () => {
  const api = setup();
  assert.equal(await api.get('enquiry_submit'), 'enquiry_submit-1');
  assert.equal(await api.get('admin_login'), 'admin_login-2');
  assert.equal(await api.get('enquiry_submit'), 'enquiry_submit-3');
  assert.deepEqual(api.counts(), { scripts: 1, executions: 3 });
});
test('missing key, execute failure and script timeout reject', async () => {
  for (const options of [{ key: '' }, { fail: true }, { hang: true }]) {
    await assert.rejects(setup(options).get('enquiry_submit'), /Security verification is unavailable/);
  }
});

test('preloading loads once without consuming a token', async () => {
 const api = setup();
 await Promise.all([api.load(), api.load()]);
 assert.deepEqual(api.counts(), { scripts: 1, executions: 0 });
 await api.get('enquiry_submit');
 assert.deepEqual(api.counts(), { scripts: 1, executions: 1 });
});
test('failed loads can be retried', async () => {
 const api = setup({ hang: true });
 await assert.rejects(api.load());
 await assert.rejects(api.load());
 assert.equal(api.counts().scripts, 2);
});
