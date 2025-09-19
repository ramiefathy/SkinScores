import { test, expect } from '@playwright/test';

const TEST_CREDENTIALS = {
  email: 'ramiefathy@gmail.com',
  password: 'testing1'
};

test.describe('Performance Analysis Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"]', TEST_CREDENTIALS.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_CREDENTIALS.password);
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
    await page.waitForURL(/.*(?<!\/login)$/, { timeout: 10000 });
  });

  test('should measure page load performance', async ({ page }) => {
    const pages = ['/', '/calculators', '/patients', '/results', '/analytics'];
    const performanceResults = [];

    for (const pagePath of pages) {
      const startTime = Date.now();

      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // Get performance metrics
      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          loadComplete: navigation.loadEventEnd - navigation.navigationStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        };
      });

      performanceResults.push({
        page: pagePath,
        loadTime,
        ...performanceMetrics
      });

      console.log(`${pagePath}: ${loadTime}ms (DOM: ${performanceMetrics.domContentLoaded}ms)`);
    }

    // Log all performance results
    console.log('Performance Results:', JSON.stringify(performanceResults, null, 2));

    // Take screenshot of performance metrics
    await page.screenshot({ path: 'test-results/screenshots/performance-metrics.png', fullPage: true });

    // Verify reasonable load times (under 5 seconds)
    performanceResults.forEach(result => {
      expect(result.loadTime).toBeLessThan(5000);
    });
  });

  test('should test slow network conditions', async ({ page, context }) => {
    // Simulate slow 3G network
    await context.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');
    const slowLoadTime = Date.now() - startTime;

    console.log(`Slow network load time: ${slowLoadTime}ms`);

    // Should still be usable under slow conditions
    await expect(page.locator('h1, h2')).toBeVisible();

    // Take screenshot under slow conditions
    await page.screenshot({ path: 'test-results/screenshots/slow-network.png', fullPage: true });
  });

  test('should monitor memory usage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get initial memory
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null;
    });

    if (initialMemory) {
      console.log('Initial memory usage:', initialMemory);
    }

    // Navigate through multiple pages to test for memory leaks
    const pages = ['/calculators', '/patients', '/results', '/analytics'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
    }

    // Get final memory
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null;
    });

    if (finalMemory && initialMemory) {
      const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
      console.log('Memory increase after navigation:', memoryIncrease, 'bytes');
      console.log('Final memory usage:', finalMemory);

      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    }
  });

  test('should test large dataset performance', async ({ page }) => {
    // Navigate to a page that might have large datasets
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');

    // Set date range to get maximum data
    const dateInputs = page.locator('input[type="date"]');

    if (await dateInputs.first().isVisible()) {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const oneYearAgoStr = oneYearAgo.toISOString().split('T')[0];

      const dataLoadStart = Date.now();
      await dateInputs.first().fill(oneYearAgoStr);
      await page.waitForLoadState('networkidle');
      const dataLoadTime = Date.now() - dataLoadStart;

      console.log(`Large dataset load time: ${dataLoadTime}ms`);

      // Should handle large datasets reasonably (under 10 seconds)
      expect(dataLoadTime).toBeLessThan(10000);
    }

    // Test scrolling performance with large lists
    await page.goto('/results');
    await page.waitForLoadState('networkidle');

    const scrollStart = Date.now();

    // Scroll down multiple times to test performance
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(100);
    }

    const scrollTime = Date.now() - scrollStart;
    console.log(`Scroll performance time: ${scrollTime}ms`);

    // Take screenshot of large dataset handling
    await page.screenshot({ path: 'test-results/screenshots/large-dataset-performance.png', fullPage: true });
  });

  test('should test calculator computation performance', async ({ page }) => {
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');

    // Find and test a calculator
    const calculatorLink = page.locator('a[href*="/calculators/"], .calculator-card a, .tool-card a').first();

    if (await calculatorLink.isVisible()) {
      await calculatorLink.click();
      await page.waitForLoadState('networkidle');

      // Fill inputs rapidly
      const inputs = page.locator('input[type="number"], input[type="range"]');
      const inputCount = await inputs.count();

      const computationStart = Date.now();

      for (let i = 0; i < Math.min(inputCount, 10); i++) {
        await inputs.nth(i).fill(String(i + 1));
        await page.waitForTimeout(50); // Small delay between inputs
      }

      // Trigger calculation
      const calculateBtn = page.locator('button:has-text("Calculate"), button:has-text("Compute"), button[type="submit"]');

      if (await calculateBtn.isVisible()) {
        await calculateBtn.click();

        // Wait for result
        await expect(page.locator('text=/score|result|total/i')).toBeVisible({ timeout: 5000 });

        const computationTime = Date.now() - computationStart;
        console.log(`Calculator computation time: ${computationTime}ms`);

        // Calculations should be fast (under 2 seconds)
        expect(computationTime).toBeLessThan(2000);

        // Take screenshot of computation result
        await page.screenshot({ path: 'test-results/screenshots/computation-performance.png', fullPage: true });
      }
    }
  });

  test('should test concurrent user simulation', async ({ page }) => {
    // Simulate multiple rapid operations
    const operations = [
      () => page.goto('/calculators'),
      () => page.goto('/patients'),
      () => page.goto('/results'),
      () => page.goto('/analytics'),
      () => page.goBack(),
      () => page.reload()
    ];

    const concurrentStart = Date.now();

    // Execute operations in rapid succession
    for (const operation of operations) {
      await operation();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(100);
    }

    const concurrentTime = Date.now() - concurrentStart;
    console.log(`Concurrent operations time: ${concurrentTime}ms`);

    // Should handle rapid navigation reasonably
    expect(concurrentTime).toBeLessThan(15000);

    // Take screenshot after concurrent operations
    await page.screenshot({ path: 'test-results/screenshots/concurrent-operations.png', fullPage: true });
  });

  test('should analyze bundle size and resource loading', async ({ page }) => {
    await page.goto('/');

    // Get resource loading information
    const resources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return resources.map(resource => ({
        name: resource.name,
        size: resource.transferSize || 0,
        duration: resource.duration,
        type: resource.initiatorType
      }));
    });

    // Analyze JavaScript bundles
    const jsResources = resources.filter(r => r.name.includes('.js'));
    const cssResources = resources.filter(r => r.name.includes('.css'));
    const imageResources = resources.filter(r => r.type === 'img');

    const totalJSSize = jsResources.reduce((sum, r) => sum + r.size, 0);
    const totalCSSSize = cssResources.reduce((sum, r) => sum + r.size, 0);
    const totalImageSize = imageResources.reduce((sum, r) => sum + r.size, 0);

    console.log(`Total JS size: ${Math.round(totalJSSize / 1024)}KB`);
    console.log(`Total CSS size: ${Math.round(totalCSSSize / 1024)}KB`);
    console.log(`Total Image size: ${Math.round(totalImageSize / 1024)}KB`);

    // Bundle sizes should be reasonable
    expect(totalJSSize).toBeLessThan(2 * 1024 * 1024); // Less than 2MB JS
    expect(totalCSSSize).toBeLessThan(500 * 1024); // Less than 500KB CSS

    // Take screenshot for resource analysis
    await page.screenshot({ path: 'test-results/screenshots/resource-analysis.png', fullPage: true });
  });
});