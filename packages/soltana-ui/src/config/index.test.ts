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

    // Verify the value is in the validation array (which is what warnInvalid checks)
    expect(VALID_RELIEFS).toContain(value);

    deregisterTierValue('relief', value);
  });
});
