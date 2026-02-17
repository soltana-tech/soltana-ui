// ---------------------------------------------------------------------------
// Runtime Tier Registration
// ---------------------------------------------------------------------------
// Per-tier registration functions that inject CSS rule blocks via the managed
// stylesheet. Theme seeds are derived into full token palettes. Relief and
// finish accept typed token maps. Ornament introspects compiled CSS to
// replicate consume selectors for per-element overrides.
// ---------------------------------------------------------------------------

import type {
  ThemeSeed,
  RegisterThemeOptions,
  RegisterReliefOptions,
  RegisterFinishOptions,
  RegisterOrnamentOptions,
  TierRegistration,
} from './types';
import { insertRule, removeRules } from './stylesheet';
import { registerTierValue } from './validation';

// ---------------------------------------------------------------------------
// Theme Token Schema
// ---------------------------------------------------------------------------

/**
 * All CSS custom properties a theme rule block defines. Source of truth for
 * the runtime derivation function and the future @soltana-ui/tokens compiler.
 * Icon tokens are included in the schema but not derived — they require
 * compile-time SVG template functions and must be provided via `tokens`
 * overrides if needed.
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
  // Bridge tokens
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
  // Icon data URIs (not derived — provide via tokens overrides)
  '--icon-select-chevron',
  '--icon-checkbox-check',
  '--icon-radio-dot',
] as const;

// ---------------------------------------------------------------------------
// Theme Seed Derivation
// ---------------------------------------------------------------------------

/**
 * Derive a full theme token map from 3-5 seed colors.
 *
 * Pure function with no DOM dependency — usable by the @soltana-ui/tokens
 * compiler in Node.js. Token values use CSS `color-mix()` expressions that
 * the browser evaluates at paint time, keeping derived tokens reactive.
 *
 * Icon tokens (`--icon-*`) are not derived; provide them via the `tokens`
 * override map in `RegisterThemeOptions` if needed.
 */
export function deriveThemeTokens(seed: ThemeSeed): Record<string, string> {
  const bg = seed.surfaceBg;
  const text = seed.textPrimary;
  const accent = seed.accentPrimary;
  const decorative = seed.accentDecorative ?? accent;
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
    '--color-success': isDark ? '#10b981' : '#0d6b4e',
    '--color-success-subtle': isDark ? 'rgb(16 185 129 / 12%)' : 'rgb(13 107 78 / 8%)',
    '--color-success-text': isDark ? '#34d399' : '#065f46',
    '--color-warning': isDark ? '#fcd34d' : '#855c0a',
    '--color-warning-subtle': isDark ? 'rgb(252 211 77 / 12%)' : 'rgb(133 92 10 / 8%)',
    '--color-warning-text': isDark ? '#fde68a' : '#6b4a08',
    '--color-error': isDark ? '#ef4444' : '#991b1b',
    '--color-error-subtle': isDark ? 'rgb(239 68 68 / 12%)' : 'rgb(153 27 27 / 8%)',
    '--color-error-text': isDark ? '#f87171' : '#7f1d1d',
    '--color-info': isDark ? '#3b82f6' : '#1e40af',
    '--color-info-subtle': isDark ? 'rgb(59 130 246 / 12%)' : 'rgb(30 64 175 / 8%)',
    '--color-info-text': isDark ? '#60a5fa' : '#1e3a8a',

    // --- Interactive states ---
    '--state-hover': mixSrgb(accent, isDark ? 8 : 6),
    '--state-active': mixSrgb(accent, isDark ? 14 : 12),
    '--state-focus-ring': mixSrgb(accent, isDark ? 40 : 35),
    '--state-disabled-bg': isDark ? mix(bg, 'white', 10) : mix(bg, 'black', 10),
    '--state-disabled-text': mix(text, bg, 55),

    // --- Channel tokens ---
    '--shadow-color': isDark ? '0 0 0' : '140 150 170',
    '--highlight-color': '255 255 255',
    '--accent-glow': mixSrgb(accent, isDark ? 15 : 10),

    // --- Bridge tokens ---
    '--surface-deep': 'var(--surface-2)',
    '--neu-shadow': isDark ? 'rgb(var(--shadow-color) / 65%)' : 'rgb(var(--shadow-color) / 35%)',
    '--neu-light': isDark
      ? 'rgb(var(--highlight-color) / 5%)'
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
    '--tooltip-bg': isDark ? bg : mix(text, bg, 0),
    '--tooltip-text': isDark ? text : mix(bg, 'white', 50),
    '--scrollbar-thumb': mixSrgb(text, isDark ? 12 : 15),
    '--scrollbar-track': mixSrgb(text, isDark ? 3 : 3),
    '--code-bg': isDark ? 'rgb(0 0 0 / 35%)' : mix(bg, 'black', 5),
  };

  return tokens;
}

