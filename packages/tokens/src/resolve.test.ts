import { describe, it, expect } from 'vitest';
import { normalizeColor, hexToRgb, buildPalette } from './resolve.js';
import type { ThemeTokens } from './types.js';

describe('normalizeColor', () => {
  it('passes hex values through unchanged', () => {
    expect(normalizeColor('#d4a843')).toBe('#d4a843');
    expect(normalizeColor('#fff')).toBe('#fff');
  });

  it('converts modern rgb() with slash alpha to rgba()', () => {
    expect(normalizeColor('rgb(255 255 255 / 6%)')).toBe('rgba(255, 255, 255, 6%)');
    expect(normalizeColor('rgb(85 97 120 / 12%)')).toBe('rgba(85, 97, 120, 12%)');
  });

  it('passes other formats through unchanged', () => {
    expect(normalizeColor('transparent')).toBe('transparent');
    expect(normalizeColor('rgba(0, 0, 0, 0.5)')).toBe('rgba(0, 0, 0, 0.5)');
  });
});

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
  const mockTokens: ThemeTokens = {
    colorScheme: 'dark',
    surfaceBg: '#08091a',
    surface1: '#0e1028',
    surface2: '#151838',
    surface3: '#1c2048',
    surface4: '#252a5a',
    textPrimary: '#f5f0e6',
    textSecondary: '#c5b99b',
    textTertiary: '#978b77',
    textMuted: '#897d69',
    textInverse: '#08091a',
    borderDefault: 'rgb(255 255 255 / 6%)',
    borderSubtle: 'rgb(255 255 255 / 3%)',
    borderStrong: 'rgb(255 255 255 / 10%)',
    accentPrimary: '#d4a843',
    accentSecondary: '#a855f7',
    colorSuccess: '#10b981',
    colorWarning: '#fcd34d',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    tooltipBg: '#08091a',
    tooltipText: '#f5f0e6',
  };

  it('returns 6-color palette', () => {
    const palette = buildPalette(mockTokens);
    expect(palette).toHaveLength(6);
  });

  it('places accent primary first', () => {
    const palette = buildPalette(mockTokens);
    expect(palette[0]).toBe('#d4a843');
  });

  it('orders for maximum hue separation', () => {
    const palette = buildPalette(mockTokens);
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
