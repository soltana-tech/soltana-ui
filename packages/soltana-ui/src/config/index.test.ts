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
  it('setting theme preserves relief and finish values', () => {
    registerTierValue('theme', 'custom-theme-a');
    registerTierValue('relief', 'custom-relief-a');
    registerTierValue('finish', 'custom-finish-a');

    expect(VALID_THEMES).toContain('custom-theme-a');
    expect(VALID_RELIEFS).toContain('custom-relief-a');
    expect(VALID_FINISHES).toContain('custom-finish-a');

    registerTierValue('theme', 'custom-theme-b');

    expect(VALID_THEMES).toContain('custom-theme-b');
    expect(VALID_RELIEFS).toContain('custom-relief-a');
    expect(VALID_FINISHES).toContain('custom-finish-a');

    deregisterTierValue('theme', 'custom-theme-a');
    deregisterTierValue('theme', 'custom-theme-b');
    deregisterTierValue('relief', 'custom-relief-a');
    deregisterTierValue('finish', 'custom-finish-a');
  });

  it('setting relief preserves theme and finish values', () => {
    registerTierValue('theme', 'custom-theme-c');
    registerTierValue('relief', 'custom-relief-b');
    registerTierValue('finish', 'custom-finish-b');

    expect(VALID_THEMES).toContain('custom-theme-c');
    expect(VALID_RELIEFS).toContain('custom-relief-b');
    expect(VALID_FINISHES).toContain('custom-finish-b');

    registerTierValue('relief', 'custom-relief-c');

    expect(VALID_THEMES).toContain('custom-theme-c');
    expect(VALID_RELIEFS).toContain('custom-relief-c');
    expect(VALID_FINISHES).toContain('custom-finish-b');

    deregisterTierValue('theme', 'custom-theme-c');
    deregisterTierValue('relief', 'custom-relief-b');
    deregisterTierValue('relief', 'custom-relief-c');
    deregisterTierValue('finish', 'custom-finish-b');
  });

  it('setting finish preserves theme and relief values', () => {
    registerTierValue('theme', 'custom-theme-d');
    registerTierValue('relief', 'custom-relief-d');
    registerTierValue('finish', 'custom-finish-c');

    expect(VALID_THEMES).toContain('custom-theme-d');
    expect(VALID_RELIEFS).toContain('custom-relief-d');
    expect(VALID_FINISHES).toContain('custom-finish-c');

    registerTierValue('finish', 'custom-finish-d');

    expect(VALID_THEMES).toContain('custom-theme-d');
    expect(VALID_RELIEFS).toContain('custom-relief-d');
    expect(VALID_FINISHES).toContain('custom-finish-d');

    deregisterTierValue('theme', 'custom-theme-d');
    deregisterTierValue('relief', 'custom-relief-d');
    deregisterTierValue('finish', 'custom-finish-c');
    deregisterTierValue('finish', 'custom-finish-d');
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
