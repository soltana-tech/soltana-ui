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

  it('sets axis styles', () => {
    const catAxis = result.categoryAxis as Record<string, Record<string, unknown>>;
    expect(catAxis.axisLabel.color).toBe('#897d69');
    expect((catAxis.axisLine.lineStyle as Record<string, unknown>).color).toBe(
      'rgb(255 255 255 / 6%)'
    );
    expect((catAxis.splitLine.lineStyle as Record<string, unknown>).color).toBe(
      'rgb(255 255 255 / 3%)'
    );
  });
});
