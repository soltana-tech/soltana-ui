import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { accordionHTML } from '../fixtures/enhancer-fixtures';

test.describe('initAccordions', () => {
  test('toggles accordion item on header click', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: accordionHTML() });
    await page.evaluate(() => window.SoltanaUI.initAccordions());

    // First item starts active
    const item1 = page.locator('.accordion-item').first();
    await expect(item1).toHaveClass(/active/);

    // Click second header to expand
    const header2 = page.locator('.accordion-header').nth(1);
    await header2.click();

    const item2 = page.locator('.accordion-item').nth(1);
    await expect(item2).toHaveClass(/active/);
  });

  test('sets aria-expanded on header', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: accordionHTML() });
    await page.evaluate(() => window.SoltanaUI.initAccordions());

    const header1 = page.locator('.accordion-header').first();
    await expect(header1).toHaveAttribute('aria-expanded', 'true');

    // Click to collapse
    await header1.click();
    await expect(header1).toHaveAttribute('aria-expanded', 'false');
  });

  test('exclusive mode collapses other items', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: accordionHTML(3, true) });
    await page.evaluate(() => window.SoltanaUI.initAccordions());

    // Open second item
    await page.locator('.accordion-header').nth(1).click();

    // First should be collapsed
    const item1 = page.locator('.accordion-item').first();
    await expect(item1).not.toHaveClass(/active/);

    // Second should be expanded
    const item2 = page.locator('.accordion-item').nth(1);
    await expect(item2).toHaveClass(/active/);
  });

  test('keyboard: Enter toggles item', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: accordionHTML() });
    await page.evaluate(() => window.SoltanaUI.initAccordions());

    const header2 = page.locator('.accordion-header').nth(1);
    await header2.focus();
    await page.keyboard.press('Enter');

    const item2 = page.locator('.accordion-item').nth(1);
    await expect(item2).toHaveClass(/active/);
  });

  test('keyboard: ArrowDown/ArrowUp navigates between headers', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: accordionHTML() });
    await page.evaluate(() => window.SoltanaUI.initAccordions());

    const header1 = page.locator('.accordion-header').first();
    await header1.focus();
    await expect(header1).toBeFocused();

    await page.keyboard.press('ArrowDown');

    const header2 = page.locator('.accordion-header').nth(1);
    await expect(header2).toBeFocused();
  });

  test('ARIA: aria-controls and aria-labelledby are linked', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: accordionHTML() });
    await page.evaluate(() => window.SoltanaUI.initAccordions());

    const header1 = page.locator('.accordion-header').first();
    const body1 = page.locator('.accordion-body').first();

    const headerId = await header1.getAttribute('id');
    const panelId = await body1.getAttribute('id');

    await expect(header1).toHaveAttribute('aria-controls', panelId!);
    await expect(body1).toHaveAttribute('aria-labelledby', headerId!);
  });

  test('destroy removes all listeners', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: accordionHTML() });

    await page.evaluate(() => {
      const cleanup = window.SoltanaUI.initAccordions();
      cleanup.destroy();
    });

    // Click header should not toggle (no listeners)
    await page.locator('.accordion-header').nth(1).click();
    const item2 = page.locator('.accordion-item').nth(1);
    await expect(item2).not.toHaveClass(/active/);
  });
});
