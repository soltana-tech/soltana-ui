import './styles/index.scss';

// Orchestrator
export { initSoltana, DEFAULT_STATE } from './init.js';

// Config: types, constants, validation, recipes
export { registerTierValue, deregisterTierValue } from './config/index.js';
export {
  BUILT_IN_THEMES,
  BUILT_IN_RELIEFS,
  BUILT_IN_FINISHES,
  BUILT_IN_ORNAMENTS,
} from './config/index.js';
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
} from './config/index.js';
export { RECIPES } from './config/index.js';

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
export { patterns, toDataUri, toElement } from './ornaments/index.js';
export type { PatternName } from './ornaments/index.js';

declare const __SOLTANA_VERSION__: string;
export const version: string =
  typeof __SOLTANA_VERSION__ !== 'undefined' ? __SOLTANA_VERSION__ : '0.0.0-dev';
