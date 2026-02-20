import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildTheme, registerSoltanaTheme, autoSync, dark, light, sepia } from './index.js';
import {
  CSS_PROPS as BASE_CSS_PROPS,
  setCssProps,
  clearCssProps,
} from '@soltana-ui/chart-shared/test-helpers';

const CSS_PROPS: Record<string, string> = {
  ...BASE_CSS_PROPS,
  'color-scheme': 'dark',
  '--surface-1': '#1a1a30',
  '--tooltip-bg': '#252540',
  '--tooltip-text': '#ffffff',
};

describe('buildTheme', () => {
  beforeEach(() => {
    setCssProps(CSS_PROPS);
  });
  afterEach(() => {
    clearCssProps();
  });

  it('returns an object with color palette', () => {
    const theme = buildTheme();
    expect(theme.color).toEqual(['#6c63ff', '#3b82f6', '#22c55e', '#f59e0b', '#ec4899', '#ef4444']);
  });

  it('maps surface and text properties', () => {
    const theme = buildTheme();
    expect(theme.backgroundColor).toBe('#1a1a2e');
    expect(theme.textStyle).toEqual({
      color: '#e0e0e0',
      fontFamily: 'Inter, sans-serif',
    });
  });

  it('maps title styles', () => {
    const theme = buildTheme();
    const title = theme.title as Record<string, unknown>;
    expect(title.textStyle).toEqual({
      color: '#e0e0e0',
      fontFamily: 'Inter, sans-serif',
    });
    expect(title.subtextStyle).toEqual({ color: '#a0a0b0' });
  });

  it('maps tooltip styles', () => {
    const theme = buildTheme();
    expect(theme.tooltip).toEqual({
      backgroundColor: '#252540',
      textStyle: { color: '#ffffff' },
    });
  });

  it('sets darkMode from color-scheme', () => {
    const theme = buildTheme();
    expect(theme.darkMode).toBe(true);
  });

  it('sets darkMode false for light scheme', () => {
    document.documentElement.style.setProperty('color-scheme', 'light');
    const theme = buildTheme();
    expect(theme.darkMode).toBe(false);
  });

  it('maps axis styles with splitArea', () => {
    const theme = buildTheme();
    const expected = {
      axisLine: { lineStyle: { color: '#333355' } },
      axisTick: { lineStyle: { color: '#333355' } },
      axisLabel: { color: '#707080' },
      splitLine: { lineStyle: { color: '#2a2a44' } },
      splitArea: {
        areaStyle: { color: ['transparent', 'rgba(42, 42, 68, 0.05)'] },
      },
    };

    expect(theme.categoryAxis).toEqual(expected);
    expect(theme.valueAxis).toEqual(expected);
    expect(theme.timeAxis).toEqual(expected);
    expect(theme.logAxis).toEqual(expected);
  });

  it('maps axisPointer styles', () => {
    const theme = buildTheme();
    expect(theme.axisPointer).toEqual({
      lineStyle: { color: '#333355' },
      crossStyle: { color: '#333355' },
      label: {
        color: '#707080',
        backgroundColor: '#1a1a30',
      },
    });
  });

  it('maps candlestick styles', () => {
    const theme = buildTheme();
    expect(theme.candlestick).toEqual({
      itemStyle: {
        color: '#22c55e',
        color0: '#ef4444',
        borderColor: '#22c55e',
        borderColor0: '#ef4444',
      },
    });
  });

  it('maps visualMap styles', () => {
    const theme = buildTheme();
    expect(theme.visualMap).toEqual({
      textStyle: { color: '#707080' },
    });
  });

  it('maps dataZoom styles', () => {
    const theme = buildTheme();
    const dz = theme.dataZoom as Record<string, unknown>;
    expect(dz.backgroundColor).toBe('#1a1a30');
    expect(dz.borderColor).toBe('#333355');
    expect(dz.fillerColor).toBe('rgba(108, 99, 255, 0.2)');
    expect(dz.handleColor).toBe('#6c63ff');
    expect(dz.textStyle).toEqual({ color: '#707080' });
    const dataBg = dz.dataBackground as Record<string, Record<string, unknown>>;
    expect(dataBg.lineStyle.color).toBe('#333355');
    expect(dataBg.areaStyle.color).toBe('#2a2a44');
    const selBg = dz.selectedDataBackground as Record<string, Record<string, unknown>>;
    expect(selBg.lineStyle.color).toBe('#6c63ff');
    expect(selBg.areaStyle.color).toBe('rgba(108, 99, 255, 0.2)');
  });

  it('maps graph styles', () => {
    const theme = buildTheme();
    const graph = theme.graph as Record<string, unknown>;
    expect(graph.lineStyle).toEqual({ color: '#333355', width: 1 });
    expect(graph.label).toEqual({ color: '#e0e0e0' });
    expect(graph.itemStyle).toEqual({ borderColor: '#333355', borderWidth: 1 });
  });
});

