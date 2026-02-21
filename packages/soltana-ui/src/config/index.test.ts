import { describe, it, expect } from 'vitest';
import {
  registerTierValue,
  deregisterTierValue,
  VALID_THEMES,
  VALID_RELIEFS,
  VALID_FINISHES,
} from './validation.js';

describe('registerTierValue', () => {
  const tierArrays = {
    theme: VALID_THEMES,
    relief: VALID_RELIEFS,
    finish: VALID_FINISHES,
  } as const;

  it.each(['theme', 'relief', 'finish'] as const)(
    'registers a custom %s value and prevents duplication',
    (tier) => {
      const value = `custom-${tier}-${String(Date.now())}`;
      const arr = tierArrays[tier];
      const lengthBefore = arr.length;

      registerTierValue(tier, value);
      expect(arr).toContain(value);

      // Second registration does not duplicate
      registerTierValue(tier, value);
      expect(arr.filter((v) => v === value)).toHaveLength(1);
      expect(arr.length).toBe(lengthBefore + 1);

      deregisterTierValue(tier, value);
    }
  );

  it.each(['theme', 'relief', 'finish'] as const)('deregisters a custom %s value', (tier) => {
    const value = `deregister-${tier}-${String(Date.now())}`;
    const arr = tierArrays[tier];

    registerTierValue(tier, value);
    expect(arr).toContain(value);

    deregisterTierValue(tier, value);
    expect(arr).not.toContain(value);
  });

  it('registered value appears in VALID_RELIEFS', () => {
    const value = `registered-${String(Date.now())}`;

    registerTierValue('relief', value);

    expect(VALID_RELIEFS).toContain(value);

    deregisterTierValue('relief', value);
  });
});

describe('tier independence', () => {
  it.each([
    {
      changedTier: 'theme' as const,
      otherTiers: ['relief', 'finish'] as const,
      arrays: { theme: VALID_THEMES, relief: VALID_RELIEFS, finish: VALID_FINISHES },
    },
    {
      changedTier: 'relief' as const,
      otherTiers: ['theme', 'finish'] as const,
      arrays: { theme: VALID_THEMES, relief: VALID_RELIEFS, finish: VALID_FINISHES },
    },
    {
      changedTier: 'finish' as const,
      otherTiers: ['theme', 'relief'] as const,
      arrays: { theme: VALID_THEMES, relief: VALID_RELIEFS, finish: VALID_FINISHES },
    },
  ])('setting $changedTier preserves other tier values', ({ changedTier, otherTiers, arrays }) => {
    const timestamp = String(Date.now());
    const initialValues = {
      theme: `custom-theme-${timestamp}`,
      relief: `custom-relief-${timestamp}`,
      finish: `custom-finish-${timestamp}`,
    };
    const secondValue = `custom-${changedTier}-${timestamp}-2`;

    registerTierValue('theme', initialValues.theme);
    registerTierValue('relief', initialValues.relief);
    registerTierValue('finish', initialValues.finish);

    expect(arrays.theme).toContain(initialValues.theme);
    expect(arrays.relief).toContain(initialValues.relief);
    expect(arrays.finish).toContain(initialValues.finish);

    registerTierValue(changedTier, secondValue);

    expect(arrays[changedTier]).toContain(secondValue);
    expect(arrays[otherTiers[0]]).toContain(initialValues[otherTiers[0]]);
    expect(arrays[otherTiers[1]]).toContain(initialValues[otherTiers[1]]);

    deregisterTierValue('theme', initialValues.theme);
    deregisterTierValue('relief', initialValues.relief);
    deregisterTierValue('finish', initialValues.finish);
    deregisterTierValue(changedTier, secondValue);
  });
});

