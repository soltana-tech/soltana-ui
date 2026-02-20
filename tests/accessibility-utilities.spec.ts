import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from './fixtures/soltana-page';

test.describe('accessibility utilities', () => {
  test('.sr-only hides visually but remains accessible', async ({ page }) => {
    await setupSoltanaPage(page, {
      bodyHTML: '<span class="sr-only" id="sr">Hidden text</span>',
    });

    const box = await page.locator('#sr').boundingBox();
    // sr-only uses 1x1px with clip-path — effectively invisible
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(1);
    expect(box!.height).toBeLessThanOrEqual(1);

    // But the element is still in the accessibility tree
    const text = await page.locator('#sr').textContent();
    expect(text).toBe('Hidden text');
  });

  test('.skip-link becomes visible on focus', async ({ page }) => {
    await setupSoltanaPage(page, {
      bodyHTML:
        '<a href="#main" class="skip-link" id="skip">Skip to content</a><main id="main"></main>',
    });

    // Before focus: positioned off-screen (top: -100%)
    const beforeBox = await page.locator('#skip').boundingBox();
    expect(beforeBox).not.toBeNull();
    expect(beforeBox!.y).toBeLessThan(0);

    // Focus the skip link directly
    await page.locator('#skip').focus();

    // After focus: should be visible (top: 0)
    await page.waitForFunction(() => {
      const el = document.getElementById('skip');
      return el && getComputedStyle(el).top === '0px';
    });

    const afterBox = await page.locator('#skip').boundingBox();
    expect(afterBox).not.toBeNull();
    expect(afterBox!.y).toBeGreaterThanOrEqual(0);
  });

  test('focus rings appear on :focus-visible', async ({ page }) => {
    await setupSoltanaPage(page, {
      bodyHTML: '<button id="btn">Click me</button>',
    });

    // Focus the button via keyboard Tab to trigger :focus-visible
    await page.locator('#btn').focus();
    await expect(page.locator('#btn')).toBeFocused();

    const outline = await page.locator('#btn').evaluate((el) => {
      return window.getComputedStyle(el).outlineStyle;
    });

    expect(outline).not.toBe('none');
  });
});
