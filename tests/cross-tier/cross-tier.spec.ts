import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { getTierAttributes, getComputedCSSProperty } from '../fixtures/helpers';

test.describe('cross-tier interaction', () => {
  test('changing theme preserves relief and finish', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      const sol = window.SoltanaUI.initSoltana({
        theme: 'dark',
        relief: 'flat',
        finish: 'frosted',
      });
      sol.setTheme('light');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('light');
    expect(attrs.relief).toBe('flat');
    expect(attrs.finish).toBe('frosted');
  });

  test('changing relief preserves theme and finish', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      const sol = window.SoltanaUI.initSoltana({
        theme: 'sepia',
        relief: 'skeuomorphic',
        finish: 'tinted',
      });
      sol.setRelief('glassmorphic');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('sepia');
    expect(attrs.relief).toBe('glassmorphic');
    expect(attrs.finish).toBe('tinted');
  });

  test('changing finish preserves theme and relief', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      const sol = window.SoltanaUI.initSoltana({
        theme: 'light',
        relief: 'skeuomorphic',
        finish: 'matte',
      });
      sol.setFinish('glossy');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('light');
    expect(attrs.relief).toBe('skeuomorphic');
    expect(attrs.finish).toBe('glossy');
  });

  test('applyRecipe then override one tier preserves other recipe tiers', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      const sol = window.SoltanaUI.initSoltana();
      sol.applyRecipe('luxury-dark');
      sol.setRelief('flat');
    });

    const attrs = await getTierAttributes(page);
    // luxury-dark: dark/neu/glossy — relief was overridden to flat
    expect(attrs.theme).toBe('dark');
    expect(attrs.relief).toBe('flat');
    expect(attrs.finish).toBe('glossy');
  });

  test('reset after recipe + override restores defaults', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      const sol = window.SoltanaUI.initSoltana();
      sol.applyRecipe('frosted-modern');
      sol.setTheme('sepia');
      sol.reset();
    });

    const attrs = await getTierAttributes(page);
    expect(['dark', 'light']).toContain(attrs.theme);
    expect(attrs.relief).toBe('neumorphic');
    expect(attrs.finish).toBe('matte');
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

  test('getState reflects all cross-tier changes', async ({ page }) => {
    await setupSoltanaPage(page);

    const state = await page.evaluate(() => {
      const sol = window.SoltanaUI.initSoltana();
      sol.applyRecipe('classic-warm');
      sol.setFinish('frosted');
      return sol.getState();
    });

    // classic-warm: sepia/skeuomorphic/matte — finish overridden to frosted
    expect(state.theme).toBe('sepia');
    expect(state.relief).toBe('skeuomorphic');
    expect(state.finish).toBe('frosted');
  });

  test('computed CSS properties reflect the active tier combination', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      window.SoltanaUI.initSoltana({
        theme: 'dark',
        relief: 'flat',
        finish: 'frosted',
      });
    });

    const surfaceBg = await getComputedCSSProperty(page, '--surface-bg');
    const reliefShadow = await getComputedCSSProperty(page, '--relief-shadow');

    expect(surfaceBg).not.toBe('');
    expect(reliefShadow).not.toBe('');

    // Switch relief and verify the relief token changes
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({
        theme: 'dark',
        relief: 'flat',
        finish: 'frosted',
      });
      s.setRelief('skeuomorphic');
    });

    const reliefShadowAfter = await getComputedCSSProperty(page, '--relief-shadow');
    expect(reliefShadowAfter).not.toBe('');
    expect(reliefShadowAfter).not.toBe(reliefShadow);
  });
});
