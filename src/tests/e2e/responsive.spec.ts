import { test, expect } from '@playwright/test';

const TARGET_BREAKPOINTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'laptop-1280', width: 1280, height: 800 },
  { name: 'tablet-landscape-1024', width: 1024, height: 768 },
  { name: 'tablet-portrait-768', width: 768, height: 1024 },
  { name: 'phone-large-430', width: 430, height: 932 },
  { name: 'phone-common-390', width: 390, height: 844 },
  { name: 'phone-small-375', width: 375, height: 812 },
  { name: 'phone-min-320', width: 320, height: 700 },
];

test.describe('Responsive & Layout Verification Suite', () => {
  for (const bp of TARGET_BREAKPOINTS) {
    test(`renders cleanly without horizontal overflow at ${bp.name} (${bp.width}x${bp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/');

      // Check title and pinned storytelling stage
      await expect(page).toHaveTitle(/Techfest 30/i);
      const stage = page.locator('#story-stage');
      await expect(stage).toBeVisible({ timeout: 10000 });

      // Verify no horizontal overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth - window.innerWidth;
      });
      expect(overflow).toBeLessThanOrEqual(1);

      // Verify 3D canvas stage is mounted
      const canvas = page.locator('canvas');
      await expect(canvas).toBeVisible();

      // Verify primary exploration CTA
      const cta = page.getByRole('button', { name: /Explore the Atlas/i });
      await expect(cta).toBeVisible({ timeout: 10000 });

      // Test mobile menu interaction on mobile viewports (<900px)
      if (bp.width < 900) {
        const menuToggle = page.locator('button[aria-controls="mobile-menu"]');
        await expect(menuToggle).toBeVisible();
        await menuToggle.click();

        const mobileMenu = page.locator('#mobile-menu');
        await expect(mobileMenu).toBeVisible();

        // Close menu with Escape key
        await page.keyboard.press('Escape');
        await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
      }

      // Capture screenshot
      await page.screenshot({
        path: `test-results/screenshot-${bp.name}.png`,
        fullPage: false,
      });
    });
  }

  test('verifies isolated 3D prototype route loads with 3D canvas', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/prototype');
    await page.waitForTimeout(2500);

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    await expect(page.getByText('The Aether Engine')).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshot-prototype-e2e.png' });
  });

  test('verifies 6-chapter scroll progression through 600vh track and reverse scrubbing', async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(3000);

    // Ch 00: The Discovery (initial scroll 0)
    await expect(page.getByText('An Aetherial Renaissance')).toBeVisible();

    // Scroll forward to Ch 01: Robotics
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.25, behavior: 'instant' });
    });
    await page.waitForTimeout(800);
    await expect(page.getByText('Robotics & Kinetic Systems')).toBeVisible();

    // Scroll forward to Ch 02: Aerospace
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.42, behavior: 'instant' });
    });
    await page.waitForTimeout(800);
    await expect(page.getByText('Aerospace & Orbital Dynamics')).toBeVisible();

    // Scroll forward to Ch 03: Cognitive Computing
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.58, behavior: 'instant' });
    });
    await page.waitForTimeout(800);
    await expect(page.getByText('Cognitive Computing & Intelligence')).toBeVisible();

    // Scroll forward to Ch 04: Sustainable Earth
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.75, behavior: 'instant' });
    });
    await page.waitForTimeout(800);
    await expect(page.getByText('Sustainable Earth Systems')).toBeVisible();

    // Scroll forward to Ch 05: Finale
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.95, behavior: 'instant' });
    });
    await page.waitForTimeout(800);
    await expect(page.getByText('Enter Techfest 30')).toBeVisible();

    // Reverse scrubbing test: Scroll backwards from Finale back to Ch 01 Robotics
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.25, behavior: 'instant' });
    });
    await page.waitForTimeout(800);
    await expect(page.getByText('Robotics & Kinetic Systems')).toBeVisible();
  });
});
