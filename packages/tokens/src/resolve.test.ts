import { describe, it, expect } from 'vitest';
import { hexToRgb, buildPalette } from './resolve.js';
import { darkTheme } from './__fixtures__/tokens.js';

describe('hexToRgb', () => {
  it('converts 6-digit hex', () => {
    expect(hexToRgb('#d4a843')).toEqual([212, 168, 67]);
    expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
    expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
  });

  it('converts 3-digit hex', () => {
    expect(hexToRgb('#fff')).toEqual([255, 255, 255]);
    expect(hexToRgb('#000')).toEqual([0, 0, 0]);
  });

  it('converts 8-digit hex (ignores alpha)', () => {
    expect(hexToRgb('#d4a843ff')).toEqual([212, 168, 67]);
  });

  it('handles hex without # prefix', () => {
    expect(hexToRgb('d4a843')).toEqual([212, 168, 67]);
  });
});

describe('buildPalette', () => {
  it('returns 6-color palette', () => {
    const palette = buildPalette(darkTheme);
    expect(palette).toHaveLength(6);
  });

  it('places accent primary first', () => {
    const palette = buildPalette(darkTheme);
    expect(palette[0]).toBe('#d4a843');
  });

  it('orders for maximum hue separation', () => {
    const palette = buildPalette(darkTheme);
    expect(palette).toEqual([
      '#d4a843', // accentPrimary (gold)
      '#3b82f6', // colorInfo (blue)
      '#10b981', // colorSuccess (green)
      '#fcd34d', // colorWarning (yellow)
      '#a855f7', // accentSecondary (purple)
      '#ef4444', // colorError (red)
    ]);
  });
});
