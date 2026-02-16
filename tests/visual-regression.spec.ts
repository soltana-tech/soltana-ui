import { test, expect } from '@playwright/test';
import { defaultCombinations, cartesian } from './fixtures/combinations';
import { renderCombination, combinationLabel } from './fixtures/render';

const combinations = process.env.FULL_MATRIX ? cartesian() : defaultCombinations();

for (const combo of combinations) {
  const label = combinationLabel(combo);

  test(`visual: ${label}`, async ({ page }) => {
    await renderCombination(page, combo);
    await expect(page).toHaveScreenshot(`${label}.png`);
  });
}
