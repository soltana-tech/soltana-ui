// ---------------------------------------------------------------------------
// Config Barrel
// ---------------------------------------------------------------------------
// Pure data, types, and validation. Orchestration lives in src/init.ts.
// ---------------------------------------------------------------------------

export { registerTierValue, deregisterTierValue } from './validation.js';
export { VALID_THEMES, VALID_RELIEFS, VALID_FINISHES, VALID_ORNAMENTS } from './validation.js';

export {
  BUILT_IN_THEMES,
  BUILT_IN_RELIEFS,
  BUILT_IN_FINISHES,
  BUILT_IN_ORNAMENTS,
} from './types.js';
export type {
  SoltanaConfig,
  SoltanaInitOptions,
  SoltanaInstance,
  EnhancerCleanup,
  EnhancerOptions,
  Theme,
  Relief,
  Finish,
  Ornament,
  RecipeName,
  Recipe,
  BuiltInTheme,
  BuiltInRelief,
  BuiltInFinish,
  BuiltInOrnament,
  BuiltInRecipeName,
  TierName,
  ThemeSeed,
  RegisterThemeOptions,
  RegisterReliefOptions,
  RegisterFinishOptions,
  RegisterOrnamentOptions,
  TierRegistration,
} from './types.js';

export { RECIPES, registerRecipe } from './recipes.js';

export { registerTheme, registerRelief, registerFinish, registerOrnament } from './register.js';

export { insertRule, removeRules, teardown } from './stylesheet.js';
