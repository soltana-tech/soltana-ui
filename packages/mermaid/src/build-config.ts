// ---------------------------------------------------------------------------
// Mermaid Config Builder — Runtime
// ---------------------------------------------------------------------------
// Reads live CSS custom properties from document.documentElement and maps
// them to a Mermaid theme config. Mirrors the static token mapping in
// @soltana-ui/tokens but resolves at runtime for the active color scheme.
// ---------------------------------------------------------------------------

import { PALETTE_PROPS, readProp } from '@soltana-ui/chart-shared';

/** Mermaid theme config passed to `mermaid.initialize()`. */
export interface MermaidConfig {
  [key: string]: unknown;
  theme: 'base';
  themeVariables: Record<string, string | boolean>;
}

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

    const bgHex = background.replace('#', '');
    const br = parseInt(bgHex.slice(0, 2), 16);
    const bg = parseInt(bgHex.slice(2, 4), 16);
    const bb = parseInt(bgHex.slice(4, 6), 16);

    const r = Math.round(fr * alpha + br * (1 - alpha));
    const g = Math.round(fg * alpha + bg * (1 - alpha));
    const b = Math.round(fb * alpha + bb * (1 - alpha));

    return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
  }

  // Already hex — normalize to 6-digit lowercase
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

/** Build a Mermaid theme config from the currently active Soltana CSS variables. */
export function buildConfig(): MermaidConfig {
  const style = getComputedStyle(document.documentElement);

  const colorScheme = readProp(style, 'color-scheme');
  const surfaceBg = readProp(style, '--surface-bg');
  const surface1 = readProp(style, '--surface-1');
  const surface2 = readProp(style, '--surface-2');
  const surface3 = readProp(style, '--surface-3');
  const textPrimary = readProp(style, '--text-primary');
  const textMuted = readProp(style, '--text-muted');
  const borderDefault = readProp(style, '--border-default');
  const accentPrimary = readProp(style, '--accent-primary');
  const colorSuccess = readProp(style, '--color-success');
  const colorError = readProp(style, '--color-error');
  const fontSans = readProp(style, '--font-sans');

  const palette = PALETTE_PROPS.map((p) => readProp(style, p));
  const hex = (color: string): string => toHex(color, surfaceBg);

  return {
    theme: 'base',
    themeVariables: {
      darkMode: colorScheme === 'dark',

      // Surfaces
      background: hex(surfaceBg),
      primaryColor: hex(surface1),
      secondaryColor: hex(surface2),
      tertiaryColor: hex(surface3),
      mainBkg: hex(surface1),

      // Text
      primaryTextColor: hex(textPrimary),
      secondaryTextColor: hex(textPrimary),
      tertiaryTextColor: hex(textPrimary),
      labelTextColor: hex(textMuted),

      // Borders / Lines
      primaryBorderColor: hex(borderDefault),
      secondaryBorderColor: hex(borderDefault),
      tertiaryBorderColor: hex(borderDefault),
      nodeBorder: hex(borderDefault),
      lineColor: hex(borderDefault),

      // Sequence diagrams
      actorBkg: hex(surface1),
      actorTextColor: hex(textPrimary),
      actorBorder: hex(borderDefault),
      signalColor: hex(textPrimary),
      noteBkgColor: hex(surface2),
      noteTextColor: hex(textPrimary),
      noteBorderColor: hex(borderDefault),

      // Flowcharts
      clusterBkg: hex(surface1),
      edgeLabelBackground: hex(surface2),

      // Activation / state
      activationBorderColor: hex(accentPrimary),
      activeBorderColor: hex(accentPrimary),
      activeBkgColor: hex(accentPrimary),

      // Gantt semantic
      doneBorderColor: hex(colorSuccess),
      doneBkgColor: hex(colorSuccess),
      critBorderColor: hex(colorError),
      critBkgColor: hex(colorError),

      // Font
      fontFamily: fontSans,

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
