// ---------------------------------------------------------------------------
// Mermaid Theme Builder
// ---------------------------------------------------------------------------
// Builds a Mermaid-compatible theme config from extracted tokens. All color
// values are alpha-composited to solid hex — Mermaid only accepts #rrggbb.
// ---------------------------------------------------------------------------

import type { ThemeTokens, FoundationTokens } from '../types.js';
import { buildPalette, hexToRgb } from '../resolve.js';

/**
 * Alpha-composite a CSS color against a background and return solid `#rrggbb`.
 * Handles `#rrggbb`, `#rgb`, and `rgb(r g b / a%)` inputs.
 */
function toHex(color: string, background: string): string {
  const rgbMatch = /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+)(%?)\s*\)$/.exec(color);
  if (rgbMatch) {
    const fr = Number(rgbMatch[1]);
    const fg = Number(rgbMatch[2]);
    const fb = Number(rgbMatch[3]);
    const rawAlpha = Number(rgbMatch[4]);
    const alpha = rgbMatch[5] === '%' ? rawAlpha / 100 : rawAlpha;

    const [br, bg, bb] = hexToRgb(background);
    const r = Math.round(fr * alpha + br * (1 - alpha));
    const g = Math.round(fg * alpha + bg * (1 - alpha));
    const b = Math.round(fb * alpha + bb * (1 - alpha));

    return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
  }

  // Already hex — normalize to 6-digit
  const hex = /^#([0-9a-f]{3,8})$/i.exec(color);
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4) {
      h = h
        .slice(0, 3)
        .split('')
        .map((c) => c + c)
        .join('');
    } else if (h.length === 8) {
      h = h.slice(0, 6);
    }
    return '#' + h.toLowerCase();
  }

  return color;
}

/** Mermaid theme config shape passed to `mermaid.initialize()`. */
export interface MermaidConfig {
  theme: 'base';
  themeVariables: Record<string, string | boolean>;
}

/** Build a Mermaid theme config from extracted tokens. */
export function buildMermaidConfig(
  theme: ThemeTokens,
  foundation: FoundationTokens
): MermaidConfig {
  const palette = buildPalette(theme);
  const bg = theme.surfaceBg;
  const hex = (color: string): string => toHex(color, bg);

  const fontFamily = foundation.fontFamily.sans;

  return {
    theme: 'base',
    themeVariables: {
      darkMode: theme.colorScheme === 'dark',

      // Surfaces
      background: hex(bg),
      primaryColor: hex(theme.surface1),
      secondaryColor: hex(theme.surface2),
      tertiaryColor: hex(theme.surface3),
      mainBkg: hex(theme.surface1),

      // Text
      primaryTextColor: hex(theme.textPrimary),
      secondaryTextColor: hex(theme.textPrimary),
      tertiaryTextColor: hex(theme.textPrimary),
      labelTextColor: hex(theme.textMuted),

      // Borders / Lines
      primaryBorderColor: hex(theme.borderDefault),
      secondaryBorderColor: hex(theme.borderDefault),
      tertiaryBorderColor: hex(theme.borderDefault),
      nodeBorder: hex(theme.borderDefault),
      lineColor: hex(theme.borderDefault),

      // Sequence diagrams
      actorBkg: hex(theme.surface1),
      actorTextColor: hex(theme.textPrimary),
      actorBorder: hex(theme.borderDefault),
      signalColor: hex(theme.textPrimary),
      noteBkgColor: hex(theme.surface2),
      noteTextColor: hex(theme.textPrimary),
      noteBorderColor: hex(theme.borderDefault),

      // Flowcharts
      clusterBkg: hex(theme.surface1),
      edgeLabelBackground: hex(theme.surface2),

      // Activation / state
      activationBorderColor: hex(theme.accentPrimary),
      activeBorderColor: hex(theme.accentPrimary),
      activeBkgColor: hex(theme.accentPrimary),

      // Gantt semantic
      doneBorderColor: hex(theme.colorSuccess),
      doneBkgColor: hex(theme.colorSuccess),
      critBorderColor: hex(theme.colorError),
      critBkgColor: hex(theme.colorError),

      // Font
      fontFamily,

      // Pie chart palette
      pie1: hex(palette[0]),
      pie2: hex(palette[1]),
      pie3: hex(palette[2]),
      pie4: hex(palette[3]),
      pie5: hex(palette[4]),
      pie6: hex(palette[5]),
    },
  };
}
