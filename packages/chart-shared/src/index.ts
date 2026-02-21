// ---------------------------------------------------------------------------
// Shared Charting Utilities
// ---------------------------------------------------------------------------
// Palette order and CSS property reader shared by @soltana-ui/echarts and
// @soltana-ui/plotly runtime builders. Kept in sync here rather than
// duplicated across packages.
// ---------------------------------------------------------------------------

/** Ordered palette props read from the active CSS theme. */
export const PALETTE_PROPS = [
  '--accent-primary',
  '--color-info',
  '--color-success',
  '--color-warning',
  '--accent-secondary',
  '--color-error',
] as const;

/** Read and trim a CSS custom property from a computed style. */
export function readProp(style: CSSStyleDeclaration, prop: string): string {
  return style.getPropertyValue(prop).trim();
}

/** Parse a hex color string to [r, g, b] (0–255). Supports 3/4/6/8-digit hex. */
function hexToRgb(hex: string): [number, number, number] {
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
 * Alpha-composite a CSS color against a background and return solid `#rrggbb`.
 * Handles `#rrggbb`, `#rgb`, and `rgb(r g b / a%)` inputs.
 */
export function toHex(color: string, background: string): string {
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

/** Return an rgba() string by injecting an alpha channel into a hex or rgb() color. */
export function withAlpha(color: string, alpha: number): string {
  const hex = /^#([0-9a-f]{3,8})$/i.exec(color);
  if (hex) {
    const [r, g, b] = hexToRgb(color);
    return `rgba(${String(r)}, ${String(g)}, ${String(b)}, ${String(alpha)})`;
  }
  const rgb = /^rgb\(\s*(\d+)[, ]\s*(\d+)[, ]\s*(\d+)\s*\)$/.exec(color);
  if (rgb) return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${String(alpha)})`;
  return color;
}
