import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { modalHTML, tabsHTML, tooltipHTML } from '../fixtures/enhancer-fixtures';

/** Combined HTML fixture containing a modal, tabs, and tooltip. */
function allEnhancersHTML(): string {
  return `
    ${modalHTML()}
    ${tabsHTML()}
    ${tooltipHTML('Integration tip')}`;
}

test.describe('enhancers integration', () => {
  test('initAll initializes all three enhancers', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: allEnhancersHTML() });
    await page.evaluate(() => window.SoltanaUI.initAll());

    // Modal responds to click
    await page.locator('[data-modal-open="test-modal"]').click();
    await expect(page.locator('#test-modal')).toHaveClass(/active/);

    // Close modal for clean state
    await page.locator('[data-modal-close]').click();
    await expect(page.locator('#test-modal')).not.toHaveClass(/active/);

    // Tabs respond to click
    const tabs = page.locator('[role="tab"]');
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');

    // Tooltip responds to hover
    await page.locator('[data-sol-tooltip]').hover();
    const tooltip = page.locator('.tooltip[role="tooltip"]');
    await expect(tooltip).toHaveText('Integration tip');
    await expect(tooltip).toHaveCSS('opacity', '1');
  });

  test('destroy from initAll disables all three enhancers', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: allEnhancersHTML() });

    await page.evaluate(() => {
      const cleanup = window.SoltanaUI.initAll();
      cleanup.destroy();
    });

    // Modal trigger should have no effect
    await page.locator('[data-modal-open="test-modal"]').click();
    await expect(page.locator('#test-modal')).not.toHaveClass(/active/);

    // Tab click should have no effect
    const tabs = page.locator('[role="tab"]');
    await tabs.nth(1).click({ force: true });
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');

    // Tooltip hover should not create a tooltip
    await page.locator('[data-sol-tooltip]').hover();
    const tooltipCount = await page.locator('.tooltip').count();
    expect(tooltipCount).toBe(0);
  });

  test('individual enhancer init does not affect others', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: allEnhancersHTML() });

    // Only init modals
    await page.evaluate(() => window.SoltanaUI.initModals());

    // Modal should work
    await page.locator('[data-modal-open="test-modal"]').click();
    await expect(page.locator('#test-modal')).toHaveClass(/active/);
    await page.locator('[data-modal-close]').click();

    // Tabs should NOT have enhanced behavior (no ARIA ids generated)
    const ariaControls = await page.locator('[role="tab"]').nth(0).getAttribute('aria-controls');
    expect(ariaControls).toBeNull();

    // Tooltip hover should not create a tooltip
    await page.locator('[data-sol-tooltip]').hover();
    const tooltipCount = await page.locator('.tooltip').count();
    expect(tooltipCount).toBe(0);
  });

  test('re-calling initAll cleans up previous listeners', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: allEnhancersHTML() });

    await page.evaluate(() => {
      window.SoltanaUI.initAll();
      window.SoltanaUI.initAll();
    });

    // Modal should work without duplicate handler artifacts
    await page.locator('[data-modal-open="test-modal"]').click();
    await expect(page.locator('#test-modal')).toHaveClass(/active/);
    await page.locator('[data-modal-close]').click();
    await expect(page.locator('#test-modal')).not.toHaveClass(/active/);

    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe('');

    // Tabs should work without duplicate handler artifacts
    const tabs = page.locator('[role="tab"]');
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');

    // Only one tooltip element should exist
    await page.locator('[data-sol-tooltip]').hover();
    const tooltipCount = await page.locator('.tooltip').count();
    expect(tooltipCount).toBe(1);
  });
});
