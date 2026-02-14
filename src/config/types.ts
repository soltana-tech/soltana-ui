// ---------------------------------------------------------------------------
// Soltana Config Types
// ---------------------------------------------------------------------------

export type Theme = 'dark' | 'light' | 'sepia' | 'auto';
export type Relief = 'flat' | 'soft' | 'lifted' | 'neu' | 'sharp' | 'hewn';
export type Finish = 'matte' | 'translucent' | 'frosted' | 'tinted' | 'glossy';
export type Ornament = 'none' | 'gilt' | 'baroque' | 'beveled' | 'faceted';

export type RecipeName = 'corporate-clean' | 'luxury-dark' | 'frosted-modern' | 'classic-warm';

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
  overrides?: Record<string, string>;
}

export interface SoltanaInstance {
  getState(): SoltanaConfig;
  setTheme(theme: Theme): void;
  setRelief(relief: Relief): void;
  setFinish(finish: Finish): void;
  setOrnament(ornament: Ornament): void;
  applyRecipe(recipeName: RecipeName): void;
  setOverrides(overrides: Record<string, string>): void;
  reinit(): void;
  reset(): void;
  destroy(): void;
}

export interface EnhancerCleanup {
  destroy(): void;
}
