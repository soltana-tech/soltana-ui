// ---------------------------------------------------------------------------
// Soltana Design System — Orchestrator
// ---------------------------------------------------------------------------
// initSoltana() sets data attributes on <html> to activate SCSS selector
// blocks for the chosen theme, relief, and finish. Coordinates config,
// validation, registration, enhancers, and the managed stylesheet.
// ---------------------------------------------------------------------------

import { VALID_THEMES, VALID_RELIEFS, VALID_FINISHES } from './config/validation.js';
import type {
  SoltanaConfig,
  SoltanaInitOptions,
  SoltanaInstance,
  SoltanaChangeType,
  EnhancerCleanup,
  Theme,
  Relief,
  Finish,
  RegisterThemeOptions,
  RegisterReliefOptions,
  RegisterFinishOptions,
  TierRegistration,
} from './config/types.js';
import { initAll } from './enhancers/index.js';
import {
  registerTheme as regTheme,
  registerRelief as regRelief,
  registerFinish as regFinish,
} from './config/register.js';
import { teardown as teardownStylesheet } from './config/stylesheet.js';
import { _resetFontLoader } from './fonts/index.js';

/** Default tier configuration used when no overrides are provided. */
export const DEFAULT_STATE: Readonly<SoltanaConfig> = Object.freeze({
  theme: 'auto',
  relief: 'neumorphic',
  finish: 'matte',
  overrides: {},
});

const DEFAULT_INIT: Required<SoltanaInitOptions> = {
  enhancers: false,
  strict: false,
};

// Module-level state for matchMedia listener cleanup
let _mql: MediaQueryList | null = null;
let _mqlHandler: (() => void) | null = null;

// Module-level state for enhancer cleanup
let _enhancerCleanup: EnhancerCleanup | null = null;

// Generation counter for stale-instance detection
let _generation = 0;

function validateOverrideKey(key: string, strict: boolean): boolean {
  if (key.startsWith('--')) return true;
  const msg = `[soltana] Override key "${key}" is not a CSS custom property (must start with "--")`;
  if (strict) throw new Error(msg);
  console.error(msg);
  return false;
}

function resolveTheme(theme: Theme): string {
  if (theme !== 'auto') return theme;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyOverrides(overrides: Record<string, string>): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(overrides)) {
    root.style.setProperty(key, value);
  }
}

function applyConfig(state: SoltanaConfig): void {
  const root = document.documentElement;

  root.setAttribute('data-theme', resolveTheme(state.theme));
  root.setAttribute('data-relief', state.relief);
  root.setAttribute('data-finish', state.finish);

  applyOverrides(state.overrides);
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
  if (!valid.includes(value)) {
    const msg = `[soltana] Unknown ${name} "${value}". Built-in options: ${valid.join(', ')}`;
    if (strict) throw new Error(msg);
    console.warn(msg);
  }
}

function resetEnhancers(enhancers: boolean): void {
  if (_enhancerCleanup) {
    try {
      _enhancerCleanup.destroy();
    } finally {
      _enhancerCleanup = null;
    }
  }
  if (enhancers) {
    _enhancerCleanup = initAll();
  }
}

function dispatchChange(type: SoltanaChangeType, value: unknown): void {
  document.documentElement.dispatchEvent(
    new CustomEvent('soltana:change', { detail: { type, value } })
  );
}

/**
 * Initialize the Soltana design system.
 * Sets data attributes on <html> to activate SCSS theme/relief/finish selectors.
 */
