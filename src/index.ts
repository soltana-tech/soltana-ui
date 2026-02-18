import './styles/index.scss';

// Configuration runtime
export { initSoltana, registerTierValue, deregisterTierValue } from './config/index.js';
export {
  BUILT_IN_THEMES,
  BUILT_IN_RELIEFS,
  BUILT_IN_FINISHES,
  BUILT_IN_ORNAMENTS,
} from './config/types.js';
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
} from './config/types.js';

// Recipe presets
export { RECIPES } from './config/recipes.js';

// Enhancer initializers
export {
  initModals,
  initTabs,
  initTooltips,
  initAll,
  MODAL_SELECTOR,
  MODAL_OPEN_SELECTOR,
  TABS_SELECTOR,
  TOOLTIP_SELECTOR,
} from './enhancers/index.js';

// Font loading
export { loadSoltanaFonts, DEFAULT_FONT_URL } from './fonts/index.js';

// SVG ornament pattern utilities
export { patterns, toDataUri, toElement } from './ornaments/patterns.js';
export type { PatternName } from './ornaments/patterns.js';

export const version = '1.0.0';
