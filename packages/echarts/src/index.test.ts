import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildTheme, registerSoltanaTheme, autoSync, dark, light, sepia } from './index.js';

const CSS_PROPS: Record<string, string> = {
  '--surface-bg': '#1a1a2e',
  '--text-primary': '#e0e0e0',
  '--text-secondary': '#a0a0b0',
  '--text-muted': '#707080',
  '--border-default': '#333355',
  '--border-subtle': '#2a2a44',
  '--tooltip-bg': '#252540',
  '--tooltip-text': '#ffffff',
  '--font-sans': 'Inter, sans-serif',
  '--accent-primary': '#6c63ff',
  '--color-info': '#3b82f6',
  '--color-success': '#22c55e',
  '--color-warning': '#f59e0b',
  '--accent-secondary': '#ec4899',
  '--color-error': '#ef4444',
};

function setCssProps(props: Record<string, string>): void {
  for (const [key, value] of Object.entries(props)) {
    document.documentElement.style.setProperty(key, value);
  }
}

function clearCssProps(): void {
  document.documentElement.removeAttribute('style');
}

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

  it('maps axis styles', () => {
    const theme = buildTheme();
    const catAxis = theme.categoryAxis as Record<string, unknown>;
    expect(catAxis).toEqual({
      axisLine: { lineStyle: { color: '#333355' } },
      axisTick: { lineStyle: { color: '#333355' } },
      axisLabel: { color: '#707080' },
      splitLine: { lineStyle: { color: '#2a2a44' } },
    });

    const valAxis = theme.valueAxis as Record<string, unknown>;
    expect(valAxis).toEqual(catAxis);
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
