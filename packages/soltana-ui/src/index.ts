import './styles/index.scss';

// Orchestrator
export { initSoltana, DEFAULT_STATE } from './init.js';

// Config: types, constants, validation
export { registerTierValue } from './config/index.js';
export { BUILT_IN_THEMES, BUILT_IN_RELIEFS, BUILT_IN_FINISHES } from './config/index.js';
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
  ThemeSeed,
  RegisterThemeOptions,
  RegisterReliefOptions,
  RegisterFinishOptions,
  TierRegistration,
} from './config/index.js';

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

declare const __SOLTANA_VERSION__: string;
export const version: string =
  typeof __SOLTANA_VERSION__ !== 'undefined' ? __SOLTANA_VERSION__ : '0.0.0-dev';
