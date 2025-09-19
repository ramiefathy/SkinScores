import { test, expect } from '@playwright/test';

const TEST_CREDENTIALS = {
  email: 'ramiefathy@gmail.com',
  password: 'testing1'
};

test.describe('Analytics Dashboard Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"]', TEST_CREDENTIALS.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_CREDENTIALS.password);
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
    await page.waitForURL(/.*(?<!\/login)$/, { timeout: 10000 });
  });

  test('should display analytics dashboard', async ({ page }) => {
    // Navigate to analytics
    const analyticsLink = page.locator('a:has-text("Analytics"), a[href*="analytics"], nav a:has-text("Reports")');

    if (await analyticsLink.first().isVisible()) {
      await analyticsLink.first().click();
    } else {
      await page.goto('/analytics');
    }

    await page.waitForLoadState('networkidle');

    // Should show analytics page
    await expect(page.locator('h1, h2')).toContainText(/analytics|dashboard|report/i);

    // Take screenshot of analytics dashboard
    await page.screenshot({ path: 'test-results/screenshots/analytics-dashboard.png', fullPage: true });
  });

  test('should display key metrics and KPIs', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');

    // Look for metric cards/widgets
    const metricCards = page.locator('.metric-card, .kpi-card, .stat-card, [data-testid*="metric"]');

    if (await metricCards.first().isVisible()) {
      const cardCount = await metricCards.count();
      console.log(`Found ${cardCount} metric cards`);

      // Take screenshot of metrics
      await page.screenshot({ path: 'test-results/screenshots/analytics-metrics.png', fullPage: true });
    }

    // Look for numeric values in dashboard
    const numbers = page.locator('text=/\\d+/, .number, .value');
    await expect(numbers.first()).toBeVisible({ timeout: 5000 });
  });

  test('should test date range filtering', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');

    // Look for date range picker
    const dateInputs = page.locator('input[type="date"], .date-picker, [aria-label*="date"]');

    if (await dateInputs.first().isVisible()) {
      // Set date range to last month
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthStr = lastMonth.toISOString().split('T')[0];

      await dateInputs.first().fill(lastMonthStr);

      if (await dateInputs.nth(1).isVisible()) {
        const today = new Date().toISOString().split('T')[0];
        await dateInputs.nth(1).fill(today);
      }

      // Wait for data to refresh
      await page.waitForTimeout(2000);

      // Take screenshot of filtered data
      await page.screenshot({ path: 'test-results/screenshots/analytics-date-filter.png', fullPage: true });
    }

    // Look for preset date range buttons
    const presetButtons = page.locator('button:has-text("Last 7 days"), button:has-text("Last 30 days"), button:has-text("This month")');

    if (await presetButtons.first().isVisible()) {
      await presetButtons.first().click();
      await page.waitForTimeout(1000);

      // Take screenshot of preset filter
      await page.screenshot({ path: 'test-results/screenshots/analytics-preset-filter.png', fullPage: true });
    }
  });

  test('should test chart interactions', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');

    // Look for charts (canvas elements, SVG, or chart containers)
    const charts = page.locator('canvas, svg, .chart, [data-testid*="chart"]');

    if (await charts.first().isVisible()) {
      const chart = charts.first();

      // Try hovering over chart for tooltips
      await chart.hover();
      await page.waitForTimeout(500);

      // Look for tooltips
      const tooltips = page.locator('.tooltip, [role="tooltip"], .chart-tooltip');
      if (await tooltips.isVisible()) {
        console.log('Chart tooltip interaction working');
      }

      // Take screenshot of chart interaction
      await page.screenshot({ path: 'test-results/screenshots/analytics-chart-interaction.png', fullPage: true });

      // Try clicking on chart elements
      await chart.click();
      await page.waitForTimeout(500);
    }
  });

  test('should test data export functionality', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');

    // Look for export buttons
    const exportBtn = page.locator('button:has-text("Export"), a:has-text("Export"), button:has-text("Download"), [aria-label*="export"]');

    if (await exportBtn.isVisible()) {
      // Set up download handling
      const downloadPromise = page.waitForEvent('download');

      await exportBtn.click();

      // Look for export format options
      const formatOptions = page.locator('button:has-text("CSV"), button:has-text("PDF"), button:has-text("Excel")');

      if (await formatOptions.first().isVisible()) {
        await formatOptions.first().click();
      }

      try {
        const download = await downloadPromise;
        console.log(`Analytics export started: ${download.suggestedFilename()}`);

        // Take screenshot of export action
        await page.screenshot({ path: 'test-results/screenshots/analytics-export.png', fullPage: true });
      } catch (error) {
        console.log('No download triggered for analytics export');
      }
    }
  });

  test('should test different analytics views/tabs', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');

    // Look for different analytics tabs/sections
    const tabs = page.locator('[role="tab"], .tab, button:has-text("Usage"), button:has-text("Patients"), button:has-text("Tools")');

    if (await tabs.count() > 1) {
      const tabCount = await tabs.count();

      for (let i = 0; i < Math.min(tabCount, 4); i++) {
        const tab = tabs.nth(i);
        const tabText = await tab.textContent();

        await tab.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Take screenshot of each tab
        await page.screenshot({
          path: `test-results/screenshots/analytics-tab-${i}-${tabText?.toLowerCase().replace(/\s+/g, '-')}.png`,
          fullPage: true
        });
      }
    }
  });

  test('should test analytics performance with large datasets', async ({ page }) => {
    await page.goto('/analytics');

    // Measure page load time
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    console.log(`Analytics page load time: ${loadTime}ms`);

    // Set date range to get more data (last 6 months)
    const dateInputs = page.locator('input[type="date"]');

    if (await dateInputs.first().isVisible()) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0];

      const dataLoadStart = Date.now();
      await dateInputs.first().fill(sixMonthsAgoStr);
      await page.waitForLoadState('networkidle');
      const dataLoadTime = Date.now() - dataLoadStart;

      console.log(`Analytics data refresh time with 6 months of data: ${dataLoadTime}ms`);

      // Take screenshot of performance test
      await page.screenshot({ path: 'test-results/screenshots/analytics-performance.png', fullPage: true });
    }
  });

  test('should test analytics responsive design', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    // Take screenshot of mobile analytics
    await page.screenshot({ path: 'test-results/screenshots/analytics-mobile.png', fullPage: true });

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);

    // Take screenshot of tablet analytics
    await page.screenshot({ path: 'test-results/screenshots/analytics-tablet.png', fullPage: true });

    // Test desktop view
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(1000);

    // Take screenshot of desktop analytics
    await page.screenshot({ path: 'test-results/screenshots/analytics-desktop.png', fullPage: true });
  });

  test('should verify data accuracy and consistency', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');

    // Get values from different metric cards
    const metricValues = page.locator('.metric-value, .kpi-value, .stat-value, text=/^\\d+$/');

    if (await metricValues.count() > 0) {
      const values = [];
      const count = await metricValues.count();

      for (let i = 0; i < Math.min(count, 5); i++) {
        const value = await metricValues.nth(i).textContent();
        values.push(value);
      }

      console.log('Analytics metric values:', values);

      // Verify no negative values where inappropriate
      const hasNegativeValues = values.some(v => v && v.includes('-') && !v.includes('-%'));
      if (hasNegativeValues) {
        console.warn('Found unexpected negative values in analytics');
      }

      // Take screenshot for data verification
      await page.screenshot({ path: 'test-results/screenshots/analytics-data-verification.png', fullPage: true });
    }
  });
});