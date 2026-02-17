import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { getTierAttributes } from '../fixtures/helpers';

test.describe('cross-tier interaction', () => {
  test('changing theme preserves relief, finish, and ornament', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      window.SoltanaUI.initSoltana({
        theme: 'dark',
        relief: 'flat',
        finish: 'frosted',
        ornament: 'gilt',
      });
    });

    await page.evaluate(() => {
      const sol = window.SoltanaUI.initSoltana({
        theme: 'dark',
        relief: 'flat',
        finish: 'frosted',
        ornament: 'gilt',
      });
      sol.setTheme('light');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('light');
    expect(attrs.relief).toBe('flat');
    expect(attrs.finish).toBe('frosted');
    expect(attrs.ornament).toBe('gilt');
  });

  test('changing relief preserves theme, finish, and ornament', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      const sol = window.SoltanaUI.initSoltana({
        theme: 'sepia',
        relief: 'soft',
        finish: 'tinted',
        ornament: 'baroque',
      });
      sol.setRelief('sharp');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('sepia');
    expect(attrs.relief).toBe('sharp');
    expect(attrs.finish).toBe('tinted');
    expect(attrs.ornament).toBe('baroque');
  });

  test('changing finish preserves theme, relief, and ornament', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      const sol = window.SoltanaUI.initSoltana({
        theme: 'light',
        relief: 'lifted',
        finish: 'matte',
        ornament: 'beveled',
      });
      sol.setFinish('glossy');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('light');
    expect(attrs.relief).toBe('lifted');
    expect(attrs.finish).toBe('glossy');
    expect(attrs.ornament).toBe('beveled');
  });

  test('changing ornament preserves theme, relief, and finish', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      const sol = window.SoltanaUI.initSoltana({
        theme: 'dark',
        relief: 'neu',
        finish: 'translucent',
        ornament: 'none',
      });
      sol.setOrnament('faceted');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('dark');
    expect(attrs.relief).toBe('neu');
    expect(attrs.finish).toBe('translucent');
    expect(attrs.ornament).toBe('faceted');
  });

  test('applyRecipe then override one tier preserves other recipe tiers', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      const sol = window.SoltanaUI.initSoltana();
      sol.applyRecipe('luxury-dark');
      sol.setRelief('flat');
    });

    const attrs = await getTierAttributes(page);
    // luxury-dark: dark/neu/glossy/gilt — relief was overridden to flat
    expect(attrs.theme).toBe('dark');
    expect(attrs.relief).toBe('flat');
    expect(attrs.finish).toBe('glossy');
    expect(attrs.ornament).toBe('gilt');
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
    expect(attrs.theme).toBe('dark');
    expect(attrs.relief).toBe('neu');
    expect(attrs.finish).toBe('matte');
    expect(attrs.ornament).toBe('none');
  });

  test('sequential tier changes accumulate correctly', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      const sol = window.SoltanaUI.initSoltana();
      sol.setTheme('light');
      sol.setRelief('lifted');
      sol.setFinish('glossy');
      sol.setOrnament('gilt');
      sol.setTheme('sepia');
      sol.setRelief('hewn');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('sepia');
    expect(attrs.relief).toBe('hewn');
    expect(attrs.finish).toBe('glossy');
    expect(attrs.ornament).toBe('gilt');
  });

  test('getState reflects all cross-tier changes', async ({ page }) => {
    await setupSoltanaPage(page);

    const state = await page.evaluate(() => {
      const sol = window.SoltanaUI.initSoltana();
      sol.applyRecipe('classic-warm');
      sol.setFinish('frosted');
      return sol.getState();
    });

    // classic-warm: sepia/soft/matte/beveled — finish overridden to frosted
    expect(state.theme).toBe('sepia');
    expect(state.relief).toBe('soft');
    expect(state.finish).toBe('frosted');
    expect(state.ornament).toBe('beveled');
  });
});
