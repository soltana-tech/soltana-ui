// ---------------------------------------------------------------------------
// Tier Validation Registry
// ---------------------------------------------------------------------------
// Shared validation state for tier values. Extracted to its own module so
// both config/index.ts and config/register.ts can import without a cycle.
// ---------------------------------------------------------------------------

import { BUILT_IN_THEMES, BUILT_IN_RELIEFS, BUILT_IN_FINISHES } from './types.js';
import type { TierName } from './types.js';

const _themes: string[] = [...BUILT_IN_THEMES, 'auto'];
const _reliefs: string[] = [...BUILT_IN_RELIEFS];
const _finishes: string[] = [...BUILT_IN_FINISHES];

const TIER_REGISTRY: Record<TierName, string[]> = {
  theme: _themes,
  relief: _reliefs,
  finish: _finishes,
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

/**
 * Live registry of valid theme values. Includes built-in themes, 'auto', and
 * any values added at runtime via `registerTierValue()` or `registerTheme()`.
 */
export const VALID_THEMES: readonly string[] = _themes;

/**
 * Live registry of valid relief values. Includes built-in reliefs and any
 * values added at runtime via `registerTierValue()` or `registerRelief()`.
 */
export const VALID_RELIEFS: readonly string[] = _reliefs;

/**
 * Live registry of valid finish values. Includes built-in finishes and any
 * values added at runtime via `registerTierValue()` or `registerFinish()`.
 */
export const VALID_FINISHES: readonly string[] = _finishes;
