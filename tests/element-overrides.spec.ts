import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const CSS_PATH = path.resolve('dist/soltana-ui.css');

let cssCache: string | null = null;

function getCSS(): string {
  if (!cssCache) {
    cssCache = fs.readFileSync(CSS_PATH, 'utf-8');
  }
  return cssCache;
}

function cardHTML(extraClasses: string = ''): string {
  const cls = extraClasses ? ` ${extraClasses}` : '';
  return `
    <div class="card${cls}" style="width: 280px;">
      <div class="card-header">Header</div>
      <div class="card-body">Card body content for visual comparison.</div>
      <div class="card-footer">Footer</div>
    </div>`;
}

interface OverrideScenario {
  name: string;
  theme: string;
  relief: string;
  finish: string;
  ornament: string;
  overrideClasses: string;
}

const scenarios: OverrideScenario[] = [
  {
    name: 'theme',
    theme: 'dark',
    relief: 'neu',
    finish: 'matte',
    ornament: 'none',
    overrideClasses: 'theme-light',
  },
  {
    name: 'relief',
    theme: 'dark',
    relief: 'neu',
    finish: 'matte',
    ornament: 'none',
    overrideClasses: 'relief-flat',
  },
  {
    name: 'finish',
    theme: 'dark',
    relief: 'neu',
    finish: 'matte',
    ornament: 'none',
    overrideClasses: 'finish-frosted',
  },
  {
    name: 'ornament',
    theme: 'dark',
    relief: 'neu',
    finish: 'matte',
    ornament: 'gilt',
    overrideClasses: 'ornament-baroque',
  },
  {
    name: 'multi',
    theme: 'dark',
    relief: 'neu',
    finish: 'matte',
    ornament: 'none',
    overrideClasses: 'theme-sepia relief-lifted finish-glossy',
  },
];

for (const scenario of scenarios) {
  test(`element override: ${scenario.name}`, async ({ page }) => {
    const css = getCSS();

    const html = `<!DOCTYPE html>
<html lang="en"
  data-theme="${scenario.theme}"
  data-relief="${scenario.relief}"
  data-finish="${scenario.finish}"
  data-ornament="${scenario.ornament}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Element Override: ${scenario.name}</title>
  <style>${css}</style>
</head>
<body>
  <main style="padding: 2rem; display: flex; gap: 2rem;">
    ${cardHTML()}
    ${cardHTML(scenario.overrideClasses)}
  </main>
</body>
</html>`;

    await page.setContent(html, { waitUntil: 'load' });
    await expect(page).toHaveScreenshot(`override-${scenario.name}.png`);
  });
}
