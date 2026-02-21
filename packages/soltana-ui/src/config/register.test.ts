import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import scss from 'postcss-scss';
import { THEME_TOKEN_NAMES, deriveThemeTokens } from './register.js';
import type { ThemeSeed } from './types.js';

const DARK_SEED: ThemeSeed = {
  surfaceBg: '#08091a',
  textPrimary: '#f5f0e6',
  accentPrimary: '#d4a843',
};

const LIGHT_SEED: ThemeSeed = {
  surfaceBg: '#f6f7fa',
  textPrimary: '#1e2128',
  accentPrimary: '#576378',
  colorScheme: 'light',
};

// --- SCSS ↔ TS token sync (merged from register.sync.test.ts) ---

function extractTokens(source: string): Set<string> {
  const tokens = new Set<string>();
  const root = scss.parse(source);

  root.walkDecls((decl) => {
    if (decl.prop.startsWith('--')) {
      tokens.add(decl.prop);
    }
  });

  return tokens;
}

function extractMixinBody(source: string, mixinName: string): string {
  const root = scss.parse(source);
  let mixinBody = '';

  root.walkAtRules('mixin', (rule) => {
    if (rule.params.startsWith(`${mixinName}(`)) {
      mixinBody = rule.toString();
    }
  });

  return mixinBody;
}

describe('SCSS ↔ TS token sync', () => {
  it.each(['dark', 'light', 'sepia'])('%s theme SCSS tokens match THEME_TOKEN_NAMES', (theme) => {
    const stylesDir = resolve(__dirname, '../styles');

    const themeScss = readFileSync(resolve(stylesDir, `themes/_${theme}.scss`), 'utf-8');
    const variablesScss = readFileSync(resolve(stylesDir, '_variables.scss'), 'utf-8');

    const themeTokens = extractTokens(themeScss);
    const mixinBody = extractMixinBody(variablesScss, 'component-tokens');
    const mixinTokens = extractTokens(mixinBody);

    const scssTokens = new Set([...themeTokens, ...mixinTokens]);
    const tsTokens = new Set<string>(THEME_TOKEN_NAMES);

    const inScssOnly = [...scssTokens].filter((t) => !tsTokens.has(t)).sort();
    const inTsOnly = [...tsTokens].filter((t) => !scssTokens.has(t)).sort();

    expect(inScssOnly, 'Tokens in SCSS but not in THEME_TOKEN_NAMES').toEqual([]);
    expect(inTsOnly, 'Tokens in THEME_TOKEN_NAMES but not in SCSS').toEqual([]);
  });
});

// --- deriveThemeTokens pure function tests ---

