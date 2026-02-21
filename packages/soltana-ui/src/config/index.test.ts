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

describe('per-element tier overrides', () => {
  it.skip('are CSS-only and tested in E2E', () => {
    /**
     * Per-element tier overrides (.theme-*, .relief-*, .finish-* utility classes)
     * are purely CSS-driven and do not interact with the config/validation layer.
     * The config module handles global tier registration and validation, while
     * per-element overrides apply tier values to specific DOM elements via CSS
     * selectors. E2E tests in tests/element-overrides.spec.ts verify this behavior.
     */
  });
});
