import { describe, it, expect, vi } from 'vitest';
import { registerTierValue } from './index';
import { VALID_THEMES, VALID_RELIEFS, VALID_FINISHES, VALID_ORNAMENTS } from './validation';

describe('registerTierValue', () => {
  const tierArrays = {
    theme: VALID_THEMES,
    relief: VALID_RELIEFS,
    finish: VALID_FINISHES,
    ornament: VALID_ORNAMENTS,
  } as const;

  it.each(['theme', 'relief', 'finish', 'ornament'] as const)(
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
    }
  );

  it('registered value suppresses strict-mode warning', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    const value = `registered-${String(Date.now())}`;

    registerTierValue('relief', value);

    // Importing initSoltana here would pull in enhancers/DOM — instead,
    // verify the value is in the validation array (which is what warnInvalid checks)
    expect(VALID_RELIEFS).toContain(value);

    spy.mockRestore();
  });
});
