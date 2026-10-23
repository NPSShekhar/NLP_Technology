import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync(new URL('../src/lib/api.js', import.meta.url), 'utf8').replaceAll('import.meta.env', 'env').replace('export const API_URL =', 'globalThis.result =');
function base(url, prod = true) {
 const context = { env: { VITE_API_URL: url, PROD: prod } };
 vm.runInNewContext(source, context);
 return context.result;
}
test('production defaults to same origin and discards local overrides', () => {
 for (const value of [undefined, '', 'http://localhost:5001', 'http://127.0.0.1:5001', 'http://[::1]:5001']) assert.equal(base(value), '');
});
test('explicit remote bases and development overrides are supported', () => {
 assert.equal(base(' https://api.example.com/ '), 'https://api.example.com');
 assert.equal(base('http://localhost:5001', false), 'http://localhost:5001');
});
