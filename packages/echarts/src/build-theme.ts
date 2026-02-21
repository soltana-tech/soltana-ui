// ---------------------------------------------------------------------------
// ECharts Theme Builder — Runtime
// ---------------------------------------------------------------------------
// Reads live CSS custom properties from document.documentElement and maps
// them to an ECharts theme object. Mirrors the static token mapping in
// @soltana-ui/tokens but resolves at runtime for the active color scheme.
// ---------------------------------------------------------------------------

import { PALETTE_PROPS, readProp, withAlpha } from '@soltana-ui/chart-shared';

/** ECharts theme object built from live CSS custom properties. */
export type EChartsThemeObject = Record<string, unknown>;

/** Build an ECharts theme from the currently active Soltana CSS variables. */
export function buildTheme(): EChartsThemeObject {
  const style = getComputedStyle(document.documentElement);

  const colorScheme = readProp(style, 'color-scheme');
  const surfaceBg = readProp(style, '--surface-bg');
  const surface1 = readProp(style, '--surface-1');
  const textPrimary = readProp(style, '--text-primary');
  const textSecondary = readProp(style, '--text-secondary');
  const textMuted = readProp(style, '--text-muted');
  const borderDefault = readProp(style, '--border-default');
  const borderSubtle = readProp(style, '--border-subtle');
  const tooltipBg = readProp(style, '--tooltip-bg');
  const tooltipText = readProp(style, '--tooltip-text');
  const fontSans = readProp(style, '--font-sans');
  const accentPrimary = readProp(style, '--accent-primary');
  const colorSuccess = readProp(style, '--color-success');
  const colorError = readProp(style, '--color-error');

  const palette = PALETTE_PROPS.map((p) => readProp(style, p));

  const axisDefaults = {
    axisLine: { lineStyle: { color: borderDefault } },
    axisTick: { lineStyle: { color: borderDefault } },
    axisLabel: { color: textMuted },
    splitLine: { lineStyle: { color: borderSubtle } },
    splitArea: {
      areaStyle: { color: ['transparent', withAlpha(borderSubtle, 0.05)] },
    },
  };

  return {
    darkMode: colorScheme === 'dark',
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
    categoryAxis: axisDefaults,
    valueAxis: axisDefaults,
    timeAxis: axisDefaults,
    logAxis: axisDefaults,
    axisPointer: {
      lineStyle: { color: borderDefault },
      crossStyle: { color: borderDefault },
      label: {
        color: textMuted,
        backgroundColor: surface1,
      },
    },
    dataZoom: {
      backgroundColor: surface1,
      borderColor: borderDefault,
      fillerColor: withAlpha(accentPrimary, 0.2),
      handleColor: accentPrimary,
      textStyle: { color: textMuted },
      dataBackground: {
        lineStyle: { color: borderDefault },
        areaStyle: { color: borderSubtle },
      },
      selectedDataBackground: {
        lineStyle: { color: accentPrimary },
        areaStyle: { color: withAlpha(accentPrimary, 0.2) },
      },
    },
    candlestick: {
      itemStyle: {
        color: colorSuccess,
        color0: colorError,
        borderColor: colorSuccess,
        borderColor0: colorError,
      },
    },
    graph: {
      lineStyle: { color: borderDefault, width: 1 },
      label: { color: textPrimary },
      itemStyle: { borderColor: borderDefault, borderWidth: 1 },
    },
    visualMap: {
      textStyle: { color: textMuted },
    },
  };
}
