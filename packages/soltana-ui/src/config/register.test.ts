import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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
  for (const line of source.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//')) continue;
    const match = /^(--[\w-]+)\s*:/.exec(trimmed);
    if (match) {
      tokens.add(match[1]);
    }
  }
  return tokens;
}

function extractMixinBody(source: string, mixinName: string): string {
  const startIdx = source.indexOf(`@mixin ${mixinName}(`);
  if (startIdx === -1) return '';

  let braceDepth = 0;
  let bodyStart = -1;
  for (let i = startIdx; i < source.length; i++) {
    if (source[i] === '{') {
      if (bodyStart === -1) bodyStart = i + 1;
      braceDepth++;
    } else if (source[i] === '}') {
      braceDepth--;
      if (braceDepth === 0) {
        return source.slice(bodyStart, i);
      }
    }
  }
  return '';
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
    expect(result['--surface-1']).toContain('color-mix');
    expect(result['--surface-2']).toContain('color-mix');
    expect(result['--surface-3']).toContain('color-mix');
    expect(result['--surface-4']).toContain('color-mix');
  });

  it('derives text hierarchy fading toward surfaceBg', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--text-secondary']).toContain('color-mix');
    expect(result['--text-secondary']).toContain('#08091a');
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
    expect(result['--accent-primary-hover']).toContain('white');
  });

  it('light scheme hover darkens (mixes with black)', () => {
    const result = deriveThemeTokens(LIGHT_SEED);
    expect(result['--accent-primary-hover']).toContain('black');
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
    expect(result['--neu-shadow']).toContain('65%');
  });

  it('light colorScheme produces light-appropriate tokens', () => {
    const result = deriveThemeTokens(LIGHT_SEED);
    expect(result['--shadow-color']).toBe('0 0 0');
    expect(result['--neu-shadow']).toContain('35%');
    expect(result['--neu-light']).toContain('88%');
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
