import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const evidenceDir = path.resolve(__dirname, '../QA/evidence');

async function run() {
  const browser = await chromium.launch({ headless: true });

  // 1. Capture Preloader Screen
  const page1 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page1.goto('http://localhost:3000/');
  await page1.waitForTimeout(600); // During 1.7s minimum gate
  await page1.screenshot({ path: path.join(evidenceDir, '01_preloader_1440x900.png') });
  await page1.close();

  // 2. Capture Hero & Chapters on Desktop (1440x900)
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/');
  // Wait for curtain reveal
  await page.waitForTimeout(4000);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(evidenceDir, '02_hero_revealed_1440x900.png') });

  // Chapter 01
  await page.evaluate(() => document.getElementById('enter-engine')?.scrollIntoView());
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(evidenceDir, '03_ch01_enter_engine_1440x900.png') });

  // Chapter 02
  await page.evaluate(() => document.getElementById('worlds')?.scrollIntoView());
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(evidenceDir, '04_ch02_editorial_worlds_1440x900.png') });

  // Chapter 03
  await page.evaluate(() => document.getElementById('festival')?.scrollIntoView());
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(evidenceDir, '05_ch03_festival_1440x900.png') });

  // Finale
  await page.evaluate(() => document.getElementById('finale')?.scrollIntoView());
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(evidenceDir, '06_finale_1440x900.png') });
  await page.close();

  // 3. Mobile (390x844)
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:3000/');
  await mobilePage.waitForTimeout(4000);
  await mobilePage.evaluate(() => document.fonts.ready);
  await mobilePage.screenshot({ path: path.join(evidenceDir, '07_mobile_390x844.png') });
  await mobilePage.close();

  await browser.close();
  console.log('All QA evidence screenshots captured successfully.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
