// ---------------------------------------------------------------------------
// Soltana Config Types
// ---------------------------------------------------------------------------

// Canonical built-in tier values (CSS-emitted values only; 'auto' is runtime)
export const BUILT_IN_THEMES = ['dark', 'light', 'sepia'] as const;
export const BUILT_IN_RELIEFS = ['flat', 'glassmorphic', 'skeuomorphic', 'neumorphic'] as const;
export const BUILT_IN_FINISHES = ['matte', 'frosted', 'tinted', 'glossy'] as const;

export type BuiltInTheme = (typeof BUILT_IN_THEMES)[number];
export type BuiltInRelief = (typeof BUILT_IN_RELIEFS)[number];
export type BuiltInFinish = (typeof BUILT_IN_FINISHES)[number];

export type Theme = BuiltInTheme | 'auto' | (string & {});
export type Relief = BuiltInRelief | (string & {});
export type Finish = BuiltInFinish | (string & {});

export interface SoltanaInitOptions {
  enhancers?: boolean;
  strict?: boolean;
  /** Options forwarded to individual enhancer initializers. */
  enhancerOptions?: EnhancerOptions;
}

export interface SoltanaConfig {
  theme: Theme;
  relief: Relief;
  finish: Finish;
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

  /**
   * Destroy and re-create enhancers (modals, tabs, tooltips).
   * Only effective when `enhancers: true` was passed to `initSoltana()`.
   */
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
  /**
   * Override the default CSS selector for target elements.
   * Behavior varies per enhancer:
   *   - **modals**: overrides the trigger selector (default: `[data-modal-open]`)
   *   - **tabs**: overrides the container selector (default: `.tabs`)
   *   - **tooltips**: overrides the container selector (default: `[data-tooltip]`)
   */
  selector?: string;
}

export type TierName = 'theme' | 'relief' | 'finish';

export type SoltanaChangeType = 'theme' | 'relief' | 'finish' | 'overrides' | 'reset' | 'destroy';

/** Detail payload for `soltana:change` custom events. */
export interface SoltanaChangeDetail {
  type: SoltanaChangeType;
  value: unknown;
}

// ---------------------------------------------------------------------------
// Runtime Registration Types
// ---------------------------------------------------------------------------

/**
 * Seed colors used to derive a full theme token palette via `registerTheme()`.
 * Only the three required fields are needed; optional fields fall back to
 * curated defaults appropriate for the chosen `colorScheme`.
 */
export interface ThemeSeed {
  /** Base surface/background color for the theme. */
  surfaceBg: string;
  /** Primary text color. */
  textPrimary: string;
  /** Primary accent / brand color. */
  accentPrimary: string;
  /** Decorative accent for borders and highlights. Defaults to `accentPrimary`. */
  accentDecorative?: string;
  /** Light or dark scheme hint for derived token generation. Defaults to `'dark'`. */
  colorScheme?: 'light' | 'dark';
  /** Semantic success color. Defaults to green (#10b981 dark / #0d6b4e light). */
  colorSuccess?: string;
  /** Semantic warning color. Defaults to amber (#fcd34d dark / #855c0a light). */
  colorWarning?: string;
  /** Semantic error color. Defaults to red (#ef4444 dark / #991b1b light). */
  colorError?: string;
  /** Semantic info color. Defaults to blue (#3b82f6 dark / #1e40af light). */
  colorInfo?: string;
  /** Highlight channel (R G B space-separated). Defaults to '255 255 255'. */
  highlightColor?: string;
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
    '--relief-opacity'?: string;
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

export interface TierRegistration {
  readonly name: string;
  readonly tier: TierName;
  unregister(): void;
}
