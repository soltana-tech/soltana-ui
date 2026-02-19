import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { getTierAttributes, captureWarnings } from '../fixtures/helpers';

test.describe('applyRecipe', () => {
  const expectedRecipes: Record<
    string,
    { theme: string; relief: string; finish: string; ornament: string }
  > = {
    'corporate-clean': { theme: 'light', relief: 'flat', finish: 'matte', ornament: 'none' },
    'luxury-dark': { theme: 'dark', relief: 'neu', finish: 'glossy', ornament: 'gilt' },
    'frosted-modern': {
      theme: 'dark',
      relief: 'glassmorphic',
      finish: 'frosted',
      ornament: 'none',
    },
    'classic-warm': {
      theme: 'sepia',
      relief: 'skeuomorphic',
      finish: 'matte',
      ornament: 'beveled',
    },
  };

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
      expect(attrs.ornament).toBe(expected.ornament);

      expect(state.theme).toBe(expected.theme);
      expect(state.relief).toBe(expected.relief);
      expect(state.finish).toBe(expected.finish);
      expect(state.ornament).toBe(expected.ornament);
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
    // Finish and ornament should remain from the recipe
    expect(state.finish).toBe('glossy');
    expect(state.ornament).toBe('gilt');
  });
});
