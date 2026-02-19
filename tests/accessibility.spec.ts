import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { singleAxis } from './fixtures/combinations';
import { renderCombination, combinationLabel } from './fixtures/render';

const combinations = singleAxis();

for (const combo of combinations) {
  const label = combinationLabel(combo);

  test(`a11y: ${label}`, async ({ page }) => {
    await renderCombination(page, combo);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(results.violations).toHaveLength(0);
  });
}
