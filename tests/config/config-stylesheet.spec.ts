import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { getComputedCSSProperty } from '../fixtures/helpers';

const THEME_SEED = {
  surfaceBg: '#1a1a2e',
  textPrimary: '#e0e0e0',
  accentPrimary: '#e94560',
};

const SECOND_SEED = {
  surfaceBg: '#f6f7fa',
  textPrimary: '#1e2128',
  accentPrimary: '#576378',
  colorScheme: 'light' as const,
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

test.describe('stylesheet behavior via public API', () => {
  test('registerTheme + setTheme reflects registered token values in computed styles', async ({
    page,
  }) => {
    await setupSoltanaPage(page);
    await page.evaluate((seed) => {
      const s = window.SoltanaUI.initSoltana();
      s.registerTheme('brand', { seed });
      s.setTheme('brand');
    }, THEME_SEED);

    // The registered theme should inject CSS rules that set --surface-bg
    const surfaceBg = await getComputedCSSProperty(page, '--surface-bg');
    expect(surfaceBg).not.toBe('');
    // The seed surfaceBg was #1a1a2e — the computed value should reflect this
    expect(surfaceBg).toContain('1a1a2e');
  });

  test('registerTheme + setTheme reflects accent tokens', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate((seed) => {
      const s = window.SoltanaUI.initSoltana();
      s.registerTheme('brand', { seed });
      s.setTheme('brand');
    }, THEME_SEED);

    const accentPrimary = await getComputedCSSProperty(page, '--accent-primary');
    expect(accentPrimary).not.toBe('');
    expect(accentPrimary).toContain('e94560');
  });

  test('unregister() causes computed styles to revert', async ({ page }) => {
    await setupSoltanaPage(page);

    // Register and activate a custom theme
    const tokensBefore = await page.evaluate((seed) => {
      const s = window.SoltanaUI.initSoltana();
      const reg = s.registerTheme('brand', { seed });
      s.setTheme('brand');
      const before = getComputedStyle(document.documentElement)
        .getPropertyValue('--surface-bg')
        .trim();

      // Unregister and switch back to built-in dark
      reg.unregister();
      s.setTheme('dark');
      const after = getComputedStyle(document.documentElement)
        .getPropertyValue('--surface-bg')
        .trim();

      return { before, after };
    }, THEME_SEED);

    // Before unregister: brand's surface-bg. After: dark's surface-bg.
    expect(tokensBefore.before).not.toBe('');
    expect(tokensBefore.after).not.toBe('');
    // They should be different since the brand seed uses #1a1a2e
    // while the built-in dark theme uses a different value
    expect(tokensBefore.before).not.toBe(tokensBefore.after);
  });

  test('destroy() removes the custom stylesheet', async ({ page }) => {
    await setupSoltanaPage(page);
    const result = await page.evaluate((seed) => {
      const s = window.SoltanaUI.initSoltana();
      s.registerTheme('brand', { seed });

      // Before destroy: check for adopted stylesheets or DOM element
      const beforeDom = document.getElementById('soltana-custom') !== null;
      const beforeAdopted = document.adoptedStyleSheets.length;

      s.destroy();

      const afterDom = document.getElementById('soltana-custom') !== null;
      const afterAdopted = document.adoptedStyleSheets.length;

      return { beforeDom, beforeAdopted, afterDom, afterAdopted };
    }, THEME_SEED);

    // After destroy, the stylesheet should be cleaned up
    expect(result.afterDom).toBe(false);
    // Adopted stylesheets count should decrease or stay at 0
    expect(result.afterAdopted).toBeLessThanOrEqual(result.beforeAdopted);
  });

  test('interleaved register/unregister maintains correct state', async ({ page }) => {
    await setupSoltanaPage(page);
    const result = await page.evaluate(
      ({ seed1, seed2 }) => {
        const s = window.SoltanaUI.initSoltana();

        // Register first theme and activate it
        const reg1 = s.registerTheme('brand-a', { seed: seed1 });
        s.setTheme('brand-a');
        const afterFirst = getComputedStyle(document.documentElement)
          .getPropertyValue('--surface-bg')
          .trim();

        // Register second theme
        const reg2 = s.registerTheme('brand-b', { seed: seed2 });

        // Unregister first theme
        reg1.unregister();

        // Activate second theme
        s.setTheme('brand-b');
        const afterSwitch = getComputedStyle(document.documentElement)
          .getPropertyValue('--surface-bg')
          .trim();

        // Unregister second theme
        reg2.unregister();
        s.setTheme('dark');
        const afterBothRemoved = getComputedStyle(document.documentElement)
          .getPropertyValue('--surface-bg')
          .trim();

        return { afterFirst, afterSwitch, afterBothRemoved };
      },
      { seed1: THEME_SEED, seed2: SECOND_SEED }
    );

    // All three states should have non-empty surface-bg values
    expect(result.afterFirst).not.toBe('');
    expect(result.afterSwitch).not.toBe('');
    expect(result.afterBothRemoved).not.toBe('');

    // brand-a (#1a1a2e) and brand-b (#f6f7fa) should produce different values
    expect(result.afterFirst).not.toBe(result.afterSwitch);
  });

  test('registerRelief injects CSS rules observable via computed styles', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate((tokens) => {
      const s = window.SoltanaUI.initSoltana();
      s.registerRelief('paper', { tokens });
      s.setRelief('paper');
    }, RELIEF_TOKENS);

    // The registered relief should set --relief-border
    const reliefBorder = await getComputedCSSProperty(page, '--relief-border');
    expect(reliefBorder).not.toBe('');
  });

  test('registered theme rules override base rules via selector specificity', async ({ page }) => {
    await setupSoltanaPage(page);
    const result = await page.evaluate((seed) => {
      const s = window.SoltanaUI.initSoltana({ theme: 'dark' });
      const baseBg = getComputedStyle(document.documentElement)
        .getPropertyValue('--surface-bg')
        .trim();

      // Register and activate a custom theme
      s.registerTheme('custom', { seed });
      s.setTheme('custom');
      const customBg = getComputedStyle(document.documentElement)
        .getPropertyValue('--surface-bg')
        .trim();

      return { baseBg, customBg };
    }, THEME_SEED);

    // The custom theme's surface-bg should override the built-in dark theme
    expect(result.baseBg).not.toBe('');
    expect(result.customBg).not.toBe('');
    expect(result.customBg).not.toBe(result.baseBg);
    expect(result.customBg).toContain('1a1a2e');
  });

  test('multiple registrations do not conflict', async ({ page }) => {
    await setupSoltanaPage(page);
    const result = await page.evaluate(
      ({ seed, reliefTokens }) => {
        const s = window.SoltanaUI.initSoltana();

        s.registerTheme('brand', { seed });
        s.registerRelief('paper', { tokens: reliefTokens });

        // Activate both
        s.setTheme('brand');
        s.setRelief('paper');

        const surfaceBg = getComputedStyle(document.documentElement)
          .getPropertyValue('--surface-bg')
          .trim();
        const reliefBorder = getComputedStyle(document.documentElement)
          .getPropertyValue('--relief-border')
          .trim();

        return { surfaceBg, reliefBorder };
      },
      { seed: THEME_SEED, reliefTokens: RELIEF_TOKENS }
    );

    // Both registered values should be present without conflict
    expect(result.surfaceBg).not.toBe('');
    expect(result.reliefBorder).not.toBe('');
  });
});
