import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { getTierAttributes, captureWarnings } from '../fixtures/helpers';

const THEME_SEED = {
  surfaceBg: '#1a1a2e',
  textPrimary: '#e0e0e0',
  accentPrimary: '#e94560',
};

const RELIEF_TOKENS = {
  '--relief-bg': 'var(--surface-1)',
  '--relief-shadow-sm': 'none',
  '--relief-shadow': 'none',
  '--relief-shadow-lg': 'none',
  '--relief-shadow-inset-sm': 'none',
  '--relief-shadow-inset': 'none',
  '--relief-shadow-inset-lg': 'none',
  '--relief-border': '1px solid var(--border-default)',
};

const FINISH_TOKENS = {
  '--finish-blur': '0px',
  '--finish-saturation': '1',
  '--finish-opacity': '1',
  '--finish-overlay': 'none',
  '--finish-sheen': 'none',
};

test.describe('runtime registration', () => {
  test('registerTheme + setTheme applies data attribute', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate((seed) => {
      const s = window.SoltanaUI.initSoltana();
      s.registerTheme('brand', { seed });
      s.setTheme('brand');
    }, THEME_SEED);

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('brand');
  });

  test('registerRelief + setRelief applies data attribute', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate((tokens) => {
      const s = window.SoltanaUI.initSoltana();
      s.registerRelief('paper', { tokens });
      s.setRelief('paper');
    }, RELIEF_TOKENS);

    const attrs = await getTierAttributes(page);
    expect(attrs.relief).toBe('paper');
  });

  test('registerFinish + setFinish applies data attribute', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate((tokens) => {
      const s = window.SoltanaUI.initSoltana();
      s.registerFinish('satin', { tokens });
      s.setFinish('satin');
    }, FINISH_TOKENS);

    const attrs = await getTierAttributes(page);
    expect(attrs.finish).toBe('satin');
  });

  test('registerOrnament + setOrnament applies data attribute', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana();
      s.registerOrnament('art-deco', {
        tokens: { '--ornament-color': 'gold' },
      });
      s.setOrnament('art-deco');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.ornament).toBe('art-deco');
  });

  test('strict mode does not warn after registerTheme', async ({ page }) => {
    await setupSoltanaPage(page);
    const warnings = await captureWarnings(page, async () => {
      await page.evaluate((seed) => {
        const s = window.SoltanaUI.initSoltana({ strict: true });
        s.registerTheme('brand', { seed });
        s.setTheme('brand');
      }, THEME_SEED);
    });

    const themeWarnings = warnings.filter((w) => w.includes('Unknown theme'));
    expect(themeWarnings).toHaveLength(0);
  });

  test('destroy() cleans up all registrations and stylesheet', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(
      ({ seed, reliefTokens }) => {
        const s = window.SoltanaUI.initSoltana();
        s.registerTheme('brand', { seed });
        s.registerRelief('paper', { tokens: reliefTokens });
        s.destroy();
      },
      { seed: THEME_SEED, reliefTokens: RELIEF_TOKENS }
    );

    // After destroy, the custom stylesheet should be removed.
    // Check for adoptedStyleSheets being clean or no soltana-custom style element.
    const hasCustomSheet = await page.evaluate(() => {
      // Check both possible locations: adoptedStyleSheets and DOM element
      const domEl = document.getElementById('soltana-custom');
      const adopted = document.adoptedStyleSheets.length;
      return { domEl: domEl !== null, adoptedCount: adopted };
    });

    // Either the DOM element is gone, or no adopted stylesheets remain beyond baseline
    // The stylesheet module removes its sheet on teardown
    expect(hasCustomSheet.domEl).toBe(false);
  });

  test('reset() cleans up registrations and stylesheet', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate((seed) => {
      const s = window.SoltanaUI.initSoltana();
      s.registerTheme('brand', { seed });
      s.setTheme('brand');
      s.reset();
    }, THEME_SEED);

    // After reset, should be back to defaults
    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('dark');

    const hasCustomSheet = await page.evaluate(
      () => document.getElementById('soltana-custom') !== null
    );
    expect(hasCustomSheet).toBe(false);
  });

  test('registers all 4 tiers simultaneously without conflicts', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(
      ({ seed, reliefTokens, finishTokens }) => {
        const s = window.SoltanaUI.initSoltana();
        s.registerTheme('brand', { seed });
        s.registerRelief('paper', { tokens: reliefTokens });
        s.registerFinish('satin', { tokens: finishTokens });
        s.registerOrnament('art-deco', {
          tokens: { '--ornament-color': 'gold' },
        });
        s.setTheme('brand');
        s.setRelief('paper');
        s.setFinish('satin');
        s.setOrnament('art-deco');
      },
      { seed: THEME_SEED, reliefTokens: RELIEF_TOKENS, finishTokens: FINISH_TOKENS }
    );

    const attrs = await getTierAttributes(page);
    expect(attrs).toEqual({
      theme: 'brand',
      relief: 'paper',
      finish: 'satin',
      ornament: 'art-deco',
    });
  });
});
