import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Navigating to site...');
  await page.goto('https://skinscore-afw5a.web.app/');

  console.log('Current URL:', page.url());

  // Take screenshot
  await page.screenshot({ path: 'site-exploration.png', fullPage: true });

  // Check page title
  const title = await page.title();
  console.log('Page title:', title);

  // Check for login elements
  const loginInputs = await page.locator('input[type="email"], input[name="email"]').count();
  console.log('Login email inputs found:', loginInputs);

  const passwordInputs = await page.locator('input[type="password"], input[name="password"]').count();
  console.log('Login password inputs found:', passwordInputs);

  // Check for headings
  const headings = await page.locator('h1, h2').allTextContents();
  console.log('Headings found:', headings);

  // Check for any sign-in related text
  const signInText = await page.locator('text=/sign.*in|login/i').count();
  console.log('Sign-in related elements:', signInText);

  // Check if we're already on a sign-in page
  const bodyText = await page.locator('body').textContent();
  console.log('Has sign-in text:', bodyText.toLowerCase().includes('sign'));

  // Wait a bit to see what loads
  await page.waitForTimeout(3000);

  console.log('Final URL:', page.url());

  await browser.close();
})();