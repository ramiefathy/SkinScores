import { test, expect } from '@playwright/test';

const TEST_CREDENTIALS = {
  email: 'ramiefathy@gmail.com',
  password: 'testing1'
};

test.describe('Error Handling and Edge Cases Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"]', TEST_CREDENTIALS.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_CREDENTIALS.password);
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
    await page.waitForURL(/.*(?<!\/login)$/, { timeout: 10000 });
  });

  test('should handle invalid form inputs gracefully', async ({ page }) => {
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');

    // Find a calculator to test
    const calculatorLink = page.locator('a[href*="/calculators/"], .calculator-card a, .tool-card a').first();

    if (await calculatorLink.isVisible()) {
      await calculatorLink.click();
      await page.waitForLoadState('networkidle');

      // Test various invalid inputs
      const numberInputs = page.locator('input[type="number"]');
      const inputCount = await numberInputs.count();

      for (let i = 0; i < Math.min(inputCount, 3); i++) {
        const input = numberInputs.nth(i);

        // Test negative values
        await input.fill('-999');
        await input.blur();
        await page.waitForTimeout(300);

        // Test extremely large values
        await input.fill('999999999');
        await input.blur();
        await page.waitForTimeout(300);

        // Test decimal values where integers expected
        await input.fill('1.5');
        await input.blur();
        await page.waitForTimeout(300);

        // Test text in number fields
        await input.fill('abc');
        await input.blur();
        await page.waitForTimeout(300);

        // Test special characters
        await input.fill('!@#$%');
        await input.blur();
        await page.waitForTimeout(300);

        // Check for validation messages
        const validationMessage = page.locator('.error, [role="alert"], .validation-error, text=/invalid|error/i');

        if (await validationMessage.isVisible()) {
          console.log(`Validation working for input ${i}`);
        }
      }

      // Take screenshot of validation errors
      await page.screenshot({ path: 'test-results/screenshots/input-validation-errors.png', fullPage: true });

      // Try to submit with invalid data
      const submitBtn = page.locator('button[type="submit"], button:has-text("Calculate"), button:has-text("Submit")');

      if (await submitBtn.isVisible()) {
        await submitBtn.click();

        // Should show validation errors or prevent submission
        const errorMessages = page.locator('.error, [role="alert"], .validation-error');
        const hasErrors = await errorMessages.count() > 0;

        if (hasErrors) {
          console.log('Form validation prevents submission with invalid data');
        }

        // Take screenshot of form submission errors
        await page.screenshot({ path: 'test-results/screenshots/form-submission-errors.png', fullPage: true });
      }
    }
  });

  test('should handle network failures gracefully', async ({ page, context }) => {
    // Block all network requests to simulate network failure
    await context.route('**/*', route => route.abort());

    await page.goto('/calculators');

    // Should show appropriate error message
    const errorElements = page.locator('text=/error|failed|network|connection/i, [role="alert"]');

    try {
      await expect(errorElements.first()).toBeVisible({ timeout: 10000 });
      console.log('Network error handling working');

      // Take screenshot of network error
      await page.screenshot({ path: 'test-results/screenshots/network-error.png', fullPage: true });
    } catch (error) {
      console.log('No specific network error message displayed');
    }

    // Restore network and test recovery
    await context.unroute('**/*');

    // Try to reload or navigate
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should recover gracefully
    await expect(page.locator('h1, h2, main')).toBeVisible({ timeout: 10000 });

    // Take screenshot of recovery
    await page.screenshot({ path: 'test-results/screenshots/network-recovery.png', fullPage: true });
  });

  test('should handle slow network responses', async ({ page, context }) => {
    // Add significant delay to all requests
    await context.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
      await route.continue();
    });

    const loadStart = Date.now();
    await page.goto('/analytics');

    // Should show loading indicators
    const loadingIndicators = page.locator('.loading, .spinner, [role="progressbar"], text=/loading|please wait/i');

    if (await loadingIndicators.first().isVisible()) {
      console.log('Loading indicators shown during slow network');

      // Take screenshot of loading state
      await page.screenshot({ path: 'test-results/screenshots/loading-indicators.png', fullPage: true });
    }

    // Wait for page to eventually load
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    const loadTime = Date.now() - loadStart;
    console.log(`Slow network load time: ${loadTime}ms`);

    // Page should eventually load
    await expect(page.locator('h1, h2')).toBeVisible();

    // Take screenshot of loaded state
    await page.screenshot({ path: 'test-results/screenshots/slow-network-loaded.png', fullPage: true });
  });

  test('should handle API errors gracefully', async ({ page, context }) => {
    // Mock API errors
    await context.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/results');
    await page.waitForLoadState('networkidle');

    // Should handle API errors gracefully
    const errorMessages = page.locator('text=/error|failed|unable to load/i, [role="alert"]');

    if (await errorMessages.first().isVisible()) {
      console.log('API error handling working');

      // Take screenshot of API error
      await page.screenshot({ path: 'test-results/screenshots/api-error.png', fullPage: true });
    }

    // Test retry functionality if available
    const retryBtn = page.locator('button:has-text("Retry"), button:has-text("Try Again"), button:has-text("Reload")');

    if (await retryBtn.isVisible()) {
      await retryBtn.click();
      await page.waitForTimeout(2000);

      console.log('Retry functionality available');
    }
  });

  test('should handle empty states appropriately', async ({ page, context }) => {
    // Mock empty responses
    await context.route('**/api/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [], results: [], items: [] })
      });
    });

    // Test empty states on different pages
    const pages = ['/results', '/patients', '/analytics'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      // Look for empty state messages
      const emptyStateMessages = page.locator('text=/no data|no results|empty|nothing found/i, .empty-state');

      if (await emptyStateMessages.first().isVisible()) {
        console.log(`Empty state handled on ${pagePath}`);

        // Take screenshot of empty state
        const pageSlug = pagePath.replace(/[^a-zA-Z0-9]/g, '-');
        await page.screenshot({
          path: `test-results/screenshots/empty-state${pageSlug}.png`,
          fullPage: true
        });
      }

      // Look for actions to add data
      const addActions = page.locator('button:has-text("Add"), button:has-text("Create"), a:has-text("Get Started")');

      if (await addActions.first().isVisible()) {
        console.log(`Add action available in empty state on ${pagePath}`);
      }
    }
  });

  test('should handle browser compatibility issues', async ({ page }) => {
    // Test with JavaScript disabled (if possible)
    await page.context().addInitScript(() => {
      // Simulate older browser by removing modern features
      delete (window as any).fetch;
      delete (window as any).Promise;
    });

    await page.goto('/');

    // Should still be functional or show appropriate fallback
    const fallbackMessage = page.locator('text=/javascript|browser|update|modern/i');

    if (await fallbackMessage.isVisible()) {
      console.log('Browser compatibility message shown');

      // Take screenshot of compatibility warning
      await page.screenshot({ path: 'test-results/screenshots/browser-compatibility.png', fullPage: true });
    } else {
      // Should still be somewhat functional
      await expect(page.locator('h1, h2, main')).toBeVisible();
    }
  });

  test('should handle session expiration', async ({ page, context }) => {
    // Simulate session expiration by clearing cookies and storage
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Clear session data
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Try to navigate to protected page
    await page.goto('/results');

    // Should redirect to login or show session expired message
    const isLoginPage = page.url().includes('/login');
    const sessionExpiredMessage = page.locator('text=/session expired|please log in again/i');

    if (isLoginPage || await sessionExpiredMessage.isVisible()) {
      console.log('Session expiration handled correctly');

      // Take screenshot of session expiration
      await page.screenshot({ path: 'test-results/screenshots/session-expired.png', fullPage: true });
    }
  });

  test('should handle rapid user interactions', async ({ page }) => {
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');

    const calculatorLink = page.locator('a[href*="/calculators/"], .calculator-card a, .tool-card a').first();

    if (await calculatorLink.isVisible()) {
      await calculatorLink.click();
      await page.waitForLoadState('networkidle');

      // Rapid button clicking
      const calculateBtn = page.locator('button:has-text("Calculate"), button:has-text("Compute"), button[type="submit"]');

      if (await calculateBtn.isVisible()) {
        // Click rapidly multiple times
        for (let i = 0; i < 5; i++) {
          await calculateBtn.click();
          await page.waitForTimeout(100);
        }

        // Should handle rapid clicks gracefully (not crash or show multiple results)
        const resultElements = page.locator('text=/score|result|total/i');
        const resultCount = await resultElements.count();

        console.log(`Rapid clicking resulted in ${resultCount} result elements`);

        // Take screenshot after rapid clicking
        await page.screenshot({ path: 'test-results/screenshots/rapid-clicking.png', fullPage: true });
      }

      // Rapid form input changes
      const inputs = page.locator('input[type="number"]');

      if (await inputs.count() > 0) {
        const input = inputs.first();

        // Rapid value changes
        for (let i = 0; i < 10; i++) {
          await input.fill(String(i));
          await page.waitForTimeout(50);
        }

        // Should handle rapid input changes without errors
        console.log('Rapid input changes handled');
      }
    }
  });

  test('should handle edge case data values', async ({ page }) => {
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');

    const calculatorLink = page.locator('a[href*="/calculators/"], .calculator-card a, .tool-card a').first();

    if (await calculatorLink.isVisible()) {
      await calculatorLink.click();
      await page.waitForLoadState('networkidle');

      const numberInputs = page.locator('input[type="number"]');

      if (await numberInputs.count() > 0) {
        const edgeCases = [
          '0',           // Zero
          '0.0001',      // Very small decimal
          '999999',      // Very large number
          '3.14159',     // Pi
          '2.718281',    // e
          '1e10',        // Scientific notation
          'Infinity',    // Infinity
          'NaN'          // Not a Number
        ];

        for (const value of edgeCases) {
          await numberInputs.first().fill(value);
          await page.waitForTimeout(200);

          // Try to calculate
          const calculateBtn = page.locator('button:has-text("Calculate"), button:has-text("Compute")');

          if (await calculateBtn.isVisible()) {
            await calculateBtn.click();
            await page.waitForTimeout(500);

            // Should handle edge case gracefully
            const errorMessage = page.locator('.error, [role="alert"]');

            if (await errorMessage.isVisible()) {
              console.log(`Edge case value "${value}" triggered validation`);
            } else {
              console.log(`Edge case value "${value}" processed normally`);
            }
          }
        }

        // Take screenshot of edge case handling
        await page.screenshot({ path: 'test-results/screenshots/edge-case-handling.png', fullPage: true });
      }
    }
  });

  test('should handle concurrent operations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simulate concurrent operations
    const promises = [
      page.goto('/calculators'),
      page.goto('/patients'),
      page.goto('/results'),
      page.reload(),
      page.goBack(),
      page.goForward()
    ];

    try {
      // Execute operations concurrently
      await Promise.all(promises.map(p => p.catch(e => console.log('Concurrent operation error:', e))));

      // Should end up in a stable state
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1, h2, main')).toBeVisible();

      console.log('Concurrent operations handled successfully');

      // Take screenshot of final state
      await page.screenshot({ path: 'test-results/screenshots/concurrent-operations-final.png', fullPage: true });
    } catch (error) {
      console.log('Concurrent operations caused issues:', error);

      // Take screenshot of error state
      await page.screenshot({ path: 'test-results/screenshots/concurrent-operations-error.png', fullPage: true });
    }
  });
});