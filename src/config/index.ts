// ---------------------------------------------------------------------------
// Soltana Design System - Config Runtime
// ---------------------------------------------------------------------------
// initSoltana() sets data attributes on <html> to activate SCSS selector
// blocks for the chosen theme, relief, finish, and ornament.
// ---------------------------------------------------------------------------

import type {
  SoltanaConfig,
  SoltanaInstance,
  EnhancerCleanup,
  Theme,
  Relief,
  Finish,
  Ornament,
} from './types';
import { initAll } from '../enhancers/index.js';
import { loadSoltanaFonts } from '../fonts/index';

const DEFAULT_CONFIG: SoltanaConfig = {
  theme: 'dark',
  relief: 'neu',
  finish: 'matte',
  ornament: 'none',
  fonts: false,
  enhancers: true,
};

const VALID_THEMES: readonly Theme[] = ['dark', 'light', 'sepia', 'auto'];
const VALID_RELIEFS: readonly Relief[] = ['flat', 'soft', 'lifted', 'neu', 'sharp', 'hewn'];
const VALID_FINISHES: readonly Finish[] = ['matte', 'translucent', 'frosted', 'tinted', 'glossy'];
const VALID_ORNAMENTS: readonly Ornament[] = ['none', 'gilt', 'baroque', 'beveled', 'faceted'];

// Module-level state for matchMedia listener cleanup
let _mql: MediaQueryList | null = null;
let _mqlHandler: (() => void) | null = null;

// Module-level state for enhancer cleanup
let _enhancerCleanup: EnhancerCleanup | null = null;

function resolveTheme(theme: Theme): 'dark' | 'light' | 'sepia' {
  if (theme !== 'auto') return theme;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyOrnament(ornament: Ornament): void {
  document.documentElement.setAttribute('data-ornament', ornament);
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
  applyOrnament(state.ornament);

  if (state.overrides) {
    applyOverrides(state.overrides);
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

function warnInvalid(name: string, value: string, valid: readonly string[]): void {
  if (!valid.includes(value)) {
    console.warn(`[soltana] Invalid ${name} "${value}". Expected: ${valid.join(', ')}`);
  }
}

/**
 * Initialize the Soltana design system.
 * Sets data attributes on <html> to activate SCSS theme/relief/finish/
 * ornament selectors.
 */
export function initSoltana(userConfig: Partial<SoltanaConfig> = {}): SoltanaInstance {
  const state: SoltanaConfig = { ...DEFAULT_CONFIG, ...userConfig };

  // Validate config values
  warnInvalid('theme', state.theme, VALID_THEMES);
  warnInvalid('relief', state.relief, VALID_RELIEFS);
  warnInvalid('finish', state.finish, VALID_FINISHES);
  warnInvalid('ornament', state.ornament, VALID_ORNAMENTS);

  // Load Google Fonts when opted in
  if (state.fonts === true) {
    loadSoltanaFonts();
  }

  applyConfig(state);
  setupAutoTheme(state);

  // Initialize JS enhancers for interactive components
  if (_enhancerCleanup) {
    _enhancerCleanup.destroy();
    _enhancerCleanup = null;
  }
  if (state.enhancers !== false) {
    _enhancerCleanup = initAll();
  }

  return {
    getState(): SoltanaConfig {
      return { ...state };
    },

    setTheme(theme: Theme): void {
      warnInvalid('theme', theme, VALID_THEMES);
      state.theme = theme;
      document.documentElement.setAttribute('data-theme', resolveTheme(theme));
      setupAutoTheme(state);
    },

    setRelief(relief: Relief): void {
      warnInvalid('relief', relief, VALID_RELIEFS);
      state.relief = relief;
      document.documentElement.setAttribute('data-relief', relief);
    },

    setFinish(finish: Finish): void {
      warnInvalid('finish', finish, VALID_FINISHES);
      state.finish = finish;
      document.documentElement.setAttribute('data-finish', finish);
    },

    setOrnament(ornament: Ornament): void {
      warnInvalid('ornament', ornament, VALID_ORNAMENTS);
      state.ornament = ornament;
      applyOrnament(ornament);
    },

    setOverrides(overrides: Record<string, string>): void {
      state.overrides = { ...state.overrides, ...overrides };
      applyOverrides(overrides);
    },

    reinit(): void {
      if (_enhancerCleanup) {
        _enhancerCleanup.destroy();
      }
      _enhancerCleanup = initAll();
    },

    reset(): void {
      Object.assign(state, DEFAULT_CONFIG);
      state.overrides = {};
      teardownAutoTheme();
      // Clear any inline override styles
      document.documentElement.removeAttribute('style');
      applyConfig(state);
      // Re-initialize enhancers
      if (_enhancerCleanup) {
        _enhancerCleanup.destroy();
        _enhancerCleanup = null;
      }
      if (state.enhancers !== false) {
        _enhancerCleanup = initAll();
      }
    },

    destroy(): void {
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

export type { SoltanaConfig, SoltanaInstance, Theme, Relief, Finish, Ornament } from './types';
