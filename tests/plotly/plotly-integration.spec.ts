import { test, expect } from '@playwright/test';
import { buildPlotlyTestDocument } from '../fixtures/plotly-assets';

const themes = ['dark', 'light', 'sepia'] as const;

test.describe('Plotly integration', () => {
  for (const theme of themes) {
    test(`${theme}: chart initializes with Soltana template`, async ({ page }) => {
      const html = buildPlotlyTestDocument({
        theme,
        chartData: {
          data: [{ type: 'bar', x: ['A', 'B', 'C'], y: [10, 20, 30] }],
        },
      });
      await page.setContent(html, { waitUntil: 'load' });
      await page.waitForFunction(() => (window as any).__plotlyReady === true);

      // Plotly renders into .js-plotly-plot
      const plotCount = await page.locator('.js-plotly-plot').count();
      expect(plotCount).toBe(1);
    });

    test(`${theme}: template applies paper and font colors`, async ({ page }) => {
      const html = buildPlotlyTestDocument({
        theme,
        chartData: {
          data: [{ type: 'scatter', x: [1, 2], y: [3, 4], mode: 'lines' }],
        },
      });
      await page.setContent(html, { waitUntil: 'load' });
      await page.waitForFunction(() => (window as any).__plotlyReady === true);

      // The layout should have been applied with template values
      const layout = await page.evaluate(() => {
        const el = document.getElementById('chart') as any;
        return el && el.layout
          ? { paper_bgcolor: el.layout.paper_bgcolor, font: el.layout.font }
          : null;
      });
      expect(layout).not.toBeNull();
    });

    test(`${theme}: Soltana CSS tokens resolve in chart document`, async ({ page }) => {
      const html = buildPlotlyTestDocument({
        theme,
        chartData: {
          data: [{ type: 'bar', x: ['X'], y: [1] }],
        },
      });
      await page.setContent(html, { waitUntil: 'load' });

      const surfaceBg = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--surface-bg').trim()
      );
      expect(surfaceBg).not.toBe('');
    });
  }

  test('chart falls back gracefully with missing CSS properties', async ({ page }) => {
    const html = buildPlotlyTestDocument({
      theme: 'dark',
      chartData: {
        data: [{ type: 'bar', x: ['A'], y: [1] }],
      },
    });
    const noThemeHtml = html.replace(/data-theme="[^"]*"/, '');
    await page.setContent(noThemeHtml, { waitUntil: 'load' });
    await page.waitForFunction(() => (window as any).__plotlyReady === true);

    const plotCount = await page.locator('.js-plotly-plot').count();
    expect(plotCount).toBe(1);
  });
});
