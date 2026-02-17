// ---------------------------------------------------------------------------
// Soltana Design System - Config Runtime
// ---------------------------------------------------------------------------
// initSoltana() sets data attributes on <html> to activate SCSS selector
// blocks for the chosen theme, relief, finish, and ornament.
// ---------------------------------------------------------------------------

import { BUILT_IN_THEMES, BUILT_IN_RELIEFS, BUILT_IN_FINISHES, BUILT_IN_ORNAMENTS } from './types';
import type {
  SoltanaConfig,
  SoltanaInstance,
  EnhancerCleanup,
  Theme,
  Relief,
  Finish,
  Ornament,
  RecipeName,
  Recipe,
  TierName,
  RegisterThemeOptions,
  RegisterReliefOptions,
  RegisterFinishOptions,
  RegisterOrnamentOptions,
  TierRegistration,
} from './types';
import { initAll } from '../enhancers/index.js';
import { loadSoltanaFonts } from '../fonts/index';
import { RECIPES, registerRecipe as addRecipe } from './recipes';
import {
  registerTheme as regTheme,
  registerRelief as regRelief,
  registerFinish as regFinish,
  registerOrnament as regOrnament,
} from './register';
import { teardown as teardownStylesheet } from './stylesheet';

const DEFAULT_CONFIG: SoltanaConfig = {
  theme: 'dark',
  relief: 'neu',
  finish: 'matte',
  ornament: 'none',
  fonts: false,
  enhancers: true,
  strict: false,
};

const VALID_THEMES: Theme[] = [...BUILT_IN_THEMES, 'auto'];
const VALID_RELIEFS: Relief[] = [...BUILT_IN_RELIEFS];
const VALID_FINISHES: Finish[] = [...BUILT_IN_FINISHES];
const VALID_ORNAMENTS: Ornament[] = [...BUILT_IN_ORNAMENTS];

/**
 * Register a custom tier value so `strict` mode does not warn for it.
 * Call before `initSoltana()` or at any point before the value is used.
 */
export function registerTierValue(tier: TierName, value: string): void {
  const registry: Record<TierName, string[]> = {
    theme: VALID_THEMES,
    relief: VALID_RELIEFS,
    finish: VALID_FINISHES,
    ornament: VALID_ORNAMENTS,
  };
  const arr = registry[tier];
  if (!arr.includes(value)) {
    arr.push(value);
  }
}

// Module-level state for matchMedia listener cleanup
let _mql: MediaQueryList | null = null;
let _mqlHandler: (() => void) | null = null;

// Module-level state for enhancer cleanup
let _enhancerCleanup: EnhancerCleanup | null = null;

function resolveTheme(theme: Theme): string {
  if (theme !== 'auto') return theme;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyOrnament(ornament: Ornament): void {
  document.documentElement.setAttribute('data-ornament', ornament);
}

function applyOverrides(overrides: Record<string, string>, strict: boolean): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(overrides)) {
    if (!key.startsWith('--')) {
      console.warn(
        `[soltana] Override key "${key}" is not a CSS custom property (must start with "--")`
      );
      if (strict) continue;
    }
    root.style.setProperty(key, value);
  }
}

function applyConfig(state: SoltanaConfig): void {
  const root = document.documentElement;

  root.setAttribute('data-theme', resolveTheme(state.theme));
  root.setAttribute('data-relief', state.relief);
  root.setAttribute('data-finish', state.finish);
  applyOrnament(state.ornament);

  if (state.overrides) {
    applyOverrides(state.overrides, !!state.strict);
  }
}

function teardownAutoTheme(): void {
  if (_mql && _mqlHandler) {
    _mql.removeEventListener('change', _mqlHandler);
  }
  _mql = null;
  _mqlHandler = null;
}

function setupAutoTheme(state: SoltanaConfig): void {
  teardownAutoTheme();

  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function' ||
    state.theme !== 'auto'
  ) {
    return;
  }

  _mql = window.matchMedia('(prefers-color-scheme: light)');
  _mqlHandler = () => {
    if (state.theme === 'auto') {
      document.documentElement.setAttribute('data-theme', resolveTheme('auto'));
    }
  };
  _mql.addEventListener('change', _mqlHandler);
}

function warnInvalid(name: string, value: string, valid: readonly string[], strict: boolean): void {
  if (strict && !valid.includes(value)) {
    console.warn(`[soltana] Unknown ${name} "${value}". Built-in options: ${valid.join(', ')}`);
  }
}

function resetEnhancers(state: SoltanaConfig): void {
  if (_enhancerCleanup) {
    _enhancerCleanup.destroy();
    _enhancerCleanup = null;
  }
  if (state.enhancers !== false) {
    _enhancerCleanup = initAll();
  }
}

function dispatchChange(type: string, value: unknown): void {
  document.documentElement.dispatchEvent(
    new CustomEvent('soltana:change', { detail: { type, value } })
  );
}

/**
 * Initialize the Soltana design system.
 * Sets data attributes on <html> to activate SCSS theme/relief/finish/
 * ornament selectors.
 */
