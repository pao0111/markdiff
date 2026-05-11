const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000/');
  await page.waitForSelector('.cm-mergeView');

  // get the left scroller
  const leftScroller = await page.locator('.cm-mergeViewEditor').nth(0).locator('.cm-scroller');
  const rightScroller = await page.locator('.cm-mergeViewEditor').nth(1).locator('.cm-scroller');

  await page.evaluate(() => {
    document.getElementById('editor-container').style.height = '100px';
  });

  await leftScroller.locator('.cm-content').click();
  for (let i = 0; i < 30; i++) {
    await page.keyboard.type('A\n');
  }

  await rightScroller.locator('.cm-content').click();
  for (let i = 0; i < 30; i++) {
    await page.keyboard.type('B\n');
  }

  await page.waitForTimeout(500);

  await leftScroller.evaluate(e => {
    e.scrollTop = 30; e.dispatchEvent(new Event('scroll'));
  });

  await page.waitForTimeout(100);

  await page.screenshot({ path: 'frontend-verification.png' });

  await browser.close();
})();
