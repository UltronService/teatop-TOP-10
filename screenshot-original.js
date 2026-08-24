const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });

  try {
    // 1920x1080 原始網址
    const page1080 = await browser.newPage();
    await page1080.setViewport({ width: 1920, height: 1080 });
    await page1080.goto('https://digital-signage-menu-pim.web.app/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await page1080.screenshot({ path: 'screenshot-original-1920x1080.png' });
    console.log('✓ 原始網址 1920x1080 截圖已保存');
    await page1080.close();

    // 3840x2160 原始網址
    const page4k = await browser.newPage();
    await page4k.setViewport({ width: 3840, height: 2160 });
    await page4k.goto('https://digital-signage-menu-pim.web.app/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await page4k.screenshot({ path: 'screenshot-original-3840x2160.png' });
    console.log('✓ 原始網址 3840x2160 截圖已保存');
    await page4k.close();

  } catch (error) {
    console.error('截圖失敗:', error.message);
  } finally {
    await browser.close();
  }
})();
