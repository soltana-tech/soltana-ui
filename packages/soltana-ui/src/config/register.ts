// ---------------------------------------------------------------------------
// Runtime Tier Registration
// ---------------------------------------------------------------------------
// Per-tier registration functions that inject CSS rule blocks via the managed
// stylesheet. Theme seeds are derived into full token palettes. Relief and
// finish accept typed token maps.
// ---------------------------------------------------------------------------

import type {
  ThemeSeed,
  RegisterThemeOptions,
  RegisterReliefOptions,
  RegisterFinishOptions,
  TierRegistration,
} from './types.js';
import { insertRule, removeRules } from './stylesheet.js';
import { registerTierValue, deregisterTierValue } from './validation.js';

// ---------------------------------------------------------------------------
// Theme Token Schema
// ---------------------------------------------------------------------------

/**
 * All CSS custom properties a theme rule block defines. Source of truth for
 * the runtime derivation function and the SCSS ↔ TS sync test.
 * Icon tokens are included in the schema but not derived — they require
 * compile-time SVG template functions and must be provided via `tokens`
 * overrides if needed.
 *
 * @internal Consumed only by tests; not re-exported from the public barrel.
 */
export const THEME_TOKEN_NAMES = [
  // Surface
  '--surface-bg',
  '--surface-1',
  '--surface-2',
  '--surface-3',
  '--surface-4',
  // Text
  '--text-primary',
  '--text-secondary',
  '--text-tertiary',
  '--text-muted',
  '--text-inverse',
  // Border
  '--border-default',
  '--border-subtle',
  '--border-strong',
  // Accent
  '--accent-primary',
  '--accent-primary-hover',
  '--accent-primary-active',
  '--accent-secondary',
  '--accent-secondary-hover',
  '--accent-secondary-active',
  // Decorative accent
  '--accent-decorative',
  '--accent-decorative-hover',
  '--accent-decorative-subtle',
  '--border-decorative',
  '--border-decorative-strong',
  // Semantic colors
  '--color-success',
  '--color-success-subtle',
  '--color-success-text',
  '--color-warning',
  '--color-warning-subtle',
  '--color-warning-text',
  '--color-error',
  '--color-error-subtle',
  '--color-error-text',
  '--color-info',
  '--color-info-subtle',
  '--color-info-text',
  // Interactive states
  '--state-hover',
  '--state-active',
  '--state-focus-ring',
  '--state-disabled-bg',
  '--state-disabled-text',
  // Channel tokens (relief system)
  '--shadow-color',
  '--highlight-color',
  '--accent-glow',
  '--channel-sheen-color',
  '--channel-tint-color',
  // Bridge tokens
  '--glass-opacity',
  '--mesh-color-1',
  '--mesh-color-2',
  '--mesh-color-3',
  '--surface-deep',
  '--neu-shadow',
  '--neu-light',
  // Component tokens
  '--input-bg',
  '--input-border',
  '--input-border-focus',
  '--input-placeholder',
  '--card-bg',
  '--card-border',
  '--badge-bg',
  '--tooltip-bg',
  '--tooltip-text',
  '--scrollbar-thumb',
  '--scrollbar-track',
  '--code-bg',
  '--toast-bg',
  '--toast-text',
  '--drawer-bg',
  '--popover-bg',
  '--popover-border',
  '--kbd-bg',
  '--kbd-border',
  '--modal-bg',
  '--overlay-backdrop-bg',
  // Icon data URIs (not derived — provide via tokens overrides)
  '--icon-select-chevron',
] as const;

// ---------------------------------------------------------------------------
// Theme Seed Derivation
// ---------------------------------------------------------------------------

interface SemanticFallbacks {
  dark: [base: string, subtle: string, text: string];
  light: [base: string, subtle: string, text: string];
}

type MixFn = (base: string, target: string, pct: number) => string;
type MixSrgbFn = (base: string, pct: number) => string;

interface DeriveSemanticOpts {
  isDark: boolean;
  mix: MixFn;
  mixSrgb: MixSrgbFn;
  fallbacks: SemanticFallbacks;
}

/**
 * Derive the three tokens (base, subtle, text) for a semantic color category.
 */
