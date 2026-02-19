import { describe, it, expect } from 'vitest';
import { extractFoundation, extractThemes } from './extract.js';
import { buildEChartsTheme } from './formats/echarts.js';
import { buildPlotlyTemplate } from './formats/plotly.js';
import { buildMplStyle } from './formats/matplotlib.js';
import { buildDtcgTheme, buildDtcgFoundation } from './formats/dtcg.js';

const MOCK_CSS = `
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

describe('extractFoundation', () => {
  const foundation = extractFoundation(MOCK_CSS);

  it('extracts radius tokens', () => {
    expect(foundation.radius.sm).toBe('.25rem');
    expect(foundation.radius.full).toBe('9999px');
  });

  it('extracts shadow tokens', () => {
    expect(foundation.shadow.sm).toBe('0 1px 2px 0 rgb(0 0 0 / 8%)');
    expect(foundation.shadow.none).toBe('none');
  });

  it('extracts transition tokens', () => {
    expect(foundation.transition.fast).toBe('75ms');
    expect(foundation.transition.slow).toBe('.3s');
  });

  it('extracts easing tokens', () => {
    expect(foundation.easing.in).toBe('cubic-bezier(.4, 0, 1, 1)');
    expect(foundation.easing.out).toBe('cubic-bezier(0, 0, .2, 1)');
  });

  it('extracts z-index tokens', () => {
    expect(foundation.z['10']).toBe('10');
    expect(foundation.z.modal).toBe('200');
  });

  it('separates font families from font weights', () => {
    expect(foundation.fontFamily.sans).toContain('Raleway');
    expect(foundation.fontFamily.mono).toContain('JetBrains Mono');
    expect(foundation.fontWeight.regular).toBe('400');
    expect(foundation.fontWeight.bold).toBe('700');
  });

  it('pairs font sizes with line heights', () => {
    expect(foundation.fontSize.sm).toEqual(['.875rem', '1.25rem']);
    expect(foundation.fontSize.base).toEqual(['1rem', '1.65']);
  });

  it('extracts letter spacing tokens', () => {
    expect(foundation.letterSpacing.refined).toBe('.02em');
  });
});

describe('extractThemes', () => {
  const themes = extractThemes(MOCK_CSS);

  it('extracts dark and light themes', () => {
    expect(Object.keys(themes)).toEqual(expect.arrayContaining(['dark', 'light']));
  });

  it('extracts color-scheme', () => {
    expect(themes.dark.colorScheme).toBe('dark');
    expect(themes.light.colorScheme).toBe('light');
  });

  it('extracts static surface tokens', () => {
    expect(themes.dark.surfaceBg).toBe('#08091a');
    expect(themes.light.surfaceBg).toBe('#f6f7fa');
  });

  it('extracts static text tokens', () => {
    expect(themes.dark.textPrimary).toBe('#f5f0e6');
    expect(themes.light.textMuted).toBe('#6b7280');
  });

  it('extracts accent tokens', () => {
    expect(themes.dark.accentPrimary).toBe('#d4a843');
    expect(themes.light.accentSecondary).toBe('#6b21a8');
  });

  it('extracts semantic color tokens', () => {
    expect(themes.dark.colorSuccess).toBe('#10b981');
    expect(themes.light.colorError).toBe('#991b1b');
  });

  it('extracts tooltip tokens', () => {
    expect(themes.dark.tooltipBg).toBe('#08091a');
    expect(themes.dark.tooltipText).toBe('#f5f0e6');
  });

  it('skips derived tokens containing var() or color-mix()', () => {
    // Tokens with var() or color-mix() values are excluded from extraction
    const dark = themes.dark as unknown as Record<string, unknown>;
    expect(dark.accentPrimaryHover).toBeUndefined();
    expect(dark.surfaceDeep).toBeUndefined();
    expect(dark.badgeBg).toBeUndefined();
  });
});

describe('end-to-end token pipeline', () => {
  const foundation = extractFoundation(MOCK_CSS);
  const themes = extractThemes(MOCK_CSS);

  it('pipes dark theme through all format builders without errors', () => {
    const dark = themes.dark;

    const echarts = buildEChartsTheme(dark, foundation);
    expect(echarts).toHaveProperty('color');
    expect(echarts).toHaveProperty('backgroundColor');
    expect(Array.isArray(echarts.color)).toBe(true);
    expect((echarts.color as string[]).length).toBeGreaterThan(0);

    const plotly = buildPlotlyTemplate(dark, foundation);
    expect(plotly).toHaveProperty('layout');
    expect(plotly.layout).toHaveProperty('paper_bgcolor');
    expect(plotly.layout).toHaveProperty('colorway');

    const mpl = buildMplStyle(dark, foundation);
    expect(typeof mpl).toBe('string');
    expect(mpl.length).toBeGreaterThan(0);
    expect(mpl).toContain('figure.facecolor');
    expect(mpl).toContain('axes.facecolor');

    const dtcg = buildDtcgTheme(dark);
    expect(dtcg).toHaveProperty('surface');
    expect(dtcg).toHaveProperty('text');

    const dtcgFoundation = buildDtcgFoundation(foundation);
    expect(dtcgFoundation).toHaveProperty('radius');
    expect(dtcgFoundation).toHaveProperty('shadow');
  });
});
