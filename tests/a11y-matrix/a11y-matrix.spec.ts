import fs from 'node:fs';
import path from 'node:path';
import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { cartesian } from '../fixtures/combinations';
import { renderCombination, combinationLabel } from '../fixtures/render';

const RESULTS_DIR = path.resolve('a11y-matrix-results/raw');
fs.mkdirSync(RESULTS_DIR, { recursive: true });

const combinations = cartesian();

for (const combo of combinations) {
  const label = combinationLabel(combo);

  test(`a11y-matrix: ${label}`, async ({ page }) => {
    await renderCombination(page, combo);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    const record = {
      combination: combo,
      label,
      timestamp: new Date().toISOString(),
      violations: results.violations,
      counts: {
        violations: results.violations.length,
        passes: results.passes.length,
        incomplete: results.incomplete.length,
        inapplicable: results.inapplicable.length,
      },
    };

    fs.writeFileSync(path.join(RESULTS_DIR, `${label}.json`), JSON.stringify(record, null, 2));
  });
}
