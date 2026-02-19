// ---------------------------------------------------------------------------
// Soltana Config Types
// ---------------------------------------------------------------------------

// Canonical built-in tier values (CSS-emitted values only; 'auto' is runtime)
export const BUILT_IN_THEMES = ['dark', 'light', 'sepia'] as const;
export const BUILT_IN_RELIEFS = ['flat', 'glassmorphic', 'skeuomorphic', 'neumorphic'] as const;
export const BUILT_IN_FINISHES = ['matte', 'frosted', 'tinted', 'glossy'] as const;
export const BUILT_IN_ORNAMENTS = ['none', 'gilt', 'baroque', 'beveled', 'faceted'] as const;

export type BuiltInTheme = (typeof BUILT_IN_THEMES)[number];
export type BuiltInRelief = (typeof BUILT_IN_RELIEFS)[number];
export type BuiltInFinish = (typeof BUILT_IN_FINISHES)[number];
export type BuiltInOrnament = (typeof BUILT_IN_ORNAMENTS)[number];
import type { BuiltInRecipeName } from './recipes.js';
export type { BuiltInRecipeName };

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

export interface SoltanaInitOptions {
  enhancers?: boolean;
  strict?: boolean;
}

export interface SoltanaConfig {
  theme: Theme;
  relief: Relief;
  finish: Finish;
  ornament: Ornament;
  overrides: Record<string, string>;
}

/**
 * Public API surface returned by `initSoltana()`.
 *
 * All members are part of the public API and may be destructured from the
 * returned instance.
 */
export interface SoltanaInstance {
  /** Return a snapshot of the current tier configuration. */
  getState(): SoltanaConfig;

  /** Set the active theme (applies `data-theme` on `<html>`). */
  setTheme(theme: Theme): void;
  /** Set the active relief (applies `data-relief` on `<html>`). */
  setRelief(relief: Relief): void;
  /** Set the active finish (applies `data-finish` on `<html>`). */
  setFinish(finish: Finish): void;
  /** Set the active ornament (applies `data-ornament` on `<html>`). */
  setOrnament(ornament: Ornament): void;

  /** Apply a named recipe, setting all four tiers at once. */
  applyRecipe(recipeName: RecipeName): void;
  /** Register a custom recipe for later use with `applyRecipe()`. */
  registerRecipe(name: string, recipe: Recipe): void;

  /** Set CSS custom property overrides on `<html>`. Keys must start with `--`. */
  setOverrides(overrides: Record<string, string>): void;
  /** Remove previously set CSS custom property overrides. Keys must start with `--`. */
  removeOverrides(keys: string[]): void;

  /** Register a custom theme by deriving tokens from a seed. */
  registerTheme(name: string, options: RegisterThemeOptions): TierRegistration;
  /** Register a custom relief with a typed token map. */
  registerRelief(name: string, options: RegisterReliefOptions): TierRegistration;
  /** Register a custom finish with a typed token map. */
  registerFinish(name: string, options: RegisterFinishOptions): TierRegistration;
  /** Register a custom ornament with a partial token map. */
  registerOrnament(name: string, options: RegisterOrnamentOptions): TierRegistration;

  /** Destroy and re-create enhancers (modals, tabs, tooltips). */
  reinitEnhancers(): void;
  /** Reset all tiers to defaults and remove overrides and registrations. */
  reset(): void;
  /** Tear down the instance: remove all attributes, listeners, and registrations. */
  destroy(): void;
}

export interface EnhancerCleanup {
  destroy(): void;
}

export interface EnhancerOptions {
  /** Root element to scope queries. Defaults to `document`. */
  root?: Element | Document;
  /** Override the default CSS selector for target elements. */
  selector?: string;
}

export type TierName = 'theme' | 'relief' | 'finish' | 'ornament';

// ---------------------------------------------------------------------------
// Runtime Registration Types
// ---------------------------------------------------------------------------

export interface ThemeSeed {
  surfaceBg: string;
  textPrimary: string;
  accentPrimary: string;
  accentDecorative?: string;
  colorScheme?: 'light' | 'dark';
  colorSuccess?: string;
  colorWarning?: string;
  colorError?: string;
  colorInfo?: string;
}

export interface RegisterThemeOptions {
  seed: ThemeSeed;
  /** Override any derived token after seed derivation. */
  tokens?: Record<string, string>;
}

export interface RegisterReliefOptions {
  tokens: {
    '--relief-bg': string;
    '--relief-shadow-sm': string;
    '--relief-shadow': string;
    '--relief-shadow-lg': string;
    '--relief-shadow-inset-sm': string;
    '--relief-shadow-inset': string;
    '--relief-shadow-inset-lg': string;
    '--relief-border': string;
  };
}

export interface RegisterFinishOptions {
  tokens: {
    '--finish-blur': string;
    '--finish-saturation': string;
    '--finish-opacity': string;
    '--finish-overlay': string;
    '--finish-sheen': string;
  };
}

export interface RegisterOrnamentOptions {
  /** Partial token map — unset tokens stay inert (inherit existing values). */
  tokens: Record<string, string>;
}

export interface TierRegistration {
  readonly name: string;
  readonly tier: TierName;
  unregister(): void;
}
