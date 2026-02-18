import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { captureWarnings } from '../fixtures/helpers';

test.describe('font loading', () => {
  test('loadSoltanaFonts injects preconnect and stylesheet links', async ({ page }) => {
    await setupSoltanaPage(page);

    const linkCount = await page.evaluate(() => {
      window.SoltanaUI.loadSoltanaFonts();
      return document.head.querySelectorAll('link').length;
    });

    expect(linkCount).toBe(3);

    const rels = await page.evaluate(() =>
      Array.from(document.head.querySelectorAll('link')).map((l) => l.rel)
    );
    expect(rels.filter((r) => r === 'preconnect')).toHaveLength(2);
    expect(rels).toContain('stylesheet');
  });

  test('loadSoltanaFonts is idempotent', async ({ page }) => {
    await setupSoltanaPage(page);

    const linkCount = await page.evaluate(() => {
      window.SoltanaUI.loadSoltanaFonts();
      window.SoltanaUI.loadSoltanaFonts();
      return document.head.querySelectorAll('link').length;
    });

    expect(linkCount).toBe(3);
  });

  test('font stylesheet requests the expected font families', async ({ page }) => {
    const requestedUrls: string[] = [];
    await page.route('**/*fonts.googleapis.com/**', (route) => {
      requestedUrls.push(route.request().url());
      route.abort();
    });

    await setupSoltanaPage(page);

    await page.evaluate(() => {
      window.SoltanaUI.loadSoltanaFonts();
    });

    // Wait for the route handler to capture the font request
    await page.waitForFunction(() => document.querySelector('link[rel="stylesheet"]') !== null);
    // Yield a frame so the intercepted request completes
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(r)));

    const fontUrl = requestedUrls.find((u) => u.includes('css2'));
    expect(fontUrl).toBeDefined();
    expect(fontUrl).toContain('Cinzel');
    expect(fontUrl).toContain('Raleway');
    expect(fontUrl).toContain('JetBrains+Mono');
  });

  test('font load error triggers console warning', async ({ page }) => {
    await page.route('**/*fonts.googleapis.com/**', (route) => route.abort());

    await setupSoltanaPage(page);

    const warnings = await captureWarnings(page, async () => {
      await page.evaluate(() => {
        window.SoltanaUI.loadSoltanaFonts();
        // Trigger onerror on the stylesheet link
        const link = document.querySelector('link[rel="stylesheet"]') as HTMLLinkElement;
        if (link?.onerror) (link.onerror as Function)();
      });
    });

    expect(warnings.some((w) => w.includes('Failed to load fonts'))).toBe(true);
  });

  test('custom URL skips preconnect links', async ({ page }) => {
    await setupSoltanaPage(page);

    const linkCount = await page.evaluate(() => {
      window.SoltanaUI.loadSoltanaFonts('https://cdn.example.com/fonts.css');
      return document.head.querySelectorAll('link').length;
    });

    // Only the stylesheet — no preconnect links
    expect(linkCount).toBe(1);

    const href = await page.evaluate(
      () => (document.head.querySelector('link[rel="stylesheet"]') as HTMLLinkElement)?.href
    );
    expect(href).toContain('cdn.example.com/fonts.css');
  });

  test('DEFAULT_FONT_URL is exported and contains expected font families', async ({ page }) => {
    await setupSoltanaPage(page);

    const url = await page.evaluate(() => window.SoltanaUI.DEFAULT_FONT_URL);
    expect(url).toContain('Cinzel');
    expect(url).toContain('Raleway');
    expect(url).toContain('JetBrains+Mono');
  });
});
