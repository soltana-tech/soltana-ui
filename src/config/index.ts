// ---------------------------------------------------------------------------
// Soltana Design System - Config Runtime
// ---------------------------------------------------------------------------
// initSoltana() sets data attributes on <html> and body classes to activate
// SCSS selector blocks for the chosen theme, material, surface, and ornament.
// ---------------------------------------------------------------------------

import type { SoltanaConfig, SoltanaInstance, Theme, Material, Surface, Ornament } from './types';
import { loadSoltanaFonts } from '../fonts/index';

const DEFAULT_CONFIG: SoltanaConfig = {
  theme: 'dark',
  material: 'neuro',
  surface: 'polished',
  ornament: 'none',
  fonts: true,
};

const ORNAMENT_CLASSES = [
  'ornament-baroque',
  'ornament-carved',
  'ornament-faceted',
  'ornament-gilt',
];

const VALID_THEMES: readonly Theme[] = ['dark', 'light', 'sepia', 'auto'];
const VALID_MATERIALS: readonly Material[] = ['neuro', 'glass', 'hybrid'];
const VALID_SURFACES: readonly Surface[] = ['polished', 'frosted', 'stained', 'metallic'];
const VALID_ORNAMENTS: readonly Ornament[] = ['none', 'baroque', 'carved', 'faceted', 'gilt'];

// Module-level state for matchMedia listener cleanup
let _mql: MediaQueryList | null = null;
let _mqlHandler: (() => void) | null = null;

function resolveTheme(theme: Theme): 'dark' | 'light' | 'sepia' {
  if (theme !== 'auto') return theme;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyOrnamentClass(ornament: Ornament): void {
  document.body.classList.remove(...ORNAMENT_CLASSES);
  if (ornament !== 'none') {
    document.body.classList.add(`ornament-${ornament}`);
  }
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
  root.setAttribute('data-material', state.material);
  root.setAttribute('data-surface', state.surface);
  applyOrnamentClass(state.ornament);

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
 * Sets data attributes on <html> to activate SCSS theme/material/surface
 * selectors, and a body class for the ornament tier.
 */
export function initSoltana(userConfig: Partial<SoltanaConfig> = {}): SoltanaInstance {
  const state: SoltanaConfig = { ...DEFAULT_CONFIG, ...userConfig };

  // Validate config values
  warnInvalid('theme', state.theme, VALID_THEMES);
  warnInvalid('material', state.material, VALID_MATERIALS);
  warnInvalid('surface', state.surface, VALID_SURFACES);
  warnInvalid('ornament', state.ornament, VALID_ORNAMENTS);

  // Load fonts unless explicitly disabled
  if (state.fonts !== false) {
    loadSoltanaFonts();
  }

  applyConfig(state);
  setupAutoTheme(state);

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

    setMaterial(material: Material): void {
      warnInvalid('material', material, VALID_MATERIALS);
      state.material = material;
      document.documentElement.setAttribute('data-material', material);
    },

    setSurface(surface: Surface): void {
      warnInvalid('surface', surface, VALID_SURFACES);
      state.surface = surface;
      document.documentElement.setAttribute('data-surface', surface);
    },

    setOrnament(ornament: Ornament): void {
      warnInvalid('ornament', ornament, VALID_ORNAMENTS);
      state.ornament = ornament;
      applyOrnamentClass(ornament);
    },

    setOverrides(overrides: Record<string, string>): void {
      state.overrides = { ...state.overrides, ...overrides };
      applyOverrides(overrides);
    },

    reset(): void {
      Object.assign(state, DEFAULT_CONFIG);
      state.overrides = {};
      teardownAutoTheme();
      // Clear any inline override styles
      document.documentElement.removeAttribute('style');
      applyConfig(state);
    },

    destroy(): void {
      teardownAutoTheme();
      const root = document.documentElement;
      root.removeAttribute('data-theme');
      root.removeAttribute('data-material');
      root.removeAttribute('data-surface');
      root.removeAttribute('style');
      document.body.classList.remove(...ORNAMENT_CLASSES);
    },
  };
}

export type { SoltanaConfig, SoltanaInstance, Theme, Material, Surface, Ornament } from './types';
