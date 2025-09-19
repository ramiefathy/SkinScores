import { chromium } from 'playwright';

const TEST_CREDENTIALS = {
  email: 'ramiefathy@gmail.com',
  password: 'testing1'
};

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('1. Navigating to site...');
    await page.goto('https://skinscore-afw5a.web.app/');
    await page.waitForLoadState('networkidle');

    console.log('Current URL:', page.url());

    // Take initial screenshot
    await page.screenshot({ path: 'test-results/screenshots/01-initial-page.png', fullPage: true });

    // Look for sign-in button or link
    console.log('2. Looking for sign-in elements...');
    const signInElements = await page.locator('text=/sign.*in|login/i').all();
    console.log('Found sign-in elements:', signInElements.length);

    if (signInElements.length > 0) {
      console.log('3. Clicking sign-in element...');
      await signInElements[0].click();
      await page.waitForLoadState('networkidle');

      console.log('After click URL:', page.url());
      await page.screenshot({ path: 'test-results/screenshots/02-after-signin-click.png', fullPage: true });
    }

    // Look for email/password inputs
    console.log('4. Looking for login form...');
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"], input[placeholder*="password"]');

    const emailCount = await emailInput.count();
    const passwordCount = await passwordInput.count();

    console.log('Email inputs found:', emailCount);
    console.log('Password inputs found:', passwordCount);

    if (emailCount > 0 && passwordCount > 0) {
      console.log('5. Filling in credentials...');
      await emailInput.first().fill(TEST_CREDENTIALS.email);
      await passwordInput.first().fill(TEST_CREDENTIALS.password);

      await page.screenshot({ path: 'test-results/screenshots/03-credentials-filled.png', fullPage: true });

      // Look for submit button
      const submitButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login"), button:has-text("Submit")');
      const submitCount = await submitButton.count();

      console.log('Submit buttons found:', submitCount);

      if (submitCount > 0) {
        console.log('6. Clicking submit...');
        await submitButton.first().click();
        await page.waitForLoadState('networkidle');

        console.log('After login URL:', page.url());
        await page.screenshot({ path: 'test-results/screenshots/04-after-login.png', fullPage: true });

        // Check if login was successful
        const isLoggedIn = !page.url().includes('sign-in') && !page.url().includes('login');
        console.log('Login appears successful:', isLoggedIn);

        if (isLoggedIn) {
          console.log('7. Testing navigation...');

          // Try to access different sections
          const navLinks = await page.locator('nav a, a[href*="/"], .nav-item').all();
          console.log('Navigation links found:', navLinks.length);

          // Test calculators
          try {
            await page.goto('https://skinscore-afw5a.web.app/calculators');
            await page.waitForLoadState('networkidle');
            console.log('Calculators URL:', page.url());
            await page.screenshot({ path: 'test-results/screenshots/05-calculators.png', fullPage: true });
          } catch (error) {
            console.log('Calculators navigation error:', error.message);
          }

          // Test results
          try {
            await page.goto('https://skinscore-afw5a.web.app/results');
            await page.waitForLoadState('networkidle');
            console.log('Results URL:', page.url());
            await page.screenshot({ path: 'test-results/screenshots/06-results.png', fullPage: true });
          } catch (error) {
            console.log('Results navigation error:', error.message);
          }

          // Test analytics
          try {
            await page.goto('https://skinscore-afw5a.web.app/analytics');
            await page.waitForLoadState('networkidle');
            console.log('Analytics URL:', page.url());
            await page.screenshot({ path: 'test-results/screenshots/07-analytics.png', fullPage: true });
          } catch (error) {
            console.log('Analytics navigation error:', error.message);
          }
        }
      }
    }

    console.log('Authentication flow exploration complete!');

  } catch (error) {
    console.error('Error during authentication flow:', error);
    await page.screenshot({ path: 'test-results/screenshots/error-state.png', fullPage: true });
  } finally {
    // Keep browser open for manual inspection
    console.log('Browser will remain open for 10 seconds...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
})();