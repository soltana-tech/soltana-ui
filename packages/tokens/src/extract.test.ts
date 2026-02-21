import { describe, it, expect } from 'vitest';
import { extractFoundation, extractThemes } from './extract.js';
import { buildDtcgTheme, buildDtcgFoundation } from './formats/dtcg.js';

// --- Foundation extraction tests ---

describe('extractFoundation', () => {
  it('extracts radius tokens', () => {
    const css = ':root { --radius-sm: .25rem; --radius-full: 9999px; }';
    const foundation = extractFoundation(css);
    expect(foundation.radius.sm).toBe('.25rem');
    expect(foundation.radius.full).toBe('9999px');
  });

  it('extracts shadow tokens', () => {
    const css = ':root { --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 8%); --shadow-none: none; }';
    const foundation = extractFoundation(css);
    expect(foundation.shadow.sm).toBe('0 1px 2px 0 rgb(0 0 0 / 8%)');
    expect(foundation.shadow.none).toBe('none');
  });

  it('extracts transition tokens', () => {
    const css = ':root { --transition-fast: 75ms; --transition-slow: .3s; }';
    const foundation = extractFoundation(css);
    expect(foundation.transition.fast).toBe('75ms');
    expect(foundation.transition.slow).toBe('.3s');
  });

  it('extracts easing tokens', () => {
    const css =
      ':root { --easing-in: cubic-bezier(.4, 0, 1, 1); --easing-out: cubic-bezier(0, 0, .2, 1); }';
    const foundation = extractFoundation(css);
    expect(foundation.easing.in).toBe('cubic-bezier(.4, 0, 1, 1)');
    expect(foundation.easing.out).toBe('cubic-bezier(0, 0, .2, 1)');
  });

  it('extracts z-index tokens', () => {
    const css = ':root { --z-10: 10; --z-modal: 200; }';
    const foundation = extractFoundation(css);
    expect(foundation.z['10']).toBe('10');
    expect(foundation.z.modal).toBe('200');
  });

  it('separates font families from font weights', () => {
    const css =
      ':root { --font-sans: "Raleway", ui-sans-serif, sans-serif; --font-mono: "JetBrains Mono", monospace; --font-regular: 400; --font-bold: 700; }';
    const foundation = extractFoundation(css);
    expect(foundation.fontFamily.sans).toContain('Raleway');
    expect(foundation.fontFamily.mono).toContain('JetBrains Mono');
    expect(foundation.fontWeight.regular).toBe('400');
    expect(foundation.fontWeight.bold).toBe('700');
  });

  it('pairs font sizes with line heights', () => {
    const css =
      ':root { --text-sm: .875rem; --leading-sm: 1.25rem; --text-base: 1rem; --leading-base: 1.65; }';
    const foundation = extractFoundation(css);
    expect(foundation.fontSize.sm).toEqual(['.875rem', '1.25rem']);
    expect(foundation.fontSize.base).toEqual(['1rem', '1.65']);
  });

  it('extracts letter spacing tokens', () => {
    const css = ':root { --tracking-refined: .02em; }';
    const foundation = extractFoundation(css);
    expect(foundation.letterSpacing.refined).toBe('.02em');
  });

  it('skips tokens containing var() references', () => {
    const css = ':root { --radius-base: .5rem; --radius-derived: var(--radius-base); }';
    const foundation = extractFoundation(css);
    expect(foundation.radius.base).toBe('.5rem');
    expect(foundation.radius.derived).toBeUndefined();
  });

  it('skips tokens containing url() references', () => {
    const css = ':root { --font-sans: "Raleway"; --font-icon: url(data:font/woff2;base64,xyz); }';
    const foundation = extractFoundation(css);
    expect(foundation.fontFamily.sans).toBe('"Raleway"');
    expect(foundation.fontFamily.icon).toBeUndefined();
  });

  it('pairs font sizes with default line height when leading token is missing', () => {
    const css = ':root { --text-xl: 1.5rem; }';
    const foundation = extractFoundation(css);
    expect(foundation.fontSize.xl).toEqual(['1.5rem', '1']);
  });
});

// --- Theme extraction tests ---

describe('extractThemes', () => {
  it('extracts theme from [data-theme] selector', () => {
    const css = '[data-theme=dark] { color-scheme: dark; --surface-bg: #08091a; }';
    const themes = extractThemes(css);
    expect(themes.dark.colorScheme).toBe('dark');
    expect(themes.dark.surfaceBg).toBe('#08091a');
  });

  it('extracts color-scheme', () => {
    const css = `
      [data-theme=dark] { color-scheme: dark; --surface-bg: #08091a; }
      [data-theme=light] { color-scheme: light; --surface-bg: #f6f7fa; }
    `;
    const themes = extractThemes(css);
    expect(themes.dark.colorScheme).toBe('dark');
    expect(themes.light.colorScheme).toBe('light');
  });

  it('extracts static color tokens', () => {
    const css = `
      [data-theme=dark] { --text-primary: #f5f0e6; --accent-primary: #d4a843; }
      [data-theme=light] { --text-primary: #1e2128; --accent-primary: #576378; }
    `;
    const themes = extractThemes(css);
    expect(themes.dark.textPrimary).toBe('#f5f0e6');
    expect(themes.dark.accentPrimary).toBe('#d4a843');
    expect(themes.light.textPrimary).toBe('#1e2128');
    expect(themes.light.accentPrimary).toBe('#576378');
  });

  it('skips derived tokens containing var()', () => {
    const css =
      '[data-theme=dark] { --accent-primary: #d4a843; --accent-derived: var(--accent-primary); }';
    const themes = extractThemes(css);
    expect(themes.dark.accentPrimary).toBe('#d4a843');
    const dark = themes.dark as unknown as Record<string, unknown>;
    expect(dark.accentDerived).toBeUndefined();
  });

  it('skips derived tokens containing color-mix()', () => {
    const css = `
      [data-theme=dark] {
        --accent-primary: #d4a843;
        --accent-primary-hover: color-mix(in oklch, var(--accent-primary), white 15%);
        --badge-bg: color-mix(in srgb, var(--accent-primary) 10%, transparent);
      }
    `;
    const themes = extractThemes(css);
    expect(themes.dark.accentPrimary).toBe('#d4a843');
    const dark = themes.dark as unknown as Record<string, unknown>;
    expect(dark.accentPrimaryHover).toBeUndefined();
    expect(dark.badgeBg).toBeUndefined();
  });
});

