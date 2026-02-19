// ---------------------------------------------------------------------------
// DTCG (Design Token Community Group) Builder
// ---------------------------------------------------------------------------
// Produces W3C-compliant design token files with `$type` and `$value`.
// ---------------------------------------------------------------------------

import type { ThemeTokens, FoundationTokens } from '../types.js';

interface DtcgToken {
  $type: string;
  $value: unknown;
}

/** Build a DTCG theme token file from a ThemeTokens map. */
export function buildDtcgTheme(theme: ThemeTokens): Record<string, unknown> {
  const color = (value: string): DtcgToken => ({ $type: 'color', $value: value });

  return {
    surface: {
      bg: color(theme.surfaceBg),
      1: color(theme.surface1),
      2: color(theme.surface2),
      3: color(theme.surface3),
      4: color(theme.surface4),
    },
    text: {
      primary: color(theme.textPrimary),
      secondary: color(theme.textSecondary),
      tertiary: color(theme.textTertiary),
      muted: color(theme.textMuted),
      inverse: color(theme.textInverse),
    },
    border: {
      default: color(theme.borderDefault),
      subtle: color(theme.borderSubtle),
      strong: color(theme.borderStrong),
    },
    accent: {
      primary: color(theme.accentPrimary),
      secondary: color(theme.accentSecondary),
    },
    semantic: {
      success: color(theme.colorSuccess),
      warning: color(theme.colorWarning),
      error: color(theme.colorError),
      info: color(theme.colorInfo),
    },
    tooltip: {
      bg: color(theme.tooltipBg),
      text: color(theme.tooltipText),
    },
    colorScheme: {
      $type: 'string',
      $value: theme.colorScheme,
    },
  };
}

/**
 * Parse a CSS box-shadow string into DTCG shadow token format.
 * Handles `inset`, multiple comma-separated shadows, and `none`.
 */
function parseShadow(raw: string): unknown {
  if (raw === 'none')
    return { offsetX: '0', offsetY: '0', blur: '0', spread: '0', color: 'transparent' };

  const shadows = raw.split(/,\s*(?=\d|inset)/).map((s) => {
    const inset = s.startsWith('inset');
    const parts = s.replace('inset', '').trim().split(/\s+/);
    if (parts.length < 2) {
      return { offsetX: '0', offsetY: '0', blur: '0', spread: '0', color: 'transparent' };
    }
    // CSS shadow: offsetX offsetY blur spread color...
    return {
      ...(inset ? { inset: true } : {}),
      offsetX: parts[0] ?? '0',
      offsetY: parts[1] ?? '0',
      blur: parts[2] ?? '0',
      spread: parts[3] ?? '0',
      color: parts.slice(4).join(' ') || 'rgb(0 0 0)',
    };
  });

  return shadows.length === 1 ? shadows[0] : shadows;
}

/**
 * Parse a CSS cubic-bezier() into a DTCG cubicBezier tuple.
 * Returns `[x1, y1, x2, y2]`.
 */
function parseCubicBezier(raw: string): [number, number, number, number] {
  const match = /cubic-bezier\(([^)]+)\)/.exec(raw);
  if (!match) return [0, 0, 1, 1];
  const parts = match[1].split(',').map((s) => parseFloat(s.trim()));
  if (parts.length !== 4 || parts.some(isNaN)) return [0, 0, 1, 1];
  return [parts[0], parts[1], parts[2], parts[3]];
}

/** Build a DTCG foundation token file from a FoundationTokens map. */
export function buildDtcgFoundation(foundation: FoundationTokens): Record<string, unknown> {
  const dimension = (value: string): DtcgToken => ({ $type: 'dimension', $value: value });
  const number = (value: string): DtcgToken => ({ $type: 'number', $value: parseFloat(value) });

  const result: Record<string, unknown> = {};

  // Radius → dimension
  result.radius = Object.fromEntries(
    Object.entries(foundation.radius).map(([k, v]) => [k, dimension(v)])
  );

  // Shadow → shadow
  result.shadow = Object.fromEntries(
    Object.entries(foundation.shadow).map(([k, v]) => [
      k,
      { $type: 'shadow', $value: parseShadow(v) },
    ])
  );

  // Transition → duration
  result.transition = Object.fromEntries(
    Object.entries(foundation.transition).map(([k, v]) => [k, { $type: 'duration', $value: v }])
  );

  // Easing → cubicBezier
  result.easing = Object.fromEntries(
    Object.entries(foundation.easing).map(([k, v]) => [
      k,
      { $type: 'cubicBezier', $value: parseCubicBezier(v) },
    ])
  );

  // Z-index → number
  result.z = Object.fromEntries(Object.entries(foundation.z).map(([k, v]) => [k, number(v)]));

  // Font family → fontFamily
  result.fontFamily = Object.fromEntries(
    Object.entries(foundation.fontFamily).map(([k, v]) => [
      k,
      {
        $type: 'fontFamily',
        $value: v.split(',').map((f) => f.trim().replace(/^["']|["']$/g, '')),
      },
    ])
  );

  // Font weight → fontWeight
  result.fontWeight = Object.fromEntries(
    Object.entries(foundation.fontWeight).map(([k, v]) => [
      k,
      { $type: 'fontWeight', $value: parseInt(v, 10) },
    ])
  );

  // Font size → dimension (paired with line height)
  result.fontSize = Object.fromEntries(
    Object.entries(foundation.fontSize).map(([k, [size, lineHeight]]) => [
      k,
      {
        size: dimension(size),
        lineHeight: dimension(lineHeight),
      },
    ])
  );

  // Letter spacing → dimension
  result.letterSpacing = Object.fromEntries(
    Object.entries(foundation.letterSpacing).map(([k, v]) => [k, dimension(v)])
  );

  return result;
}
