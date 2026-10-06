// Run with Playwright on NODE_PATH and a Vite server at LAUNCH_TEST_URL.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const base = process.env.LAUNCH_TEST_URL || 'http://127.0.0.1:5174';
  const out = path.join(__dirname,'../../.launch-verification');
  fs.mkdirSync(out,{recursive:true});
  try {
    const {LAUNCH_DURATION} = await import('../src/lib/launch.js');
    for (const duration of [...new Set([LAUNCH_DURATION,70])]) {
      const context = await browser.newContext({viewport:{width:1440,height:1000}});
      // Exercise the 60 -> 59 boundary even when local demo duration is short.
      if(duration !== LAUNCH_DURATION) await context.route('**/src/lib/launch.js*',async route=>{
        const response=await route.fetch();
        await route.fulfill({response,body:(await response.text()).replace(/LAUNCH_DURATION = \d+/,`LAUNCH_DURATION = ${duration}`)});
      });
      const page=await context.newPage();
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      const now=new Date();await page.clock.install({time:now});await page.clock.pauseAt(now);
      await page.goto(`${base}/?launch-history=before`);
      await page.goto(`${base}/launching`);
      const timer=page.getByRole('timer');await timer.waitFor();
      assert.equal(await page.getByRole('button',{name:'Start Launch Countdown'}).count(),0);
      const launch=page.getByRole('button',{name:'Launch Website',exact:true});
      const cards=page.getByTestId('launch-clock-card');
      assert.equal(await cards.count(),duration >= 60 ? 2 : 1);
      for (const [name,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',375,812],['small-mobile',320,640]]) {
        await page.setViewportSize({width,height});
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        await page.screenshot({path:path.join(out,`auto-${duration}-${name}.png`)});
      }
      if(duration>=60){
        await page.clock.fastForward((duration-60)*1000);
        assert.deepEqual(await cards.allTextContents(),['01','00']);
        assert.equal(await launch.count(),0);
        await page.clock.fastForward(1000);
        assert.deepEqual(await cards.allTextContents(),['59']);
        assert.equal(await launch.isDisabled(),true);
        await launch.evaluate(el=>el.click());
        assert.equal(new URL(page.url()).pathname,'/launching');
        assert.equal(new URL(page.url()).pathname,'/launching');
        await page.clock.fastForward(58000);
      }else{
        assert.equal(await launch.count(),1);
        assert.equal(await launch.isDisabled(),duration>1);
        await page.clock.fastForward((duration-1)*1000);
      }
      assert.deepEqual(await cards.allTextContents(),['01']);
      assert.equal(await launch.isEnabled(),true);
      await page.clock.fastForward(2000);
      assert.deepEqual(await cards.allTextContents(),['01']);
      await launch.click();await page.waitForURL(`${base}/`);
      await page.getByTestId('launch-page').waitFor({state:'hidden'});
      await page.clock.runFor(100);
      const canvas=page.locator('canvas[data-launch-celebration]');await canvas.waitFor();
      assert.equal(await canvas.evaluate(e=>getComputedStyle(e).pointerEvents),'none');
      await page.clock.runFor(11000);assert.equal(await canvas.count(),1);
      await page.clock.runFor(2000);assert.equal(await canvas.count(),0);
      await page.reload();await page.clock.runFor(1000);assert.equal(await canvas.count(),0);
      await page.goBack();
      await page.waitForURL(`${base}/?launch-history=before`);
      assert.equal(await page.getByTestId('launch-page').count(),0);
      await page.goForward();await page.waitForURL(`${base}/`);
      await page.clock.runFor(1000);assert.equal(await canvas.count(),0);
      assert.deepEqual(errors,[]);
      console.log(`PASS ${duration}s: countdown, Home celebration, cleanup, no refresh replay, Back skips launching and Forward returns Home; four viewports.`);
      await context.close();
    }
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
