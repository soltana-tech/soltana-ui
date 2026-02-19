// ---------------------------------------------------------------------------
// Config Barrel
// ---------------------------------------------------------------------------
// Pure data, types, and validation. Orchestration lives in src/init.ts.
// ---------------------------------------------------------------------------

export { registerTierValue } from './validation.js';
export { VALID_THEMES, VALID_RELIEFS, VALID_FINISHES } from './validation.js';

export { BUILT_IN_THEMES, BUILT_IN_RELIEFS, BUILT_IN_FINISHES } from './types.js';
export type {
  SoltanaConfig,
  SoltanaInitOptions,
  SoltanaInstance,
  EnhancerCleanup,
  EnhancerOptions,
  Theme,
  Relief,
  Finish,
  BuiltInTheme,
  BuiltInRelief,
  BuiltInFinish,
  TierName,
  SoltanaChangeType,
  ThemeSeed,
  RegisterThemeOptions,
  RegisterReliefOptions,
  RegisterFinishOptions,
  TierRegistration,
} from './types.js';
