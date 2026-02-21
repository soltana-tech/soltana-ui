import './styles/index.scss';

/*
 * Public API Exports
 *
 * Tier 1: Core API
 *   - initSoltana: Primary orchestrator function
 *   - Configuration types and interfaces (SoltanaConfig, SoltanaInitOptions, etc.)
 *
 * Tier 2: Enhancer API
 *   - Enhancer init functions (initModals, initTabs, initTooltips, etc.)
 *   - Selector constants for component discovery (MODAL_SELECTOR, TABS_SELECTOR, etc.)
 *   - Toast helper functions (showToast, dismissToast)
 *
 * Tier 3: Constants
 *   - BUILT_IN_* constants (THEMES, RELIEFS, FINISHES) - available tier options
 *   - VALID_* constants - exported for advanced consumers and testing
 *   - DEFAULT_STATE - exported for advanced consumers and testing
 *
 * Tier 4: Utilities
 *   - loadSoltanaFonts: Google Fonts loader with preconnect hints
 *   - version: Package version string injected at build time
 */

// Orchestrator
export { initSoltana, DEFAULT_STATE } from './init.js';

// Config: types, constants, validation
export { BUILT_IN_THEMES, BUILT_IN_RELIEFS, BUILT_IN_FINISHES } from './config/index.js';

/** Advanced exports for runtime validation, testing, and custom integrations. */
export { VALID_THEMES, VALID_RELIEFS, VALID_FINISHES } from './config/index.js';
export type {
  SoltanaConfig,
  SoltanaInitOptions,
  SoltanaInstance,
  SoltanaChangeDetail,
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
} from './config/index.js';

// Enhancer initializers
export {
  initModals,
  initTabs,
  initTooltips,
  initAccordions,
  initDropdowns,
  initDrawers,
  initToasts,
  showToast,
  dismissToast,
  initCollapsibles,
  initComboboxes,
  initHoverCards,
  initContextMenus,
  initCarousels,
  initScrollAreas,
  initDatePickers,
  initColorPickers,
  initTrees,
  initAll,
  MODAL_SELECTOR,
  MODAL_OPEN_SELECTOR,
  TABS_SELECTOR,
  TOOLTIP_SELECTOR,
  ACCORDION_SELECTOR,
  DROPDOWN_SELECTOR,
  DRAWER_SELECTOR,
  DRAWER_OPEN_SELECTOR,
  TOAST_CONTAINER_SELECTOR,
  COLLAPSIBLE_SELECTOR,
  COMBOBOX_SELECTOR,
  HOVER_CARD_SELECTOR,
  CONTEXT_MENU_SELECTOR,
  CAROUSEL_SELECTOR,
  SCROLL_AREA_SELECTOR,
  DATE_PICKER_SELECTOR,
  COLOR_PICKER_SELECTOR,
  TREE_SELECTOR,
} from './enhancers/index.js';
export type { ToastOptions, ToastType, ToastPosition } from './enhancers/index.js';

// Font loading
export { loadSoltanaFonts, DEFAULT_FONT_URL } from './fonts/index.js';

declare const __SOLTANA_VERSION__: string;
export const version: string =
  typeof __SOLTANA_VERSION__ !== 'undefined' ? __SOLTANA_VERSION__ : '0.0.0-dev';
