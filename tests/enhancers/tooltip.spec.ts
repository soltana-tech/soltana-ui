import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { tooltipHTML, multiTooltipHTML } from '../fixtures/enhancer-fixtures';

test.describe('initTooltips', () => {
  test('shows tooltip on hover with correct text', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: tooltipHTML('Help text') });
    await page.evaluate(() => window.SoltanaUI.initTooltips());

    await page.locator('button').hover();

    const tooltip = page.locator('.tooltip[role="tooltip"]');
    await expect(tooltip).toHaveText('Help text');
    await expect(tooltip).toHaveCSS('opacity', '1');
  });

  test('sets aria-describedby on trigger', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: tooltipHTML('Accessible tooltip') });
    await page.evaluate(() => window.SoltanaUI.initTooltips());

    await page.locator('button').hover();

    const describedby = await page.locator('button').getAttribute('aria-describedby');
    expect(describedby).toBeTruthy();

    const tooltip = page.locator('.tooltip[role="tooltip"]');
    await expect(tooltip).toHaveAttribute('id', describedby!);
  });

  test('hides tooltip on mouseleave', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: tooltipHTML('Bye') });
    await page.evaluate(() => window.SoltanaUI.initTooltips());

    const button = page.locator('button');
    await button.hover();

    const tooltip = page.locator('.tooltip[role="tooltip"]');
    await expect(tooltip).toHaveCSS('opacity', '1');

    // Move mouse away from the trigger
    await page.mouse.move(0, 0);

    await expect(tooltip).toHaveCSS('opacity', '0');
  });

  test('shows tooltip on focus', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: tooltipHTML('Focus tip') });
    await page.evaluate(() => window.SoltanaUI.initTooltips());

    await page.locator('button').focus();

    const tooltip = page.locator('.tooltip[role="tooltip"]');
    await expect(tooltip).toHaveText('Focus tip');
    await expect(tooltip).toHaveCSS('opacity', '1');
  });

  test('hides tooltip on blur', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: tooltipHTML('Blur tip') });
    await page.evaluate(() => window.SoltanaUI.initTooltips());

    await page.locator('button').focus();

    const tooltip = page.locator('.tooltip[role="tooltip"]');
    await expect(tooltip).toHaveCSS('opacity', '1');

    await page.locator('button').blur();

    await expect(tooltip).toHaveCSS('opacity', '0');
  });

  test('hides tooltip on Escape key', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: tooltipHTML('Escape tip') });
    await page.evaluate(() => window.SoltanaUI.initTooltips());

    // Focus the trigger so the keydown listener (on the trigger element) fires
    await page.locator('button').focus();

    const tooltip = page.locator('.tooltip[role="tooltip"]');
    await expect(tooltip).toHaveCSS('opacity', '1');

    await page.keyboard.press('Escape');

    await expect(tooltip).toHaveCSS('opacity', '0');
  });

  for (const position of ['top', 'bottom', 'left', 'right', 'default'] as const) {
    test(`positions tooltip correctly for position="${position}"`, async ({ page }) => {
      const posArg = position === 'default' ? undefined : position;
      // Center the trigger with generous margin for position calculation
      const html = posArg
        ? `<button data-sol-tooltip="Positioned" data-tooltip-position="${posArg}"
             style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
             Hover me
           </button>`
        : `<button data-sol-tooltip="Positioned"
             style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
             Hover me
           </button>`;

      await setupSoltanaPage(page, { bodyHTML: html });
      await page.evaluate(() => window.SoltanaUI.initTooltips());

      await page.locator('button').hover();

      // Wait for requestAnimationFrame positioning
      await page.waitForFunction(() => {
        const tip = document.querySelector('.tooltip');
        return tip && getComputedStyle(tip).opacity === '1';
      });

      const triggerBox = await page.locator('button').boundingBox();
      const tooltipBox = await page.locator('.tooltip').boundingBox();

      expect(triggerBox).toBeTruthy();
      expect(tooltipBox).toBeTruthy();

      const effective = position === 'default' ? 'top' : position;

      switch (effective) {
        case 'top':
          // Tooltip bottom edge should be above (or at) trigger top edge
          expect(tooltipBox!.y + tooltipBox!.height).toBeLessThanOrEqual(triggerBox!.y + 2);
          break;
        case 'bottom':
          // Tooltip top edge should be below (or at) trigger bottom edge
          expect(tooltipBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height - 2);
          break;
        case 'left':
          // Tooltip right edge should be left of (or at) trigger left edge
          expect(tooltipBox!.x + tooltipBox!.width).toBeLessThanOrEqual(triggerBox!.x + 2);
          break;
        case 'right':
          // Tooltip left edge should be right of (or at) trigger right edge
          expect(tooltipBox!.x).toBeGreaterThanOrEqual(triggerBox!.x + triggerBox!.width - 2);
          break;
      }
    });
  }

  test('cleans up aria-describedby when switching between tooltip targets', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: multiTooltipHTML() });
    await page.evaluate(() => window.SoltanaUI.initTooltips());

    const first = page.locator('button').nth(0);
    const second = page.locator('button').nth(1);

    // Hover first trigger
    await first.hover();
    const firstDescribedby = await first.getAttribute('aria-describedby');
    expect(firstDescribedby).toBeTruthy();

    // Hover second trigger (without explicit mouseleave on first)
    await second.hover();
    const secondDescribedby = await second.getAttribute('aria-describedby');
    expect(secondDescribedby).toBeTruthy();

    // First trigger's aria-describedby should be cleaned up
    const firstAfter = await first.getAttribute('aria-describedby');
    expect(firstAfter).toBeNull();
  });

  test('destroy removes tooltip element and listeners', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: tooltipHTML('Gone') });

    await page.evaluate(() => {
      const cleanup = window.SoltanaUI.initTooltips();
      // Trigger tooltip creation so element exists
      const btn = document.querySelector('button')!;
      btn.dispatchEvent(new MouseEvent('mouseenter'));
      cleanup.destroy();
    });

    // Tooltip element should be removed from DOM
    const tooltipCount = await page.locator('.tooltip').count();
    expect(tooltipCount).toBe(0);

    // Hovering should not create a new tooltip since listeners are gone
    await page.locator('button').hover();
    const tooltipCountAfter = await page.locator('.tooltip').count();
    expect(tooltipCountAfter).toBe(0);
  });

  test('tooltip with empty text does not show tooltip element', async ({ page }) => {
    await setupSoltanaPage(page, {
      bodyHTML: '<button data-sol-tooltip="" style="margin: 100px;">Empty</button>',
    });
    await page.evaluate(() => window.SoltanaUI.initTooltips());

    await page.locator('button').hover();

    // showTooltip bails early if text is empty — the tooltip element is never created.
    const tooltipCount = await page.locator('.tooltip').count();
    expect(tooltipCount).toBe(0);
  });

  test('double init does not create duplicate tooltips', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: tooltipHTML('Once') });
    await page.evaluate(() => {
      window.SoltanaUI.initTooltips();
      window.SoltanaUI.initTooltips();
    });

    await page.locator('button').hover();

    const tooltipCount = await page.locator('.tooltip').count();
    expect(tooltipCount).toBe(1);
  });
});
