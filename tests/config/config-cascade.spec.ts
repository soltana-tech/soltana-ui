// TODO: Visual regression tests for tier combinations are a future improvement,
// particularly for combinations where tiers interact via bridge tokens
// (e.g., frosted finish over skeuomorphic relief).

import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { getComputedCSSProperty, getTierAttributes } from '../fixtures/helpers';
import { singleAxis } from '../fixtures/combinations';

test.describe('tier independence', () => {
  test('changing theme preserves relief and finish', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      (window as any).__sol = window.SoltanaUI.initSoltana({
        theme: 'dark',
        relief: 'flat',
        finish: 'frosted',
      });
    });

    const surfaceBgBefore = await getComputedCSSProperty(page, '--surface-bg');
    const reliefShadowBefore = await getComputedCSSProperty(page, '--relief-shadow');
    const finishBlurBefore = await getComputedCSSProperty(page, '--finish-blur');

    await page.evaluate(() => {
      (window as any).__sol.setTheme('light');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('light');
    expect(attrs.relief).toBe('flat');
    expect(attrs.finish).toBe('frosted');

    const surfaceBgAfter = await getComputedCSSProperty(page, '--surface-bg');
    const reliefShadowAfter = await getComputedCSSProperty(page, '--relief-shadow');
    const finishBlurAfter = await getComputedCSSProperty(page, '--finish-blur');

    expect(surfaceBgAfter).not.toBe('');
    expect(surfaceBgAfter).not.toBe(surfaceBgBefore);
    expect(reliefShadowAfter).toBe(reliefShadowBefore);
    expect(finishBlurAfter).toBe(finishBlurBefore);
  });

  test('changing relief preserves theme and finish', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      (window as any).__sol = window.SoltanaUI.initSoltana({
        theme: 'sepia',
        relief: 'skeuomorphic',
        finish: 'tinted',
      });
    });

    const surfaceBgBefore = await getComputedCSSProperty(page, '--surface-bg');
    const reliefShadowBefore = await getComputedCSSProperty(page, '--relief-shadow');
    const finishBlurBefore = await getComputedCSSProperty(page, '--finish-blur');

    await page.evaluate(() => {
      (window as any).__sol.setRelief('glassmorphic');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('sepia');
    expect(attrs.relief).toBe('glassmorphic');
    expect(attrs.finish).toBe('tinted');

    const surfaceBgAfter = await getComputedCSSProperty(page, '--surface-bg');
    const reliefShadowAfter = await getComputedCSSProperty(page, '--relief-shadow');
    const finishBlurAfter = await getComputedCSSProperty(page, '--finish-blur');

    expect(reliefShadowAfter).not.toBe('');
    expect(reliefShadowAfter).not.toBe(reliefShadowBefore);
    expect(surfaceBgAfter).toBe(surfaceBgBefore);
    expect(finishBlurAfter).toBe(finishBlurBefore);
  });

  test('changing finish preserves theme and relief', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      (window as any).__sol = window.SoltanaUI.initSoltana({
        theme: 'light',
        relief: 'skeuomorphic',
        finish: 'matte',
      });
    });

    const surfaceBgBefore = await getComputedCSSProperty(page, '--surface-bg');
    const reliefShadowBefore = await getComputedCSSProperty(page, '--relief-shadow');
    const finishSheenBefore = await getComputedCSSProperty(page, '--finish-sheen');

    await page.evaluate(() => {
      (window as any).__sol.setFinish('glossy');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('light');
    expect(attrs.relief).toBe('skeuomorphic');
    expect(attrs.finish).toBe('glossy');

    const surfaceBgAfter = await getComputedCSSProperty(page, '--surface-bg');
    const reliefShadowAfter = await getComputedCSSProperty(page, '--relief-shadow');
    const finishSheenAfter = await getComputedCSSProperty(page, '--finish-sheen');

    expect(finishSheenAfter).not.toBe('');
    expect(finishSheenAfter).not.toBe(finishSheenBefore);
    expect(surfaceBgAfter).toBe(surfaceBgBefore);
    expect(reliefShadowAfter).toBe(reliefShadowBefore);
  });

  test('sequential tier changes accumulate correctly', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      const sol = window.SoltanaUI.initSoltana();
      sol.setTheme('light');
      sol.setRelief('skeuomorphic');
      sol.setFinish('glossy');
      sol.setTheme('sepia');
      sol.setRelief('neumorphic');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('sepia');
    expect(attrs.relief).toBe('neumorphic');
    expect(attrs.finish).toBe('glossy');
  });

  test('computed CSS properties reflect active tier and update on change', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      (window as any).__sol = window.SoltanaUI.initSoltana({
        theme: 'dark',
        relief: 'flat',
        finish: 'frosted',
      });
    });

    const reliefShadow = await getComputedCSSProperty(page, '--relief-shadow');
    expect(reliefShadow).not.toBe('');

    await page.evaluate(() => {
      (window as any).__sol.setRelief('skeuomorphic');
    });

    const reliefShadowAfter = await getComputedCSSProperty(page, '--relief-shadow');
    expect(reliefShadowAfter).not.toBe('');
    expect(reliefShadowAfter).not.toBe(reliefShadow);
  });
});

