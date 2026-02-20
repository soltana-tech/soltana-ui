import { test, expect } from '@playwright/test';
import { defaultCombinations, cartesian } from './fixtures/combinations';
import { renderCombination, combinationLabel } from './fixtures/render';

// FULL_MATRIX env var controls combination coverage:
//   unset  -> defaultCombinations() (curated subset for fast CI)
//   truthy -> cartesian() (all theme x relief x finish permutations)
// The a11y-matrix/ suite always uses cartesian regardless of this flag.
const combinations = process.env.FULL_MATRIX ? cartesian() : defaultCombinations();

for (const combo of combinations) {
  const label = combinationLabel(combo);

  test(`visual: ${label}`, async ({ page }) => {
    await renderCombination(page, combo);

    // Structural assertion: verify tier data attributes match the combination
    const attrs = await page.evaluate(() => ({
      theme: document.documentElement.getAttribute('data-theme'),
      relief: document.documentElement.getAttribute('data-relief'),
      finish: document.documentElement.getAttribute('data-finish'),
    }));
    expect(attrs.theme).toBe(combo.theme);
    expect(attrs.relief).toBe(combo.relief);
    expect(attrs.finish).toBe(combo.finish);

    await expect(page).toHaveScreenshot(`${label}.png`);
  });
}
