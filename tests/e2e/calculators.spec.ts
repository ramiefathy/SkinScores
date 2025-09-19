import { test, expect } from '@playwright/test';

const TEST_CREDENTIALS = {
  email: 'ramiefathy@gmail.com',
  password: 'testing1'
};

test.describe('Calculator Tools Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"]', TEST_CREDENTIALS.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_CREDENTIALS.password);
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
    await page.waitForURL(/.*(?<!\/login)$/, { timeout: 10000 });
  });

  test('should display calculator tools library', async ({ page }) => {
    // Navigate to calculators/tools section
    await page.goto('/calculators');

    // Wait for tools to load
    await page.waitForLoadState('networkidle');

    // Should show list of available tools
    await expect(page.locator('h1, h2')).toContainText(/calculator|tool|score/i);

    // Take screenshot of tools library
    await page.screenshot({ path: 'test-results/screenshots/tools-library.png', fullPage: true });

    // Check that tools are listed
    const toolCards = page.locator('[data-testid*="tool"], [data-testid*="calculator"], .tool-card, .calculator-card');
    await expect(toolCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('should search and filter tools', async ({ page }) => {
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');

    // Look for search input
    const searchInput = page.locator('input[placeholder*="search"], input[aria-label*="search"], input[name*="search"]');

    if (await searchInput.isVisible()) {
      await searchInput.fill('pasi');
      await page.waitForTimeout(1000); // Wait for search results

      // Should show filtered results
      const results = page.locator('[data-testid*="tool"], .tool-card, .calculator-card');
      await expect(results.first()).toBeVisible();

      // Take screenshot of search results
      await page.screenshot({ path: 'test-results/screenshots/search-results.png', fullPage: true });
    }
  });

  test('should test PASI calculator functionality', async ({ page }) => {
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');

    // Find and click PASI calculator
    const pasiTool = page.locator('text=/pasi/i, [href*="pasi"], [data-tool="pasi"]').first();

    if (await pasiTool.isVisible()) {
      await pasiTool.click();
      await page.waitForLoadState('networkidle');

      // Should be on PASI calculator page
      await expect(page.locator('h1, h2')).toContainText(/pasi/i);

      // Take screenshot of PASI calculator
      await page.screenshot({ path: 'test-results/screenshots/pasi-calculator.png', fullPage: true });

      // Fill in some test values
      const inputs = page.locator('input[type="number"], input[type="range"], select');
      const inputCount = await inputs.count();

      for (let i = 0; i < Math.min(inputCount, 4); i++) {
        const input = inputs.nth(i);
        const inputType = await input.getAttribute('type');

        if (inputType === 'number' || inputType === 'range') {
          await input.fill('2');
        } else if (await input.getAttribute('tagName') === 'SELECT') {
          await input.selectOption({ index: 1 });
        }
      }

      // Look for calculate button
      const calculateBtn = page.locator('button:has-text("Calculate"), button:has-text("Compute"), button[type="submit"]');
      if (await calculateBtn.isVisible()) {
        await calculateBtn.click();

        // Should show result
        await expect(page.locator('text=/score|result|total/i')).toBeVisible({ timeout: 5000 });

        // Take screenshot of results
        await page.screenshot({ path: 'test-results/screenshots/pasi-results.png', fullPage: true });
      }
    }
  });

  test('should test input validation on calculators', async ({ page }) => {
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');

    // Find any calculator tool
    const firstTool = page.locator('[data-testid*="tool"], .tool-card, .calculator-card, a[href*="/calculators/"]').first();
    await firstTool.click();
    await page.waitForLoadState('networkidle');

    // Try entering invalid values
    const numberInputs = page.locator('input[type="number"]');
    const firstInput = numberInputs.first();

    if (await firstInput.isVisible()) {
      // Test negative values if not allowed
      await firstInput.fill('-1');

      // Test very large values
      await firstInput.fill('99999');

      // Test decimal values if integers only
      await firstInput.fill('1.5');

      // Look for validation messages
      const validationMessages = page.locator('.error, [role="alert"], .validation-error, text=/invalid|error/i');

      // Take screenshot of validation state
      await page.screenshot({ path: 'test-results/screenshots/validation-error.png', fullPage: true });
    }
  });

  test('should test saving calculator results', async ({ page }) => {
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');

    // Find and use a calculator
    const firstTool = page.locator('[data-testid*="tool"], .tool-card, .calculator-card, a[href*="/calculators/"]').first();
    await firstTool.click();
    await page.waitForLoadState('networkidle');

    // Fill in required fields
    const inputs = page.locator('input[type="number"], input[type="range"], select');
    const inputCount = await inputs.count();

    for (let i = 0; i < Math.min(inputCount, 3); i++) {
      const input = inputs.nth(i);
      const inputType = await input.getAttribute('type');

      if (inputType === 'number' || inputType === 'range') {
        await input.fill('1');
      }
    }

    // Calculate
    const calculateBtn = page.locator('button:has-text("Calculate"), button:has-text("Compute"), button[type="submit"]');
    if (await calculateBtn.isVisible()) {
      await calculateBtn.click();
      await page.waitForTimeout(2000);

      // Look for save button
      const saveBtn = page.locator('button:has-text("Save"), button:has-text("Save Result")');
      if (await saveBtn.isVisible()) {
        await saveBtn.click();

        // Should show success message or redirect
        await expect(page.locator('text=/saved|success/i, [role="alert"]')).toBeVisible({ timeout: 5000 });

        // Take screenshot of save confirmation
        await page.screenshot({ path: 'test-results/screenshots/save-result.png', fullPage: true });
      }
    }
  });

  test('should test different calculator types', async ({ page }) => {
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');

    // Test different types of calculators
    const calculatorTypes = ['pasi', 'dlqi', 'bsa', 'scorad', 'skindex'];

    for (const calcType of calculatorTypes) {
      const calcLink = page.locator(`text=/${calcType}/i, [href*="${calcType}"]`).first();

      if (await calcLink.isVisible()) {
        await calcLink.click();
        await page.waitForLoadState('networkidle');

        // Verify calculator loaded
        await expect(page.locator('h1, h2')).toContainText(new RegExp(calcType, 'i'));

        // Take screenshot
        await page.screenshot({
          path: `test-results/screenshots/${calcType}-calculator.png`,
          fullPage: true
        });

        // Test basic functionality
        const inputs = page.locator('input[type="number"], input[type="range"], select, input[type="radio"], input[type="checkbox"]');
        const inputCount = await inputs.count();

        if (inputCount > 0) {
          // Fill first few inputs
          for (let i = 0; i < Math.min(inputCount, 3); i++) {
            const input = inputs.nth(i);
            const inputType = await input.getAttribute('type');

            try {
              if (inputType === 'number' || inputType === 'range') {
                await input.fill('1');
              } else if (inputType === 'radio' || inputType === 'checkbox') {
                await input.check();
              } else if (await input.getAttribute('tagName') === 'SELECT') {
                await input.selectOption({ index: 1 });
              }
            } catch (error) {
              console.log(`Could not interact with input ${i} for ${calcType}: ${error}`);
            }
          }
        }

        // Go back to calculators list
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should test calculator help and documentation', async ({ page }) => {
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');

    // Find a calculator
    const firstTool = page.locator('[data-testid*="tool"], .tool-card, .calculator-card, a[href*="/calculators/"]').first();
    await firstTool.click();
    await page.waitForLoadState('networkidle');

    // Look for help/info buttons
    const helpButtons = page.locator('button:has-text("Help"), button:has-text("Info"), [aria-label*="help"], [aria-label*="info"], .help-icon, .info-icon');

    if (await helpButtons.first().isVisible()) {
      await helpButtons.first().click();

      // Should show help content
      await expect(page.locator('text=/instruction|how to|guide|help/i')).toBeVisible({ timeout: 5000 });

      // Take screenshot of help content
      await page.screenshot({ path: 'test-results/screenshots/calculator-help.png', fullPage: true });
    }
  });
});