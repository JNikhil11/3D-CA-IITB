import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const evidenceDir = path.resolve(__dirname, '../QA/evidence');

async function run() {
  const browser = await chromium.launch({ headless: true });

  // 1. Capture Desktop 1440x900 Journey Across All 6 Chapters
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto('http://localhost:3000/');
  await desktop.waitForTimeout(3500); // Wait for 1.7s curtain reveal
  await desktop.evaluate(() => document.fonts.ready);

  // Ch 00: The Discovery
  await desktop.screenshot({ path: path.join(evidenceDir, 'ch00_discovery_1440x900.png') });

  // Helper to scroll to normalized progress
  const scrollToProgress = async (prog) => {
    await desktop.evaluate((p) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * p, behavior: 'instant' });
    }, prog);
    await desktop.waitForTimeout(900);
  };

  // Ch 01: Robotics (p = 0.25)
  await scrollToProgress(0.25);
  await desktop.screenshot({ path: path.join(evidenceDir, 'ch01_robotics_1440x900.png') });

  // Ch 02: Aerospace (p = 0.42)
  await scrollToProgress(0.42);
  await desktop.screenshot({ path: path.join(evidenceDir, 'ch02_aerospace_1440x900.png') });

  // Ch 03: Cognitive Computing (p = 0.58)
  await scrollToProgress(0.58);
  await desktop.screenshot({ path: path.join(evidenceDir, 'ch03_computing_1440x900.png') });

  // Ch 04: Sustainable Earth Systems (p = 0.75)
  await scrollToProgress(0.75);
  await desktop.screenshot({ path: path.join(evidenceDir, 'ch04_sustainability_1440x900.png') });

  // Ch 05: Enter Techfest 30 Grand Finale (p = 0.95)
  await scrollToProgress(0.95);
  await desktop.screenshot({ path: path.join(evidenceDir, 'ch05_finale_1440x900.png') });

  // Reverse Scrubbing Test: Reverse from Ch 05 back to Ch 01 Robotics
  await scrollToProgress(0.25);
  await desktop.screenshot({ path: path.join(evidenceDir, 'reverse_scrub_to_ch01_1440x900.png') });
  await desktop.close();

  // 2. Capture Mobile 390x844 Layout
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto('http://localhost:3000/');
  await mobile.waitForTimeout(3500);
  await mobile.evaluate(() => document.fonts.ready);

  // Mobile Ch 00
  await mobile.screenshot({ path: path.join(evidenceDir, 'mobile_ch00_390x844.png') });

  // Mobile Ch 01
  await mobile.evaluate(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * 0.25, behavior: 'instant' });
  });
  await mobile.waitForTimeout(900);
  await mobile.screenshot({ path: path.join(evidenceDir, 'mobile_ch01_390x844.png') });

  // Mobile Ch 03
  await mobile.evaluate(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * 0.58, behavior: 'instant' });
  });
  await mobile.waitForTimeout(900);
  await mobile.screenshot({ path: path.join(evidenceDir, 'mobile_ch03_390x844.png') });

  // Mobile Ch 05
  await mobile.evaluate(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * 0.95, behavior: 'instant' });
  });
  await mobile.waitForTimeout(900);
  await mobile.screenshot({ path: path.join(evidenceDir, 'mobile_ch05_390x844.png') });
  await mobile.close();

  await browser.close();
  console.log('All scrollytelling QA evidence screenshots captured successfully.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
