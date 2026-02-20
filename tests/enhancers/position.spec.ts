import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';

/**
 * Position computation is internal (not exported via UMD), so these tests
 * verify it indirectly through tooltip placement behavior in a real browser.
 */
test.describe('tooltip position computation in browser', () => {
  function centeredTriggerHTML(position: string): string {
    return `<button data-sol-tooltip="Positioned" data-tooltip-position="${position}"
              style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100px; height: 40px;">
              Anchor
            </button>`;
  }

  for (const placement of ['top', 'bottom', 'left', 'right'] as const) {
    test(`positions tooltip at ${placement}`, async ({ page }) => {
      await setupSoltanaPage(page, { bodyHTML: centeredTriggerHTML(placement) });
      await page.evaluate(() => window.SoltanaUI.initTooltips());

      await page.locator('button').hover();

      await page.waitForFunction(() => {
        const tip = document.querySelector('.tooltip');
        return tip && getComputedStyle(tip).opacity === '1';
      });

      const triggerBox = await page.locator('button').boundingBox();
      const tooltipBox = await page.locator('.tooltip').boundingBox();
      expect(triggerBox).toBeTruthy();
      expect(tooltipBox).toBeTruthy();

      // Verify the tooltip is positioned correctly relative to the anchor
      switch (placement) {
        case 'top':
          expect(tooltipBox!.y + tooltipBox!.height).toBeLessThanOrEqual(triggerBox!.y + 2);
          break;
        case 'bottom':
          expect(tooltipBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height - 2);
          break;
        case 'left':
          expect(tooltipBox!.x + tooltipBox!.width).toBeLessThanOrEqual(triggerBox!.x + 2);
          break;
        case 'right':
          expect(tooltipBox!.x).toBeGreaterThanOrEqual(triggerBox!.x + triggerBox!.width - 2);
          break;
      }
    });
  }

  test('flips when clipped at viewport edge', async ({ page }) => {
    // Anchor near the top edge -- requesting 'top' placement should flip to 'bottom'
    const edgeHTML = `<button data-sol-tooltip="Flipped" data-tooltip-position="top"
                        style="position: fixed; top: 5px; left: 50%; transform: translateX(-50%); width: 100px; height: 40px;">
                        Top Edge
                      </button>`;

    await setupSoltanaPage(page, { bodyHTML: edgeHTML });
    await page.evaluate(() => window.SoltanaUI.initTooltips());

    await page.locator('button').hover();

    await page.waitForFunction(() => {
      const tip = document.querySelector('.tooltip');
      return tip && getComputedStyle(tip).opacity === '1';
    });

    const triggerBox = await page.locator('button').boundingBox();
    const tooltipBox = await page.locator('.tooltip').boundingBox();
    expect(triggerBox).toBeTruthy();
    expect(tooltipBox).toBeTruthy();

    // Should have flipped to bottom since top would clip the viewport
    expect(tooltipBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height - 2);
  });

  test('tooltip stays within viewport bounds', async ({ page }) => {
    // Anchor in the top-left corner with default 'top' position
    const cornerHTML = `<button data-sol-tooltip="Corner tooltip with some text"
                          style="position: fixed; top: 0; left: 0; width: 20px; height: 20px;">
                          Corner
                        </button>`;

    await setupSoltanaPage(page, { bodyHTML: cornerHTML });
    await page.evaluate(() => window.SoltanaUI.initTooltips());

    await page.locator('button').hover();

    await page.waitForFunction(() => {
      const tip = document.querySelector('.tooltip');
      return tip && getComputedStyle(tip).opacity === '1';
    });

    const viewportSize = page.viewportSize()!;
    const tooltipBox = await page.locator('.tooltip').boundingBox();
    expect(tooltipBox).toBeTruthy();

    expect(tooltipBox!.y).toBeGreaterThanOrEqual(0);
    expect(tooltipBox!.x).toBeGreaterThanOrEqual(0);
    expect(tooltipBox!.y + tooltipBox!.height).toBeLessThanOrEqual(viewportSize.height);
    expect(tooltipBox!.x + tooltipBox!.width).toBeLessThanOrEqual(viewportSize.width);
  });
});
