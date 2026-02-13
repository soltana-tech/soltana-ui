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

/**
 * Initialize the Soltana design system.
 * Sets data attributes on <html> to activate SCSS theme/material/surface
 * selectors, and a body class for the ornament tier.
 */
export function initSoltana(userConfig: Partial<SoltanaConfig> = {}): SoltanaInstance {
  const state: SoltanaConfig = { ...DEFAULT_CONFIG, ...userConfig };

  // Load fonts unless explicitly disabled
  if (state.fonts !== false) {
    loadSoltanaFonts();
  }

  applyConfig(state);

  // Auto-detect system theme changes when theme is 'auto'
  if (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    state.theme === 'auto'
  ) {
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    mql.addEventListener('change', () => {
      if (state.theme === 'auto') {
        document.documentElement.setAttribute('data-theme', resolveTheme('auto'));
      }
    });
  }

  return {
    getState(): SoltanaConfig {
      return { ...state };
    },

    setTheme(theme: Theme): void {
      state.theme = theme;
      document.documentElement.setAttribute('data-theme', resolveTheme(theme));

      // Re-register auto-detection listener when switching to 'auto'
      if (
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        theme === 'auto'
      ) {
        const mql = window.matchMedia('(prefers-color-scheme: light)');
        mql.addEventListener('change', () => {
          if (state.theme === 'auto') {
            document.documentElement.setAttribute('data-theme', resolveTheme('auto'));
          }
        });
      }
    },

    setMaterial(material: Material): void {
      state.material = material;
      document.documentElement.setAttribute('data-material', material);
    },

    setSurface(surface: Surface): void {
      state.surface = surface;
      document.documentElement.setAttribute('data-surface', surface);
    },

    setOrnament(ornament: Ornament): void {
      state.ornament = ornament;
      applyOrnamentClass(ornament);
    },

    setOverrides(overrides: Record<string, string>): void {
      state.overrides = { ...state.overrides, ...overrides };
      applyOverrides(overrides);
    },

    reset(): void {
      Object.assign(state, DEFAULT_CONFIG);
      state.overrides = undefined;
      // Clear any inline override styles
      document.documentElement.removeAttribute('style');
      applyConfig(state);
    },
  };
}

export type { SoltanaConfig, SoltanaInstance, Theme, Material, Surface, Ornament } from './types';