// ---------------------------------------------------------------------------
// Ornament Introspection
// ---------------------------------------------------------------------------

interface OrnamentTemplate {
  className: string;
  pseudoState: string;
  cssText: string;
}

let cachedTemplates: OrnamentTemplate[] | null = null;

const CONSUME_SELECTOR_RE =
  /^:where\(\[data-ornament\]:not\(\[data-ornament='none'\]\)\)\s+\.([a-zA-Z0-9_-]+)(:[a-zA-Z]+)?$/;

function introspectOrnamentTemplates(): OrnamentTemplate[] {
  if (cachedTemplates) return cachedTemplates;

  const templates: OrnamentTemplate[] = [];

  for (const sheet of document.styleSheets) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      // Cross-origin sheet — skip silently
      continue;
    }

    for (const rule of rules) {
      if (!(rule instanceof CSSStyleRule)) continue;

      const match = CONSUME_SELECTOR_RE.exec(rule.selectorText);
      if (!match) continue;

      templates.push({
        className: match[1],
        pseudoState: match[2] || '',
        cssText: rule.style.cssText,
      });
    }
  }

  cachedTemplates = templates;
  return templates;
}

/** Test-only: clear the introspection cache. */
export function _resetIntrospectionCache(): void {
  cachedTemplates = null;
}

// ---------------------------------------------------------------------------
// Registration Functions
// ---------------------------------------------------------------------------

function buildDeclarations(tokens: Record<string, string>): string {
  return Object.entries(tokens)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');
}

export function registerTheme(name: string, options: RegisterThemeOptions): TierRegistration {
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
    },
  };
}

export function registerRelief(name: string, options: RegisterReliefOptions): TierRegistration {
  const decls = buildDeclarations(options.tokens);
  const rules: CSSRule[] = [];
  rules.push(insertRule(`[data-relief='${name}'], .relief-${name} { ${decls} }`));
  registerTierValue('relief', name);

  return {
    name,
    tier: 'relief',
    unregister() {
      removeRules(rules);
    },
  };
}

export function registerFinish(name: string, options: RegisterFinishOptions): TierRegistration {
  const decls = buildDeclarations(options.tokens);
  const rules: CSSRule[] = [];
  rules.push(insertRule(`[data-finish='${name}'], .finish-${name} { ${decls} }`));
  registerTierValue('finish', name);

  return {
    name,
    tier: 'finish',
    unregister() {
      removeRules(rules);
    },
  };
}

export function registerOrnament(name: string, options: RegisterOrnamentOptions): TierRegistration {
  const decls = buildDeclarations(options.tokens);
  const rules: CSSRule[] = [];

  // Part 1: Token blocks
  rules.push(insertRule(`:where([data-ornament='${name}']) { ${decls} }`));
  rules.push(insertRule(`.ornament-${name} { ${decls} }`));

  // Part 2: Consume selectors — replicate compiled per-element overrides
  const templates = introspectOrnamentTemplates();
  for (const t of templates) {
    const sel = `.ornament-${name} .${t.className}${t.pseudoState}, .${t.className}.ornament-${name}${t.pseudoState}`;
    rules.push(insertRule(`${sel} { ${t.cssText} }`));
  }

  registerTierValue('ornament', name);

  return {
    name,
    tier: 'ornament',
    unregister() {
      removeRules(rules);
    },
  };
}
