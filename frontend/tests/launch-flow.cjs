// Run with Playwright on NODE_PATH and a Vite dev server at LAUNCH_TEST_URL.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    const base = process.env.LAUNCH_TEST_URL || 'http://127.0.0.1:5173';
    await page.route('**/src/lib/launch.js*', async route => {
      const response = await route.fetch();
      const body = (await response.text())
        .replaceAll('import.meta.env.VITE_LAUNCH_AT', '"2026-10-07T15:00:00+05:30"')
        .replaceAll('import.meta.env.VITE_LAUNCH_COUNTDOWN_MINUTES', '10');
      await route.fulfill({ response, body });
    });
    await page.clock.install({ time: new Date('2026-10-07T14:49:59+05:30') });
    await page.clock.pauseAt(new Date('2026-10-07T14:49:59+05:30'));
    await page.goto(`${base}/launching`);
    await page.getByText('Launching soon', { exact: true }).waitFor();
    assert.equal(await page.getByRole('timer').count(), 0);
    await page.clock.fastForward(1000);
    await page.getByRole('timer').waitFor();
    assert.deepEqual(await page.getByTestId('launch-clock-card').allTextContents(), ['10', '00']);
    await page.clock.fastForward(300000);
    await page.reload();
    assert.deepEqual(await page.getByTestId('launch-clock-card').allTextContents(), ['05', '00']);
    await page.clock.fastForward(299000);
    const launch = page.getByRole('button', { name: 'Launch Website', exact: true });
    assert.equal(await launch.isDisabled(), true);
    await page.clock.fastForward(1000);
    assert.equal(await launch.isEnabled(), true);
    await launch.click();
    await page.waitForURL(`${base}/`);
    await page.clock.runFor(100);
    await page.locator('canvas[data-launch-celebration]').waitFor();
    console.log('PASS: soon, 10-minute boundary, refresh persistence, scheduled launch, confetti');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
