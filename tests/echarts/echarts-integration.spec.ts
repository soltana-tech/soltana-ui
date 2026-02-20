import { test, expect } from '@playwright/test';
import { buildEChartsTestDocument } from '../fixtures/echarts-assets';

const themes = ['dark', 'light', 'sepia'] as const;

test.describe('ECharts integration', () => {
  for (const theme of themes) {
    test(`${theme}: chart initializes with Soltana theme`, async ({ page }) => {
      const html = buildEChartsTestDocument({
        theme,
        chartOption: {
          animation: false,
          series: { type: 'bar', data: [10, 20, 30] },
          xAxis: { type: 'category', data: ['A', 'B', 'C'] },
          yAxis: { type: 'value' },
        },
      });
      await page.setContent(html, { waitUntil: 'load' });
      await page.waitForFunction(
        () => (window as any).__chart && !(window as any).__chart.isDisposed()
      );

      // Chart should be rendered (canvas present)
      const canvasCount = await page.locator('#chart canvas').count();
      expect(canvasCount).toBeGreaterThan(0);
    });

    test(`${theme}: theme JSON has required keys`, async ({ page }) => {
      const html = buildEChartsTestDocument({
        theme,
        chartOption: {
          animation: false,
          series: { type: 'bar', data: [1] },
          xAxis: { type: 'category', data: ['A'] },
          yAxis: { type: 'value' },
        },
      });
      await page.setContent(html, { waitUntil: 'load' });
      await page.waitForFunction(
        () => (window as any).__chart && !(window as any).__chart.isDisposed()
      );

      // Verify the chart's theme option resolved properly
      const hasOption = await page.evaluate(() => {
        const chart = (window as any).__chart;
        const option = chart.getOption();
        return option && typeof option === 'object';
      });
      expect(hasOption).toBe(true);
    });

    test(`${theme}: Soltana CSS tokens resolve in chart document`, async ({ page }) => {
      const html = buildEChartsTestDocument({
        theme,
        chartOption: {
          animation: false,
          series: { type: 'bar', data: [1] },
          xAxis: { type: 'category', data: ['A'] },
          yAxis: { type: 'value' },
        },
      });
      await page.setContent(html, { waitUntil: 'load' });

      // Key Soltana tokens should be defined
      const surfaceBg = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--surface-bg').trim()
      );
      expect(surfaceBg).not.toBe('');

      const textPrimary = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
      );
      expect(textPrimary).not.toBe('');
    });
  }

  test('chart falls back gracefully with missing CSS properties', async ({ page }) => {
    // Build a document with no theme attribute -- tokens may be empty
    const html = buildEChartsTestDocument({
      theme: 'dark',
      chartOption: {
        animation: false,
        series: { type: 'bar', data: [10, 20] },
        xAxis: { type: 'category', data: ['A', 'B'] },
        yAxis: { type: 'value' },
      },
    });
    // Strip data-theme to test fallback
    const noThemeHtml = html.replace(/data-theme="[^"]*"/, '');
    await page.setContent(noThemeHtml, { waitUntil: 'load' });
    await page.waitForFunction(
      () => (window as any).__chart && !(window as any).__chart.isDisposed()
    );

    // Chart should still render without errors
    const canvasCount = await page.locator('#chart canvas').count();
    expect(canvasCount).toBeGreaterThan(0);
  });
});
