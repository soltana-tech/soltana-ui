// ---------------------------------------------------------------------------
// Soltana Recipes — Named presets of proven tier combinations
// ---------------------------------------------------------------------------

import type { Recipe } from './types.js';

const BUILT_IN_RECIPES = {
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
    relief: 'neumorphic',
    finish: 'glossy',
    ornament: 'gilt',
  },
  'frosted-modern': {
    name: 'Frosted Modern',
    description: 'Glassmorphic frosted panels on a dark backdrop.',
    theme: 'dark',
    relief: 'glassmorphic',
    finish: 'frosted',
    ornament: 'none',
  },
  'classic-warm': {
    name: 'Classic Warm',
    description: 'Warm parchment tones with skeuomorphic depth and beveled edges.',
    theme: 'sepia',
    relief: 'skeuomorphic',
    finish: 'matte',
    ornament: 'beveled',
  },
} as const satisfies Record<string, Recipe>;

export type BuiltInRecipeName = keyof typeof BUILT_IN_RECIPES;

const recipes: Record<string, Recipe> = { ...BUILT_IN_RECIPES };

/**
 * Live view of the recipe registry. Reflects both built-in and user-registered
 * recipes. Typed as Readonly to discourage direct mutation — use
 * `registerRecipe()` to add entries.
 */
export const RECIPES: Readonly<Record<string, Recipe>> = recipes;

export function registerRecipe(name: string, recipe: Recipe): void {
  recipes[name] = recipe;
}
