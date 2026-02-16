// ---------------------------------------------------------------------------
// Soltana Config Types
// ---------------------------------------------------------------------------

export type BuiltInTheme = 'dark' | 'light' | 'sepia' | 'auto';
export type BuiltInRelief = 'flat' | 'soft' | 'lifted' | 'neu' | 'sharp' | 'hewn';
export type BuiltInFinish = 'matte' | 'translucent' | 'frosted' | 'tinted' | 'glossy';
export type BuiltInOrnament = 'none' | 'gilt' | 'baroque' | 'beveled' | 'faceted';
export type BuiltInRecipeName =
  | 'corporate-clean'
  | 'luxury-dark'
  | 'frosted-modern'
  | 'classic-warm';

export type Theme = BuiltInTheme | (string & {});
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
  reinit(): void;
  reset(): void;
  destroy(): void;
}

export interface EnhancerCleanup {
  destroy(): void;
}

export type TierName = 'theme' | 'relief' | 'finish' | 'ornament';
