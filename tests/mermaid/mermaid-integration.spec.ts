import { test, expect } from '@playwright/test';
import { buildMermaidTestDocument } from '../fixtures/mermaid-assets';

const themes = ['dark', 'light', 'sepia'] as const;

const FLOWCHART = `graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[OK]
  B -->|No| D[End]`;

test.describe('Mermaid integration', () => {
  for (const theme of themes) {
    test(`${theme}: diagram renders with Soltana theme`, async ({ page }) => {
      const html = buildMermaidTestDocument({ theme, diagram: FLOWCHART });
      await page.setContent(html, { waitUntil: 'load' });
      await page.waitForFunction(() => (window as any).__mermaidReady === true, null, {
        timeout: 10000,
      });

      // Mermaid renders an SVG inside the diagram container
      const svgCount = await page.locator('#diagram svg').count();
      expect(svgCount).toBe(1);
    });

    test(`${theme}: Soltana CSS tokens resolve in diagram document`, async ({ page }) => {
      const html = buildMermaidTestDocument({ theme, diagram: FLOWCHART });
      await page.setContent(html, { waitUntil: 'load' });

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

  test('diagram falls back gracefully with missing CSS properties', async ({ page }) => {
    const html = buildMermaidTestDocument({ theme: 'dark', diagram: FLOWCHART });
    const noThemeHtml = html.replace(/data-theme="[^"]*"/, '');
    await page.setContent(noThemeHtml, { waitUntil: 'load' });
    await page.waitForFunction(() => (window as any).__mermaidReady === true, null, {
      timeout: 10000,
    });

    const svgCount = await page.locator('#diagram svg').count();
    expect(svgCount).toBe(1);
  });
});
