import { chromium } from 'playwright';

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 }
};

const TEST_CREDENTIALS = {
  email: 'ramiefathy@gmail.com',
  password: 'testing1'
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshot(page, name, fullPage = true) {
  try {
    await page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage
    });
    console.log(`📸 Screenshot saved: ${name}.png`);
  } catch (error) {
    console.log(`❌ Screenshot failed for ${name}: ${error.message}`);
  }
}

async function testAuthentication(page) {
  console.log('\n🔐 TESTING AUTHENTICATION...');

  try {
    await page.goto('https://skinscore-afw5a.web.app/');
    await page.waitForLoadState('networkidle');

    await takeScreenshot(page, 'auth-01-homepage');

    // Look for sign-in elements
    const signInElements = page.locator('text=/sign.*in|login/i');
    const signInCount = await signInElements.count();

    if (signInCount > 0) {
      console.log(`✅ Found ${signInCount} sign-in elements`);

      await signInElements.first().click();
      await page.waitForLoadState('networkidle');
      await takeScreenshot(page, 'auth-02-signin-page');

      // Try to login
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');

      if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
        console.log('✅ Found login form');

        await emailInput.fill(TEST_CREDENTIALS.email);
        await passwordInput.fill(TEST_CREDENTIALS.password);
        await takeScreenshot(page, 'auth-03-credentials-filled');

        const submitBtn = page.locator('button[type="submit"], button:has-text("Sign In")');
        if (await submitBtn.count() > 0) {
          await submitBtn.click();
          await page.waitForLoadState('networkidle');
          await delay(2000);

          await takeScreenshot(page, 'auth-04-after-login');

          const isLoggedIn = !page.url().includes('sign-in');
          console.log(`${isLoggedIn ? '✅' : '❌'} Login ${isLoggedIn ? 'successful' : 'failed'}`);

          return isLoggedIn;
        }
      }
    } else {
      console.log('❌ No sign-in elements found');
    }
  } catch (error) {
    console.log(`❌ Authentication test error: ${error.message}`);
  }

  return false;
}

async function testNavigationAndStructure(page) {
  console.log('\n🧭 TESTING NAVIGATION AND STRUCTURE...');

  const testPages = [
    { path: '/', name: 'homepage' },
    { path: '/calculators', name: 'calculators' },
    { path: '/patients', name: 'patients' },
    { path: '/results', name: 'results' },
    { path: '/analytics', name: 'analytics' }
  ];

  for (const testPage of testPages) {
    try {
      console.log(`📄 Testing ${testPage.name}...`);

      await page.goto(`https://skinscore-afw5a.web.app${testPage.path}`);
      await page.waitForLoadState('networkidle');
      await delay(1000);

      await takeScreenshot(page, `nav-${testPage.name}`);

      // Check for main content
      const mainContent = page.locator('main, h1, h2, .container, .content');
      const hasContent = await mainContent.count() > 0;
      console.log(`${hasContent ? '✅' : '❌'} Main content found on ${testPage.name}`);

      // Check for navigation elements
      const navElements = page.locator('nav, .nav, .menu, .navigation');
      const hasNav = await navElements.count() > 0;
      console.log(`${hasNav ? '✅' : '❌'} Navigation found on ${testPage.name}`);

      // Check page title
      const title = await page.title();
      console.log(`📋 Title: ${title}`);

    } catch (error) {
      console.log(`❌ Error testing ${testPage.name}: ${error.message}`);
    }
  }
}

async function testResponsiveDesign(page) {
  console.log('\n📱 TESTING RESPONSIVE DESIGN...');

  await page.goto('https://skinscore-afw5a.web.app/');
  await page.waitForLoadState('networkidle');

  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    try {
      console.log(`📐 Testing ${name} viewport (${viewport.width}x${viewport.height})...`);

      await page.setViewportSize(viewport);
      await delay(500);

      await takeScreenshot(page, `responsive-${name}-home`);

      // Test calculators page
      await page.goto('https://skinscore-afw5a.web.app/calculators');
      await page.waitForLoadState('networkidle');
      await takeScreenshot(page, `responsive-${name}-calculators`);

      // Check for horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });

      console.log(`${hasHorizontalScroll ? '❌' : '✅'} Horizontal scroll on ${name}`);

      // Check for mobile menu
      if (name === 'mobile') {
        const mobileMenu = page.locator('button[aria-label*="menu"], .hamburger, .mobile-menu');
        const hasMobileMenu = await mobileMenu.count() > 0;
        console.log(`${hasMobileMenu ? '✅' : '❌'} Mobile menu found`);
      }

    } catch (error) {
      console.log(`❌ Error testing ${name} viewport: ${error.message}`);
    }
  }
}

