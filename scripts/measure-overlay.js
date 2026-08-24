#!/usr/bin/env node
/**
 * 量原型画布与 data-review 盒（#screen 本地坐标）。
 * 用法：node scripts/measure-overlay.js <index.html> [--chrome]
 * HTML 需有 #screen；复刻页建议有 .shell / .stage / [data-review]。
 * 交付 HTML 不要依赖本脚本；本脚本只放在 review/ 或本 skill 的 scripts/。
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const html = path.resolve(process.argv[2] || '');
if (!html || !fs.existsSync(html)) {
  console.error('usage: node measure-overlay.js <index.html> [--chrome]');
  process.exit(1);
}
const useChrome = process.argv.includes('--chrome');
const fileUrl = 'file://' + html + (html.includes('?') ? '&' : '?') + 'overlay=1';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: useChrome
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : undefined,
  });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  const data = await page.evaluate(() => {
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const screen = document.getElementById('screen');
      const s = screen ? screen.getBoundingClientRect() : { left: 0, top: 0 };
      return {
        x: Math.round(r.left - s.left),
        y: Math.round(r.top - s.top),
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
    };
    const overlay = document.querySelector('#overlay, .overlay, [data-overlay]');
    const reviews = {};
    document.querySelectorAll('[data-review]').forEach((el) => {
      reviews[el.getAttribute('data-review')] = box(el);
    });
    return {
      screen: box(document.getElementById('screen')),
      shell: box(document.querySelector('.shell')),
      stage: box(document.querySelector('.stage')),
      overlay: overlay ? box(overlay) : null,
      reviews,
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