function deriveSemanticColor(
  name: string,
  seedColor: string | undefined,
  opts: DeriveSemanticOpts
): Record<string, string> {
  const { isDark, mix, mixSrgb, fallbacks } = opts;
  const [fallbackBase, fallbackSubtle, fallbackText] = isDark ? fallbacks.dark : fallbacks.light;
  return {
    [`--color-${name}`]: seedColor ?? fallbackBase,
    [`--color-${name}-subtle`]: seedColor ? mixSrgb(seedColor, isDark ? 12 : 8) : fallbackSubtle,
    [`--color-${name}-text`]: seedColor
      ? isDark
        ? mix(seedColor, 'white', 25)
        : mix(seedColor, 'black', 25)
      : fallbackText,
  };
}

/**
 * Derive a full theme token map from 3-5 seed colors.
 *
 * Pure function with no DOM dependency. Token values use CSS `color-mix()`
 * expressions that the browser evaluates at paint time, keeping derived
 * tokens reactive.
 *
 * Icon tokens (`--icon-*`) are not derived; provide them via the `tokens`
 * override map in `RegisterThemeOptions` if needed.
 *
 * @internal Consumed by `registerTheme()` and tests; not re-exported from the public barrel.
 */
export function deriveThemeTokens(seed: ThemeSeed): Record<string, string> {
  const bg = seed.surfaceBg;
  const text = seed.textPrimary;
  const accent = seed.accentPrimary;
  const decorative = seed.accentDecorative ?? accent;
  // Defaults to 'dark' — dark-mode derivation produces lighter hover states
  // and higher-contrast borders, which degrade more gracefully when the
  // actual palette luminance is ambiguous.
  const scheme = seed.colorScheme ?? 'dark';
  const isDark = scheme === 'dark';

  // Shorthand for color-mix expressions
  const mix = (base: string, target: string, pct: number) =>
    `color-mix(in oklch, ${base}, ${target} ${String(pct)}%)`;
  const mixSrgb = (base: string, pct: number) =>
    `color-mix(in srgb, ${base} ${String(pct)}%, transparent)`;

  // Accent variant direction: dark themes lighten on hover, light themes darken
  const hoverTarget = isDark ? 'white' : 'black';

  const tokens: Record<string, string> = {
    // --- Surface ---
    '--surface-bg': bg,
    '--surface-1': isDark ? mix(bg, 'white', 5) : mix(bg, 'white', 50),
    '--surface-2': isDark ? mix(bg, 'white', 10) : mix(bg, 'black', 5),
    '--surface-3': isDark ? mix(bg, 'white', 15) : mix(bg, 'black', 10),
    '--surface-4': isDark ? mix(bg, 'white', 20) : mix(bg, 'black', 15),

    // --- Text ---
    '--text-primary': text,
    '--text-secondary': mix(text, bg, 25),
    '--text-tertiary': mix(text, bg, 45),
    '--text-muted': mix(text, bg, 55),
    '--text-inverse': bg,

    // --- Border ---
    '--border-default': mixSrgb(text, isDark ? 6 : 12),
    '--border-subtle': mixSrgb(text, isDark ? 3 : 7),
    '--border-strong': mixSrgb(text, isDark ? 10 : 20),

    // --- Accent ---
    '--accent-primary': accent,
    '--accent-primary-hover': mix(accent, hoverTarget, 15),
    '--accent-primary-active': mix(accent, 'black', 25),
    // Secondary: hue-rotated complement
    '--accent-secondary': `oklch(from ${accent} l c calc(h + 120))`,
    '--accent-secondary-hover': `oklch(from ${mix(accent, hoverTarget, 15)} l c calc(h + 120))`,
    '--accent-secondary-active': `oklch(from ${mix(accent, 'black', 25)} l c calc(h + 120))`,

    // --- Decorative accent ---
    '--accent-decorative': decorative,
    '--accent-decorative-hover': mix(decorative, hoverTarget, 15),
    '--accent-decorative-subtle': mixSrgb(decorative, 10),
    '--border-decorative': mixSrgb(decorative, isDark ? 20 : 25),
    '--border-decorative-strong': mixSrgb(decorative, isDark ? 35 : 40),

    // --- Semantic colors ---
    ...deriveSemanticColor('success', seed.colorSuccess, {
      isDark,
      mix,
      mixSrgb,
      fallbacks: {
        dark: ['#10b981', 'rgb(16 185 129 / 12%)', '#34d399'],
        light: ['#0d6b4e', 'rgb(13 107 78 / 8%)', '#065f46'],
      },
    }),
    ...deriveSemanticColor('warning', seed.colorWarning, {
      isDark,
      mix,
      mixSrgb,
      fallbacks: {
        dark: ['#fcd34d', 'rgb(252 211 77 / 12%)', '#fde68a'],
        light: ['#855c0a', 'rgb(133 92 10 / 8%)', '#6b4a08'],
      },
    }),
    ...deriveSemanticColor('error', seed.colorError, {
      isDark,
      mix,
      mixSrgb,
      fallbacks: {
        dark: ['#ef4444', 'rgb(239 68 68 / 12%)', '#f87171'],
        light: ['#991b1b', 'rgb(153 27 27 / 8%)', '#7f1d1d'],
      },
    }),
    ...deriveSemanticColor('info', seed.colorInfo, {
      isDark,
      mix,
      mixSrgb,
      fallbacks: {
        dark: ['#3b82f6', 'rgb(59 130 246 / 12%)', '#60a5fa'],
        light: ['#1e40af', 'rgb(30 64 175 / 8%)', '#1e3a8a'],
      },
    }),

    // --- Interactive states ---
    '--state-hover': mixSrgb(accent, isDark ? 8 : 6),
    '--state-active': mixSrgb(accent, isDark ? 14 : 12),
    '--state-focus-ring': mixSrgb(accent, isDark ? 40 : 35),
    '--state-disabled-bg': isDark ? mix(bg, 'white', 10) : mix(bg, 'black', 10),
    '--state-disabled-text': mix(text, bg, 55),

    // --- Channel tokens ---
    '--shadow-color': '0 0 0',
    '--highlight-color': seed.highlightColor ?? '255 255 255',
    '--accent-glow': mixSrgb(accent, isDark ? 15 : 10),
    '--channel-sheen-color': isDark ? '255 255 255' : '0 0 0',
    '--channel-tint-color': hexToRgbChannels(accent),

    // --- Bridge tokens ---
    '--glass-opacity': isDark ? '0.5' : '0.35',
    '--mesh-color-1': 'var(--accent-primary)',
    '--mesh-color-2': 'var(--accent-secondary)',
    '--mesh-color-3': 'var(--accent-decorative)',
    '--surface-deep': 'var(--surface-2)',
    '--neu-shadow': isDark ? 'rgb(var(--shadow-color) / 65%)' : 'rgb(var(--shadow-color) / 35%)',
    '--neu-light': isDark
      ? 'rgb(var(--highlight-color) / 12%)'
      : 'rgb(var(--highlight-color) / 88%)',

    // --- Component tokens ---
    '--input-bg': isDark ? mixSrgb('white', 4) : 'white',
    '--input-border': mixSrgb(text, isDark ? 8 : 14),
    '--input-border-focus': 'var(--accent-primary)',
    '--input-placeholder': mix(text, bg, 55),
    '--card-bg': isDark
      ? `color-mix(in srgb, ${mix(bg, 'white', 5)} 60%, transparent)`
      : `color-mix(in srgb, white 78%, transparent)`,
    '--card-border': mixSrgb(text, isDark ? 6 : 10),
    '--badge-bg': mixSrgb(accent, isDark ? 10 : 8),
    '--tooltip-bg': isDark ? bg : text,
    '--tooltip-text': isDark ? text : mix(bg, 'white', 50),
    '--scrollbar-thumb': mixSrgb(text, isDark ? 12 : 15),
    '--scrollbar-track': mixSrgb(text, isDark ? 3 : 3),
    '--code-bg': isDark ? 'rgb(0 0 0 / 35%)' : mix(bg, 'black', 5),
    '--toast-bg': 'var(--surface-1)',
    '--toast-text': 'var(--text-primary)',
    '--drawer-bg': 'var(--surface-1)',
    '--popover-bg': 'var(--surface-1)',
    '--popover-border': 'var(--border-default)',
    '--kbd-bg': 'var(--surface-2)',
    '--kbd-border': 'var(--border-strong)',
    '--modal-bg': 'var(--surface-1)',
    '--overlay-backdrop-bg': 'rgb(var(--shadow-color) / 60%)',
  };

  return tokens;
}