describe('deriveThemeTokens', () => {
  it.each([
    ['surfaceBg', '--surface-bg', '#08091a'],
    ['textPrimary', '--text-primary', '#f5f0e6'],
    ['accentPrimary', '--accent-primary', '#d4a843'],
  ])('maps seed %s to %s', (_seedKey, token, expected) => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result[token]).toBe(expected);
  });

  it('derives surface scale with color-mix expressions', () => {
    const result = deriveThemeTokens(DARK_SEED);
    // Verify all surface tokens are valid color-mix() expressions
    ['--surface-1', '--surface-2', '--surface-3', '--surface-4'].forEach((token) => {
      expect(result[token]).toMatch(/^color-mix\(in oklch, #08091a, white \d+%\)$/);
    });
    // Verify progression: each surface level has increasing mix percentage
    const surface1Pct = parseInt(/(\d+)%/.exec(result['--surface-1'])?.[1] ?? '0', 10);
    const surface2Pct = parseInt(/(\d+)%/.exec(result['--surface-2'])?.[1] ?? '0', 10);
    const surface3Pct = parseInt(/(\d+)%/.exec(result['--surface-3'])?.[1] ?? '0', 10);
    const surface4Pct = parseInt(/(\d+)%/.exec(result['--surface-4'])?.[1] ?? '0', 10);
    expect(surface2Pct).toBeGreaterThan(surface1Pct);
    expect(surface3Pct).toBeGreaterThan(surface2Pct);
    expect(surface4Pct).toBeGreaterThan(surface3Pct);
    // Regression: exact expression ensures mixing strategy stability
    expect(result['--surface-1']).toBe('color-mix(in oklch, #08091a, white 5%)');
  });

  it('derives text hierarchy fading toward surfaceBg', () => {
    const result = deriveThemeTokens(DARK_SEED);
    // Verify all text hierarchy tokens use color-mix with increasing fade
    ['--text-secondary', '--text-tertiary', '--text-muted'].forEach((token) => {
      expect(result[token]).toMatch(/^color-mix\(in oklch, #f5f0e6, #08091a \d+%\)$/);
    });
    // Verify fade progression: each level fades more toward background
    const secondaryPct = parseInt(/(\d+)%/.exec(result['--text-secondary'])?.[1] ?? '0', 10);
    const tertiaryPct = parseInt(/(\d+)%/.exec(result['--text-tertiary'])?.[1] ?? '0', 10);
    const mutedPct = parseInt(/(\d+)%/.exec(result['--text-muted'])?.[1] ?? '0', 10);
    expect(tertiaryPct).toBeGreaterThan(secondaryPct);
    expect(mutedPct).toBeGreaterThan(tertiaryPct);
    // Regression: exact expression ensures mixing strategy stability
    expect(result['--text-secondary']).toBe('color-mix(in oklch, #f5f0e6, #08091a 25%)');
  });

  it('sets --text-inverse to surfaceBg', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--text-inverse']).toBe('#08091a');
  });

  it('derives accent hover/active variants', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--accent-primary-hover']).toContain('color-mix');
    expect(result['--accent-primary-active']).toContain('color-mix');
  });

  it('dark scheme hover lightens (mixes with white)', () => {
    const result = deriveThemeTokens(DARK_SEED);
    // Verify hover state uses color-mix with white
    expect(result['--accent-primary-hover']).toMatch(
      /^color-mix\(in oklch, #d4a843, white \d+%\)$/
    );
    // Verify hover differs from base
    expect(result['--accent-primary-hover']).not.toBe(result['--accent-primary']);
    // Regression: exact expression ensures mixing strategy stability
    expect(result['--accent-primary-hover']).toBe('color-mix(in oklch, #d4a843, white 15%)');
  });

  it('light scheme hover darkens (mixes with black)', () => {
    const result = deriveThemeTokens(LIGHT_SEED);
    // Verify hover state uses color-mix with black
    expect(result['--accent-primary-hover']).toMatch(
      /^color-mix\(in oklch, #576378, black \d+%\)$/
    );
    // Verify hover differs from base
    expect(result['--accent-primary-hover']).not.toBe(result['--accent-primary']);
  });

  it('defaults accentDecorative to accentPrimary', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--accent-decorative']).toBe('#d4a843');
  });

  it('uses provided accentDecorative when given', () => {
    const result = deriveThemeTokens({ ...DARK_SEED, accentDecorative: '#ff00ff' });
    expect(result['--accent-decorative']).toBe('#ff00ff');
  });

  it('defaults colorScheme to dark', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--shadow-color']).toBe('0 0 0');
    // Verify neu-shadow uses rgb() with shadow-color channel
    expect(result['--neu-shadow']).toMatch(/^rgb\(var\(--shadow-color\) \/ \d+%\)$/);
    // Dark themes use higher opacity for neumorphic shadows
    const neuShadowOpacity = parseInt(/(\d+)%/.exec(result['--neu-shadow'])?.[1] ?? '0', 10);
    expect(neuShadowOpacity).toBeGreaterThan(50);
  });

  it('light colorScheme produces light-appropriate tokens', () => {
    const result = deriveThemeTokens(LIGHT_SEED);
    expect(result['--shadow-color']).toBe('0 0 0');
    // Verify neu-shadow and neu-light use rgb() with channel references
    expect(result['--neu-shadow']).toMatch(/^rgb\(var\(--shadow-color\) \/ \d+%\)$/);
    expect(result['--neu-light']).toMatch(/^rgb\(var\(--highlight-color\) \/ \d+%\)$/);
    // Light themes use lower opacity for neumorphic shadows
    const neuShadowOpacity = parseInt(/(\d+)%/.exec(result['--neu-shadow'])?.[1] ?? '0', 10);
    expect(neuShadowOpacity).toBeLessThan(50);
    // Light themes use higher opacity for neumorphic highlights
    const neuLightOpacity = parseInt(/(\d+)%/.exec(result['--neu-light'])?.[1] ?? '0', 10);
    expect(neuLightOpacity).toBeGreaterThan(50);
  });

  it('dark scheme uses dark semantic colors', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--color-success']).toBe('#10b981');
    expect(result['--color-error']).toBe('#ef4444');
  });

  it('light scheme uses light semantic colors', () => {
    const result = deriveThemeTokens(LIGHT_SEED);
    expect(result['--color-success']).toBe('#0d6b4e');
    expect(result['--color-error']).toBe('#991b1b');
  });

  it('does not include icon tokens (--icon-*)', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--icon-select-chevron']).toBeUndefined();
  });

  it('produces bridge tokens as var() references', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--surface-deep']).toBe('var(--surface-2)');
    expect(result['--input-border-focus']).toBe('var(--accent-primary)');
  });

  it.each([
    [
      'colorSuccess',
      '#00cc66',
      '--color-success',
      '--color-success-subtle',
      '--color-success-text',
    ],
    ['colorError', '#ff2222', '--color-error', '--color-error-subtle', '--color-error-text'],
    ['colorWarning', '#ffaa00', '--color-warning', undefined, undefined],
    ['colorInfo', '#0066ff', '--color-info', undefined, undefined],
  ])('uses provided %s seed', (seedKey, seedValue, baseToken, subtleToken, textToken) => {
    const result = deriveThemeTokens({ ...DARK_SEED, [seedKey]: seedValue });
    expect(result[baseToken]).toBe(seedValue);
    if (subtleToken) expect(result[subtleToken]).toContain(seedValue);
    if (textToken) expect(result[textToken]).toContain(seedValue);
  });

  it('falls back to defaults when semantic color seeds are omitted', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--color-success']).toBe('#10b981');
    expect(result['--color-error']).toBe('#ef4444');
    expect(result['--color-warning']).toBe('#fcd34d');
    expect(result['--color-info']).toBe('#3b82f6');
  });

  it('produces all expected non-icon tokens', () => {
    const result = deriveThemeTokens(DARK_SEED);
    const iconTokens = ['--icon-select-chevron'];
    const expectedTokens = THEME_TOKEN_NAMES.filter((t) => !iconTokens.includes(t));
    for (const token of expectedTokens) {
      expect(result[token], `Missing token: ${token}`).toBeDefined();
    }
  });
});