export function initSoltana(
  userConfig: Partial<SoltanaConfig & SoltanaInitOptions> = {}
): SoltanaInstance {
  _generation++;
  const myGen = _generation;

  const { enhancers, strict, ...stateOverrides } = userConfig;
  const state: SoltanaConfig = { ...DEFAULT_STATE, ...stateOverrides };
  const initOpts: Required<SoltanaInitOptions> = {
    enhancers: enhancers ?? DEFAULT_INIT.enhancers,
    strict: strict ?? DEFAULT_INIT.strict,
  };

  // Filter invalid override keys from initial config
  state.overrides = Object.fromEntries(
    Object.entries(state.overrides).filter(([key]) => validateOverrideKey(key, initOpts.strict))
  );

  // Validate config values (throws in strict mode, warns otherwise)
  warnInvalid('theme', state.theme, VALID_THEMES, initOpts.strict);
  warnInvalid('relief', state.relief, VALID_RELIEFS, initOpts.strict);
  warnInvalid('finish', state.finish, VALID_FINISHES, initOpts.strict);

  applyConfig(state);
  setupAutoTheme(state);

  resetEnhancers(initOpts.enhancers);

  // Track runtime registrations for cleanup
  const registrations: TierRegistration[] = [];

  // Internal setters (closure-captured, safe to destructure from the instance)
  function setTheme(theme: Theme): void {
    warnInvalid('theme', theme, VALID_THEMES, initOpts.strict);
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', resolveTheme(theme));
    setupAutoTheme(state);
    dispatchChange('theme', theme);
  }

  function setRelief(relief: Relief): void {
    warnInvalid('relief', relief, VALID_RELIEFS, initOpts.strict);
    state.relief = relief;
    document.documentElement.setAttribute('data-relief', relief);
    dispatchChange('relief', relief);
  }

  function setFinish(finish: Finish): void {
    warnInvalid('finish', finish, VALID_FINISHES, initOpts.strict);
    state.finish = finish;
    document.documentElement.setAttribute('data-finish', finish);
    dispatchChange('finish', finish);
  }

  // Stale-instance detection: only reset() and destroy() check the generation
  // counter and no-op (or throw in strict mode) when called on a superseded
  // instance. Mutation methods (setTheme, setRelief, etc.) use last-write-wins
  // semantics — the most recent call wins regardless of which instance issued it.
  return {
    getState(): SoltanaConfig {
      return { ...state, overrides: { ...state.overrides } };
    },

    setTheme,
    setRelief,
    setFinish,

    setOverrides(overrides: Record<string, string>): void {
      const validOverrides: Record<string, string> = {};
      for (const [key, value] of Object.entries(overrides)) {
        if (!validateOverrideKey(key, initOpts.strict)) continue;
        validOverrides[key] = value;
      }
      state.overrides = { ...state.overrides, ...validOverrides };
      applyOverrides(validOverrides);
      dispatchChange('overrides', validOverrides);
    },

    removeOverrides(keys: string[]): void {
      const validKeys = keys.filter((key) => validateOverrideKey(key, initOpts.strict));
      const root = document.documentElement;
      for (const key of validKeys) {
        root.style.removeProperty(key);
      }
      state.overrides = Object.fromEntries(
        Object.entries(state.overrides).filter(([k]) => !validKeys.includes(k))
      );
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

    reinitEnhancers(): void {
      resetEnhancers(initOpts.enhancers);
    },

    reset(): void {
      if (myGen !== _generation) {
        if (initOpts.strict) {
          throw new Error('[soltana] Stale instance — reset() called after re-initialization');
        }
        console.warn('[soltana] Stale instance — reset() ignored');
        return;
      }
      for (const reg of registrations.splice(0)) {
        reg.unregister();
      }
      teardownStylesheet();
      state.theme = DEFAULT_STATE.theme;
      state.relief = DEFAULT_STATE.relief;
      state.finish = DEFAULT_STATE.finish;
      state.overrides = {};
      teardownAutoTheme();
      document.documentElement.removeAttribute('style');
      applyConfig(state);
      setupAutoTheme(state);
      resetEnhancers(initOpts.enhancers);
      dispatchChange('reset', null);
    },

    destroy(): void {
      if (myGen !== _generation) {
        if (initOpts.strict) {
          throw new Error('[soltana] Stale instance — destroy() called after re-initialization');
        }
        console.warn('[soltana] Stale instance — destroy() ignored');
        return;
      }
      for (const reg of registrations.splice(0)) {
        reg.unregister();
      }
      teardownStylesheet();
      teardownAutoTheme();
      resetEnhancers(false);
      _resetFontLoader();
      const root = document.documentElement;
      root.removeAttribute('data-theme');
      root.removeAttribute('data-relief');
      root.removeAttribute('data-finish');
      root.removeAttribute('style');
    },
  };
}