// ---------------------------------------------------------------------------
// Registration Functions
// ---------------------------------------------------------------------------

const HEX_RE = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;

/**
 * Convert a color to space-separated RGB channels (0-255).
 * Supports hex (#RGB, #RRGGBB, #RRGGBBAA) and rgb(r, g, b) formats only.
 * Falls back to neutral gray for invalid input.
 */
function hexToRgbChannels(hex: string): string {
  if (!HEX_RE.test(hex)) {
    // Attempt to parse rgb() format before falling back
    const rgbMatch = /^rgb\(\s*(\d+)[, ]\s*(\d+)[, ]\s*(\d+)\s*\)$/.exec(hex);
    if (rgbMatch) {
      return `${rgbMatch[1]} ${rgbMatch[2]} ${rgbMatch[3]}`;
    }
    console.error(
      `[soltana] Non-hex color "${hex}" passed to hexToRgbChannels. Falling back to neutral gray.`
    );
    // Silent degradation to neutral gray (#808080). See accentPrimary JSDoc in types.ts.
    return '128 128 128';
  }
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  const r = String(parseInt(h.slice(0, 2), 16));
  const g = String(parseInt(h.slice(2, 4), 16));
  const b = String(parseInt(h.slice(4, 6), 16));
  return `${r} ${g} ${b}`;
}

