import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { getComputedCSSProperty } from '../fixtures/helpers';

test.describe('per-element utility class overrides', () => {
  const cardHTML = `
    <div id="parent-card" class="card" style="width: 280px;">
      <div class="card-body">Parent card</div>
    </div>
    <div id="child-card" class="theme-light card" style="width: 280px;">
      <div class="card-body">Child card with theme-light</div>
    </div>`;

  test('.theme-* class applies theme tokens to a child element', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: cardHTML });
    await page.evaluate(() => window.SoltanaUI.initSoltana({ theme: 'dark' }));

    const parentBg = await getComputedCSSProperty(page, '--surface-bg', '#parent-card');
    const childBg = await getComputedCSSProperty(page, '--surface-bg', '#child-card');

    // The .theme-light card should receive different surface-bg tokens than the dark parent
    expect(parentBg).not.toBe('');
    expect(childBg).not.toBe('');
    expect(parentBg).not.toBe(childBg);

    // The light theme child's surface-bg should match the built-in light theme value
    const lightThemeBg = await getComputedCSSProperty(page, '--surface-bg', '.theme-light');
    expect(lightThemeBg).toBe(childBg);
  });

  test('.relief-* class applies relief tokens to a child element', async ({ page }) => {
    const html = `
      <div id="parent-card" class="card" style="width: 280px;">
        <div class="card-body">Parent (neu)</div>
      </div>
      <div id="child-card" class="relief-flat card" style="width: 280px;">
        <div class="card-body">Child (flat)</div>
      </div>`;

    await setupSoltanaPage(page, { bodyHTML: html });
    await page.evaluate(() =>
      window.SoltanaUI.initSoltana({ theme: 'dark', relief: 'neumorphic' })
    );

    const parentShadow = await getComputedCSSProperty(page, '--relief-shadow', '#parent-card');
    const childShadow = await getComputedCSSProperty(page, '--relief-shadow', '#child-card');

    // The .relief-flat card should have different shadow tokens than the neu parent
    expect(parentShadow).not.toBe('');
    expect(childShadow).not.toBe('');
    expect(parentShadow).not.toBe(childShadow);
  });

  test('.finish-* class applies finish tokens to a child element', async ({ page }) => {
    const html = `
      <div id="parent-card" class="card" style="width: 280px;">
        <div class="card-body">Parent (matte)</div>
      </div>
      <div id="child-card" class="finish-frosted card" style="width: 280px;">
        <div class="card-body">Child (frosted)</div>
      </div>`;

    await setupSoltanaPage(page, { bodyHTML: html });
    await page.evaluate(() => window.SoltanaUI.initSoltana({ theme: 'dark', finish: 'matte' }));

    const parentBlur = await getComputedCSSProperty(page, '--finish-blur', '#parent-card');
    const childBlur = await getComputedCSSProperty(page, '--finish-blur', '#child-card');

    // The .finish-frosted card should have different blur tokens than the matte parent
    expect(parentBlur).not.toBe('');
    expect(childBlur).not.toBe('');
    expect(parentBlur).not.toBe(childBlur);
  });

  test('.ornament-* class applies ornament tokens to a child element', async ({ page }) => {
    const html = `
      <div id="parent-card" class="card" style="width: 280px;">
        <div class="card-body">Parent (none)</div>
      </div>
      <div id="child-card" class="ornament-gilt card" style="width: 280px;">
        <div class="card-body">Child (gilt)</div>
      </div>`;

    await setupSoltanaPage(page, { bodyHTML: html });
    await page.evaluate(() => window.SoltanaUI.initSoltana({ theme: 'dark', ornament: 'none' }));

    const childHasClass = await page.evaluate(() =>
      document.getElementById('child-card')?.classList.contains('ornament-gilt')
    );
    expect(childHasClass).toBe(true);

    // Ornament tiers define --ornament-* tokens, not --accent-* tokens.
    // .ornament-gilt sets --ornament-frame-inner-display: block;
    // .ornament-none does not set it, so parent inherits no value.
    const parentVal = await getComputedCSSProperty(
      page,
      '--ornament-frame-inner-display',
      '#parent-card'
    );
    const childVal = await getComputedCSSProperty(
      page,
      '--ornament-frame-inner-display',
      '#child-card'
    );

    // The child with .ornament-gilt should have 'block'; parent should not
    expect(childVal.trim()).toBe('block');
    expect(parentVal.trim()).not.toBe('block');
  });
});
