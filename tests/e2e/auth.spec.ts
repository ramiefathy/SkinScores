import { test, expect } from '@playwright/test';

const TEST_CREDENTIALS = {
  email: 'ramiefathy@gmail.com',
  password: 'testing1'
};

test.describe('Authentication Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page for unauthenticated users', async ({ page }) => {
    // Check if we're on a login page or home page with login functionality
    const url = page.url();
    const hasLoginElements = await page.locator('text=/sign.*in|login/i').count() > 0;

    console.log('Current URL:', url);
    console.log('Has login elements:', hasLoginElements);

    await expect(page.locator('h1, h2')).toContainText(/clinical.*scoring|sign.*in|login/i);

    // Take screenshot of login page
    await page.screenshot({ path: 'test-results/screenshots/login-page.png', fullPage: true });
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Navigate to login if not already there
    if (!page.url().includes('/login')) {
      await page.goto('/login');
    }

    // Fill in credentials
    await page.fill('input[type="email"], input[name="email"]', TEST_CREDENTIALS.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_CREDENTIALS.password);

    // Submit the form
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');

    // Wait for navigation after successful login
    await page.waitForURL(/.*(?<!\/login)$/, { timeout: 10000 });

    // Verify we're logged in (check for dashboard or main app content)
    await expect(page).not.toHaveURL(/.*\/login/);

    // Take screenshot of dashboard
    await page.screenshot({ path: 'test-results/screenshots/dashboard-logged-in.png', fullPage: true });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    if (!page.url().includes('/login')) {
      await page.goto('/login');
    }

    await page.fill('input[type="email"], input[name="email"]', 'invalid@example.com');
    await page.fill('input[type="password"], input[name="password"]', 'wrongpassword');

    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');

    // Wait for error message
    await expect(page.locator('text=/error|invalid|incorrect/i')).toBeVisible({ timeout: 5000 });

    // Take screenshot of error state
    await page.screenshot({ path: 'test-results/screenshots/login-error.png', fullPage: true });
  });

  test('should persist session after page refresh', async ({ page }) => {
    // Login first
    if (!page.url().includes('/login')) {
      await page.goto('/login');
    }

    await page.fill('input[type="email"], input[name="email"]', TEST_CREDENTIALS.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_CREDENTIALS.password);
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');

    await page.waitForURL(/.*(?<!\/login)$/, { timeout: 10000 });

    // Refresh the page
    await page.reload();

    // Should still be logged in
    await expect(page).not.toHaveURL(/.*\/login/);
  });

  test('should successfully logout', async ({ page }) => {
    // Login first
    if (!page.url().includes('/login')) {
      await page.goto('/login');
    }

    await page.fill('input[type="email"], input[name="email"]', TEST_CREDENTIALS.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_CREDENTIALS.password);
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');

    await page.waitForURL(/.*(?<!\/login)$/, { timeout: 10000 });

    // Look for logout button (could be in menu, profile dropdown, etc.)
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout"), a:has-text("Sign Out")');

    // If logout button is not immediately visible, try clicking profile menu
    if (!(await logoutButton.isVisible())) {
      const profileMenu = page.locator('[aria-label*="profile"], [aria-label*="menu"], button:has([aria-label*="profile"]), button:has([aria-label*="account"])');
      if (await profileMenu.isVisible()) {
        await profileMenu.click();
      }
    }

    await logoutButton.click();

    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
  });

  test('should protect routes that require authentication', async ({ page }) => {
    // Try to access protected routes directly
    const protectedRoutes = ['/dashboard', '/calculators', '/patients', '/analytics', '/results'];

    for (const route of protectedRoutes) {
      await page.goto(route);
      // Should be redirected to login
      await expect(page).toHaveURL(/.*\/login/, { timeout: 5000 });
    }
  });
});