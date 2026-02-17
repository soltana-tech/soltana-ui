import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { tabsHTML } from '../fixtures/enhancer-fixtures';

test.describe('initTabs', () => {
  test('initializes ARIA ids and relationships', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: tabsHTML() });
    await page.evaluate(() => window.SoltanaUI.initTabs());

    const tab0 = page.locator('[role="tab"]').nth(0);
    const panel0 = page.locator('[role="tabpanel"]').nth(0);

    const tabId = await tab0.getAttribute('id');
    const panelId = await panel0.getAttribute('id');

    expect(tabId).toBeTruthy();
    expect(panelId).toBeTruthy();
    await expect(tab0).toHaveAttribute('aria-controls', panelId!);
    await expect(panel0).toHaveAttribute('aria-labelledby', tabId!);
  });

  test('clicking tab 2 activates its panel and deactivates tab 1', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: tabsHTML() });
    await page.evaluate(() => window.SoltanaUI.initTabs());

    const tab0 = page.locator('[role="tab"]').nth(0);
    const tab1 = page.locator('[role="tab"]').nth(1);
    const panel0 = page.locator('[role="tabpanel"]').nth(0);
    const panel1 = page.locator('[role="tabpanel"]').nth(1);

    await tab1.click();

    await expect(tab1).toHaveAttribute('aria-selected', 'true');
    await expect(tab0).toHaveAttribute('aria-selected', 'false');
    await expect(panel1).not.toHaveAttribute('hidden', '');
    await expect(panel0).toHaveAttribute('hidden', '');
  });

  for (const key of ['ArrowRight', 'ArrowDown']) {
    test(`forward keyboard navigation wraps around (${key})`, async ({ page }) => {
      await setupSoltanaPage(page, { bodyHTML: tabsHTML() });
      await page.evaluate(() => window.SoltanaUI.initTabs());

      const tabs = page.locator('[role="tab"]');

      // Focus the first tab so keyboard events target the tablist
      await tabs.nth(0).focus();

      // Navigate forward through all three tabs and wrap
      await page.keyboard.press(key);
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');

      await page.keyboard.press(key);
      await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');

      // Wrap around to first
      await page.keyboard.press(key);
      await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    });
  }

  for (const key of ['ArrowLeft', 'ArrowUp']) {
    test(`backward keyboard navigation wraps around (${key})`, async ({ page }) => {
      await setupSoltanaPage(page, { bodyHTML: tabsHTML() });
      await page.evaluate(() => window.SoltanaUI.initTabs());

      const tabs = page.locator('[role="tab"]');

      await tabs.nth(0).focus();

      // From first tab, backward should wrap to last
      await page.keyboard.press(key);
      await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');

      await page.keyboard.press(key);
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');

      await page.keyboard.press(key);
      await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    });
  }

  test('Home key activates first tab', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: tabsHTML() });
    await page.evaluate(() => window.SoltanaUI.initTabs());

    const tabs = page.locator('[role="tab"]');

    // Move to last tab first
    await tabs.nth(2).click();
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('Home');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  });

  test('End key activates last tab', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: tabsHTML() });
    await page.evaluate(() => window.SoltanaUI.initTabs());

    const tabs = page.locator('[role="tab"]');

    await tabs.nth(0).focus();
    await page.keyboard.press('End');
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
  });

  test('double init does not duplicate listeners', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: tabsHTML() });
    await page.evaluate(() => {
      window.SoltanaUI.initTabs();
      window.SoltanaUI.initTabs();
    });

    const tabs = page.locator('[role="tab"]');
    const panels = page.locator('[role="tabpanel"]');

    await tabs.nth(1).click();

    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');
    await expect(panels.nth(1)).not.toHaveAttribute('hidden', '');
    await expect(panels.nth(0)).toHaveAttribute('hidden', '');
  });

  test('destroy removes all listeners', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: tabsHTML() });
    await page.evaluate(() => {
      const cleanup = window.SoltanaUI.initTabs();
      cleanup.destroy();
    });

    const tabs = page.locator('[role="tab"]');

    await tabs.nth(1).click({ force: true });

    // Tab 0 should remain selected since listeners are gone
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  });

  test('single tab group works without errors', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: tabsHTML(1) });
    await page.evaluate(() => window.SoltanaUI.initTabs());

    const tab = page.locator('[role="tab"]').nth(0);
    const panel = page.locator('[role="tabpanel"]').nth(0);

    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(panel).not.toHaveAttribute('hidden', '');

    // Keyboard nav on a single tab should not throw
    await tab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(tab).toHaveAttribute('aria-selected', 'true');
  });
});