describe('tier interaction', () => {
  // Note: jsdom does not support getComputedStyle for CSS custom properties set via attribute selectors.
  // CSS custom property verification is covered by Playwright integration tests in tests/config/config-cascade.spec.ts.

  it('supports multiple tiers active simultaneously', async () => {
    const { initSoltana } = await import('../init.js');

    const instance = initSoltana({
      theme: 'dark',
      relief: 'neumorphic',
      finish: 'frosted',
    });

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-relief')).toBe('neumorphic');
    expect(document.documentElement.getAttribute('data-finish')).toBe('frosted');

    const state = instance.getState();
    expect(state.theme).toBe('dark');
    expect(state.relief).toBe('neumorphic');
    expect(state.finish).toBe('frosted');

    instance.destroy();
  });

  it('allows independent tier changes without interference', async () => {
    const { initSoltana } = await import('../init.js');

    const instance = initSoltana({
      theme: 'light',
      relief: 'flat',
      finish: 'matte',
    });

    instance.setTheme('sepia');

    expect(document.documentElement.getAttribute('data-theme')).toBe('sepia');
    expect(document.documentElement.getAttribute('data-relief')).toBe('flat');
    expect(document.documentElement.getAttribute('data-finish')).toBe('matte');

    let state = instance.getState();
    expect(state.theme).toBe('sepia');
    expect(state.relief).toBe('flat');
    expect(state.finish).toBe('matte');

    instance.setRelief('skeuomorphic');

    expect(document.documentElement.getAttribute('data-theme')).toBe('sepia');
    expect(document.documentElement.getAttribute('data-relief')).toBe('skeuomorphic');
    expect(document.documentElement.getAttribute('data-finish')).toBe('matte');

    state = instance.getState();
    expect(state.theme).toBe('sepia');
    expect(state.relief).toBe('skeuomorphic');
    expect(state.finish).toBe('matte');

    instance.destroy();
  });

  it('supports all tier combinations concurrently', async () => {
    const { initSoltana } = await import('../init.js');

    const themes = ['light', 'dark', 'sepia'];
    const reliefs = ['flat', 'glassmorphic', 'skeuomorphic', 'neumorphic'];
    const finishes = ['matte', 'frosted', 'tinted', 'glossy'];

    themes.forEach((theme) => {
      reliefs.forEach((relief) => {
        finishes.forEach((finish) => {
          const instance = initSoltana({ theme, relief, finish });

          expect(document.documentElement.getAttribute('data-theme')).toBe(theme);
          expect(document.documentElement.getAttribute('data-relief')).toBe(relief);
          expect(document.documentElement.getAttribute('data-finish')).toBe(finish);

          const state = instance.getState();
          expect(state.theme).toBe(theme);
          expect(state.relief).toBe(relief);
          expect(state.finish).toBe(finish);

          instance.destroy();
        });
      });
    });
  });
});

describe('per-element tier overrides', () => {
  it('supports per-element theme override with utility class', () => {
    document.documentElement.setAttribute('data-theme', 'dark');

    const element = document.createElement('div');
    element.classList.add('theme-light');
    document.body.appendChild(element);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(element.classList.contains('theme-light')).toBe(true);

    document.body.removeChild(element);
    document.documentElement.removeAttribute('data-theme');
  });

  it('supports per-element relief override with utility class', () => {
    document.documentElement.setAttribute('data-relief', 'flat');

    const element = document.createElement('div');
    element.classList.add('relief-neumorphic');
    document.body.appendChild(element);

    expect(document.documentElement.getAttribute('data-relief')).toBe('flat');
    expect(element.classList.contains('relief-neumorphic')).toBe(true);

    document.body.removeChild(element);
    document.documentElement.removeAttribute('data-relief');
  });

  it('supports per-element finish override with utility class', () => {
    document.documentElement.setAttribute('data-finish', 'matte');

    const element = document.createElement('div');
    element.classList.add('finish-glossy');
    document.body.appendChild(element);

    expect(document.documentElement.getAttribute('data-finish')).toBe('matte');
    expect(element.classList.contains('finish-glossy')).toBe(true);

    document.body.removeChild(element);
    document.documentElement.removeAttribute('data-finish');
  });

  it('supports multi-tier per-element overrides', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('data-relief', 'flat');
    document.documentElement.setAttribute('data-finish', 'matte');

    const element = document.createElement('div');
    element.classList.add('theme-light', 'relief-neumorphic', 'finish-glossy');
    document.body.appendChild(element);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-relief')).toBe('flat');
    expect(document.documentElement.getAttribute('data-finish')).toBe('matte');

    expect(element.classList.contains('theme-light')).toBe(true);
    expect(element.classList.contains('relief-neumorphic')).toBe(true);
    expect(element.classList.contains('finish-glossy')).toBe(true);

    document.body.removeChild(element);
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-relief');
    document.documentElement.removeAttribute('data-finish');
  });

  it('allows nested per-element overrides', () => {
    document.documentElement.setAttribute('data-theme', 'dark');

    const parent = document.createElement('div');
    parent.classList.add('theme-light');
    document.body.appendChild(parent);

    const child = document.createElement('div');
    child.classList.add('theme-sepia');
    parent.appendChild(child);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(parent.classList.contains('theme-light')).toBe(true);
    expect(child.classList.contains('theme-sepia')).toBe(true);

    document.body.removeChild(parent);
    document.documentElement.removeAttribute('data-theme');
  });
});
