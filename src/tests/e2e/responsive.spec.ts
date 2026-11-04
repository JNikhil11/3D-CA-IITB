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

      // Check title and hero
      await expect(page).toHaveTitle(/Techfest 30/i);
      const hero = page.locator('#hero');
      await expect(hero).toBeVisible();

      // Check no horizontal overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth - window.innerWidth;
      });
      expect(overflow).toBeLessThanOrEqual(1);

      // Verify narrative chapters in DOM
      const chapters = ['hero', 'enter-engine', 'worlds', 'festival', 'finale'];
      for (const id of chapters) {
        const section = page.locator(`#${id}`);
        await expect(section).toBeAttached();
      }

      // Check primary CTA in Hero
      const cta = page.getByRole('button', { name: /Enter the Atlas/i });
      await expect(cta).toBeVisible();

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
    await page.waitForTimeout(3000);

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    await expect(page.getByText('The Aether Engine')).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshot-prototype-e2e.png' });
  });

  test('captures multi-chapter 3D camera transitions across scroll journey', async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(3000);

    // 1. Chapter 01: Enter the Engine
    const ch1 = page.locator('#enter-engine');
    await ch1.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test-results/screenshot-ch01-engine.png' });

    // 2. Chapter 02: World of Engineering
    const ch2 = page.locator('#worlds');
    await ch2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test-results/screenshot-ch02-worlds.png' });

    // 3. Chapter 03: The Techfest Experience
    const ch3 = page.locator('#festival');
    await ch3.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test-results/screenshot-ch03-festival.png' });

    // 4. Finale: Enter Techfest 30
    const finale = page.locator('#finale');
    await finale.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test-results/screenshot-finale.png' });
  });
});
