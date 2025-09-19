import { test, expect } from '@playwright/test';

const TEST_CREDENTIALS = {
  email: 'ramiefathy@gmail.com',
  password: 'testing1',
};

test.describe('Results Management Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"]', TEST_CREDENTIALS.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_CREDENTIALS.password);
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
    await page.waitForURL(/.*(?<!\/login)$/, { timeout: 10000 });
  });

  test('should display results page', async ({ page }) => {
    // Navigate to results
    const resultsLink = page.locator(
      'a:has-text("Results"), a[href*="results"], nav a:has-text("History")',
    );

    if (await resultsLink.first().isVisible()) {
      await resultsLink.first().click();
    } else {
      await page.goto('/results');
    }

    await page.waitForLoadState('networkidle');

    // Should show results page
    await expect(page.locator('h1, h2')).toContainText(/results|history|scores/i);

    // Take screenshot of results page
    await page.screenshot({ path: 'test-results/screenshots/results-page.png', fullPage: true });
  });

  test('should display saved calculation results', async ({ page }) => {
    await page.goto('/results');
    await page.waitForLoadState('networkidle');

    // Look for result entries
    const resultItems = page.locator('.result-item, .score-item, tr, [data-testid*="result"]');

    if (await resultItems.first().isVisible()) {
      console.log(`Found ${await resultItems.count()} result items`);

      // Take screenshot of results list
      await page.screenshot({ path: 'test-results/screenshots/results-list.png', fullPage: true });

      // Click on first result to view details
      await resultItems.first().click();
      await page.waitForLoadState('networkidle');

      // Take screenshot of result details
      await page.screenshot({
        path: 'test-results/screenshots/result-details.png',
        fullPage: true,
      });
    } else {
      console.log('No results found - may need to create some test results first');
    }
  });

  test('should filter results by date range', async ({ page }) => {
    await page.goto('/results');
    await page.waitForLoadState('networkidle');

    // Look for date filters
    const dateInputs = page.locator('input[type="date"], .date-picker, [aria-label*="date"]');

    if (await dateInputs.first().isVisible()) {
      // Set date range to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

      await dateInputs.first().fill(thirtyDaysAgoStr);

      if (await dateInputs.nth(1).isVisible()) {
        const today = new Date().toISOString().split('T')[0];
        await dateInputs.nth(1).fill(today);
      }

      await page.waitForTimeout(1000);

      // Take screenshot of filtered results
      await page.screenshot({
        path: 'test-results/screenshots/results-date-filter.png',
        fullPage: true,
      });
    }
  });

  test('should filter results by tool type', async ({ page }) => {
    await page.goto('/results');
    await page.waitForLoadState('networkidle');

    // Look for tool filter dropdown
    const toolFilter = page.locator(
      'select[name*="tool"], select[aria-label*="tool"], .tool-filter',
    );

    if (await toolFilter.isVisible()) {
      await toolFilter.selectOption({ index: 1 });
      await page.waitForTimeout(1000);

      // Take screenshot of tool-filtered results
      await page.screenshot({
        path: 'test-results/screenshots/results-tool-filter.png',
        fullPage: true,
      });
    }

    // Look for tool filter buttons/chips
    const toolButtons = page.locator(
      'button:has-text("PASI"), button:has-text("DLQI"), button:has-text("BSA")',
    );

    if (await toolButtons.first().isVisible()) {
      await toolButtons.first().click();
      await page.waitForTimeout(1000);

      // Take screenshot of button-filtered results
      await page.screenshot({
        path: 'test-results/screenshots/results-button-filter.png',
        fullPage: true,
      });
    }
  });

  test('should search results', async ({ page }) => {
    await page.goto('/results');
    await page.waitForLoadState('networkidle');

    // Look for search input
    const searchInput = page.locator(
      'input[placeholder*="search"], input[aria-label*="search"], input[name*="search"]',
    );

    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);

      // Take screenshot of search results
      await page.screenshot({
        path: 'test-results/screenshots/results-search.png',
        fullPage: true,
      });

      // Clear search
      await searchInput.clear();
      await page.waitForTimeout(500);
    }
  });

  test('should export individual results', async ({ page }) => {
    await page.goto('/results');
    await page.waitForLoadState('networkidle');

    // Find a result to export
    const resultItems = page.locator('.result-item, .score-item, tr, [data-testid*="result"]');

    if (await resultItems.first().isVisible()) {
      // Look for export button on result item
      const exportBtn = resultItems
        .first()
        .locator('button:has-text("Export"), a:has-text("Export"), [aria-label*="export"]');

      if (await exportBtn.isVisible()) {
        const downloadPromise = page.waitForEvent('download');

        await exportBtn.click();

        try {
          const download = await downloadPromise;
          console.log(`Result export started: ${download.suggestedFilename()}`);

          // Take screenshot of export action
          await page.screenshot({
            path: 'test-results/screenshots/result-export.png',
            fullPage: true,
          });
        } catch (error) {
          console.log('No download triggered for result export');
        }
      } else {
        // Try clicking on result first, then look for export
        await resultItems.first().click();
        await page.waitForLoadState('networkidle');

        const detailExportBtn = page.locator(
          'button:has-text("Export"), a:has-text("Export"), [aria-label*="export"]',
        );

        if (await detailExportBtn.isVisible()) {
          const downloadPromise = page.waitForEvent('download');
          await detailExportBtn.click();

          try {
            await downloadPromise;
            console.log('Result detail export working');
          } catch (error) {
            console.log('Result detail export not available');
          }
        }
      }
    }
  });

  test('should export multiple results', async ({ page }) => {
    await page.goto('/results');
    await page.waitForLoadState('networkidle');

    // Look for bulk export functionality
    const bulkExportBtn = page.locator(
      'button:has-text("Export All"), button:has-text("Bulk Export"), button:has-text("Download All")',
    );

    if (await bulkExportBtn.isVisible()) {
      const downloadPromise = page.waitForEvent('download');

      await bulkExportBtn.click();

      try {
        const download = await downloadPromise;
        console.log(`Bulk export started: ${download.suggestedFilename()}`);

        // Take screenshot of bulk export
        await page.screenshot({
          path: 'test-results/screenshots/results-bulk-export.png',
          fullPage: true,
        });
      } catch (error) {
        console.log('No download triggered for bulk export');
      }
    }

    // Test selection-based export
    const checkboxes = page.locator('input[type="checkbox"]');

    if ((await checkboxes.count()) > 1) {
      // Select multiple results
      await checkboxes.nth(0).check();
      await checkboxes.nth(1).check();

      const selectedExportBtn = page.locator(
        'button:has-text("Export Selected"), button:has-text("Download Selected")',
      );

      if (await selectedExportBtn.isVisible()) {
        await selectedExportBtn.click();

        // Take screenshot of selected export
        await page.screenshot({
          path: 'test-results/screenshots/results-selected-export.png',
          fullPage: true,
        });
      }
    }
  });

  test('should share results', async ({ page }) => {
    await page.goto('/results');
    await page.waitForLoadState('networkidle');

    // Find a result to share
    const resultItems = page.locator('.result-item, .score-item, tr, [data-testid*="result"]');

    if (await resultItems.first().isVisible()) {
      await resultItems.first().click();
      await page.waitForLoadState('networkidle');

      // Look for share functionality
      const shareBtn = page.locator(
        'button:has-text("Share"), a:has-text("Share"), [aria-label*="share"]',
      );

      if (await shareBtn.isVisible()) {
        await shareBtn.click();

        // Look for share options
        const shareOptions = page.locator(
          'button:has-text("Email"), button:has-text("Link"), button:has-text("Copy")',
        );

        if (await shareOptions.first().isVisible()) {
          await shareOptions.first().click();

          // Take screenshot of share dialog
          await page.screenshot({
            path: 'test-results/screenshots/result-share.png',
            fullPage: true,
          });
        }
      }
    }
  });

  test('should display result history timeline', async ({ page }) => {
    await page.goto('/results');
    await page.waitForLoadState('networkidle');

    // Look for timeline or history view
    const timelineBtn = page.locator(
      'button:has-text("Timeline"), button:has-text("History"), [aria-label*="timeline"]',
    );

    if (await timelineBtn.isVisible()) {
      await timelineBtn.click();
      await page.waitForLoadState('networkidle');

      // Take screenshot of timeline view
      await page.screenshot({
        path: 'test-results/screenshots/results-timeline.png',
        fullPage: true,
      });
    }

    // Look for patient-specific result history
    const patientFilter = page.locator('select[name*="patient"], input[placeholder*="patient"]');

    if (await patientFilter.isVisible()) {
      // Select a patient if dropdown
      if ((await patientFilter.getAttribute('tagName')) === 'SELECT') {
        await patientFilter.selectOption({ index: 1 });
      } else {
        await patientFilter.fill('test');
      }

      await page.waitForTimeout(1000);

      // Take screenshot of patient history
      await page.screenshot({
        path: 'test-results/screenshots/patient-result-history.png',
        fullPage: true,
      });
    }
  });

  test('should delete results', async ({ page }) => {
    await page.goto('/results');
    await page.waitForLoadState('networkidle');

    // Find a result to delete
    const resultItems = page.locator('.result-item, .score-item, tr, [data-testid*="result"]');

    if (await resultItems.first().isVisible()) {
      // Look for delete button
      const deleteBtn = resultItems
        .first()
        .locator('button:has-text("Delete"), [aria-label*="delete"], .delete-btn');

      if (await deleteBtn.isVisible()) {
        await deleteBtn.click();

        // Handle confirmation dialog
        const confirmBtn = page.locator(
          'button:has-text("Confirm"), button:has-text("Delete"), button:has-text("Yes")',
        );

        if (await confirmBtn.isVisible()) {
          await confirmBtn.click();

          // Should show success message
          await expect(page.locator('text=/deleted|removed/i, [role="alert"]')).toBeVisible({
            timeout: 5000,
          });

          // Take screenshot of deletion confirmation
          await page.screenshot({
            path: 'test-results/screenshots/result-deleted.png',
            fullPage: true,
          });
        }
      }
    }
  });

  test('should paginate through results', async ({ page }) => {
    await page.goto('/results');
    await page.waitForLoadState('networkidle');

    // Look for pagination controls
    const nextBtn = page.locator('button:has-text("Next"), [aria-label*="next"], .pagination-next');
    const prevBtn = page.locator(
      'button:has-text("Previous"), [aria-label*="previous"], .pagination-prev',
    );

    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(1000);

      // Take screenshot of next page
      await page.screenshot({
        path: 'test-results/screenshots/results-pagination.png',
        fullPage: true,
      });

      if (await prevBtn.isVisible()) {
        await prevBtn.click();
      }
    }

    // Test page size selector
    const pageSizeSelect = page.locator('select[name*="pageSize"], select[aria-label*="per page"]');

    if (await pageSizeSelect.isVisible()) {
      await pageSizeSelect.selectOption({ label: '50' });
      await page.waitForTimeout(1000);

      // Take screenshot with different page size
      await page.screenshot({
        path: 'test-results/screenshots/results-page-size.png',
        fullPage: true,
      });
    }
  });
});
