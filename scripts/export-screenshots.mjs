import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, '../arch/docs/product/mockups/images');
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const shots = [
  { file: 'dashboard.html', out: 'spisok_vakansiy.png', width: 1280 },
  { file: 'vacancy.html', out: 'voronka.png', width: 1680 },
  { file: 'vacancy-funnel-empty.html', out: 'voronka_empty.png', width: 1680 },
  { file: 'vacancy-funnel-loading.html', out: 'voronka_loading.png', width: 1680 },
  { file: 'vacancy-drawer-open.html', out: 'voronka_drawer.png', width: 1680 },
  { file: 'resume.html', out: 'resume.png', width: 1280 },
  { file: 'vacancy-card.html', out: 'history.png', width: 1280 },
  { file: 'resume-bank-calendar.html', out: 'bank_calendar.png', width: 1400 },
  { file: 'resume-bank.html', out: 'bank_list.png', width: 1280 },
];

const screenshotCss = `
  .mock-nav { display: none !important; }
  html, body {
    height: auto !important;
    overflow: visible !important;
  }
  .layout {
    height: auto !important;
    min-height: 100vh;
    overflow: visible !important;
  }
  .main,
  .content,
  .content-inner {
    overflow: visible !important;
    height: auto !important;
  }
`;

await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

for (const shot of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: shot.width, height: 900, deviceScaleFactor: 2 });
  await page.goto(`file://${path.join(root, shot.file)}`, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });
  await page.addStyleTag({ content: screenshotCss });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({
    path: path.join(outDir, shot.out),
    fullPage: true,
  });
  await page.close();
  console.log(`✓ ${shot.out} (${shot.width}px)`);
}

await browser.close();
console.log(`\nSaved to ${outDir}`);
