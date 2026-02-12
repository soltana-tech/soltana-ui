// ---------------------------------------------------------------------------
// Material & Surface Presets
// ---------------------------------------------------------------------------
// CSS variable values for materials and surfaces. Applied to :root.
// Ornaments are applied via body classes, not CSS variables.
// ---------------------------------------------------------------------------

import type { Material, Surface } from './types';

type PresetVariables = Record<string, string>;

export const materialPresets: Record<Material, PresetVariables> = {
  neuro: {
    '--material-bg': 'var(--neuro-bg)',
    '--material-shadow':
      '3px 3px 8px var(--neuro-shadow-dark), -3px -3px 8px var(--neuro-shadow-light)',
    '--material-shadow-inset':
      'inset 2px 2px 5px var(--neuro-shadow-dark), inset -2px -2px 5px var(--neuro-shadow-light)',
    '--material-blur': '0px',
    '--material-saturation': '100%',
    '--material-opacity': '1',
    '--material-border': 'var(--border-default)',
    // Neuro-specific surface effect defaults
    '--surface-texture-opacity': '0',
    '--surface-overlay': 'none',
    '--surface-sheen': 'none',
  },
  glass: {
    '--material-bg': 'var(--glass-bg)',
    '--material-shadow': '0 8px 32px var(--glass-shadow)',
    '--material-shadow-inset': 'inset 0 1px 0 var(--glass-inner-glow)',
    '--material-blur': '16px',
    '--material-saturation': '140%',
    '--material-opacity': '0.85',
    '--material-border': 'var(--glass-border)',
    // Glass doesn't use texture overlays
    '--surface-texture-opacity': '0',
    '--surface-overlay': 'none',
    '--surface-sheen': 'none',
  },
  hybrid: {
    '--material-bg':
      'linear-gradient(145deg, var(--glass-gradient-start), var(--glass-gradient-end))',
    '--material-shadow':
      '4px 4px 12px var(--neuro-shadow-dark), -4px -4px 12px var(--neuro-shadow-light), 0 8px 24px var(--glass-shadow)',
    '--material-shadow-inset':
      'inset 2px 2px 6px var(--neuro-shadow-dark), inset -2px -2px 6px var(--neuro-shadow-light), inset 0 1px 0 var(--glass-inner-glow)',
    '--material-blur': '12px',
    '--material-saturation': '120%',
    '--material-opacity': '0.9',
    '--material-border': 'var(--glass-border)',
    // Hybrid uses both blur and can show subtle textures
    '--surface-texture-opacity': '0',
    '--surface-overlay': 'none',
    '--surface-sheen': 'none',
  },
};

export const surfacePresets: Record<Surface, PresetVariables> = {
  polished: {
    // Default clean surface - no modifications
    '--surface-texture-opacity': '0',
    '--surface-overlay': 'none',
    '--surface-sheen': 'none',
  },
  frosted: {
    // Glass/hybrid: heavy blur with desaturation
    '--material-blur': '24px',
    '--material-saturation': '80%',
    '--material-opacity': '0.7',
    // Neuro: etched/matte texture overlay (subtle noise pattern)
    '--surface-texture-opacity': '0.06',
    '--surface-overlay': 'none',
    '--surface-sheen': 'none',
  },
  stained: {
    // Glass/hybrid: colored translucent gradient
    '--material-bg':
      'linear-gradient(135deg, var(--stained-primary), var(--stained-secondary), var(--stained-accent))',
    '--material-blur': '28px',
    '--material-border': '2px solid rgb(40 35 30 / 40%)',
    // Neuro: subtle jewel-toned color overlay
    '--surface-texture-opacity': '0',
    '--surface-overlay':
      'linear-gradient(135deg, rgb(212 168 67 / 6%), rgb(168 85 247 / 5%), rgb(16 185 129 / 4%))',
    '--surface-sheen': 'none',
  },
  metallic: {
    // Glass/hybrid: gradient sheen with reflective highlights
    '--material-bg':
      'linear-gradient(145deg, rgb(255 255 255 / 15%) 0%, transparent 40%, transparent 60%, rgb(0 0 0 / 10%) 100%)',
    // Neuro: brushed metal gradient sheen
    '--surface-texture-opacity': '0',
    '--surface-overlay': 'none',
    '--surface-sheen':
      'linear-gradient(145deg, rgb(255 255 255 / 12%) 0%, transparent 35%, transparent 65%, rgb(0 0 0 / 8%) 100%)',
  },
};
