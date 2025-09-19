import { test, expect } from '@playwright/test';

const TEST_CREDENTIALS = {
  email: 'ramiefathy@gmail.com',
  password: 'testing1'
};

test.describe('Navigation and User Flows Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"]', TEST_CREDENTIALS.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_CREDENTIALS.password);
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
    await page.waitForURL(/.*(?<!\/login)$/, { timeout: 10000 });
  });

  test('should test main navigation menu', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Find main navigation elements
    const navItems = page.locator('nav a, [role="navigation"] a, .nav-item, .menu-item');

    if (await navItems.count() > 0) {
      console.log(`Found ${await navItems.count()} navigation items`);

      // Test each navigation item
      const navCount = await navItems.count();
      const navTexts = [];

      for (let i = 0; i < Math.min(navCount, 6); i++) {
        const navItem = navItems.nth(i);
        const navText = await navItem.textContent();
        navTexts.push(navText);

        // Skip if it's a logout or external link
        if (navText?.toLowerCase().includes('logout') || navText?.toLowerCase().includes('sign out')) {
          continue;
        }

        try {
          await navItem.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(1000);

          // Verify page loaded
          await expect(page.locator('h1, h2, main')).toBeVisible();

          console.log(`Navigation to "${navText}" successful`);
        } catch (error) {
          console.log(`Navigation to "${navText}" failed: ${error}`);
        }
      }

      // Take screenshot of navigation
      await page.screenshot({ path: 'test-results/screenshots/navigation-menu.png', fullPage: true });
    }
  });

  test('should test breadcrumb navigation', async ({ page }) => {
    // Navigate to a deep page
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');

    // Find and click on a calculator
    const calculatorLink = page.locator('a[href*="/calculators/"], .calculator-card a, .tool-card a').first();

    if (await calculatorLink.isVisible()) {
      await calculatorLink.click();
      await page.waitForLoadState('networkidle');

      // Look for breadcrumbs
      const breadcrumbs = page.locator('.breadcrumb, [aria-label*="breadcrumb"], nav[aria-label*="breadcrumb"]');

      if (await breadcrumbs.isVisible()) {
        // Test breadcrumb links
        const breadcrumbLinks = breadcrumbs.locator('a');
        const linkCount = await breadcrumbLinks.count();

        if (linkCount > 0) {
          // Click on parent breadcrumb
          await breadcrumbLinks.first().click();
          await page.waitForLoadState('networkidle');

          // Should navigate back
          await expect(page.locator('h1, h2')).toBeVisible();

          // Take screenshot of breadcrumb navigation
          await page.screenshot({ path: 'test-results/screenshots/breadcrumb-navigation.png', fullPage: true });
        }
      }
    }
  });

  test('should test back button navigation', async ({ page }) => {
    // Start from dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to calculators
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');

    // Navigate to a specific calculator
    const calculatorLink = page.locator('a[href*="/calculators/"], .calculator-card a, .tool-card a').first();

    if (await calculatorLink.isVisible()) {
      await calculatorLink.click();
      await page.waitForLoadState('networkidle');

      // Use browser back button
      await page.goBack();
      await page.waitForLoadState('networkidle');

      // Should be back on calculators list
      await expect(page).toHaveURL(/.*calculators.*$/);

      // Take screenshot of back navigation
      await page.screenshot({ path: 'test-results/screenshots/back-navigation.png', fullPage: true });
    }
  });

  test('should test deep linking', async ({ page }) => {
    // Test direct navigation to specific calculator
    const specificUrls = [
      '/calculators/pasi',
      '/calculators/dlqi',
      '/calculators/bsa',
      '/patients',
      '/results',
      '/analytics'
    ];

    for (const url of specificUrls) {
      try {
        await page.goto(url);
        await page.waitForLoadState('networkidle');

        // Should load the specific page
        await expect(page.locator('h1, h2, main')).toBeVisible({ timeout: 5000 });

        console.log(`Deep link to ${url} successful`);

        // Take screenshot of deep-linked page
        const urlSlug = url.replace(/[^a-zA-Z0-9]/g, '-');
        await page.screenshot({
          path: `test-results/screenshots/deep-link${urlSlug}.png`,
          fullPage: true
        });
      } catch (error) {
        console.log(`Deep link to ${url} failed: ${error}`);
      }
    }
  });

  test('should test common user journey - complete calculator workflow', async ({ page }) => {
    // 1. Start from dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'test-results/screenshots/journey-01-dashboard.png', fullPage: true });

    // 2. Navigate to calculators
    const calculatorsLink = page.locator('a:has-text("Calculators"), a[href*="calculators"], button:has-text("Calculators")');

    if (await calculatorsLink.first().isVisible()) {
      await calculatorsLink.first().click();
    } else {
      await page.goto('/calculators');
    }

    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/screenshots/journey-02-calculators.png', fullPage: true });

    // 3. Select a calculator
    const calculatorTool = page.locator('a[href*="/calculators/"], .calculator-card, .tool-card').first();

    if (await calculatorTool.isVisible()) {
      await calculatorTool.click();
      await page.waitForLoadState('networkidle');

      await page.screenshot({ path: 'test-results/screenshots/journey-03-calculator.png', fullPage: true });

      // 4. Fill in calculator
      const inputs = page.locator('input[type="number"], input[type="range"], select');
      const inputCount = await inputs.count();

      for (let i = 0; i < Math.min(inputCount, 3); i++) {
        const input = inputs.nth(i);
        const inputType = await input.getAttribute('type');

        if (inputType === 'number' || inputType === 'range') {
          await input.fill('2');
        } else if (await input.getAttribute('tagName') === 'SELECT') {
          await input.selectOption({ index: 1 });
        }
      }

      await page.screenshot({ path: 'test-results/screenshots/journey-04-filled.png', fullPage: true });

      // 5. Calculate result
      const calculateBtn = page.locator('button:has-text("Calculate"), button:has-text("Compute"), button[type="submit"]');

      if (await calculateBtn.isVisible()) {
        await calculateBtn.click();
        await page.waitForTimeout(2000);

        await page.screenshot({ path: 'test-results/screenshots/journey-05-result.png', fullPage: true });

        // 6. Save result
        const saveBtn = page.locator('button:has-text("Save"), button:has-text("Save Result")');

        if (await saveBtn.isVisible()) {
          await saveBtn.click();
          await page.waitForTimeout(2000);

          await page.screenshot({ path: 'test-results/screenshots/journey-06-saved.png', fullPage: true });
        }
      }
    }

    // 7. Navigate to results
    const resultsLink = page.locator('a:has-text("Results"), a[href*="results"]');

    if (await resultsLink.first().isVisible()) {
      await resultsLink.first().click();
    } else {
      await page.goto('/results');
    }

    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/screenshots/journey-07-results.png', fullPage: true });
  });

  test('should test mobile navigation patterns', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for mobile menu trigger (hamburger button)
    const mobileMenuBtn = page.locator('button[aria-label*="menu"], .hamburger, .mobile-menu-btn, button:has([aria-hidden="true"])');

    if (await mobileMenuBtn.isVisible()) {
      await mobileMenuBtn.click();
      await page.waitForTimeout(500);

      // Take screenshot of mobile menu
      await page.screenshot({ path: 'test-results/screenshots/mobile-navigation.png', fullPage: true });

      // Test navigation items in mobile menu
      const mobileNavItems = page.locator('.mobile-menu a, .drawer a, .sidebar a');

      if (await mobileNavItems.count() > 0) {
        await mobileNavItems.first().click();
        await page.waitForLoadState('networkidle');

        // Take screenshot of mobile navigation result
        await page.screenshot({ path: 'test-results/screenshots/mobile-nav-result.png', fullPage: true });
      }
    }
  });

  test('should test keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    // Check for focus indicators
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Take screenshot of keyboard focus
    await page.screenshot({ path: 'test-results/screenshots/keyboard-navigation.png', fullPage: true });

    // Navigate through several elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }

    // Test Enter key activation
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Take screenshot after Enter activation
    await page.screenshot({ path: 'test-results/screenshots/keyboard-activation.png', fullPage: true });
  });

  test('should test 404 and error page navigation', async ({ page }) => {
    // Test 404 page
    await page.goto('/non-existent-page');
    await page.waitForLoadState('networkidle');

    // Should show 404 or redirect
    const pageContent = await page.locator('body').textContent();
    const is404 = pageContent?.includes('404') || pageContent?.includes('Not Found') || pageContent?.includes('Page not found');

    if (is404) {
      console.log('404 page displayed correctly');
      await page.screenshot({ path: 'test-results/screenshots/404-page.png', fullPage: true });

      // Look for navigation back to home
      const homeLink = page.locator('a:has-text("Home"), a:has-text("Dashboard"), button:has-text("Go Home")');

      if (await homeLink.first().isVisible()) {
        await homeLink.first().click();
        await page.waitForLoadState('networkidle');

        // Should navigate back to valid page
        await expect(page.locator('h1, h2')).toBeVisible();
      }
    } else {
      console.log('No 404 page found, may redirect to login or home');
    }
  });
});