// ---------------------------------------------------------------------------
// Tier Validation Registry
// ---------------------------------------------------------------------------
// Shared validation state for tier values. Extracted to its own module so
// both config/index.ts and config/register.ts can import without a cycle.
// ---------------------------------------------------------------------------

import {
  BUILT_IN_THEMES,
  BUILT_IN_RELIEFS,
  BUILT_IN_FINISHES,
  BUILT_IN_ORNAMENTS,
} from './types.js';
import type { TierName } from './types.js';

const _themes: string[] = [...BUILT_IN_THEMES, 'auto'];
const _reliefs: string[] = [...BUILT_IN_RELIEFS];
const _finishes: string[] = [...BUILT_IN_FINISHES];
const _ornaments: string[] = [...BUILT_IN_ORNAMENTS];

const TIER_REGISTRY: Record<TierName, string[]> = {
  theme: _themes,
  relief: _reliefs,
  finish: _finishes,
  ornament: _ornaments,
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

/**
 * Remove a custom tier value from the registry (e.g. on unregister).
 */
export function deregisterTierValue(tier: TierName, value: string): void {
  const arr = TIER_REGISTRY[tier];
  const index = arr.indexOf(value);
  if (index !== -1) {
    arr.splice(index, 1);
  }
}

export const VALID_THEMES: readonly string[] = _themes;
export const VALID_RELIEFS: readonly string[] = _reliefs;
export const VALID_FINISHES: readonly string[] = _finishes;
export const VALID_ORNAMENTS: readonly string[] = _ornaments;
