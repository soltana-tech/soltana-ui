import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { drawerHTML } from '../fixtures/enhancer-fixtures';

test.describe('initDrawers', () => {
  test('opens drawer on trigger click', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: drawerHTML() });
    await page.evaluate(() => window.SoltanaUI.initDrawers());

    await page.locator('[data-drawer-open="test-drawer"]').click();

    const wrapper = page.locator('#test-drawer');
    await expect(wrapper).toHaveClass(/active/);
    await expect(wrapper).toHaveAttribute('aria-hidden', 'false');
  });

  test('closes drawer on close button click', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: drawerHTML() });
    await page.evaluate(() => window.SoltanaUI.initDrawers());

    await page.locator('[data-drawer-open="test-drawer"]').click();
    await expect(page.locator('#test-drawer')).toHaveClass(/active/);

    await page.locator('[data-drawer-close]').click();

    const wrapper = page.locator('#test-drawer');
    await expect(wrapper).not.toHaveClass(/active/);
    await expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  test('closes drawer on Escape key', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: drawerHTML() });
    await page.evaluate(() => window.SoltanaUI.initDrawers());

    await page.locator('[data-drawer-open="test-drawer"]').click();
    await expect(page.locator('#test-drawer')).toHaveClass(/active/);

    // Wait for focus to be inside the drawer
    await page.waitForFunction(() => {
      const el = document.activeElement;
      return el && el.closest('#test-drawer') !== null;
    });

    await page.keyboard.press('Escape');
    await expect(page.locator('#test-drawer')).not.toHaveClass(/active/);
  });

  test('closes drawer on backdrop click', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: drawerHTML() });
    await page.evaluate(() => window.SoltanaUI.initDrawers());

    await page.locator('[data-drawer-open="test-drawer"]').click();
    await expect(page.locator('#test-drawer')).toHaveClass(/active/);

    await page.locator('#test-drawer .drawer-backdrop').dispatchEvent('click');
    await expect(page.locator('#test-drawer')).not.toHaveClass(/active/);
  });

  test('adds scroll lock class while open', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: drawerHTML() });
    await page.evaluate(() => window.SoltanaUI.initDrawers());

    await page.locator('[data-drawer-open="test-drawer"]').click();
    const hasLock = await page.evaluate(() => document.body.classList.contains('sol-drawer-open'));
    expect(hasLock).toBe(true);

    await page.locator('[data-drawer-close]').click();
    const lockRemoved = await page.evaluate(() =>
      document.body.classList.contains('sol-drawer-open')
    );
    expect(lockRemoved).toBe(false);
  });

  test('traps focus within drawer', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: drawerHTML() });
    await page.evaluate(() => window.SoltanaUI.initDrawers());

    await page.locator('[data-drawer-open="test-drawer"]').click();

    await page.waitForFunction(() => {
      const el = document.activeElement;
      return el && el.closest('#test-drawer') !== null;
    });

    // Focus the last button, Tab should wrap to first
    const lastBtn = page.locator('#test-drawer .drawer-body button');
    await lastBtn.focus();
    await page.keyboard.press('Tab');

    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).toBeDefined();
    // Focus should still be inside the drawer
    const insideDrawer = await page.evaluate(
      () => document.activeElement?.closest('#test-drawer') !== null
    );
    expect(insideDrawer).toBe(true);
  });

  test('destroy removes all listeners', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: drawerHTML() });

    await page.evaluate(() => {
      const cleanup = window.SoltanaUI.initDrawers();
      cleanup.destroy();
    });

    await page.locator('[data-drawer-open="test-drawer"]').click();
    await expect(page.locator('#test-drawer')).not.toHaveClass(/active/);
  });

  test('destroy prevents future interactions', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: drawerHTML() });

    // Verify drawer works before destroy
    await page.evaluate(() => window.SoltanaUI.initDrawers());
    await page.locator('[data-drawer-open="test-drawer"]').click();
    await expect(page.locator('#test-drawer')).toHaveClass(/active/);
    await page.locator('[data-drawer-close]').click();
    await expect(page.locator('#test-drawer')).not.toHaveClass(/active/);

    // Destroy and verify no further interactions work
    await page.evaluate(() => {
      const cleanup = window.SoltanaUI.initDrawers();
      cleanup.destroy();
    });

    await page.locator('[data-drawer-open="test-drawer"]').click();
    await expect(page.locator('#test-drawer')).not.toHaveClass(/active/);
    await expect(page.locator('#test-drawer')).toHaveAttribute('aria-hidden', 'true');

    // Body scroll lock should not be set
    const hasScrollLock = await page.evaluate(() =>
      document.body.classList.contains('sol-drawer-open')
    );
    expect(hasScrollLock).toBe(false);
  });
});
