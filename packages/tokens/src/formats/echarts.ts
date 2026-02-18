// ---------------------------------------------------------------------------
// ECharts Theme Builder
// ---------------------------------------------------------------------------

import type { ThemeTokens, FoundationTokens } from '../types.js';
import { buildPalette } from '../resolve.js';

/** Build an ECharts theme JSON object from extracted tokens. */
export function buildEChartsTheme(
  theme: ThemeTokens,
  foundation: FoundationTokens
): Record<string, unknown> {
  const palette = buildPalette(theme);
  const fontFamily = foundation.fontFamily.sans;

  return {
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
    categoryAxis: {
      axisLine: {
        lineStyle: { color: theme.borderDefault },
      },
      axisTick: {
        lineStyle: { color: theme.borderDefault },
      },
      axisLabel: {
        color: theme.textMuted,
      },
      splitLine: {
        lineStyle: { color: theme.borderSubtle },
      },
    },
    valueAxis: {
      axisLine: {
        lineStyle: { color: theme.borderDefault },
      },
      axisTick: {
        lineStyle: { color: theme.borderDefault },
      },
      axisLabel: {
        color: theme.textMuted,
      },
      splitLine: {
        lineStyle: { color: theme.borderSubtle },
      },
    },
  };
}