describe('registerSoltanaTheme', () => {
  beforeEach(() => {
    setCssProps(CSS_PROPS);
  });
  afterEach(() => {
    clearCssProps();
  });

  it('calls echarts.registerTheme with the built theme', () => {
    const echarts = { registerTheme: vi.fn() };
    registerSoltanaTheme(echarts);

    expect(echarts.registerTheme).toHaveBeenCalledOnce();
    expect(echarts.registerTheme).toHaveBeenCalledWith(
      'soltana',
      expect.objectContaining({
        color: expect.any(Array) as unknown,
        backgroundColor: '#1a1a2e',
      })
    );

    const theme = echarts.registerTheme.mock.calls[0][1] as Record<string, unknown>;
    expect(theme.color).toEqual(['#6c63ff', '#3b82f6', '#22c55e', '#f59e0b', '#ec4899', '#ef4444']);
    expect(theme.backgroundColor).toBe('#1a1a2e');
    expect(theme.textStyle).toEqual({ color: '#e0e0e0', fontFamily: 'Inter, sans-serif' });
    expect(theme.tooltip).toEqual({ backgroundColor: '#252540', textStyle: { color: '#ffffff' } });
  });

  it('uses a custom theme name', () => {
    const echarts = { registerTheme: vi.fn() };
    registerSoltanaTheme(echarts, 'my-theme');

    expect(echarts.registerTheme).toHaveBeenCalledWith('my-theme', expect.any(Object));
  });
});

describe('autoSync', () => {
  beforeEach(() => {
    setCssProps(CSS_PROPS);
  });
  afterEach(() => {
    clearCssProps();
  });

  it('registers immediately on creation', () => {
    const echarts = { registerTheme: vi.fn() };
    const sync = autoSync(echarts);

    expect(echarts.registerTheme).toHaveBeenCalledOnce();
    sync.destroy();
  });

  it('re-registers on soltana:change events', () => {
    const echarts = { registerTheme: vi.fn() };
    const sync = autoSync(echarts);

    expect(echarts.registerTheme).toHaveBeenCalledTimes(1);

    document.documentElement.dispatchEvent(
      new CustomEvent('soltana:change', { detail: { type: 'theme', value: 'light' } })
    );

    expect(echarts.registerTheme).toHaveBeenCalledTimes(2);

    const reTheme = echarts.registerTheme.mock.calls[1][1] as Record<string, unknown>;
    expect(reTheme).toHaveProperty('color');
    expect(reTheme).toHaveProperty('backgroundColor');
    expect(reTheme).toHaveProperty('textStyle');

    sync.destroy();
  });

  it('stops listening after destroy()', () => {
    const echarts = { registerTheme: vi.fn() };
    const sync = autoSync(echarts);

    sync.destroy();
    echarts.registerTheme.mockClear();

    document.documentElement.dispatchEvent(
      new CustomEvent('soltana:change', { detail: { type: 'theme', value: 'dark' } })
    );

    expect(echarts.registerTheme).not.toHaveBeenCalled();
  });
});

describe('CSS token structure', () => {
  it('reads all expected CSS custom properties from the DOM', () => {
    setCssProps(CSS_PROPS);
    const theme = buildTheme();
    // Verify every color in the palette maps from a CSS property
    expect(theme.color).toHaveLength(6);
    for (const c of theme.color as string[]) {
      expect(c).toMatch(/^#[0-9a-f]{6}$/i);
    }
    clearCssProps();
  });

  it('returns fallback values when CSS properties are missing', () => {
    clearCssProps();
    const theme = buildTheme();
    // Without CSS properties, values should be empty strings or graceful defaults
    expect(theme.backgroundColor).toBe('');
  });
});

describe('static JSON exports', () => {
  it('exports dark theme with expected structure', () => {
    expect(dark).toHaveProperty('color');
    expect(dark).toHaveProperty('backgroundColor');
    expect(Array.isArray((dark as Record<string, unknown>).color)).toBe(true);
  });

  it('exports light theme with expected structure', () => {
    expect(light).toHaveProperty('color');
    expect(light).toHaveProperty('backgroundColor');
  });

  it('exports sepia theme with expected structure', () => {
    expect(sepia).toHaveProperty('color');
    expect(sepia).toHaveProperty('backgroundColor');
  });
});
