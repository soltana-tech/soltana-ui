import { test, expect } from '@playwright/test';
import { buildEChartsTestDocument } from '../fixtures/echarts-assets';
import { CHART_CONFIGS } from '../fixtures/echarts-chart-data';

const themes = ['dark', 'light', 'sepia'] as const;

for (const theme of themes) {
  for (const [chartName, chartOption] of Object.entries(CHART_CONFIGS)) {
    test(`echarts: ${chartName} — ${theme}`, async ({ page }) => {
      const html = buildEChartsTestDocument({ theme, chartOption });
      await page.setContent(html, { waitUntil: 'load' });
      await page.waitForFunction(
        () => (window as any).__chart && !(window as any).__chart.isDisposed()
      );
      await expect(page).toHaveScreenshot(`echarts-${chartName}-${theme}.png`);
    });
  }
}
