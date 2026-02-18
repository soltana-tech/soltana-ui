import { describe, it, expect } from 'vitest';
import { buildEChartsTheme } from './echarts.js';
import type { ThemeTokens, FoundationTokens } from '../types.js';

const darkTheme: ThemeTokens = {
  colorScheme: 'dark',
  surfaceBg: '#08091a',
  surface1: '#0e1028',
  surface2: '#151838',
  surface3: '#1c2048',
  surface4: '#252a5a',
  textPrimary: '#f5f0e6',
  textSecondary: '#c5b99b',
  textTertiary: '#978b77',
  textMuted: '#897d69',
  textInverse: '#08091a',
  borderDefault: 'rgb(255 255 255 / 6%)',
  borderSubtle: 'rgb(255 255 255 / 3%)',
  borderStrong: 'rgb(255 255 255 / 10%)',
  accentPrimary: '#d4a843',
  accentSecondary: '#a855f7',
  colorSuccess: '#10b981',
  colorWarning: '#fcd34d',
  colorError: '#ef4444',
  colorInfo: '#3b82f6',
  tooltipBg: '#08091a',
  tooltipText: '#f5f0e6',
};

const foundation: FoundationTokens = {
  radius: { sm: '.25rem' },
  shadow: { sm: '0 1px 2px 0 rgb(0 0 0 / 8%)' },
  transition: { fast: '75ms' },
  easing: { in: 'cubic-bezier(.4, 0, 1, 1)' },
  z: { modal: '200' },
  fontFamily: { sans: '"Raleway", ui-sans-serif, sans-serif' },
  fontSize: { base: ['1rem', '1.65'] },
  fontWeight: { regular: '400' },
  letterSpacing: { refined: '.02em' },
};

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
