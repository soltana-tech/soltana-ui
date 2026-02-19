import type { TierName } from 'soltana-ui';

/** Per-sandbox tier state. null = inherit from global (document-level) setting. */
export interface SandboxState {
  theme: string | null;
  relief: string | null;
  finish: string | null;
}

export function createDefaultState(): SandboxState {
  return { theme: null, relief: null, finish: null };
}

/**
 * Convert sandbox state to a space-separated string of utility classes.
 * Only non-null tiers produce classes (e.g. `"relief-skeuomorphic finish-frosted"`).
 */
export function stateToClasses(state: SandboxState): string {
  const parts: string[] = [];
  if (state.theme) parts.push(`theme-${state.theme}`);
  if (state.relief) parts.push(`relief-${state.relief}`);
  if (state.finish) parts.push(`finish-${state.finish}`);
  return parts.join(' ');
}

/** Serialize non-null tier values into URLSearchParams. */
export function serializeState(state: SandboxState): URLSearchParams {
  const params = new URLSearchParams();
  const tiers: TierName[] = ['theme', 'relief', 'finish'];
  for (const tier of tiers) {
    const value = state[tier];
    if (value) params.set(tier, value);
  }
  return params;
}

/** Deserialize URLSearchParams into a SandboxState. */
export function deserializeState(params: URLSearchParams): Partial<SandboxState> {
  const state: Partial<SandboxState> = {};
  const tiers: TierName[] = ['theme', 'relief', 'finish'];
  for (const tier of tiers) {
    const value = params.get(tier);
    if (value) state[tier] = value;
  }
  return state;
}
