import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { getTierAttributes, captureWarnings, getComputedCSSProperty } from '../fixtures/helpers';
import { RECIPES } from '../../packages/soltana-ui/src/config/recipes';

test.describe('applyRecipe', () => {
  // Derive expected values from the RECIPES map so new recipes are
  // automatically covered without updating test data.
  const expectedRecipes: Record<string, { theme: string; relief: string; finish: string }> = {};

  for (const [name, recipe] of Object.entries(RECIPES)) {
    expectedRecipes[name] = {
      theme: recipe.theme,
      relief: recipe.relief,
      finish: recipe.finish,
    };
  }

  for (const [recipeName, expected] of Object.entries(expectedRecipes)) {
    test(`${recipeName} applies tier values matching RECIPES definition`, async ({ page }) => {
      await setupSoltanaPage(page);
      const state = await page.evaluate((name) => {
        const s = window.SoltanaUI.initSoltana();
        s.applyRecipe(name);
        return s.getState();
      }, recipeName);

      const attrs = await getTierAttributes(page);

      expect(attrs.theme).toBe(expected.theme);
      expect(attrs.relief).toBe(expected.relief);
      expect(attrs.finish).toBe(expected.finish);

      expect(state.theme).toBe(expected.theme);
      expect(state.relief).toBe(expected.relief);
      expect(state.finish).toBe(expected.finish);

      // Verify computed CSS properties resolve to non-empty values
      const surfaceBg = await getComputedCSSProperty(page, '--surface-bg');
      const reliefShadow = await getComputedCSSProperty(page, '--relief-shadow');
      const finishBlur = await getComputedCSSProperty(page, '--finish-blur');
      expect(surfaceBg).not.toBe('');
      expect(reliefShadow).not.toBe('');
      expect(finishBlur).not.toBe('');
    });
  }

  test('invalid recipe name triggers console.warn and preserves state', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      (window as any).__soltanaInstance = window.SoltanaUI.initSoltana({
        theme: 'sepia',
        relief: 'glassmorphic',
      });
    });

    const warnings = await captureWarnings(page, async () => {
      await page.evaluate(() => (window as any).__soltanaInstance.applyRecipe('nonexistent'));
    });

    expect(warnings.some((w) => w.includes('Unknown recipe'))).toBe(true);

    const state = await page.evaluate(() => (window as any).__soltanaInstance.getState());
    expect(state.theme).toBe('sepia');
    expect(state.relief).toBe('glassmorphic');
  });

  test('individual setters can override tiers after recipe application', async ({ page }) => {
    await setupSoltanaPage(page);
    const state = await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana();
      s.applyRecipe('luxury-dark');
      s.setTheme('light');
      s.setRelief('flat');
      return s.getState();
    });

    expect(state.theme).toBe('light');
    expect(state.relief).toBe('flat');
    // Finish should remain from the recipe
    expect(state.finish).toBe('glossy');
  });
});
