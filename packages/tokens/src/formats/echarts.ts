// ---------------------------------------------------------------------------
// ECharts Theme Builder
// ---------------------------------------------------------------------------

import type { ThemeTokens, FoundationTokens } from '../types.js';
import { buildPalette, hexToRgb } from '../resolve.js';

/** Return an rgba() string by injecting an alpha channel into a hex or rgb() color. */
function withAlpha(color: string, alpha: number): string {
  const hex = /^#([0-9a-f]{3,8})$/i.exec(color);
  if (hex) {
    const [r, g, b] = hexToRgb(color);
    return `rgba(${String(r)}, ${String(g)}, ${String(b)}, ${String(alpha)})`;
  }
  const rgb = /^rgb\(\s*(\d+)[, ]\s*(\d+)[, ]\s*(\d+)\s*\)$/.exec(color);
  if (rgb) return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${String(alpha)})`;
  return color;
}

/** Build an ECharts theme JSON object from extracted tokens. */
export function buildEChartsTheme(
  theme: ThemeTokens,
  foundation: FoundationTokens
): Record<string, unknown> {
  const palette = buildPalette(theme);
  const fontFamily = foundation.fontFamily.sans;

  const axisDefaults = {
    axisLine: { lineStyle: { color: theme.borderDefault } },
    axisTick: { lineStyle: { color: theme.borderDefault } },
    axisLabel: { color: theme.textMuted },
    splitLine: { lineStyle: { color: theme.borderSubtle } },
    splitArea: {
      areaStyle: { color: ['transparent', withAlpha(theme.borderSubtle, 0.05)] },
    },
  };

  return {
    darkMode: theme.colorScheme === 'dark',
    color: palette,
    backgroundColor: theme.surfaceBg,
    textStyle: {
      color: theme.textPrimary,
      fontFamily,
    },
    title: {
      textStyle: {
        color: theme.textPrimary,
        fontFamily,
      },
      subtextStyle: {
        color: theme.textSecondary,
      },
    },
    legend: {
      textStyle: {
        color: theme.textSecondary,
      },
    },
    tooltip: {
      backgroundColor: theme.tooltipBg,
      textStyle: {
        color: theme.tooltipText,
      },
    },
    categoryAxis: axisDefaults,
    valueAxis: axisDefaults,
    timeAxis: axisDefaults,
    logAxis: axisDefaults,
    axisPointer: {
      lineStyle: { color: theme.borderDefault },
      crossStyle: { color: theme.borderDefault },
      label: {
        color: theme.textMuted,
        backgroundColor: theme.surface1,
      },
    },
    dataZoom: {
      backgroundColor: theme.surface1,
      borderColor: theme.borderDefault,
      fillerColor: withAlpha(theme.accentPrimary, 0.2),
      handleColor: theme.accentPrimary,
      textStyle: { color: theme.textMuted },
      dataBackground: {
        lineStyle: { color: theme.borderDefault },
        areaStyle: { color: theme.borderSubtle },
      },
      selectedDataBackground: {
        lineStyle: { color: theme.accentPrimary },
        areaStyle: { color: withAlpha(theme.accentPrimary, 0.2) },
      },
    },
    candlestick: {
      itemStyle: {
        color: theme.colorSuccess,
        color0: theme.colorError,
        borderColor: theme.colorSuccess,
        borderColor0: theme.colorError,
      },
    },
    graph: {
      lineStyle: { color: theme.borderDefault, width: 1 },
      label: { color: theme.textPrimary },
      itemStyle: { borderColor: theme.borderDefault, borderWidth: 1 },
    },
    visualMap: {
      textStyle: { color: theme.textMuted },
    },
  };
}
