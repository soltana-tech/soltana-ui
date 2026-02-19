import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { modalHTML, multiModalHTML, modalNoFocusableHTML } from '../fixtures/enhancer-fixtures';

test.describe('initModals', () => {
  test('opens modal on trigger click', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: modalHTML() });
    await page.evaluate(() => window.SoltanaUI.initModals());

    await page.locator('[data-modal-open="test-modal"]').click();

    const modal = page.locator('#test-modal');
    await expect(modal).toHaveClass(/active/);
    await expect(modal).toHaveAttribute('aria-hidden', 'false');
  });

  test('closes modal on close button click', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: modalHTML() });
    await page.evaluate(() => window.SoltanaUI.initModals());

    await page.locator('[data-modal-open="test-modal"]').click();
    await expect(page.locator('#test-modal')).toHaveClass(/active/);

    await page.locator('[data-modal-close]').click();

    const modal = page.locator('#test-modal');
    await expect(modal).not.toHaveClass(/active/);
    await expect(modal).toHaveAttribute('aria-hidden', 'true');
  });

  test('closes modal on Escape key', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: modalHTML() });
    await page.evaluate(() => window.SoltanaUI.initModals());

    await page.locator('[data-modal-open="test-modal"]').click();
    await expect(page.locator('#test-modal')).toHaveClass(/active/);

    // Keydown listener is on the modal element — focus must be inside it
    await page.waitForFunction(() => {
      const el = document.activeElement;
      return el && el.closest('#test-modal') !== null;
    });
    await page.keyboard.press('Escape');

    await expect(page.locator('#test-modal')).not.toHaveClass(/active/);
  });

  test('closes modal on backdrop click', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: modalHTML() });
    await page.evaluate(() => window.SoltanaUI.initModals());

    await page.locator('[data-modal-open="test-modal"]').click();
    await expect(page.locator('#test-modal')).toHaveClass(/active/);

    // The backdrop click handler checks e.target === backdrop.
    // Dispatch click directly on the backdrop to avoid hit-testing through the modal overlay.
    await page.locator('#test-modal .modal-backdrop').dispatchEvent('click');

    await expect(page.locator('#test-modal')).not.toHaveClass(/active/);
  });

  test('does not close when clicking inside modal content', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: modalHTML() });
    await page.evaluate(() => window.SoltanaUI.initModals());

    await page.locator('[data-modal-open="test-modal"]').click();
    await expect(page.locator('#test-modal')).toHaveClass(/active/);

    await page.locator('#test-modal .modal').click();
    await expect(page.locator('#test-modal')).toHaveClass(/active/);

    await page.locator('#test-modal input').click();
    await expect(page.locator('#test-modal')).toHaveClass(/active/);
  });

  test('traps focus: Tab wraps from last to first focusable element', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: modalHTML() });
    await page.evaluate(() => window.SoltanaUI.initModals());

    await page.locator('[data-modal-open="test-modal"]').click();

    // Wait for requestAnimationFrame focus to settle
    await page.waitForFunction(() => {
      const el = document.activeElement;
      return el && el.closest('#test-modal') !== null;
    });

    // Focus the last focusable element (the "Another button")
    const lastButton = page.locator('#test-modal .modal button').last();
    await lastButton.focus();
    await expect(lastButton).toBeFocused();

    // Tab from last element should wrap to first
    await page.keyboard.press('Tab');

    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    const focusedText = await page.evaluate(() => document.activeElement?.textContent);
    expect(focusedTag).toBe('BUTTON');
    expect(focusedText).toBe('Close');
  });

  test('traps focus: Shift+Tab wraps from first to last focusable', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: modalHTML() });
    await page.evaluate(() => window.SoltanaUI.initModals());

    await page.locator('[data-modal-open="test-modal"]').click();

    await page.waitForFunction(() => {
      const el = document.activeElement;
      return el && el.closest('#test-modal') !== null;
    });

    // Focus the first focusable element (the Close button)
    const closeButton = page.locator('#test-modal [data-modal-close]');
    await closeButton.focus();
    await expect(closeButton).toBeFocused();

    // Shift+Tab from first element should wrap to last
    await page.keyboard.press('Shift+Tab');

    const focusedText = await page.evaluate(() => document.activeElement?.textContent);
    expect(focusedText).toBe('Another button');
  });

  test('focuses first focusable element on open', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: modalHTML() });
    await page.evaluate(() => window.SoltanaUI.initModals());

    await page.locator('[data-modal-open="test-modal"]').click();

    // requestAnimationFrame defers focus; wait for it
    await page.waitForFunction(() => {
      const el = document.activeElement;
      return el?.hasAttribute('data-modal-close') === true;
    });

    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).toBe('BUTTON');
    const focusedText = await page.evaluate(() => document.activeElement?.textContent);
    expect(focusedText).toBe('Close');
  });

  test('handles multiple modals with body overflow management', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: multiModalHTML() });
    await page.evaluate(() => window.SoltanaUI.initModals());

    // Open both modals
    await page.locator('[data-modal-open="modal-a"]').click();
    await page.locator('[data-modal-open="modal-b"]').click();

    const hasScrollLock = () =>
      page.evaluate(() => document.body.classList.contains('sol-modal-open'));

    expect(await hasScrollLock()).toBe(true);

    // Close first modal -- scroll lock stays (one still open)
    await page.locator('#modal-a [data-modal-close]').click();
    expect(await hasScrollLock()).toBe(true);

    // Close second modal -- scroll lock removed
    await page.locator('#modal-b [data-modal-close]').click();
    expect(await hasScrollLock()).toBe(false);
  });

  test('invalid modal ID does not throw', async ({ page }) => {
    await setupSoltanaPage(page, {
      bodyHTML: '<button data-modal-open="does-not-exist">Open</button>',
    });

    // Should not throw
    await page.evaluate(() => window.SoltanaUI.initModals());
    await page.locator('[data-modal-open="does-not-exist"]').click();

    const hasScrollLock = await page.evaluate(() =>
      document.body.classList.contains('sol-modal-open')
    );
    expect(hasScrollLock).toBe(false);
  });

  test('modal with no focusable children does not throw', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: modalNoFocusableHTML() });
    await page.evaluate(() => window.SoltanaUI.initModals());

    await page.locator('[data-modal-open="no-focus-modal"]').click();

    await expect(page.locator('#no-focus-modal')).toHaveClass(/active/);
    await expect(page.locator('#no-focus-modal')).toHaveAttribute('aria-hidden', 'false');
  });

  test('rapid open/close does not corrupt state', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: modalHTML() });
    await page.evaluate(() => window.SoltanaUI.initModals());

    const trigger = page.locator('[data-modal-open="test-modal"]');
    const closeBtn = page.locator('[data-modal-close]');

    // Rapidly open and close several times
    for (let i = 0; i < 5; i++) {
      await trigger.click();
      await closeBtn.click();
    }

    // Modal should be closed and scroll lock removed
    await expect(page.locator('#test-modal')).not.toHaveClass(/active/);
    const hasScrollLock = await page.evaluate(() =>
      document.body.classList.contains('sol-modal-open')
    );
    expect(hasScrollLock).toBe(false);
  });

  test('destroy removes all listeners', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: modalHTML() });

    await page.evaluate(() => {
      const cleanup = window.SoltanaUI.initModals();
      cleanup.destroy();
    });

    await page.locator('[data-modal-open="test-modal"]').click();

    // Modal should remain closed after destroy
    await expect(page.locator('#test-modal')).not.toHaveClass(/active/);
    await expect(page.locator('#test-modal')).toHaveAttribute('aria-hidden', 'true');
  });
});
