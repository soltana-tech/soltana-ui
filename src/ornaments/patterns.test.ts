import { describe, it, expect } from 'vitest';
import { greekKey, scrollwork, dentil, medallion, cornerOrnament, patterns } from './patterns';
import type { PatternName } from './patterns';

const PATTERN_FNS = { greekKey, scrollwork, dentil, medallion, cornerOrnament };

describe('ornament patterns', () => {
  it.each(Object.entries(PATTERN_FNS))(
    '%s returns valid SVG with currentColor by default',
    (_name, fn) => {
      const svg = fn();
      expect(svg).toContain('<svg');
      expect(svg).toContain('currentColor');
    }
  );

  it.each(Object.entries(PATTERN_FNS))('%s interpolates custom color', (_name, fn) => {
    const svg = fn('#ff0000');
    expect(svg).toContain('#ff0000');
    expect(svg).not.toContain('currentColor');
  });

  it('patterns map contains all expected keys', () => {
    const expected: PatternName[] = ['greek-key', 'scrollwork', 'dentil', 'medallion', 'corner'];
    expect(Object.keys(patterns).sort()).toEqual([...expected].sort());
  });

  it('patterns map entries return SVG strings', () => {
    for (const fn of Object.values(patterns)) {
      const svg = fn();
      expect(svg).toContain('<svg');
    }
  });
});
