import { describe, it, expect } from 'vitest';
import { patterns, toDataUri, toElement } from './patterns.js';
import type { PatternName } from './patterns.js';

describe('ornament patterns', () => {
  it.each(Object.entries(patterns))(
    '%s returns valid SVG with currentColor by default',
    (_name, fn) => {
      const svg = fn();
      expect(svg).toContain('currentColor');
    }
  );

  it.each(Object.entries(patterns))('%s parses as valid SVG', (_name, fn) => {
    const svg = fn();
    const el = toElement(svg);
    expect(el.tagName).toBe('svg');
    expect(el.getAttribute('viewBox')).toBeTruthy();
  });

  it.each(Object.entries(patterns))('%s interpolates custom color', (_name, fn) => {
    const svg = fn('#ff0000');
    expect(svg).toContain('#ff0000');
    expect(svg).not.toContain('currentColor');
  });

  it('patterns map contains all expected keys', () => {
    const expected: PatternName[] = [
      'greek-key',
      'scrollwork',
      'dentil',
      'medallion',
      'corner',
      'faceted-divider',
      'faceted-corner',
    ];
    expect(Object.keys(patterns).sort()).toEqual([...expected].sort());
  });
});

describe('toDataUri', () => {
  const svg = patterns['greek-key']();

  it('returns a data URI with the correct prefix', () => {
    expect(toDataUri(svg)).toMatch(/^data:image\/svg\+xml,/);
  });

  it('contains encoded SVG content', () => {
    const uri = toDataUri(svg);
    expect(uri).toContain(encodeURIComponent('<svg'));
  });

  it('round-trips back to the original SVG', () => {
    const uri = toDataUri(svg);
    const prefix = 'data:image/svg+xml,';
    const decoded = decodeURIComponent(uri.slice(prefix.length));
    expect(decoded).toBe(svg.trim());
  });
});

describe('toElement', () => {
  const svg = patterns.medallion();

  it('returns an SVGElement', () => {
    const el = toElement(svg);
    expect(el).toBeInstanceOf(Element);
    expect(el.tagName).toBe('svg');
  });

  it('preserves SVG attributes', () => {
    const el = toElement(svg);
    expect(el.getAttribute('width')).toBe('48');
    expect(el.getAttribute('height')).toBe('48');
    expect(el.getAttribute('viewBox')).toBe('0 0 48 48');
  });

  it('throws on invalid SVG', () => {
    expect(() => toElement('<not-svg>>>')).toThrow('Invalid SVG');
  });
});
