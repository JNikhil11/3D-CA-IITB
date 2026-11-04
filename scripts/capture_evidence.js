import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const evidenceDir = path.resolve(__dirname, '../QA/evidence');

async function run() {
  console.log('Launching Playwright Chromium for 5-World Evidence Capture...');
  const browser = await chromium.launch({ headless: true });

  // 1. Capture Preloader Screen
  const page1 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page1.goto('http://localhost:3000/');
  await page1.waitForTimeout(600); // During 1.7s minimum gate
  await page1.screenshot({
    path: path.join(evidenceDir, '01_preloader_1440x900.png'),
    timeout: 60000,
  });
  console.log('✓ Captured 01_preloader_1440x900.png');
  await page1.close();

  // 2. Capture Hero & 5 Worlds on Desktop (1440x900)
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/');
  // Wait for curtain reveal & WebGL shader compilation
  await page.waitForTimeout(5000);

  // Helper to scroll to normalized progress
  const scrollToProg = async (p) => {
    await page.evaluate((prog) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * prog, behavior: 'instant' });
    }, p);
    await page.waitForTimeout(1500);
  };

  // World 01: The Grand Observatory (p = 0.08)
  await scrollToProg(0.08);
  await page.screenshot({
    path: path.join(evidenceDir, 'world01_observatory_1440x900.png'),
    timeout: 60000,
  });
  console.log('✓ Captured World 01: The Grand Observatory');

  // World 02: The Subterranean Engine (p = 0.30)
  await scrollToProg(0.30);
  await page.screenshot({
    path: path.join(evidenceDir, 'world02_subterranean_1440x900.png'),
    timeout: 60000,
  });
  console.log('✓ Captured World 02: The Subterranean Engine');

  // World 03: Engineering Worlds (p = 0.52)
  await scrollToProg(0.52);
  await page.screenshot({
    path: path.join(evidenceDir, 'world03_engineering_1440x900.png'),
    timeout: 60000,
  });
  console.log('✓ Captured World 03: Engineering Worlds');

  // World 04: The Techfest Experience (p = 0.74)
  await scrollToProg(0.74);
  await page.screenshot({
    path: path.join(evidenceDir, 'world04_festival_1440x900.png'),
    timeout: 60000,
  });
  console.log('✓ Captured World 04: The Techfest Experience');

  // World 05: The Final Destination (p = 0.95)
  await scrollToProg(0.95);
  await page.screenshot({
    path: path.join(evidenceDir, 'world05_finale_1440x900.png'),
    timeout: 60000,
  });
  console.log('✓ Captured World 05: The Final Destination');
  await page.close();

  // 3. Mobile (390x844)
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto('http://localhost:3000/');
  await mobile.waitForTimeout(5000);

  // Mobile World 01
  await mobile.evaluate(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * 0.08, behavior: 'instant' });
  });
  await mobile.waitForTimeout(1500);
  await mobile.screenshot({
    path: path.join(evidenceDir, 'mobile_world01_390x844.png'),
    timeout: 60000,
  });
  console.log('✓ Captured Mobile World 01');

  // Mobile World 05
  await mobile.evaluate(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * 0.95, behavior: 'instant' });
  });
  await mobile.waitForTimeout(1500);
  await mobile.screenshot({
    path: path.join(evidenceDir, 'mobile_world05_390x844.png'),
    timeout: 60000,
  });
  console.log('✓ Captured Mobile World 05');
  await mobile.close();

  await browser.close();
  console.log('★ All 5-world scrollytelling QA evidence screenshots captured successfully.');
}

run().catch((err) => {
  console.error('Error during evidence capture:', err);
  process.exit(1);
});
