import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { THEME_TOKEN_NAMES } from './register';

/**
 * Extract all CSS custom property declarations from SCSS source.
 * Ignores comment lines. Matches `--token-name:` at the start of trimmed lines.
 */
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

/**
 * Extract the body of a Sass mixin by name from source text.
 * Returns the content between the opening `{` and its matching `}`.
 */
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

/**
 * Validates that the custom properties declared across the dark theme SCSS file
 * and the component-tokens mixin match THEME_TOKEN_NAMES in register.ts.
 * Catches drift between the two schemas.
 */
describe('SCSS ↔ TS token sync', () => {
  it('dark theme SCSS tokens match THEME_TOKEN_NAMES', () => {
    const stylesDir = resolve(__dirname, '../styles');

    const darkScss = readFileSync(resolve(stylesDir, 'themes/_dark.scss'), 'utf-8');
    const variablesScss = readFileSync(resolve(stylesDir, '_variables.scss'), 'utf-8');

    // Tokens declared directly in the dark theme file
    const themeTokens = extractTokens(darkScss);

    // Tokens emitted by the component-tokens mixin
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
