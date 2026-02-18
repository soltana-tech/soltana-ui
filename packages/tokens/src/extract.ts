// ---------------------------------------------------------------------------
// CSS Token Extraction
// ---------------------------------------------------------------------------
// PostCSS-based parser that reads compiled CSS and produces typed token maps.
// Only static values are extracted — declarations containing `var()` or
// `color-mix()` are skipped since they cannot be resolved outside a browser.
// ---------------------------------------------------------------------------

import postcss from 'postcss';
import type { ThemeTokens, FoundationTokens } from './types.js';

// ---------------------------------------------------------------------------
// Theme token mapping: CSS custom property → ThemeTokens key
// ---------------------------------------------------------------------------

const THEME_PROP_MAP: Partial<Record<string, keyof ThemeTokens>> = {
  '--surface-bg': 'surfaceBg',
  '--surface-1': 'surface1',
  '--surface-2': 'surface2',
  '--surface-3': 'surface3',
  '--surface-4': 'surface4',
  '--text-primary': 'textPrimary',
  '--text-secondary': 'textSecondary',
  '--text-tertiary': 'textTertiary',
  '--text-muted': 'textMuted',
  '--text-inverse': 'textInverse',
  '--border-default': 'borderDefault',
  '--border-subtle': 'borderSubtle',
  '--border-strong': 'borderStrong',
  '--accent-primary': 'accentPrimary',
  '--accent-secondary': 'accentSecondary',
  '--color-success': 'colorSuccess',
  '--color-warning': 'colorWarning',
  '--color-error': 'colorError',
  '--color-info': 'colorInfo',
  '--tooltip-bg': 'tooltipBg',
  '--tooltip-text': 'tooltipText',
};

const THEME_SELECTOR_RE = /\[data-theme=(\w+)\]/;

const FONT_WEIGHT_NAMES = new Set([
  'light',
  'regular',
  'medium',
  'semibold',
  'bold',
  'extrabold',
  'black',
]);

function isDerived(value: string): boolean {
  return value.includes('var(') || value.includes('color-mix(');
}

// ---------------------------------------------------------------------------
// extractThemes
// ---------------------------------------------------------------------------

/**
 * Walk theme rule blocks and return a map of theme name → ThemeTokens.
 * Only static (non-derived) values are included.
 */
export function extractThemes(css: string): Record<string, ThemeTokens> {
  const root = postcss.parse(css);
  const result: Partial<Record<string, Partial<ThemeTokens>>> = {};

  root.walkRules((rule) => {
    const match = THEME_SELECTOR_RE.exec(rule.selector);
    if (!match) return;

    const themeName = match[1];
    result[themeName] ??= {};
    const tokens = result[themeName];

    // Extract color-scheme
    rule.walkDecls('color-scheme', (decl) => {
      tokens.colorScheme = decl.value as ThemeTokens['colorScheme'];
    });

    rule.walkDecls(/^--/, (decl) => {
      if (isDerived(decl.value)) return;
      const key = THEME_PROP_MAP[decl.prop];
      if (key && key !== 'colorScheme') {
        tokens[key] = decl.value.trim();
      }
    });
  });

  return result as Record<string, ThemeTokens>;
}

// ---------------------------------------------------------------------------
// extractFoundation
// ---------------------------------------------------------------------------

/**
 * Extract foundation tokens from the standalone `:root` block
 * (the first rule in the CSS, which has no `[data-theme]` peer).
 */
export function extractFoundation(css: string): FoundationTokens {
  const root = postcss.parse(css);
  const foundation: FoundationTokens = {
    radius: {},
    shadow: {},
    transition: {},
    easing: {},
    z: {},
    fontFamily: {},
    fontSize: {},
    fontWeight: {},
    letterSpacing: {},
  };

  // Collect --text-* / --leading-* pairs for fontSize
  const textSizes: Record<string, string> = {};
  const leadings: Record<string, string> = {};

  let foundRoot = false;

  root.walkRules((rule) => {
    // Only process the first standalone :root (no data-theme in selector)
    if (rule.selector !== ':root') return;
    if (foundRoot) return;
    foundRoot = true;

    rule.walkDecls(/^--/, (decl) => {
      const prop = decl.prop;
      const val = decl.value.trim();

      // Skip derived values (var(), color-mix(), url())
      if (isDerived(val) || val.startsWith('url(')) return;

      if (prop.startsWith('--radius-')) {
        foundation.radius[prop.replace('--radius-', '')] = val;
      } else if (prop.startsWith('--shadow-')) {
        foundation.shadow[prop.replace('--shadow-', '')] = val;
      } else if (prop.startsWith('--transition-')) {
        foundation.transition[prop.replace('--transition-', '')] = val;
      } else if (prop.startsWith('--easing-')) {
        foundation.easing[prop.replace('--easing-', '')] = val;
      } else if (prop.startsWith('--z-')) {
        foundation.z[prop.replace('--z-', '')] = val;
      } else if (prop.startsWith('--font-')) {
        const suffix = prop.replace('--font-', '');
        if (FONT_WEIGHT_NAMES.has(suffix)) {
          foundation.fontWeight[suffix] = val;
        } else {
          foundation.fontFamily[suffix] = val;
        }
      } else if (prop.startsWith('--text-')) {
        textSizes[prop.replace('--text-', '')] = val;
      } else if (prop.startsWith('--leading-')) {
        leadings[prop.replace('--leading-', '')] = val;
      } else if (prop.startsWith('--tracking-')) {
        foundation.letterSpacing[prop.replace('--tracking-', '')] = val;
      }
    });
  });

  // Pair font sizes with line heights
  for (const key of Object.keys(textSizes)) {
    foundation.fontSize[key] = [textSizes[key], leadings[key] ?? '1'];
  }

  return foundation;
}
