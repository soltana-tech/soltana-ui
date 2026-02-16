// ---------------------------------------------------------------------------
// Soltana Recipes — Named presets of proven tier combinations
// ---------------------------------------------------------------------------

import type { Recipe } from './types';

const recipes: Record<string, Recipe> = {
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

/** Read-only view of the recipe registry. */
export const RECIPES: Readonly<Record<string, Recipe>> = recipes;

export function registerRecipe(name: string, recipe: Recipe): void {
  recipes[name] = recipe;
}

export const VALID_RECIPE_NAMES: readonly string[] = Object.keys(RECIPES);
