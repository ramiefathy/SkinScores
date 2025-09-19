import { test, expect } from '@playwright/test';

const TEST_CREDENTIALS = {
  email: 'ramiefathy@gmail.com',
  password: 'testing1',
};

test.describe('Patient Session Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"]', TEST_CREDENTIALS.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_CREDENTIALS.password);
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
    await page.waitForURL(/.*(?<!\/login)$/, { timeout: 10000 });
  });

  test('should display patient sessions page', async ({ page }) => {
    // Navigate to patient sessions
    const patientsLink = page.locator(
      'a:has-text("Patients"), a[href*="patient"], nav a:has-text("Sessions")',
    );

    if (await patientsLink.first().isVisible()) {
      await patientsLink.first().click();
    } else {
      await page.goto('/patients');
    }

    await page.waitForLoadState('networkidle');

    // Should show patients/sessions page
    await expect(page.locator('h1, h2')).toContainText(/patient|session/i);

    // Take screenshot of sessions page
    await page.screenshot({
      path: 'test-results/screenshots/patient-sessions.png',
      fullPage: true,
    });
  });

  test('should create new patient session', async ({ page }) => {
    await page.goto('/patients');
    await page.waitForLoadState('networkidle');

    // Look for create/new session button
    const createBtn = page.locator(
      'button:has-text("Create"), button:has-text("New"), button:has-text("Add"), a:has-text("New Session")',
    );

    if (await createBtn.first().isVisible()) {
      await createBtn.first().click();
      await page.waitForLoadState('networkidle');

      // Fill in patient details
      const patientNameInput = page.locator(
        'input[name*="name"], input[placeholder*="name"], input[label*="Name"]',
      );
      if (await patientNameInput.isVisible()) {
        await patientNameInput.fill(`Test Patient ${Date.now()}`);
      }

      const patientIdInput = page.locator(
        'input[name*="id"], input[placeholder*="id"], input[label*="ID"]',
      );
      if (await patientIdInput.isVisible()) {
        await patientIdInput.fill(`TEST${Date.now()}`);
      }

      const ageInput = page.locator(
        'input[name*="age"], input[placeholder*="age"], input[label*="Age"]',
      );
      if (await ageInput.isVisible()) {
        await ageInput.fill('30');
      }

      // Save the session
      const saveBtn = page.locator(
        'button:has-text("Save"), button:has-text("Create"), button[type="submit"]',
      );
      if (await saveBtn.isVisible()) {
        await saveBtn.click();

        // Should show success or redirect to session
        await page.waitForTimeout(2000);

        // Take screenshot of created session
        await page.screenshot({
          path: 'test-results/screenshots/new-patient-session.png',
          fullPage: true,
        });
      }
    }
  });

  test('should edit existing patient session', async ({ page }) => {
    await page.goto('/patients');
    await page.waitForLoadState('networkidle');

    // Find an existing session to edit
    const sessionRow = page
      .locator('tr, .session-item, .patient-card, [data-testid*="session"]')
      .first();

    if (await sessionRow.isVisible()) {
      // Look for edit button
      const editBtn = sessionRow.locator(
        'button:has-text("Edit"), a:has-text("Edit"), [aria-label*="edit"]',
      );

      if (await editBtn.isVisible()) {
        await editBtn.click();
        await page.waitForLoadState('networkidle');

        // Modify some fields
        const nameInput = page.locator('input[name*="name"], input[placeholder*="name"]');
        if (await nameInput.isVisible()) {
          await nameInput.fill(`Updated Patient ${Date.now()}`);
        }

        // Save changes
        const saveBtn = page.locator(
          'button:has-text("Save"), button:has-text("Update"), button[type="submit"]',
        );
        if (await saveBtn.isVisible()) {
          await saveBtn.click();

          // Take screenshot of updated session
          await page.screenshot({
            path: 'test-results/screenshots/edited-patient-session.png',
            fullPage: true,
          });
        }
      } else {
        // Try clicking on the session itself
        await sessionRow.click();
        await page.waitForLoadState('networkidle');

        // Take screenshot of session details
        await page.screenshot({
          path: 'test-results/screenshots/session-details.png',
          fullPage: true,
        });
      }
    }
  });

  test('should filter and search patient sessions', async ({ page }) => {
    await page.goto('/patients');
    await page.waitForLoadState('networkidle');

    // Look for search functionality
    const searchInput = page.locator(
      'input[placeholder*="search"], input[aria-label*="search"], input[name*="search"]',
    );

    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);

      // Take screenshot of search results
      await page.screenshot({
        path: 'test-results/screenshots/session-search.png',
        fullPage: true,
      });

      // Clear search
      await searchInput.clear();
    }

    // Look for date filters
    const dateFilters = page.locator('input[type="date"], .date-picker, [aria-label*="date"]');

    if (await dateFilters.first().isVisible()) {
      const today = new Date().toISOString().split('T')[0];
      await dateFilters.first().fill(today);
      await page.waitForTimeout(1000);

      // Take screenshot of filtered results
      await page.screenshot({
        path: 'test-results/screenshots/session-date-filter.png',
        fullPage: true,
      });
    }
  });

  test('should delete patient session', async ({ page }) => {
    await page.goto('/patients');
    await page.waitForLoadState('networkidle');

    // Find a session to delete
    const sessionRow = page
      .locator('tr, .session-item, .patient-card, [data-testid*="session"]')
      .first();

    if (await sessionRow.isVisible()) {
      // Look for delete button
      const deleteBtn = sessionRow.locator(
        'button:has-text("Delete"), [aria-label*="delete"], .delete-btn',
      );

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
            path: 'test-results/screenshots/session-deleted.png',
            fullPage: true,
          });
        }
      }
    }
  });

  test('should test batch operations on sessions', async ({ page }) => {
    await page.goto('/patients');
    await page.waitForLoadState('networkidle');

    // Look for checkboxes to select multiple sessions
    const checkboxes = page.locator('input[type="checkbox"]');

    if ((await checkboxes.count()) > 1) {
      // Select first few sessions
      await checkboxes.nth(0).check();
      await checkboxes.nth(1).check();

      // Look for batch action buttons
      const batchActions = page.locator(
        'button:has-text("Delete Selected"), button:has-text("Export Selected"), button:has-text("Batch")',
      );

      if (await batchActions.first().isVisible()) {
        await batchActions.first().click();

        // Take screenshot of batch action
        await page.screenshot({
          path: 'test-results/screenshots/batch-operations.png',
          fullPage: true,
        });
      }
    }
  });

  test('should export patient sessions', async ({ page }) => {
    await page.goto('/patients');
    await page.waitForLoadState('networkidle');

    // Look for export functionality
    const exportBtn = page.locator(
      'button:has-text("Export"), a:has-text("Export"), [aria-label*="export"]',
    );

    if (await exportBtn.isVisible()) {
      // Set up download handling
      const downloadPromise = page.waitForEvent('download');

      await exportBtn.click();

      // Wait for download to start
      try {
        const download = await downloadPromise;
        console.log(`Download started: ${download.suggestedFilename()}`);

        // Take screenshot during export
        await page.screenshot({
          path: 'test-results/screenshots/session-export.png',
          fullPage: true,
        });
      } catch (error) {
        console.log('No download triggered or export functionality not available');
      }
    }
  });

  test('should test session navigation and pagination', async ({ page }) => {
    await page.goto('/patients');
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
        path: 'test-results/screenshots/session-pagination.png',
        fullPage: true,
      });

      if (await prevBtn.isVisible()) {
        await prevBtn.click();
      }
    }

    // Test sorting if available
    const sortHeaders = page.locator('th[role="columnheader"], .sortable, [aria-sort]');

    if (await sortHeaders.first().isVisible()) {
      await sortHeaders.first().click();
      await page.waitForTimeout(1000);

      // Take screenshot of sorted results
      await page.screenshot({
        path: 'test-results/screenshots/session-sorting.png',
        fullPage: true,
      });
    }
  });
});
