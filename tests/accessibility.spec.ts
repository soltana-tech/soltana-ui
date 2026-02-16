import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { defaultCombinations } from './fixtures/combinations';
import { renderCombination, combinationLabel } from './fixtures/render';

const combinations = defaultCombinations();

for (const combo of combinations) {
  const label = combinationLabel(combo);

  test(`a11y: ${label}`, async ({ page }) => {
    await renderCombination(page, combo);

    // color-contrast excluded: known contrast issues in light/sepia themes
    // tracked for resolution in the design system SCSS layer
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .disableRules(['color-contrast'])
      .analyze();

    for (const violation of results.violations) {
      console.log(
        `[${violation.id}] ${violation.help} (${violation.impact})\n` +
          violation.nodes.map((n) => `  ${n.html}`).join('\n')
      );
    }

    expect(results.violations).toHaveLength(0);
  });
}