test.describe('multi-tier cascade integration', () => {
  for (const combo of singleAxis()) {
    test(`combo ${combo.theme}/${combo.relief}/${combo.finish} resolves key tokens`, async ({
      page,
    }) => {
      await setupSoltanaPage(page);
      await page.evaluate((cfg) => {
        (window as any).__sol = window.SoltanaUI.initSoltana();
        (window as any).__sol.setTheme(cfg.theme);
        (window as any).__sol.setRelief(cfg.relief);
        (window as any).__sol.setFinish(cfg.finish);
      }, combo);

      const reliefShadow = await getComputedCSSProperty(page, '--relief-shadow');
      const finishBlur = await getComputedCSSProperty(page, '--finish-blur');
      const surfaceBg = await getComputedCSSProperty(page, '--surface-bg');

      expect(reliefShadow).not.toBe('');
      expect(finishBlur).not.toBe('');
      expect(surfaceBg).not.toBe('');

      const altRelief = combo.relief === 'flat' ? 'skeuomorphic' : 'flat';
      await page.evaluate((newRelief) => {
        (window as any).__sol.setRelief(newRelief);
      }, altRelief);

      const reliefShadowAfter = await getComputedCSSProperty(page, '--relief-shadow');
      expect(reliefShadowAfter).not.toBe(reliefShadow);
    });
  }

  test('all three tiers contribute independently to computed styles', async ({ page }) => {
    await setupSoltanaPage(page);

    // Apply a known combination where all tiers produce distinct tokens
    await page.evaluate(() => {
      window.SoltanaUI.initSoltana({
        theme: 'dark',
        relief: 'skeuomorphic',
        finish: 'frosted',
      });
    });

    const surfaceBg = await getComputedCSSProperty(page, '--surface-bg');
    const reliefShadow = await getComputedCSSProperty(page, '--relief-shadow');
    const finishBlur = await getComputedCSSProperty(page, '--finish-blur');

    // Each tier's tokens should be present and non-empty
    expect(surfaceBg).not.toBe('');
    expect(reliefShadow).not.toBe('');
    expect(finishBlur).not.toBe('');
  });

  test('switching one tier does not affect tokens from other tiers', async ({ page }) => {
    await setupSoltanaPage(page);

    // Initialize once and store the instance for reuse
    await page.evaluate(() => {
      (window as any).__sol = window.SoltanaUI.initSoltana({
        theme: 'dark',
        relief: 'skeuomorphic',
        finish: 'frosted',
      });
    });

    const reliefBefore = await getComputedCSSProperty(page, '--relief-shadow');
    const finishBefore = await getComputedCSSProperty(page, '--finish-blur');

    // Switch only theme on the existing instance (no re-init)
    await page.evaluate(() => {
      (window as any).__sol.setTheme('light');
    });

    const reliefAfter = await getComputedCSSProperty(page, '--relief-shadow');
    const finishAfter = await getComputedCSSProperty(page, '--finish-blur');

    // Relief and finish tokens should not change when only theme changes
    expect(reliefAfter).toBe(reliefBefore);
    expect(finishAfter).toBe(finishBefore);
  });
});

test.describe('sampled cross-product combinations', () => {
  // Representative sampling: each theme x each relief, with a varied finish
  const finishes = ['matte', 'frosted', 'tinted', 'glossy'];
  const sampledCombos: { theme: string; relief: string; finish: string }[] = [];

  for (const theme of ['dark', 'light', 'sepia']) {
    for (const relief of ['flat', 'glassmorphic', 'skeuomorphic', 'neumorphic']) {
      // Rotate through finishes to get variety without full cartesian
      const finishIdx = sampledCombos.length % finishes.length;
      sampledCombos.push({ theme, relief, finish: finishes[finishIdx] });
    }
  }

  for (const combo of sampledCombos) {
    test(`sampled ${combo.theme}/${combo.relief}/${combo.finish} resolves all tier tokens`, async ({
      page,
    }) => {
      await setupSoltanaPage(page);
      await page.evaluate((cfg) => {
        const s = window.SoltanaUI.initSoltana();
        s.setTheme(cfg.theme);
        s.setRelief(cfg.relief);
        s.setFinish(cfg.finish);
      }, combo);

      const surfaceBg = await getComputedCSSProperty(page, '--surface-bg');
      const reliefShadow = await getComputedCSSProperty(page, '--relief-shadow');
      const finishBlur = await getComputedCSSProperty(page, '--finish-blur');

      expect(surfaceBg).not.toBe('');
      expect(reliefShadow).not.toBe('');
      expect(finishBlur).not.toBe('');
    });
  }
});
