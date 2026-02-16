// ---------------------------------------------------------------------------
// Soltana Config Types
// ---------------------------------------------------------------------------

// Canonical built-in tier values (CSS-emitted values only; 'auto' is runtime)
export const BUILT_IN_THEMES = ['dark', 'light', 'sepia'] as const;
export const BUILT_IN_RELIEFS = ['flat', 'soft', 'lifted', 'neu', 'sharp', 'hewn'] as const;
export const BUILT_IN_FINISHES = ['matte', 'translucent', 'frosted', 'tinted', 'glossy'] as const;
export const BUILT_IN_ORNAMENTS = ['none', 'gilt', 'baroque', 'beveled', 'faceted'] as const;

export type BuiltInTheme = (typeof BUILT_IN_THEMES)[number];
export type BuiltInRelief = (typeof BUILT_IN_RELIEFS)[number];
export type BuiltInFinish = (typeof BUILT_IN_FINISHES)[number];
export type BuiltInOrnament = (typeof BUILT_IN_ORNAMENTS)[number];
export type BuiltInRecipeName =
  | 'corporate-clean'
  | 'luxury-dark'
  | 'frosted-modern'
  | 'classic-warm';

export type Theme = BuiltInTheme | 'auto' | (string & {});
export type Relief = BuiltInRelief | (string & {});
export type Finish = BuiltInFinish | (string & {});
export type Ornament = BuiltInOrnament | (string & {});
export type RecipeName = BuiltInRecipeName | (string & {});

export interface Recipe {
  name: string;
  description: string;
  theme: Theme;
  relief: Relief;
  finish: Finish;
  ornament: Ornament;
}

export interface SoltanaConfig {
  theme: Theme;
  relief: Relief;
  finish: Finish;
  ornament: Ornament;
  fonts?: boolean;
  enhancers?: boolean;
  strict?: boolean;
  overrides?: Record<string, string>;
}

export interface SoltanaInstance {
  getState(): SoltanaConfig;
  setTheme(theme: Theme): void;
  setRelief(relief: Relief): void;
  setFinish(finish: Finish): void;
  setOrnament(ornament: Ornament): void;
  applyRecipe(recipeName: RecipeName): void;
  registerRecipe(name: string, recipe: Recipe): void;
  setOverrides(overrides: Record<string, string>): void;
  removeOverrides(keys: string[]): void;
  reinit(): void;
  reset(): void;
  destroy(): void;
}

export interface EnhancerCleanup {
  destroy(): void;
}

export type TierName = 'theme' | 'relief' | 'finish' | 'ornament';
