import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { toastContainerHTML } from '../fixtures/enhancer-fixtures';

test.describe('initToasts', () => {
  test('sets ARIA attributes on toast container', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: toastContainerHTML() });
    await page.evaluate(() => window.SoltanaUI.initToasts());

    const container = page.locator('[data-sol-toast-container]');
    await expect(container).toHaveAttribute('role', 'status');
    await expect(container).toHaveAttribute('aria-live', 'polite');
  });

  test('dismisses toast on close button click', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: toastContainerHTML() });
    await page.evaluate(() => window.SoltanaUI.initToasts());

    const toast = page.locator('.toast');
    await expect(toast).toBeVisible();

    await page.locator('.toast .close').click();

    // Toast should lose active class
    await expect(toast).not.toHaveClass(/active/);
  });

  test('destroy removes all listeners', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: toastContainerHTML() });

    await page.evaluate(() => {
      const cleanup = window.SoltanaUI.initToasts();
      cleanup.destroy();
    });

    // Close button should not work after destroy
    await page.locator('.toast .close').click();
    const toast = page.locator('.toast');
    await expect(toast).toHaveClass(/active/);
  });
});

test.describe('showToast', () => {
  test('creates and displays a toast programmatically', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: '' });

    await page.evaluate(() => {
      window.SoltanaUI.showToast({
        message: 'Test message',
        type: 'success',
        duration: 0,
      });
    });

    // Wait for animation frame to add active class
    await page.waitForSelector('.toast.active');

    const toast = page.locator('.toast');
    await expect(toast).toBeVisible();
    await expect(toast).toHaveClass(/toast-success/);

    const body = page.locator('.toast-body');
    await expect(body).toHaveText('Test message');
  });

  test('auto-dismisses after duration', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: '' });

    await page.evaluate(() => {
      window.SoltanaUI.showToast({
        message: 'Auto dismiss',
        type: 'info',
        duration: 200,
      });
    });

    await page.waitForSelector('.toast.active');
    const toast = page.locator('.toast');
    await expect(toast).toBeVisible();

    // Wait for auto-dismiss
    await page.waitForFunction(() => document.querySelectorAll('.toast.active').length === 0, {
      timeout: 5000,
    });
  });

  test('creates container at specified position', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: '' });

    await page.evaluate(() => {
      window.SoltanaUI.showToast({
        message: 'Bottom left',
        position: 'bottom-left',
        duration: 0,
      });
    });

    await page.waitForSelector('.toast-container-bottom-left');
    const container = page.locator('.toast-container-bottom-left');
    await expect(container).toBeVisible();
  });
});
