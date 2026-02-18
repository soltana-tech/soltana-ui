// ---------------------------------------------------------------------------
// Color Resolution & Palette Construction
// ---------------------------------------------------------------------------
// Normalizes CSS color values and builds a 6-color palette from theme tokens
// for chart color cycles.
// ---------------------------------------------------------------------------

import type { ThemeTokens, ColorPalette } from './types.js';

/**
 * Normalize a CSS color value to a consistent format.
 * - Hex values pass through unchanged
 * - `rgb(r g b / a%)` → `rgba(r, g, b, a%)`
 * - Other formats pass through unchanged
 */
export function normalizeColor(value: string): string {
  // Modern rgb() with slash alpha: rgb(r g b / a%)
  const rgbSlash = /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\/\s*([^)]+)\)$/.exec(value);
  if (rgbSlash) {
    return `rgba(${rgbSlash[1]}, ${rgbSlash[2]}, ${rgbSlash[3]}, ${rgbSlash[4].trim()})`;
  }
  return value;
}

/**
 * Convert a hex color string to an [r, g, b] tuple (0-255).
 * Supports 3-digit (#abc), 4-digit (#abcd), 6-digit (#aabbcc),
 * and 8-digit (#aabbccdd) hex values.
 */
export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '');

  if (h.length === 3 || h.length === 4) {
    h = h
      .slice(0, 3)
      .split('')
      .map((c) => c + c)
      .join('');
  } else if (h.length === 8) {
    h = h.slice(0, 6);
  }

  const num = parseInt(h, 16);
  return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
}

/**
 * Build a 6-color palette from theme tokens for chart color cycles.
 *
 * Order maximizes hue separation between adjacent colors:
 * `[accentPrimary, colorInfo, colorSuccess, colorWarning, accentSecondary, colorError]`
 */
export function buildPalette(tokens: ThemeTokens): ColorPalette {
  return [
    tokens.accentPrimary,
    tokens.colorInfo,
    tokens.colorSuccess,
    tokens.colorWarning,
    tokens.accentSecondary,
    tokens.colorError,
  ];
}
