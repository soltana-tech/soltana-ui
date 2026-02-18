// ---------------------------------------------------------------------------
// Matplotlib Style Builder
// ---------------------------------------------------------------------------

import type { ThemeTokens, FoundationTokens } from '../types.js';
import { buildPalette } from '../resolve.js';

/**
 * Convert a CSS color value to bare hex for matplotlib's rcParams format.
 * `#` starts a comment in `.mplstyle` files, so all hex values must be bare.
 * - `#rrggbb` → `rrggbb`
 * - `rgb(r g b / a%)` → `rrggbbaa` (8-digit bare hex)
 * - Other values → pass through unchanged
 */
function toMplColor(value: string): string {
  const rgbMatch = /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+)(%?)\s*\)$/.exec(value);
  if (rgbMatch) {
    const r = Number(rgbMatch[1]);
    const g = Number(rgbMatch[2]);
    const b = Number(rgbMatch[3]);
    const rawAlpha = Number(rgbMatch[4]);
    const alpha = rgbMatch[5] === '%' ? rawAlpha / 100 : rawAlpha;
    const a = Math.round(alpha * 255);
    return [r, g, b, a].map((v) => v.toString(16).padStart(2, '0')).join('');
  }
  // Strip leading '#' — it's a comment character in mplstyle
  return value.replace(/^#/, '');
}

/**
 * Build a `.mplstyle` string from extracted tokens.
 * Format: `key: value\n` — matplotlib's rcParams file format.
 */
export function buildMplStyle(theme: ThemeTokens, foundation: FoundationTokens): string {
  const palette = buildPalette(theme);
  // matplotlib prop_cycle expects bare hex without '#'
  const cycleColors = palette.map((c) => c.replace('#', '')).join("', '");

  const fontFamily = foundation.fontFamily.sans;
  // Extract first font name for font.sans-serif
  const sansFonts = fontFamily
    .split(',')
    .map((f) => f.trim().replace(/^["']|["']$/g, ''))
    .join(', ');

  const lines: [string, string][] = [
    // Figure
    ['figure.facecolor', theme.surfaceBg],
    ['figure.edgecolor', theme.surfaceBg],
    ['savefig.facecolor', theme.surfaceBg],
    ['savefig.edgecolor', theme.surfaceBg],

    // Axes
    ['axes.facecolor', theme.surface1],
    ['axes.edgecolor', theme.borderDefault],
    ['axes.labelcolor', theme.textSecondary],
    [`axes.prop_cycle`, `cycler('color', ['${cycleColors}'])`],

    // Grid
    ['grid.color', theme.borderSubtle],

    // Ticks
    ['xtick.color', theme.borderDefault],
    ['ytick.color', theme.borderDefault],
    ['xtick.labelcolor', theme.textMuted],
    ['ytick.labelcolor', theme.textMuted],

    // Text
    ['text.color', theme.textPrimary],

    // Font
    ['font.family', 'sans-serif'],
    ['font.sans-serif', sansFonts],
  ];

  return (
    lines
      .map(([key, val]) => {
        // axes.prop_cycle uses bare hex inside cycler(); font values are not colors
        const isColor = !key.startsWith('font.') && key !== 'axes.prop_cycle';
        return `${key}: ${isColor ? toMplColor(val) : val}`;
      })
      .join('\n') + '\n'
  );
}
