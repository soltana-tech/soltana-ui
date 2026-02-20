import { describe, it, expect } from 'vitest';
import { buildEChartsTheme } from './echarts.js';
import { darkTheme, foundationStandard as foundation } from '../__fixtures__/tokens.js';

describe('buildEChartsTheme', () => {
  const result = buildEChartsTheme(darkTheme, foundation);

  it('sets 6-color palette', () => {
    expect(result.color).toHaveLength(6);
    expect((result.color as string[])[0]).toBe('#d4a843');
  });

  it('sets backgroundColor from surfaceBg', () => {
    expect(result.backgroundColor).toBe('#08091a');
  });

  it('sets textStyle from textPrimary and font family', () => {
    const textStyle = result.textStyle as Record<string, unknown>;
    expect(textStyle.color).toBe('#f5f0e6');
    expect(textStyle.fontFamily).toContain('Raleway');
  });

  it('sets title styles', () => {
    const title = result.title as Record<string, Record<string, unknown>>;
    expect(title.textStyle.color).toBe('#f5f0e6');
    expect(title.subtextStyle.color).toBe('#c5b99b');
  });

  it('sets tooltip styles', () => {
    const tooltip = result.tooltip as Record<string, unknown>;
    expect(tooltip.backgroundColor).toBe('#08091a');
    expect((tooltip.textStyle as Record<string, unknown>).color).toBe('#f5f0e6');
  });

  it('sets darkMode from colorScheme', () => {
    expect(result.darkMode).toBe(true);
  });

  it('sets axis styles with splitArea', () => {
    const catAxis = result.categoryAxis as Record<string, Record<string, unknown>>;
    expect(catAxis.axisLabel.color).toBe('#897d69');
    expect((catAxis.axisLine.lineStyle as Record<string, unknown>).color).toBe(
      'rgb(255 255 255 / 6%)'
    );
    expect((catAxis.splitLine.lineStyle as Record<string, unknown>).color).toBe(
      'rgb(255 255 255 / 3%)'
    );
    expect(catAxis.splitArea).toBeDefined();
  });

  it('sets timeAxis and logAxis identical to categoryAxis', () => {
    expect(result.timeAxis).toEqual(result.categoryAxis);
    expect(result.logAxis).toEqual(result.categoryAxis);
  });

  it('sets axisPointer styles', () => {
    const ap = result.axisPointer as Record<string, unknown>;
    expect(ap.lineStyle).toEqual({ color: 'rgb(255 255 255 / 6%)' });
    expect(ap.crossStyle).toEqual({ color: 'rgb(255 255 255 / 6%)' });
    const label = ap.label as Record<string, unknown>;
    expect(label.color).toBe('#897d69');
    expect(label.backgroundColor).toBe('#0e1028');
  });

  it('sets candlestick styles from semantic colors', () => {
    const cs = result.candlestick as Record<string, Record<string, unknown>>;
    expect(cs.itemStyle.color).toBe('#10b981');
    expect(cs.itemStyle.color0).toBe('#ef4444');
    expect(cs.itemStyle.borderColor).toBe('#10b981');
    expect(cs.itemStyle.borderColor0).toBe('#ef4444');
  });

  it('sets visualMap text styles', () => {
    const vm = result.visualMap as Record<string, Record<string, unknown>>;
    expect(vm.textStyle.color).toBe('#897d69');
  });

  it('sets dataZoom styles from surface and border tokens', () => {
    const dz = result.dataZoom as Record<string, unknown>;
    expect(dz.backgroundColor).toBe('#0e1028');
    expect(dz.borderColor).toBe('rgb(255 255 255 / 6%)');
    expect(dz.fillerColor).toBe('rgba(212, 168, 67, 0.2)');
    expect(dz.handleColor).toBe('#d4a843');
    expect(dz.textStyle).toEqual({ color: '#897d69' });
    const dataBg = dz.dataBackground as Record<string, Record<string, unknown>>;
    expect(dataBg.lineStyle.color).toBe('rgb(255 255 255 / 6%)');
    expect(dataBg.areaStyle.color).toBe('rgb(255 255 255 / 3%)');
    const selBg = dz.selectedDataBackground as Record<string, Record<string, unknown>>;
    expect(selBg.lineStyle.color).toBe('#d4a843');
    expect(selBg.areaStyle.color).toBe('rgba(212, 168, 67, 0.2)');
  });

  it('sets graph styles from border tokens', () => {
    const graph = result.graph as Record<string, unknown>;
    expect(graph.lineStyle).toEqual({ color: 'rgb(255 255 255 / 6%)', width: 1 });
    expect(graph.label).toEqual({ color: '#f5f0e6' });
    expect(graph.itemStyle).toEqual({ borderColor: 'rgb(255 255 255 / 6%)', borderWidth: 1 });
  });
});
