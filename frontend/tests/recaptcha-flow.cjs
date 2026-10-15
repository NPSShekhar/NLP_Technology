// Run with Playwright available through NODE_PATH; all external services are mocked.
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const root = path.resolve(__dirname, '..');
  const server = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', '5187', '--strictPort'], {
    cwd: root, env: { ...process.env, VITE_RECAPTCHA_SITE_KEY: 'test-public-key' }, stdio: 'pipe',
  });
  let browser;
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(Error('Vite startup timed out')), 15000);
      server.stdout.on('data', data => { if (data.toString().includes('5187')) { clearTimeout(timeout); resolve(); } });
      server.once('error', reject);
    });
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage();
    let submissions = 0, login = 0, scriptLoads = 0;
    await page.route('https://www.google.com/recaptcha/api.js?**', route => {
      scriptLoads++;
      return route.fulfill({ contentType: 'text/javascript', body: `window.executions = 0; window.grecaptcha = { ready: cb => cb(), execute: async (key, {action}) => { window.executions++; return action + '-' + window.executions; } };` });
    });
    await page.route('**/api/**', route => {
      const request = route.request();
      const url = new URL(request.url());
      let body = [];
      if (url.pathname.endsWith('/access')) {
        assert.match(request.headers()['x-recaptcha-token'], /^admin_login-/);
        login++; body = { success: true };
      } else if (url.pathname.endsWith('/contact-enquiries') && request.method() === 'POST') {
        assert.match(request.headers()['x-recaptcha-token'], /^enquiry_submit-/);
        assert.match(request.headers()['content-type'], /^multipart\/form-data; boundary=/);
        assert.ok(request.postDataBuffer().includes(Buffer.from('test.pdf')));
        submissions++; body = { success: true };
      }
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) });
    });
    for (const route of ['/', '/contact']) {
      await page.goto('http://127.0.0.1:5187' + route);
      const form = page.locator('form').filter({ has: page.locator('input[name="email"]') });
      await form.locator('input[name="name"]').fill('Test Customer');
      await form.locator('input[name="address"]').fill('Test Company');
      await form.locator('input[name="email"]').fill('test@example.com');
      await form.locator('input[name="phone"]').fill('1234567890');
      await form.locator('textarea[name="message"]').fill('Please quote for assembly.');
      await form.locator('input[type="file"]').setInputFiles({ name: 'test.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 test') });
      for (const width of [375, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await form.scrollIntoViewIfNeeded();
        assert.equal(await form.locator('canvas').count(), 0);
        assert.equal(await form.getByText('Captcha', { exact: true }).count(), 0);
        const bounds = await form.boundingBox();
        assert.ok(bounds.x >= -1 && bounds.x + bounds.width <= width + 1, `${route}: form fits ${width}px`);
      }
      await form.locator('button[type="submit"]').click();
      assert.equal(await page.evaluate(() => window.executions || 0), 0, 'privacy validation precedes token generation');
      await form.locator('input[type="checkbox"]').check();
      await form.locator('button[type="submit"]').click();
      await page.getByText('Request Sent!', { exact: true }).waitFor();
    }
    assert.equal(submissions, 2);
    await page.goto('http://127.0.0.1:5187/admin');
    await page.getByPlaceholder('Username').fill('test');
    await page.getByPlaceholder('Password', { exact: true }).fill('example');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('button', { name: 'Enquiries', exact: true }).waitFor();
    assert.equal(login, 1);
    assert.equal(scriptLoads, 3, 'one script per full document load');
    console.log('PASS: Home + Contact submissions/uploads/privacy, admin login, old CAPTCHA absent, form bounds at 375/768/1440px (mock services).');
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
