const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let entries = [{ id: 7, name: 'Example Customer', address: 'Example Company', email: 'customer@example.com', phone: '+919876543210', message: 'Please quote for assembly.\n<script>Not executable</script>', email_sent: true, created_at: '2026-10-06T09:00:00Z', email_sent_at: '2026-10-06T09:00:01Z' }];
  let failDelete = false;
  let failList = false;
  let deletes = 0;
  await page.route('**/api/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    let body = [];
    let status = 200;
    if (url.pathname.includes('contact-enquiries')) {
      assert.equal(request.headers().authorization, `Basic ${Buffer.from('demo:example').toString('base64')}`);
      if (url.pathname.endsWith('/access')) body = { success: true };
      else if (request.method() === 'DELETE') {
        deletes++;
        status = failDelete ? 500 : 200;
        body = { success: !failDelete, message: failDelete ? 'Unable to delete enquiry.' : 'Deleted' };
        if (!failDelete) entries = [];
      } else {
        status = failList ? 500 : 200;
        body = failList ? { message: 'Unable to load enquiries.' } : { enquiries: entries };
      }
    }
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
  });
  try {
    await page.goto((process.env.LAUNCH_TEST_URL || 'http://127.0.0.1:5174') + '/admin');
    await page.getByPlaceholder('Username').fill('demo');
    await page.getByPlaceholder('Password', { exact: true }).fill('example');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('button', { name: 'Enquiries', exact: true }).click();
    await page.getByRole('button', { name: 'View enquiry from Example Customer' }).waitFor();
    await page.getByRole('button', { name: 'View enquiry from Example Customer' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    assert.ok((await dialog.textContent()).includes('<script>Not executable</script>'));
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    await page.getByRole('searchbox').fill('missing');
    await page.getByText('No enquiries match your search.').waitFor();
    await page.getByRole('searchbox').fill('');
    const out = path.join(__dirname, '../../.launch-verification');
    fs.mkdirSync(out, { recursive: true });
    await page.screenshot({ path: path.join(out, 'admin-enquiries-desktop.png'), fullPage: true });
    await page.setViewportSize({ width: 375, height: 812 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: path.join(out, 'admin-enquiries-mobile.png'), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1000 });
    const remove = page.getByRole('button', { name: 'Delete enquiry from Example Customer' });
    page.once('dialog', dialog => dialog.dismiss());
    await remove.click();
    assert.equal(deletes, 0);
    failDelete = true;
    page.once('dialog', dialog => dialog.accept());
    await remove.click();
    await page.getByRole('alert').filter({ hasText: 'Unable to delete enquiry.' }).waitFor();
    assert.equal(await remove.count(), 1);
    failDelete = false;
    page.once('dialog', dialog => dialog.accept());
    await remove.click();
    await page.getByText('No enquiries yet.').waitFor();
    failList = true;
    await page.getByRole('button', { name: 'Refresh' }).click();
    await page.getByRole('alert').filter({ hasText: 'Unable to load enquiries.' }).waitFor();
    await page.getByRole('button', { name: 'Logout' }).click();
    await page.getByRole('button', { name: 'Sign In' }).waitFor();
    assert.deepEqual(errors, []);
    console.log('PASS: authenticated list, details, search, mobile, delete cancel/failure/success, refresh error, logout. APIs mocked; no real enquiry deleted.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
