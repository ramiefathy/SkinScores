import { test, expect } from '@playwright/test';

const TEST_CREDENTIALS = {
  email: 'ramiefathy@gmail.com',
  password: 'testing1',
};

test.describe('Accessibility Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"]', TEST_CREDENTIALS.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_CREDENTIALS.password);
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
    await page.waitForURL(/.*(?<!\/login)$/, { timeout: 10000 });
  });

  test('should test keyboard navigation accessibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test tab navigation through interactive elements
    let tabCount = 0;
    const maxTabs = 20;

    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab');
      tabCount++;

      const focusedElement = page.locator(':focus');

      if (await focusedElement.isVisible()) {
        // Check if focused element has proper focus indicator
        const focusedElementInfo = await focusedElement.evaluate((el) => ({
          tagName: el.tagName,
          type: el.getAttribute('type'),
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label'),
          hasVisibleFocus: getComputedStyle(el).outline !== 'none',
        }));

        console.log(
          `Tab ${tabCount}: ${focusedElementInfo.tagName} with role=${focusedElementInfo.role}`,
        );

        // Interactive elements should have proper focus indicators
        if (['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(focusedElementInfo.tagName)) {
          // Should have visible focus or custom focus styles
          expect(focusedElementInfo.hasVisibleFocus || focusedElementInfo.ariaLabel).toBeTruthy();
        }
      }

      await page.waitForTimeout(100);
    }

    // Take screenshot of keyboard navigation
    await page.screenshot({
      path: 'test-results/screenshots/accessibility-keyboard.png',
      fullPage: true,
    });
  });

  test('should test ARIA labels and roles', async ({ page }) => {
    const pages = ['/', '/calculators', '/patients', '/results', '/analytics'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      // Check for proper heading structure
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();

      if (headingCount > 0) {
        // Should have at least one h1
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBeGreaterThanOrEqual(1);

        console.log(`${pagePath}: Found ${headingCount} headings with ${h1Count} h1 elements`);
      }

      // Check for proper button labels
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();

      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        const hasAriaLabel = await button.getAttribute('aria-label');
        const hasText = await button.textContent();
        const hasTitle = await button.getAttribute('title');

        // Buttons should have accessible names
        if (!hasText?.trim() && !hasAriaLabel && !hasTitle) {
          console.warn(`Button without accessible name found on ${pagePath}`);
        }
      }

      // Check for form labels
      const inputs = page.locator('input');
      const inputCount = await inputs.count();

      for (let i = 0; i < Math.min(inputCount, 10); i++) {
        const input = inputs.nth(i);
        const inputId = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');

        if (inputId) {
          const associatedLabel = page.locator(`label[for="${inputId}"]`);
          const hasLabel = await associatedLabel.isVisible();

          if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
            console.warn(`Input without accessible label found on ${pagePath}`);
          }
        }
      }

      // Take screenshot for ARIA analysis
      await page.screenshot({
        path: `test-results/screenshots/accessibility-aria-${pagePath.replace(/[^a-zA-Z0-9]/g, '-')}.png`,
        fullPage: true,
      });
    }
  });

  test('should test color contrast', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get color information for text elements
    const textElements = page.locator('p, span, div, h1, h2, h3, h4, h5, h6, button, a');
    const elementCount = await textElements.count();

    const contrastIssues = [];

    for (let i = 0; i < Math.min(elementCount, 20); i++) {
      const element = textElements.nth(i);

      if (await element.isVisible()) {
        const colorInfo = await element.evaluate((el) => {
          const styles = getComputedStyle(el);
          return {
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
          };
        });

        // Check if colors are defined (not transparent)
        if (
          colorInfo.color !== 'rgba(0, 0, 0, 0)' &&
          colorInfo.backgroundColor !== 'rgba(0, 0, 0, 0)'
        ) {
          // Log potential contrast issues (manual review needed)
          if (colorInfo.color === colorInfo.backgroundColor) {
            contrastIssues.push({
              element: i,
              issue: 'Same color and background color',
              ...colorInfo,
            });
          }
        }
      }
    }

    if (contrastIssues.length > 0) {
      console.log('Potential contrast issues found:', contrastIssues);
    }

    // Take screenshot for color contrast analysis
    await page.screenshot({
      path: 'test-results/screenshots/accessibility-contrast.png',
      fullPage: true,
    });
  });

  test('should test screen reader compatibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for proper landmark regions
    const landmarks = {
      main: await page.locator('main, [role="main"]').count(),
      navigation: await page.locator('nav, [role="navigation"]').count(),
      banner: await page.locator('header, [role="banner"]').count(),
      contentinfo: await page.locator('footer, [role="contentinfo"]').count(),
    };

    console.log('Landmark regions found:', landmarks);

    // Should have main content area
    expect(landmarks.main).toBeGreaterThanOrEqual(1);

    // Check for skip links
    const skipLinks = page.locator('a[href*="#main"], a[href*="#content"], a:has-text("Skip to")');
    const hasSkipLinks = (await skipLinks.count()) > 0;

    if (hasSkipLinks) {
      console.log('Skip links found - good for accessibility');
    } else {
      console.log('No skip links found - consider adding for better accessibility');
    }

    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');

      if (!alt && role !== 'presentation') {
        console.warn(`Image without alt text found`);
      }
    }

    // Take screenshot for screen reader analysis
    await page.screenshot({
      path: 'test-results/screenshots/accessibility-screenreader.png',
      fullPage: true,
    });
  });

  test('should test focus management in modals/dialogs', async ({ page }) => {
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');

    // Look for buttons that might open modals
    const modalTriggers = page.locator(
      'button:has-text("Help"), button:has-text("Info"), button:has-text("Add"), button:has-text("Edit")',
    );

    if (await modalTriggers.first().isVisible()) {
      await modalTriggers.first().click();
      await page.waitForTimeout(500);

      // Check if modal/dialog opened
      const modal = page.locator('[role="dialog"], .modal, .dialog');

      if (await modal.isVisible()) {
        // Focus should be trapped in modal
        const focusableInModal = modal.locator(
          'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const focusableCount = await focusableInModal.count();

        if (focusableCount > 0) {
          // Test tab navigation within modal
          await page.keyboard.press('Tab');

          // Focused element should be within modal
          const isWithinModal = (await modal.locator(':focus').count()) > 0;
          expect(isWithinModal).toBeTruthy();

          console.log('Modal focus management working correctly');
        }

        // Test escape key to close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Modal should close
        const modalStillVisible = await modal.isVisible();
        if (!modalStillVisible) {
          console.log('Modal closes with Escape key - good accessibility');
        }

        // Take screenshot of modal focus management
        await page.screenshot({
          path: 'test-results/screenshots/accessibility-modal-focus.png',
          fullPage: true,
        });
      }
    }
  });

  test('should test form accessibility', async ({ page }) => {
    // Test calculator forms
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');

    const calculatorLink = page
      .locator('a[href*="/calculators/"], .calculator-card a, .tool-card a')
      .first();

    if (await calculatorLink.isVisible()) {
      await calculatorLink.click();
      await page.waitForLoadState('networkidle');

      // Check form accessibility
      const form = page.locator('form');

      if (await form.isVisible()) {
        // Check for fieldsets and legends
        const fieldsets = form.locator('fieldset');
        const fieldsetCount = await fieldsets.count();

        if (fieldsetCount > 0) {
          for (let i = 0; i < fieldsetCount; i++) {
            const fieldset = fieldsets.nth(i);
            const legend = fieldset.locator('legend');
            const hasLegend = await legend.isVisible();

            if (!hasLegend) {
              console.warn('Fieldset without legend found');
            }
          }
        }

        // Check for error message accessibility
        const inputs = form.locator('input');
        const inputCount = await inputs.count();

        if (inputCount > 0) {
          // Try to trigger validation errors
          const firstInput = inputs.first();
          await firstInput.fill('invalid value');
          await firstInput.blur();

          await page.waitForTimeout(500);

          // Look for error messages
          const errorMessages = page.locator(
            '[role="alert"], .error, .validation-error, [aria-describedby]',
          );

          if (await errorMessages.isVisible()) {
            // Error messages should be associated with inputs
            const ariaDescribedBy = await firstInput.getAttribute('aria-describedby');

            if (ariaDescribedBy) {
              console.log('Form validation errors properly associated with inputs');
            }
          }
        }

        // Take screenshot of form accessibility
        await page.screenshot({
          path: 'test-results/screenshots/accessibility-forms.png',
          fullPage: true,
        });
      }
    }
  });

  test('should test mobile accessibility', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test touch target sizes
    const clickableElements = page.locator('button, a, input[type="button"], input[type="submit"]');
    const clickableCount = await clickableElements.count();

    for (let i = 0; i < Math.min(clickableCount, 10); i++) {
      const element = clickableElements.nth(i);

      if (await element.isVisible()) {
        const boundingBox = await element.boundingBox();

        if (boundingBox) {
          // Touch targets should be at least 44x44 pixels
          const isLargeEnough = boundingBox.width >= 44 && boundingBox.height >= 44;

          if (!isLargeEnough) {
            console.warn(`Small touch target found: ${boundingBox.width}x${boundingBox.height}`);
          }
        }
      }
    }

    // Test mobile navigation accessibility
    const mobileMenuBtn = page.locator('button[aria-label*="menu"], .hamburger, .mobile-menu-btn');

    if (await mobileMenuBtn.isVisible()) {
      // Should have proper ARIA attributes
      const ariaLabel = await mobileMenuBtn.getAttribute('aria-label');
      const ariaExpanded = await mobileMenuBtn.getAttribute('aria-expanded');

      expect(ariaLabel).toBeTruthy();

      // Click to open menu
      await mobileMenuBtn.click();
      await page.waitForTimeout(500);

      // Check if aria-expanded updated
      const newAriaExpanded = await mobileMenuBtn.getAttribute('aria-expanded');

      if (newAriaExpanded !== ariaExpanded) {
        console.log('Mobile menu ARIA states update correctly');
      }
    }

    // Take screenshot of mobile accessibility
    await page.screenshot({
      path: 'test-results/screenshots/accessibility-mobile.png',
      fullPage: true,
    });
  });

  test('should test accessibility of data tables', async ({ page }) => {
    // Go to a page that might have data tables
    await page.goto('/results');
    await page.waitForLoadState('networkidle');

    const tables = page.locator('table');
    const tableCount = await tables.count();

    if (tableCount > 0) {
      for (let i = 0; i < tableCount; i++) {
        const table = tables.nth(i);

        // Check for table headers
        const headers = table.locator('th');
        const headerCount = await headers.count();

        if (headerCount > 0) {
          // Headers should have proper scope
          for (let j = 0; j < headerCount; j++) {
            const header = headers.nth(j);
            const scope = await header.getAttribute('scope');

            if (!scope) {
              console.warn('Table header without scope attribute found');
            }
          }
        }

        // Check for table caption
        const caption = table.locator('caption');
        const hasCaption = await caption.isVisible();

        if (!hasCaption) {
          console.warn('Table without caption found');
        }

        // Check for complex table accessibility
        const dataCells = table.locator('td');
        const dataCellCount = await dataCells.count();

        if (dataCellCount > 20) {
          // Complex table
          // Should have additional accessibility features
          const hasHeaders = await table.getAttribute('headers');
          const hasAriaLabel = await table.getAttribute('aria-label');
          const hasAriaDescribedBy = await table.getAttribute('aria-describedby');

          if (!hasHeaders && !hasAriaLabel && !hasAriaDescribedBy) {
            console.warn('Complex table needs additional accessibility attributes');
          }
        }
      }

      // Take screenshot of table accessibility
      await page.screenshot({
        path: 'test-results/screenshots/accessibility-tables.png',
        fullPage: true,
      });
    }
  });
});
