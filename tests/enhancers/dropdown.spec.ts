import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { dropdownHTML } from '../fixtures/enhancer-fixtures';

test.describe('initDropdowns', () => {
  test('opens menu on toggle click', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: dropdownHTML() });
    await page.evaluate(() => window.SoltanaUI.initDropdowns());

    await page.locator('.dropdown-toggle').click();

    const menu = page.locator('.dropdown-menu');
    await expect(menu).toHaveClass(/active/);
  });

  test('closes menu on second toggle click', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: dropdownHTML() });
    await page.evaluate(() => window.SoltanaUI.initDropdowns());

    const toggle = page.locator('.dropdown-toggle');
    await toggle.click();
    await expect(page.locator('.dropdown-menu')).toHaveClass(/active/);

    await toggle.click();
    await expect(page.locator('.dropdown-menu')).not.toHaveClass(/active/);
  });

  test('sets aria-expanded on toggle', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: dropdownHTML() });
    await page.evaluate(() => window.SoltanaUI.initDropdowns());

    const toggle = page.locator('.dropdown-toggle');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('closes on click outside', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: dropdownHTML() + '<p>Outside</p>' });
    await page.evaluate(() => window.SoltanaUI.initDropdowns());

    await page.locator('.dropdown-toggle').click();
    await expect(page.locator('.dropdown-menu')).toHaveClass(/active/);

    // Click outside
    await page.locator('p').click();
    await expect(page.locator('.dropdown-menu')).not.toHaveClass(/active/);
  });

  test('keyboard: Escape closes menu and focuses toggle', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: dropdownHTML() });
    await page.evaluate(() => window.SoltanaUI.initDropdowns());

    await page.locator('.dropdown-toggle').click();
    await expect(page.locator('.dropdown-menu')).toHaveClass(/active/);

    await page.keyboard.press('Escape');

    await expect(page.locator('.dropdown-menu')).not.toHaveClass(/active/);
    await expect(page.locator('.dropdown-toggle')).toBeFocused();
  });

  test('keyboard: ArrowDown navigates menu items', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: dropdownHTML() });
    await page.evaluate(() => window.SoltanaUI.initDropdowns());

    await page.locator('.dropdown-toggle').click();

    // Wait for focus to settle on first item
    await page.waitForFunction(() => document.activeElement?.classList.contains('dropdown-item'));

    await page.keyboard.press('ArrowDown');

    const focusedText = await page.evaluate(() => document.activeElement?.textContent);
    expect(focusedText).toBe('Duplicate');
  });

  test('destroy removes all listeners', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: dropdownHTML() });

    await page.evaluate(() => {
      const cleanup = window.SoltanaUI.initDropdowns();
      cleanup.destroy();
    });

    await page.locator('.dropdown-toggle').click();
    await expect(page.locator('.dropdown-menu')).not.toHaveClass(/active/);
  });
});
