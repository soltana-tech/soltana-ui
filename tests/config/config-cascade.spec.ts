import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { getComputedCSSProperty } from '../fixtures/helpers';
import { singleAxis } from '../fixtures/combinations';

test.describe('multi-tier cascade integration', () => {
  for (const combo of singleAxis()) {
    test(`combo ${combo.theme}/${combo.relief}/${combo.finish} resolves key tokens`, async ({
      page,
    }) => {
      await setupSoltanaPage(page);
      await page.evaluate((cfg) => {
        const s = window.SoltanaUI.initSoltana();
        s.setTheme(cfg.theme);
        s.setRelief(cfg.relief);
        s.setFinish(cfg.finish);
      }, combo);

      // Relief tokens should resolve to non-empty values
      const reliefShadow = await getComputedCSSProperty(page, '--relief-shadow');
      expect(reliefShadow).not.toBe('');

      // Finish tokens should resolve to non-empty values
      const finishBlur = await getComputedCSSProperty(page, '--finish-blur');
      expect(finishBlur).not.toBe('');

      // Theme surface token should resolve to non-empty value
      const surfaceBg = await getComputedCSSProperty(page, '--surface-bg');
      expect(surfaceBg).not.toBe('');
    });
  }

  test('all three tiers contribute independently to computed styles', async ({ page }) => {
    await setupSoltanaPage(page);

    // Apply a known combination where all tiers produce distinct tokens
    await page.evaluate(() => {
      window.SoltanaUI.initSoltana({
        theme: 'dark',
        relief: 'skeuomorphic',
        finish: 'frosted',
      });
    });

    const surfaceBg = await getComputedCSSProperty(page, '--surface-bg');
    const reliefShadow = await getComputedCSSProperty(page, '--relief-shadow');
    const finishBlur = await getComputedCSSProperty(page, '--finish-blur');

    // Each tier's tokens should be present and non-empty
    expect(surfaceBg).not.toBe('');
    expect(reliefShadow).not.toBe('');
    expect(finishBlur).not.toBe('');
  });

  test('switching one tier does not affect tokens from other tiers', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      window.SoltanaUI.initSoltana({
        theme: 'dark',
        relief: 'skeuomorphic',
        finish: 'frosted',
      });
    });

    const reliefBefore = await getComputedCSSProperty(page, '--relief-shadow');
    const finishBefore = await getComputedCSSProperty(page, '--finish-blur');

    // Switch only theme
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({
        theme: 'dark',
        relief: 'skeuomorphic',
        finish: 'frosted',
      });
      s.setTheme('light');
    });

    const reliefAfter = await getComputedCSSProperty(page, '--relief-shadow');
    const finishAfter = await getComputedCSSProperty(page, '--finish-blur');

    // Relief and finish tokens should not change when only theme changes
    expect(reliefAfter).toBe(reliefBefore);
    expect(finishAfter).toBe(finishBefore);
  });
});
