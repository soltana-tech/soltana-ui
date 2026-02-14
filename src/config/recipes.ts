// ---------------------------------------------------------------------------
// Soltana Recipes — Named presets of proven tier combinations
// ---------------------------------------------------------------------------

import type { RecipeName, Recipe } from './types';

export const RECIPES: Readonly<Record<RecipeName, Recipe>> = {
  'corporate-clean': {
    name: 'Corporate Clean',
    description: 'Minimal and professional with zero ornamentation.',
    theme: 'light',
    relief: 'flat',
    finish: 'matte',
    ornament: 'none',
  },
  'luxury-dark': {
    name: 'Luxury Dark',
    description: 'Rich neumorphic depth with glossy sheen and gold accents.',
    theme: 'dark',
    relief: 'neu',
    finish: 'glossy',
    ornament: 'gilt',
  },
  'frosted-modern': {
    name: 'Frosted Modern',
    description: 'Elevated frosted glass panels on a dark backdrop.',
    theme: 'dark',
    relief: 'lifted',
    finish: 'frosted',
    ornament: 'none',
  },
  'classic-warm': {
    name: 'Classic Warm',
    description: 'Warm parchment tones with soft shadows and beveled edges.',
    theme: 'sepia',
    relief: 'soft',
    finish: 'matte',
    ornament: 'beveled',
  },
};

export const VALID_RECIPE_NAMES: readonly RecipeName[] = Object.keys(RECIPES) as RecipeName[];
