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
      const overflowInfo = await page.evaluate(() => {
        const diff = document.documentElement.scrollWidth - window.innerWidth;
        if (diff > 1) {
          const culprits = Array.from(document.querySelectorAll('#main-content *'))
            .filter((el) => {
              const rect = el.getBoundingClientRect();
              return rect.right > window.innerWidth || el.scrollWidth > window.innerWidth;
            })
            .map((el) => ({
              tag: el.tagName,
              cls: el.className,
              id: el.id,
              text: el.textContent?.slice(0, 30),
              scrollWidth: el.scrollWidth,
              right: el.getBoundingClientRect().right,
            }));
          return { diff, culprits };
        }
        return { diff, culprits: [] };
      });
      if (overflowInfo.diff > 1) {
        console.log(`[OVERFLOW AT ${bp.name}]`, JSON.stringify(overflowInfo.culprits.slice(0, 5), null, 2));
      }
      expect(overflowInfo.diff).toBeLessThanOrEqual(1); // Allow subpixel rounding

      // Verify all 7 chapters are present in the DOM
      const chapters = ['hero', 'story', 'atlas', 'competitions', 'learning', 'atmosphere', 'finale'];
      for (const id of chapters) {
        const section = page.locator(`#${id}`);
        await expect(section).toBeAttached();
      }

      // Check primary CTA in Hero
      const cta = page.getByRole('button', { name: /Explore The Atlas/i });
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

      // Capture screenshot evidence for each verified viewport
      await page.screenshot({
        path: `test-results/screenshot-${bp.name}.png`,
        fullPage: false,
      });
    });
  }

  test('interactive domain tabs align astrolabe quadrant and update details', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const aerospaceTab = page.locator('#tab-aerospace');
    await aerospaceTab.scrollIntoViewIfNeeded();
    await expect(aerospaceTab).toBeVisible();
    await aerospaceTab.click();

    await expect(aerospaceTab).toHaveAttribute('aria-selected', 'true');
    const panel = page.locator('#panel-aerospace');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('ORBITAL PLANE 2');
  });
});
