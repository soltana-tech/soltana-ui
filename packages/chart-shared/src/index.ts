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
