import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { getTierAttributes } from '../fixtures/helpers';
import { THEME_SEED, RELIEF_TOKENS, FINISH_TOKENS } from '../fixtures/registration-seeds';

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

  test('strict mode does not throw after registerTheme', async ({ page }) => {
    await setupSoltanaPage(page);
    const error = await page.evaluate((seed) => {
      try {
        const s = window.SoltanaUI.initSoltana({ strict: true });
        s.registerTheme('brand', { seed });
        s.setTheme('brand');
        return null;
      } catch (e) {
        return (e as Error).message;
      }
    }, THEME_SEED);

    expect(error).toBeNull();
  });

  test('destroy() cleans up all registrations and stylesheet', async ({ page }) => {
    await setupSoltanaPage(page);
    const result = await page.evaluate(
      ({ seed, reliefTokens }) => {
        const s = window.SoltanaUI.initSoltana();
        s.registerTheme('brand', { seed });
        s.registerRelief('paper', { tokens: reliefTokens });
        const adoptedBefore = document.adoptedStyleSheets.length;
        s.destroy();
        const adoptedAfter = document.adoptedStyleSheets.length;
        const domEl = document.getElementById('soltana-custom');
        const hasThemeAttr = document.documentElement.hasAttribute('data-theme');
        const hasReliefAttr = document.documentElement.hasAttribute('data-relief');
        const hasFinishAttr = document.documentElement.hasAttribute('data-finish');
        return {
          domEl: domEl !== null,
          adoptedBefore,
          adoptedAfter,
          hasThemeAttr,
          hasReliefAttr,
          hasFinishAttr,
        };
      },
      { seed: THEME_SEED, reliefTokens: RELIEF_TOKENS }
    );

    expect(result.domEl).toBe(false);
    expect(result.adoptedAfter).toBeLessThan(result.adoptedBefore);
    expect(result.hasThemeAttr).toBe(false);
    expect(result.hasReliefAttr).toBe(false);
    expect(result.hasFinishAttr).toBe(false);
  });

  test('reset() cleans up registrations and stylesheet', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate((seed) => {
      const s = window.SoltanaUI.initSoltana();
      s.registerTheme('brand', { seed });
      s.setTheme('brand');
      s.reset();
    }, THEME_SEED);

    // After reset, should be back to defaults (auto resolves at runtime)
    const attrs = await getTierAttributes(page);
    expect(['dark', 'light']).toContain(attrs.theme);

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
        s.setTheme('brand');
        s.setRelief('paper');
        s.setFinish('satin');
      },
      { seed: THEME_SEED, reliefTokens: RELIEF_TOKENS, finishTokens: FINISH_TOKENS }
    );

    const attrs = await getTierAttributes(page);
    expect(attrs).toEqual({
      theme: 'brand',
      relief: 'paper',
      finish: 'satin',
    });
  });
});
