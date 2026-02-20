// ---------------------------------------------------------------------------
// Plotly Template Builder — Runtime
// ---------------------------------------------------------------------------
// Reads live CSS custom properties from document.documentElement and maps
// them to a Plotly layout template. Mirrors the static token mapping in
// @soltana-ui/tokens but resolves at runtime for the active color scheme.
// ---------------------------------------------------------------------------

// Shared palette order — must stay in sync with PALETTE_PROPS in
// @soltana-ui/echarts (packages/echarts/src/build-theme.ts).
const PALETTE_PROPS = [
  '--accent-primary',
  '--color-info',
  '--color-success',
  '--color-warning',
  '--accent-secondary',
  '--color-error',
] as const;

/** Plotly template object built from live CSS custom properties. */
export interface PlotlyTemplate {
  layout: Record<string, unknown>;
}

function readProp(style: CSSStyleDeclaration, prop: string): string {
  return style.getPropertyValue(prop).trim();
}

/** Build a Plotly template from the currently active Soltana CSS variables. */
export function buildTemplate(): PlotlyTemplate {
  const style = getComputedStyle(document.documentElement);

  const surfaceBg = readProp(style, '--surface-bg');
  const surface1 = readProp(style, '--surface-1');
  const textPrimary = readProp(style, '--text-primary');
  const textSecondary = readProp(style, '--text-secondary');
  const textMuted = readProp(style, '--text-muted');
  const borderDefault = readProp(style, '--border-default');
  const borderSubtle = readProp(style, '--border-subtle');
  const fontSans = readProp(style, '--font-sans');
  const tooltipBg = readProp(style, '--tooltip-bg');
  const tooltipText = readProp(style, '--tooltip-text');

  const colorway = PALETTE_PROPS.map((p) => readProp(style, p));

  return {
    layout: {
      paper_bgcolor: surfaceBg,
      plot_bgcolor: surface1,
      colorway,
      font: {
        color: textPrimary,
        family: fontSans,
      },
      title: {
        font: { color: textPrimary },
      },
      xaxis: {
        gridcolor: borderSubtle,
        linecolor: borderDefault,
        tickfont: { color: textMuted },
        title: { font: { color: textSecondary } },
        zerolinecolor: borderDefault,
      },
      yaxis: {
        gridcolor: borderSubtle,
        linecolor: borderDefault,
        tickfont: { color: textMuted },
        title: { font: { color: textSecondary } },
        zerolinecolor: borderDefault,
      },
      hoverlabel: {
        bgcolor: tooltipBg,
        font: { color: tooltipText },
        bordercolor: borderDefault,
      },
      legend: {
        font: { color: textSecondary },
        bgcolor: surface1,
        bordercolor: borderSubtle,
      },
      coloraxis: {
        colorbar: {
          tickfont: { color: textMuted },
          title: { font: { color: textSecondary } },
          outlinecolor: borderDefault,
        },
      },
    },
  };
}
