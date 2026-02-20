import { test, expect } from '@playwright/test';
import { getCSS } from './fixtures/assets';

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
  overrideClasses: string;
}

const scenarios: OverrideScenario[] = [
  {
    name: 'theme',
    theme: 'dark',
    relief: 'neumorphic',
    finish: 'matte',
    overrideClasses: 'theme-light',
  },
  {
    name: 'relief',
    theme: 'dark',
    relief: 'neumorphic',
    finish: 'matte',
    overrideClasses: 'relief-flat',
  },
  {
    name: 'finish',
    theme: 'dark',
    relief: 'neumorphic',
    finish: 'matte',
    overrideClasses: 'finish-frosted',
  },
  {
    name: 'multi',
    theme: 'dark',
    relief: 'neumorphic',
    finish: 'matte',
    overrideClasses: 'theme-sepia relief-skeuomorphic finish-glossy',
  },
];

for (const scenario of scenarios) {
  test(`element override: ${scenario.name}`, async ({ page }) => {
    const css = getCSS();

    const html = `<!DOCTYPE html>
<html lang="en"
  data-theme="${scenario.theme}"
  data-relief="${scenario.relief}"
  data-finish="${scenario.finish}">
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

    // Verify the override card has different computed tokens than the base card
    const [baseBg, overrideBg] = await page.evaluate(() => {
      const cards = document.querySelectorAll('.card');
      const base = getComputedStyle(cards[0]).getPropertyValue('--surface-bg');
      const override = getComputedStyle(cards[1]).getPropertyValue('--surface-bg');
      return [base, override];
    });
    if (scenario.overrideClasses.includes('theme-')) {
      expect(overrideBg).not.toBe(baseBg);
    }

    // Assert tier-specific tokens differ between base and override cards
    if (scenario.overrideClasses.includes('relief-')) {
      const [baseShadow, overrideShadow] = await page.evaluate(() => {
        const cards = document.querySelectorAll('.card');
        const base = getComputedStyle(cards[0]).getPropertyValue('--relief-shadow').trim();
        const override = getComputedStyle(cards[1]).getPropertyValue('--relief-shadow').trim();
        return [base, override];
      });
      expect(baseShadow).not.toBe('');
      expect(overrideShadow).not.toBe('');
      expect(overrideShadow).not.toBe(baseShadow);
    }

    if (scenario.overrideClasses.includes('finish-')) {
      const [baseVal, overrideVal] = await page.evaluate(() => {
        const cards = document.querySelectorAll('.card');
        const prop = '--finish-sheen';
        const base = getComputedStyle(cards[0]).getPropertyValue(prop).trim();
        const override = getComputedStyle(cards[1]).getPropertyValue(prop).trim();
        return [base, override];
      });
      expect(baseVal).not.toBe('');
      expect(overrideVal).not.toBe('');
      expect(overrideVal).not.toBe(baseVal);
    }

    await expect(page).toHaveScreenshot(`override-${scenario.name}.png`);
  });
}
