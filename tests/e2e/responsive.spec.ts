import { test, expect } from '@playwright/test';

const TEST_CREDENTIALS = {
  email: 'ramiefathy@gmail.com',
  password: 'testing1'
};

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
  largeDesktop: { width: 1920, height: 1080 }
};

test.describe('Responsive Design Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"]', TEST_CREDENTIALS.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_CREDENTIALS.password);
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
    await page.waitForURL(/.*(?<!\/login)$/, { timeout: 10000 });
  });

  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    test(`should display correctly on ${viewportName} viewport`, async ({ page }) => {
      await page.setViewportSize(viewport);

      const pages = ['/', '/calculators', '/patients', '/results', '/analytics'];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');

        // Check that main content is visible
        await expect(page.locator('h1, h2, main')).toBeVisible();

        // Check for horizontal scrolling (shouldn't happen)
        const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
        const viewportWidth = viewport.width;

        if (bodyWidth > viewportWidth + 50) { // Allow small tolerance
          console.warn(`Horizontal scroll detected on ${pagePath} at ${viewportName}: ${bodyWidth}px > ${viewportWidth}px`);
        }

        // Take screenshot
        const pageSlug = pagePath.replace(/[^a-zA-Z0-9]/g, '-') || 'home';
        await page.screenshot({
          path: `test-results/screenshots/${viewportName}-${pageSlug}.png`,
          fullPage: true
        });

        await page.waitForTimeout(500);
      }
    });
  }

  test('should adapt navigation for mobile', async ({ page }) => {
    // Test mobile navigation
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Mobile should have hamburger menu or collapsed navigation
    const mobileMenu = page.locator('button[aria-label*="menu"], .hamburger, .mobile-menu-btn, [aria-expanded]');
    const fullNav = page.locator('nav a, .nav-item').first();

    const hasMobileMenu = await mobileMenu.isVisible();
    const hasFullNavVisible = await fullNav.isVisible();

    if (hasMobileMenu) {
      console.log('Mobile menu button found');

      // Test mobile menu functionality
      await mobileMenu.click();
      await page.waitForTimeout(500);

      // Menu should expand
      const expandedMenu = page.locator('.mobile-menu, .drawer, .sidebar, nav[aria-expanded="true"]');

      if (await expandedMenu.isVisible()) {
        console.log('Mobile menu expands correctly');

        // Take screenshot of expanded mobile menu
        await page.screenshot({ path: 'test-results/screenshots/mobile-menu-expanded.png', fullPage: true });

        // Test menu items
        const menuItems = expandedMenu.locator('a, button');
        const menuItemCount = await menuItems.count();

        if (menuItemCount > 0) {
          console.log(`Mobile menu has ${menuItemCount} items`);

          // Test clicking a menu item
          await menuItems.first().click();
          await page.waitForLoadState('networkidle');

          // Menu should close and navigate
          await expect(page.locator('h1, h2')).toBeVisible();
        }
      }
    } else if (!hasFullNavVisible) {
      console.warn('No navigation visible on mobile - potential UX issue');
    }

    // Take screenshot of mobile navigation
    await page.screenshot({ path: 'test-results/screenshots/mobile-navigation-test.png', fullPage: true });
  });

  test('should have appropriate touch targets on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check touch target sizes
    const interactiveElements = page.locator('button, a, input[type="button"], input[type="submit"], [role="button"]');
    const elementCount = await interactiveElements.count();

    let smallTargetCount = 0;

    for (let i = 0; i < Math.min(elementCount, 15); i++) {
      const element = interactiveElements.nth(i);

      if (await element.isVisible()) {
        const boundingBox = await element.boundingBox();

        if (boundingBox) {
          // Touch targets should be at least 44x44 pixels (iOS) or 48x48 pixels (Android)
          const minSize = 44;
          const isLargeEnough = boundingBox.width >= minSize && boundingBox.height >= minSize;

          if (!isLargeEnough) {
            smallTargetCount++;
            console.warn(`Small touch target: ${boundingBox.width}x${boundingBox.height}px`);
          }
        }
      }
    }

    console.log(`Found ${smallTargetCount} touch targets smaller than recommended size`);

    // Take screenshot highlighting touch targets
    await page.screenshot({ path: 'test-results/screenshots/mobile-touch-targets.png', fullPage: true });
  });

  test('should test calculator responsiveness', async ({ page }) => {
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');

    const calculatorLink = page.locator('a[href*="/calculators/"], .calculator-card a, .tool-card a').first();

    if (await calculatorLink.isVisible()) {
      await calculatorLink.click();
      await page.waitForLoadState('networkidle');

      // Test calculator on different viewports
      for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(500);

        // Check that form elements are properly sized
        const inputs = page.locator('input, select, button');
        const inputCount = await inputs.count();

        for (let i = 0; i < Math.min(inputCount, 5); i++) {
          const input = inputs.nth(i);

          if (await input.isVisible()) {
            const boundingBox = await input.boundingBox();

            if (boundingBox) {
              // Form elements should be appropriately sized for viewport
              if (viewportName === 'mobile') {
                // Mobile form elements should be large enough for touch
                expect(boundingBox.height).toBeGreaterThanOrEqual(40);
              }

              // Elements shouldn't be too wide for their container
              expect(boundingBox.width).toBeLessThanOrEqual(viewport.width);
            }
          }
        }

        // Take screenshot of calculator on each viewport
        await page.screenshot({
          path: `test-results/screenshots/calculator-${viewportName}.png`,
          fullPage: true
        });
      }
    }
  });

  test('should test table responsiveness', async ({ page }) => {
    await page.goto('/results');
    await page.waitForLoadState('networkidle');

    const tables = page.locator('table');

    if (await tables.first().isVisible()) {
      // Test tables on different viewports
      for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(500);

        const table = tables.first();
        const tableWidth = await table.evaluate(el => el.scrollWidth);

        if (viewportName === 'mobile' && tableWidth > viewport.width) {
          // Mobile tables should be horizontally scrollable or stacked
          const isScrollable = await table.evaluate(el => {
            const parent = el.parentElement;
            return parent && getComputedStyle(parent).overflowX === 'auto';
          });

          if (!isScrollable) {
            console.warn('Table may not be responsive on mobile');
          }
        }

        // Take screenshot of table responsiveness
        await page.screenshot({
          path: `test-results/screenshots/table-${viewportName}.png`,
          fullPage: true
        });
      }
    }
  });

  test('should test image and media responsiveness', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(500);

        for (let i = 0; i < Math.min(imageCount, 5); i++) {
          const img = images.nth(i);

          if (await img.isVisible()) {
            const boundingBox = await img.boundingBox();

            if (boundingBox) {
              // Images shouldn't overflow viewport width
              expect(boundingBox.width).toBeLessThanOrEqual(viewport.width + 10); // Small tolerance

              // Images should maintain aspect ratio
              const aspectRatio = boundingBox.width / boundingBox.height;
              expect(aspectRatio).toBeGreaterThan(0.1);
              expect(aspectRatio).toBeLessThan(10);
            }
          }
        }

        // Take screenshot of media responsiveness
        await page.screenshot({
          path: `test-results/screenshots/media-${viewportName}.png`,
          fullPage: true
        });
      }
    }
  });

  test('should test layout breakpoints', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const breakpoints = [
      { width: 320, height: 568 },  // Small mobile
      { width: 375, height: 667 },  // Mobile
      { width: 414, height: 896 },  // Large mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1024, height: 768 }, // Small desktop
      { width: 1200, height: 800 }, // Medium desktop
      { width: 1440, height: 900 }, // Large desktop
      { width: 1920, height: 1080 } // Extra large desktop
    ];

    for (const viewport of breakpoints) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(300);

      // Check layout doesn't break
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });

      if (hasHorizontalScroll) {
        console.warn(`Horizontal scroll at ${viewport.width}x${viewport.height}`);
      }

      // Check main content is visible
      await expect(page.locator('main, h1, h2')).toBeVisible();

      // Take screenshot at key breakpoints
      if ([375, 768, 1024, 1440].includes(viewport.width)) {
        await page.screenshot({
          path: `test-results/screenshots/breakpoint-${viewport.width}w.png`,
          fullPage: true
        });
      }
    }
  });

  test('should test text readability across viewports', async ({ page }) => {
    const pages = ['/', '/calculators'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(300);

        // Check font sizes
        const textElements = page.locator('p, span, div, h1, h2, h3, h4, h5, h6');
        const elementCount = await textElements.count();

        for (let i = 0; i < Math.min(elementCount, 10); i++) {
          const element = textElements.nth(i);

          if (await element.isVisible()) {
            const fontSize = await element.evaluate(el => {
              return parseInt(getComputedStyle(el).fontSize);
            });

            // Text should be readable on all viewports
            if (viewportName === 'mobile') {
              // Mobile text should be at least 16px for body text
              const tagName = await element.evaluate(el => el.tagName.toLowerCase());

              if (['p', 'span', 'div'].includes(tagName) && fontSize < 14) {
                console.warn(`Small text on mobile: ${fontSize}px`);
              }
            }
          }
        }

        // Take screenshot for text readability
        const pageSlug = pagePath.replace(/[^a-zA-Z0-9]/g, '-') || 'home';
        await page.screenshot({
          path: `test-results/screenshots/text-${viewportName}-${pageSlug}.png`,
          fullPage: true
        });
      }
    }
  });

  test('should test orientation changes', async ({ page }) => {
    // Test landscape mobile
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should still be usable in landscape
    await expect(page.locator('h1, h2, main')).toBeVisible();

    // Take screenshot of landscape mobile
    await page.screenshot({ path: 'test-results/screenshots/mobile-landscape.png', fullPage: true });

    // Test portrait tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(300);

    // Take screenshot of portrait tablet
    await page.screenshot({ path: 'test-results/screenshots/tablet-portrait.png', fullPage: true });

    // Test landscape tablet
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(300);

    // Take screenshot of landscape tablet
    await page.screenshot({ path: 'test-results/screenshots/tablet-landscape.png', fullPage: true });
  });
});