export function initSoltana(userConfig: Partial<SoltanaConfig> = {}): SoltanaInstance {
  const state: SoltanaConfig = { ...DEFAULT_CONFIG, ...userConfig };

  // Validate config values (only in strict mode)
  warnInvalid('theme', state.theme, VALID_THEMES, !!state.strict);
  warnInvalid('relief', state.relief, VALID_RELIEFS, !!state.strict);
  warnInvalid('finish', state.finish, VALID_FINISHES, !!state.strict);
  warnInvalid('ornament', state.ornament, VALID_ORNAMENTS, !!state.strict);

  // Load Google Fonts when opted in
  if (state.fonts === true) {
    loadSoltanaFonts();
  }

  applyConfig(state);
  setupAutoTheme(state);

  resetEnhancers(state);

  // Track runtime registrations for cleanup
  const registrations: TierRegistration[] = [];

  // Internal setters (closure-captured, safe to destructure from the instance)
  function setTheme(theme: Theme): void {
    warnInvalid('theme', theme, VALID_THEMES, !!state.strict);
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', resolveTheme(theme));
    setupAutoTheme(state);
    dispatchChange('theme', theme);
  }

  function setRelief(relief: Relief): void {
    warnInvalid('relief', relief, VALID_RELIEFS, !!state.strict);
    state.relief = relief;
    document.documentElement.setAttribute('data-relief', relief);
    dispatchChange('relief', relief);
  }

  function setFinish(finish: Finish): void {
    warnInvalid('finish', finish, VALID_FINISHES, !!state.strict);
    state.finish = finish;
    document.documentElement.setAttribute('data-finish', finish);
    dispatchChange('finish', finish);
  }

  function setOrnament(ornament: Ornament): void {
    warnInvalid('ornament', ornament, VALID_ORNAMENTS, !!state.strict);
    state.ornament = ornament;
    applyOrnament(ornament);
    dispatchChange('ornament', ornament);
  }

  return {
    getState(): SoltanaConfig {
      return { ...state };
    },

    setTheme,
    setRelief,
    setFinish,
    setOrnament,

    applyRecipe(recipeName: RecipeName): void {
      if (!(recipeName in RECIPES)) {
        console.warn(
          `[soltana] Unknown recipe "${recipeName}". Available: ${Object.keys(RECIPES).join(', ')}`
        );
        return;
      }
      const recipe = RECIPES[recipeName];
      setTheme(recipe.theme);
      setRelief(recipe.relief);
      setFinish(recipe.finish);
      setOrnament(recipe.ornament);
    },

    registerRecipe(name: string, recipe: Recipe): void {
      addRecipe(name, recipe);
    },

    setOverrides(overrides: Record<string, string>): void {
      state.overrides = { ...state.overrides, ...overrides };
      applyOverrides(overrides, !!state.strict);
      dispatchChange('overrides', overrides);
    },

    removeOverrides(keys: string[]): void {
      const root = document.documentElement;
      for (const key of keys) {
        root.style.removeProperty(key);
      }
      if (state.overrides) {
        const remaining = Object.fromEntries(
          Object.entries(state.overrides).filter(([k]) => !keys.includes(k))
        );
        state.overrides = remaining;
      }
      dispatchChange('overrides', null);
    },

    registerTheme(name: string, options: RegisterThemeOptions): TierRegistration {
      const reg = regTheme(name, options);
      registrations.push(reg);
      return reg;
    },

    registerRelief(name: string, options: RegisterReliefOptions): TierRegistration {
      const reg = regRelief(name, options);
      registrations.push(reg);
      return reg;
    },

    registerFinish(name: string, options: RegisterFinishOptions): TierRegistration {
      const reg = regFinish(name, options);
      registrations.push(reg);
      return reg;
    },

    registerOrnament(name: string, options: RegisterOrnamentOptions): TierRegistration {
      const reg = regOrnament(name, options);
      registrations.push(reg);
      return reg;
    },

    reinit(): void {
      resetEnhancers(state);
    },

    reset(): void {
      for (const reg of registrations.splice(0)) {
        reg.unregister();
      }
      teardownStylesheet();
      Object.assign(state, DEFAULT_CONFIG);
      state.overrides = {};
      teardownAutoTheme();
      document.documentElement.removeAttribute('style');
      applyConfig(state);
      resetEnhancers(state);
      dispatchChange('reset', null);
    },

    destroy(): void {
      for (const reg of registrations.splice(0)) {
        reg.unregister();
      }
      teardownStylesheet();
      teardownAutoTheme();
      if (_enhancerCleanup) {
        _enhancerCleanup.destroy();
        _enhancerCleanup = null;
      }
      const root = document.documentElement;
      root.removeAttribute('data-theme');
      root.removeAttribute('data-relief');
      root.removeAttribute('data-finish');
      root.removeAttribute('style');
      root.removeAttribute('data-ornament');
    },
  };
}

export type {
  SoltanaConfig,
  SoltanaInstance,
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
} from './types';
export { RECIPES, getRecipeNames } from './recipes';
export { VALID_THEMES, VALID_RELIEFS, VALID_FINISHES, VALID_ORNAMENTS };