const CSS_IDENT_RE = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

function validateCssIdent(name: string): void {
  if (!name || !CSS_IDENT_RE.test(name)) {
    throw new Error(
      `[soltana] Invalid tier name "${name}". Must be a non-empty CSS identifier (letters, digits, hyphens, underscores; starting with a letter).`
    );
  }
}

function buildDeclarations(tokens: Record<string, string>): string {
  return Object.entries(tokens)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');
}

export function registerTheme(name: string, options: RegisterThemeOptions): TierRegistration {
  validateCssIdent(name);
  const derived = deriveThemeTokens(options.seed);
  const merged = options.tokens ? { ...derived, ...options.tokens } : derived;
  const decls = buildDeclarations(merged);

  const rules: CSSRule[] = [];
  rules.push(
    insertRule(
      `[data-theme='${name}'], .theme-${name} { color-scheme: ${options.seed.colorScheme ?? 'dark'}; ${decls} }`
    )
  );
  registerTierValue('theme', name);

  return {
    name,
    tier: 'theme',
    unregister() {
      removeRules(rules);
      deregisterTierValue('theme', name);
    },
  };
}

const REQUIRED_RELIEF_TOKENS = [
  '--relief-bg',
  '--relief-shadow-sm',
  '--relief-shadow',
  '--relief-shadow-lg',
  '--relief-shadow-inset-sm',
  '--relief-shadow-inset',
  '--relief-shadow-inset-lg',
  '--relief-border',
] as const;

const REQUIRED_FINISH_TOKENS = [
  '--finish-blur',
  '--finish-saturation',
  '--finish-opacity',
  '--finish-overlay',
  '--finish-sheen',
] as const;

const REQUIRED_TIER_TOKENS: Record<'relief' | 'finish', readonly string[]> = {
  relief: REQUIRED_RELIEF_TOKENS,
  finish: REQUIRED_FINISH_TOKENS,
};

function validateTierTokens(
  tier: 'relief' | 'finish',
  name: string,
  tokens: Record<string, string>
): void {
  const required = REQUIRED_TIER_TOKENS[tier];
  const missing = required.filter((key) => !(key in tokens));
  if (missing.length > 0) {
    throw new Error(
      `[soltana] register${tier[0].toUpperCase()}${tier.slice(1)}("${name}") missing required tokens: ${missing.join(', ')}`
    );
  }
}

function registerSimpleTier(
  tier: 'relief' | 'finish',
  name: string,
  tokens: Record<string, string>
): TierRegistration {
  validateCssIdent(name);
  validateTierTokens(tier, name, tokens);
  const decls = buildDeclarations(tokens);
  const rules: CSSRule[] = [];
  rules.push(insertRule(`[data-${tier}='${name}'], .${tier}-${name} { ${decls} }`));
  registerTierValue(tier, name);
  return {
    name,
    tier,
    unregister() {
      removeRules(rules);
      deregisterTierValue(tier, name);
    },
  };
}

export function registerRelief(name: string, options: RegisterReliefOptions): TierRegistration {
  return registerSimpleTier('relief', name, options.tokens);
}

export function registerFinish(name: string, options: RegisterFinishOptions): TierRegistration {
  return registerSimpleTier('finish', name, options.tokens);
}
