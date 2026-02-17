// ---------------------------------------------------------------------------
// Tier Validation Registry
// ---------------------------------------------------------------------------
// Shared validation state for tier values. Extracted to its own module so
// both config/index.ts and config/register.ts can import without a cycle.
// ---------------------------------------------------------------------------

import { BUILT_IN_THEMES, BUILT_IN_RELIEFS, BUILT_IN_FINISHES, BUILT_IN_ORNAMENTS } from './types';
import type { Theme, Relief, Finish, Ornament, TierName } from './types';

const VALID_THEMES: Theme[] = [...BUILT_IN_THEMES, 'auto'];
const VALID_RELIEFS: Relief[] = [...BUILT_IN_RELIEFS];
const VALID_FINISHES: Finish[] = [...BUILT_IN_FINISHES];
const VALID_ORNAMENTS: Ornament[] = [...BUILT_IN_ORNAMENTS];

const TIER_REGISTRY: Record<TierName, string[]> = {
  theme: VALID_THEMES,
  relief: VALID_RELIEFS,
  finish: VALID_FINISHES,
  ornament: VALID_ORNAMENTS,
};

/**
 * Register a custom tier value so `strict` mode does not warn for it.
 * Call before `initSoltana()` or at any point before the value is used.
 */
export function registerTierValue(tier: TierName, value: string): void {
  const arr = TIER_REGISTRY[tier];
  if (!arr.includes(value)) {
    arr.push(value);
  }
}

export { VALID_THEMES, VALID_RELIEFS, VALID_FINISHES, VALID_ORNAMENTS };
