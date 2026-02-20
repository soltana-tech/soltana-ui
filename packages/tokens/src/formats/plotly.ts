// ---------------------------------------------------------------------------
// Plotly Template Builder
// ---------------------------------------------------------------------------

import type { ThemeTokens, FoundationTokens } from '../types.js';
import { buildPalette } from '../resolve.js';

/** Build a Plotly template JSON object from extracted tokens. */
export function buildPlotlyTemplate(
  theme: ThemeTokens,
  foundation: FoundationTokens
): Record<string, unknown> {
  const palette = buildPalette(theme);
  const fontFamily = foundation.fontFamily.sans;

  return {
    layout: {
      paper_bgcolor: theme.surfaceBg,
      plot_bgcolor: theme.surface1,
      colorway: palette,
      font: {
        color: theme.textPrimary,
        family: fontFamily,
      },
      title: {
        font: {
          color: theme.textPrimary,
        },
      },
      xaxis: {
        gridcolor: theme.borderSubtle,
        linecolor: theme.borderDefault,
        tickfont: { color: theme.textMuted },
        title: { font: { color: theme.textSecondary } },
        zerolinecolor: theme.borderDefault,
      },
      yaxis: {
        gridcolor: theme.borderSubtle,
        linecolor: theme.borderDefault,
        tickfont: { color: theme.textMuted },
        title: { font: { color: theme.textSecondary } },
        zerolinecolor: theme.borderDefault,
      },
      hoverlabel: {
        bgcolor: theme.tooltipBg,
        font: { color: theme.tooltipText },
        bordercolor: theme.borderDefault,
      },
      legend: {
        font: { color: theme.textSecondary },
        bgcolor: theme.surface1,
        bordercolor: theme.borderSubtle,
      },
      coloraxis: {
        colorbar: {
          tickfont: { color: theme.textMuted },
          title: { font: { color: theme.textSecondary } },
          outlinecolor: theme.borderDefault,
        },
      },
    },
  };
}