async function testPerformance(page) {
  console.log('\n⚡ TESTING PERFORMANCE...');

  const testUrls = [
    'https://skinscore-afw5a.web.app/',
    'https://skinscore-afw5a.web.app/calculators',
    'https://skinscore-afw5a.web.app/analytics'
  ];

  for (const url of testUrls) {
    try {
      const startTime = Date.now();

      await page.goto(url);
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart),
          loadComplete: Math.round(navigation.loadEventEnd - navigation.navigationStart),
          firstPaint: Math.round(performance.getEntriesByName('first-paint')[0]?.startTime || 0),
          firstContentfulPaint: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0)
        };
      });

      console.log(`📊 ${url}:`);
      console.log(`   Load time: ${loadTime}ms`);
      console.log(`   DOM ready: ${metrics.domContentLoaded}ms`);
      console.log(`   First paint: ${metrics.firstPaint}ms`);
      console.log(`   FCP: ${metrics.firstContentfulPaint}ms`);

      const isGoodPerformance = loadTime < 3000;
      console.log(`${isGoodPerformance ? '✅' : '⚠️'} Performance ${isGoodPerformance ? 'good' : 'needs improvement'}`);

    } catch (error) {
      console.log(`❌ Performance test error for ${url}: ${error.message}`);
    }
  }
}

async function testAccessibility(page) {
  console.log('\n♿ TESTING ACCESSIBILITY...');

  await page.goto('https://skinscore-afw5a.web.app/');
  await page.waitForLoadState('networkidle');

  try {
    // Check for heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    console.log(`📄 Found ${headings.length} headings`);

    const h1Count = await page.locator('h1').count();
    console.log(`${h1Count === 1 ? '✅' : '⚠️'} H1 count: ${h1Count} (should be 1)`);

    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    let imagesWithoutAlt = 0;

    for (let i = 0; i < imageCount; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      if (!alt) imagesWithoutAlt++;
    }

    console.log(`🖼️ Images: ${imageCount} total, ${imagesWithoutAlt} without alt text`);
    console.log(`${imagesWithoutAlt === 0 ? '✅' : '⚠️'} Image accessibility`);

    // Check for form labels
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    console.log(`📝 Found ${inputCount} form inputs`);

    // Check for skip links
    const skipLinks = page.locator('a[href*="#main"], a[href*="#content"]');
    const hasSkipLinks = await skipLinks.count() > 0;
    console.log(`${hasSkipLinks ? '✅' : '⚠️'} Skip links ${hasSkipLinks ? 'found' : 'not found'}`);

    await takeScreenshot(page, 'accessibility-test');

  } catch (error) {
    console.log(`❌ Accessibility test error: ${error.message}`);
  }
}

async function testErrorHandling(page) {
  console.log('\n🚨 TESTING ERROR HANDLING...');

  try {
    // Test 404 page
    await page.goto('https://skinscore-afw5a.web.app/non-existent-page');
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, 'error-404');

    const pageContent = await page.locator('body').textContent();
    const handles404 = pageContent.includes('404') || pageContent.includes('Not Found') || pageContent.includes('Page not found');
    console.log(`${handles404 ? '✅' : '❌'} 404 error handling`);

    // Test network simulation
    await page.route('**/*', route => {
      if (route.request().url().includes('/api/')) {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server Error' })
        });
      } else {
        route.continue();
      }
    });

    await page.goto('https://skinscore-afw5a.web.app/');
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, 'error-api-simulation');

    console.log('✅ Error handling tests completed');

  } catch (error) {
    console.log(`❌ Error handling test error: ${error.message}`);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🚀 STARTING COMPREHENSIVE UI/UX TESTING');
  console.log('🎯 Target: https://skinscore-afw5a.web.app');
  console.log('📅 Date:', new Date().toISOString());

  try {
    const isAuthenticated = await testAuthentication(page);

    await testNavigationAndStructure(page);
    await testResponsiveDesign(page);
    await testPerformance(page);
    await testAccessibility(page);
    await testErrorHandling(page);

    console.log('\n🎉 COMPREHENSIVE TESTING COMPLETED');
    console.log('📁 Screenshots saved to test-results/screenshots/');

  } catch (error) {
    console.error('❌ Critical test error:', error);
  } finally {
    await delay(3000);
    await browser.close();
  }
})();