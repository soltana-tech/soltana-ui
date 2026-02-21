import { describe, it, expect } from 'vitest';
import { PALETTE_PROPS, readProp, toHex, withAlpha } from './index.js';

// ---------------------------------------------------------------------------
// PALETTE_PROPS
// ---------------------------------------------------------------------------

describe('PALETTE_PROPS', () => {
  it('contains exactly 6 entries', () => {
    expect(PALETTE_PROPS).toHaveLength(6);
  });

  it('starts with --accent-primary', () => {
    expect(PALETTE_PROPS[0]).toBe('--accent-primary');
  });

  it('contains all expected tokens', () => {
    expect(PALETTE_PROPS).toContain('--accent-primary');
    expect(PALETTE_PROPS).toContain('--color-info');
    expect(PALETTE_PROPS).toContain('--color-success');
    expect(PALETTE_PROPS).toContain('--color-warning');
    expect(PALETTE_PROPS).toContain('--accent-secondary');
    expect(PALETTE_PROPS).toContain('--color-error');
  });
});

// ---------------------------------------------------------------------------
// readProp
// ---------------------------------------------------------------------------

describe('readProp', () => {
  /** Minimal CSSStyleDeclaration stub for testing readProp in a non-DOM env. */
  function mockStyle(props: Record<string, string>): CSSStyleDeclaration {
    return {
      getPropertyValue: (name: string) => props[name] ?? '',
    } as unknown as CSSStyleDeclaration;
  }

  it('reads and trims a CSS custom property', () => {
    const style = mockStyle({ '--test-prop': '  #ff0000  ' });
    expect(readProp(style, '--test-prop')).toBe('#ff0000');
  });

  it('returns empty string for missing properties', () => {
    const style = mockStyle({});
    expect(readProp(style, '--nonexistent-prop')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// toHex
// ---------------------------------------------------------------------------

describe('toHex', () => {
  it('normalizes 6-digit hex to lowercase', () => {
    expect(toHex('#AABBCC', '#000000')).toBe('#aabbcc');
  });

  it('expands 3-digit hex to 6-digit', () => {
    expect(toHex('#abc', '#000000')).toBe('#aabbcc');
  });

  it('strips alpha from 8-digit hex', () => {
    expect(toHex('#aabbccff', '#000000')).toBe('#aabbcc');
  });

  it('strips alpha from 4-digit hex', () => {
    expect(toHex('#abcf', '#000000')).toBe('#aabbcc');
  });

  it('alpha-composites rgb() with fractional alpha against background', () => {
    // rgb(255 0 0 / 0.5) on #000000 → #800000
    expect(toHex('rgb(255 0 0 / 0.5)', '#000000')).toBe('#800000');
  });

  it('alpha-composites rgb() with percentage alpha against background', () => {
    // rgb(255 0 0 / 50%) on #000000 → #800000
    expect(toHex('rgb(255 0 0 / 50%)', '#000000')).toBe('#800000');
  });

  it('alpha-composites against a non-black background', () => {
    // rgb(0 0 0 / 0.5) on #ffffff → #808080
    expect(toHex('rgb(0 0 0 / 0.5)', '#ffffff')).toBe('#808080');
  });

  it('returns fully opaque rgb as solid hex', () => {
    // rgb(128 64 32 / 1) on any background → #804020
    expect(toHex('rgb(128 64 32 / 1)', '#000000')).toBe('#804020');
  });

  it('passes through unrecognized values unchanged', () => {
    expect(toHex('red', '#000000')).toBe('red');
    expect(toHex('hsl(0 100% 50%)', '#000000')).toBe('hsl(0 100% 50%)');
  });
});

// ---------------------------------------------------------------------------
// withAlpha
// ---------------------------------------------------------------------------

describe('withAlpha', () => {
  it('converts 6-digit hex to rgba', () => {
    expect(withAlpha('#ff8000', 0.5)).toBe('rgba(255, 128, 0, 0.5)');
  });

  it('converts 3-digit hex to rgba', () => {
    expect(withAlpha('#f00', 0.3)).toBe('rgba(255, 0, 0, 0.3)');
  });

  it('strips existing alpha from 8-digit hex', () => {
    expect(withAlpha('#ff800080', 0.5)).toBe('rgba(255, 128, 0, 0.5)');
  });

  it('converts rgb() to rgba()', () => {
    expect(withAlpha('rgb(100, 200, 50)', 0.8)).toBe('rgba(100, 200, 50, 0.8)');
  });

  it('handles space-separated rgb()', () => {
    expect(withAlpha('rgb(100 200 50)', 0.8)).toBe('rgba(100, 200, 50, 0.8)');
  });

  it('passes through unrecognized values unchanged', () => {
    expect(withAlpha('red', 0.5)).toBe('red');
    expect(withAlpha('hsl(0 100% 50%)', 0.5)).toBe('hsl(0 100% 50%)');
  });
});
