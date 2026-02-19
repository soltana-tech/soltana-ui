// ---------------------------------------------------------------------------
// ECharts Theme Builder — Runtime
// ---------------------------------------------------------------------------
// Reads live CSS custom properties from document.documentElement and maps
// them to an ECharts theme object. Mirrors the static token mapping in
// @soltana-ui/tokens but resolves at runtime for the active tier config.
// ---------------------------------------------------------------------------

// Shared palette order — must stay in sync with PALETTE_PROPS in
// @soltana-ui/plotly (packages/plotly/src/build-template.ts).
const PALETTE_PROPS = [
  '--accent-primary',
  '--color-info',
  '--color-success',
  '--color-warning',
  '--accent-secondary',
  '--color-error',
] as const;

/** ECharts theme object built from live CSS custom properties. */
export type EChartsThemeObject = Record<string, unknown>;

function readProp(style: CSSStyleDeclaration, prop: string): string {
  return style.getPropertyValue(prop).trim();
}

/** Build an ECharts theme from the currently active Soltana CSS variables. */
export function buildTheme(): EChartsThemeObject {
  const style = getComputedStyle(document.documentElement);

  const surfaceBg = readProp(style, '--surface-bg');
  const textPrimary = readProp(style, '--text-primary');
  const textSecondary = readProp(style, '--text-secondary');
  const textMuted = readProp(style, '--text-muted');
  const borderDefault = readProp(style, '--border-default');
  const borderSubtle = readProp(style, '--border-subtle');
  const tooltipBg = readProp(style, '--tooltip-bg');
  const tooltipText = readProp(style, '--tooltip-text');
  const fontSans = readProp(style, '--font-sans');

  const palette = PALETTE_PROPS.map((p) => readProp(style, p));

  return {
    color: palette,
    backgroundColor: surfaceBg,
    textStyle: {
      color: textPrimary,
      fontFamily: fontSans,
    },
    title: {
      textStyle: {
        color: textPrimary,
        fontFamily: fontSans,
      },
      subtextStyle: {
        color: textSecondary,
      },
    },
    legend: {
      textStyle: {
        color: textSecondary,
      },
    },
    tooltip: {
      backgroundColor: tooltipBg,
      textStyle: {
        color: tooltipText,
      },
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: borderDefault } },
      axisTick: { lineStyle: { color: borderDefault } },
      axisLabel: { color: textMuted },
      splitLine: { lineStyle: { color: borderSubtle } },
    },
    valueAxis: {
      axisLine: { lineStyle: { color: borderDefault } },
      axisTick: { lineStyle: { color: borderDefault } },
      axisLabel: { color: textMuted },
      splitLine: { lineStyle: { color: borderSubtle } },
    },
  };
}
