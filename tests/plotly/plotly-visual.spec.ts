import { test, expect } from '@playwright/test';
import { buildPlotlyTestDocument } from '../fixtures/plotly-assets';
import { CHART_CONFIGS } from '../fixtures/plotly-chart-data';

const themes = ['dark', 'light', 'sepia'] as const;

for (const theme of themes) {
  for (const [chartName, chartData] of Object.entries(CHART_CONFIGS)) {
    test(`plotly: ${chartName} — ${theme}`, async ({ page }) => {
      const html = buildPlotlyTestDocument({ theme, chartData });
      await page.setContent(html, { waitUntil: 'load' });
      await page.waitForFunction(() => (window as any).__plotlyReady === true);
      await expect(page).toHaveScreenshot(`plotly-${chartName}-${theme}.png`);
    });
  }
}
