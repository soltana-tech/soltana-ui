// ---------------------------------------------------------------------------
// Soltana Design System - Config Runtime
// ---------------------------------------------------------------------------
// initSoltana() applies theme, material, surface, and ornament presets
// to :root as CSS custom properties. Returns an API for runtime changes.
// ---------------------------------------------------------------------------

import type { SoltanaConfig, SoltanaInstance, Theme, Material, Surface, Ornament } from './types';
import { themePresets } from './presets';
import { materialPresets, surfacePresets } from './material-presets';

const DEFAULT_CONFIG: SoltanaConfig = {
  theme: 'dark',
  material: 'neuro',
  surface: 'polished',
  ornament: 'none',
};

const ORNAMENT_CLASSES = [
  'ornament-baroque',
  'ornament-carved',
  'ornament-faceted',
  'ornament-gilt',
];

/**
 * Apply a set of CSS variables to the document root
 */
function applyVariables(variables: Record<string, string>): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(variables)) {
    if (key === 'color-scheme') {
      root.style.colorScheme = value;
    } else {
      root.style.setProperty(key, value);
    }
  }
}

/**
 * Apply ornament as a class on the body element.
 * Ornaments use pseudo-elements and must be applied via CSS classes.
 */
function applyOrnamentClass(ornament: Ornament): void {
  const body = document.body;

  // Remove all existing ornament classes
  body.classList.remove(...ORNAMENT_CLASSES);

  // Add the new ornament class (unless 'none')
  if (ornament !== 'none') {
    body.classList.add(`ornament-${ornament}`);
  }
}

/**
 * Apply all presets based on current config state
 */
function applyConfig(config: SoltanaConfig): void {
  // 1. Apply theme preset (base colors)
  applyVariables(themePresets[config.theme]);

  // 2. Apply material preset
  applyVariables(materialPresets[config.material]);

  // 3. Apply surface modifier (overwrites some material vars)
  applyVariables(surfacePresets[config.surface]);

  // 4. Apply ornament via body class (uses pseudo-elements, not CSS vars)
  applyOrnamentClass(config.ornament);

  // 5. Apply custom overrides
  if (config.overrides) {
    applyVariables(config.overrides);
  }
}

/**
 * Initialize the Soltana design system with the given config.
 * Returns an API for runtime tier switching.
 */
export function initSoltana(userConfig: Partial<SoltanaConfig> = {}): SoltanaInstance {
  // Merge user config with defaults
  const state: SoltanaConfig = {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };

  // Apply initial config
  applyConfig(state);

  // Return runtime API
  return {
    getState(): SoltanaConfig {
      return { ...state };
    },

    setTheme(theme: Theme): void {
      state.theme = theme;
      applyConfig(state);
    },

    setMaterial(material: Material): void {
      state.material = material;
      applyConfig(state);
    },

    setSurface(surface: Surface): void {
      state.surface = surface;
      applyConfig(state);
    },

    setOrnament(ornament: Ornament): void {
      state.ornament = ornament;
      applyConfig(state);
    },

    setOverrides(overrides: Record<string, string>): void {
      state.overrides = { ...state.overrides, ...overrides };
      applyConfig(state);
    },

    reset(): void {
      Object.assign(state, DEFAULT_CONFIG);
      state.overrides = undefined;
      applyConfig(state);
    },
  };
}

// Re-export types
export type { SoltanaConfig, SoltanaInstance, Theme, Material, Surface, Ornament } from './types';