// --- Integration tests: full parse-then-extract pipeline ---

const COMPREHENSIVE_CSS = `
:root {
  --radius-sm: .25rem;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 8%);
  --shadow-none: none;
  --transition-fast: 75ms;
  --transition-slow: .3s;
  --easing-in: cubic-bezier(.4, 0, 1, 1);
  --easing-out: cubic-bezier(0, 0, .2, 1);
  --z-10: 10;
  --z-modal: 200;
  --font-sans: "Raleway", ui-sans-serif, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --text-sm: .875rem;
  --leading-sm: 1.25rem;
  --text-base: 1rem;
  --leading-base: 1.65;
  --font-regular: 400;
  --font-bold: 700;
  --tracking-refined: .02em;
}
:root, [data-theme=dark], .theme-dark {
  color-scheme: dark;
  --surface-bg: #08091a;
  --surface-1: #0e1028;
  --surface-2: #151838;
  --surface-3: #1c2048;
  --surface-4: #252a5a;
  --text-primary: #f5f0e6;
  --text-secondary: #c5b99b;
  --text-tertiary: #978b77;
  --text-muted: #897d69;
  --text-inverse: #08091a;
  --border-default: rgb(255 255 255 / 6%);
  --border-subtle: rgb(255 255 255 / 3%);
  --border-strong: rgb(255 255 255 / 10%);
  --accent-primary: #d4a843;
  --accent-primary-hover: color-mix(in oklch, var(--accent-primary), white 15%);
  --accent-secondary: #a855f7;
  --color-success: #10b981;
  --color-warning: #fcd34d;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  --tooltip-bg: #08091a;
  --tooltip-text: #f5f0e6;
  --surface-deep: var(--surface-2);
  --badge-bg: color-mix(in srgb, var(--accent-primary) 10%, transparent);
}
[data-theme=light], .theme-light {
  color-scheme: light;
  --surface-bg: #f6f7fa;
  --surface-1: #fff;
  --surface-2: #eef0f5;
  --surface-3: #e2e5ed;
  --surface-4: #d5d9e4;
  --text-primary: #1e2128;
  --text-secondary: #3a3f4c;
  --text-tertiary: #5c6375;
  --text-muted: #6b7280;
  --text-inverse: #eef0f5;
  --border-default: rgb(85 97 120 / 12%);
  --border-subtle: rgb(85 97 120 / 7%);
  --border-strong: rgb(85 97 120 / 20%);
  --accent-primary: #576378;
  --accent-secondary: #6b21a8;
  --color-success: #0d6b4e;
  --color-warning: #855c0a;
  --color-error: #991b1b;
  --color-info: #1e40af;
  --tooltip-bg: #1e2128;
  --tooltip-text: #eef0f5;
}
`;

describe('Integration: full extraction pipeline', () => {
  it('extracts comprehensive foundation token set from compiled CSS', () => {
    const foundation = extractFoundation(COMPREHENSIVE_CSS);
    expect(foundation.radius.sm).toBe('.25rem');
    expect(foundation.shadow.sm).toBe('0 1px 2px 0 rgb(0 0 0 / 8%)');
    expect(foundation.transition.fast).toBe('75ms');
    expect(foundation.easing.in).toBe('cubic-bezier(.4, 0, 1, 1)');
    expect(foundation.z.modal).toBe('200');
    expect(foundation.fontFamily.sans).toContain('Raleway');
    expect(foundation.fontSize.base).toEqual(['1rem', '1.65']);
    expect(foundation.fontWeight.regular).toBe('400');
    expect(foundation.letterSpacing.refined).toBe('.02em');
  });

  it('extracts dark and light themes from compiled CSS, skipping derived tokens', () => {
    const themes = extractThemes(COMPREHENSIVE_CSS);
    expect(Object.keys(themes)).toEqual(expect.arrayContaining(['dark', 'light']));
    expect(themes.dark.colorScheme).toBe('dark');
    expect(themes.dark.surfaceBg).toBe('#08091a');
    expect(themes.dark.textPrimary).toBe('#f5f0e6');
    expect(themes.light.colorScheme).toBe('light');
    expect(themes.light.surfaceBg).toBe('#f6f7fa');
    const dark = themes.dark as unknown as Record<string, unknown>;
    expect(dark.accentPrimaryHover).toBeUndefined();
    expect(dark.surfaceDeep).toBeUndefined();
  });
});

describe('Integration: token pipeline through format builders', () => {
  const foundation = extractFoundation(COMPREHENSIVE_CSS);
  const themes = extractThemes(COMPREHENSIVE_CSS);

  it('pipes foundation through DTCG builder', () => {
    const result = buildDtcgFoundation(foundation);
    expect(result).toHaveProperty('radius');
    expect(result).toHaveProperty('shadow');
    expect(result).toHaveProperty('fontSize');
  });

  it('pipes dark theme through DTCG builder', () => {
    const result = buildDtcgTheme(themes.dark);
    expect(result).toHaveProperty('surface');
    expect(result).toHaveProperty('text');
    expect(result).toHaveProperty('accent');
  });
});
