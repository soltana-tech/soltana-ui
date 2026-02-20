import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildTemplate, autoSync, dark, light, sepia } from './index.js';
import {
  CSS_PROPS as BASE_CSS_PROPS,
  setCssProps,
  clearCssProps,
} from '@soltana-ui/chart-shared/test-helpers';

const CSS_PROPS: Record<string, string> = {
  ...BASE_CSS_PROPS,
  '--surface-1': '#222244',
  '--tooltip-bg': '#111133',
  '--tooltip-text': '#f0f0f0',
};

describe('buildTemplate', () => {
  beforeEach(() => {
    setCssProps(CSS_PROPS);
  });
  afterEach(() => {
    clearCssProps();
  });

  it('returns a template with colorway palette', () => {
    const tmpl = buildTemplate();
    expect(tmpl.layout.colorway).toEqual([
      '#6c63ff',
      '#3b82f6',
      '#22c55e',
      '#f59e0b',
      '#ec4899',
      '#ef4444',
    ]);
  });

  it('maps paper and plot background', () => {
    const tmpl = buildTemplate();
    expect(tmpl.layout.paper_bgcolor).toBe('#1a1a2e');
    expect(tmpl.layout.plot_bgcolor).toBe('#222244');
  });

  it('maps font properties', () => {
    const tmpl = buildTemplate();
    expect(tmpl.layout.font).toEqual({
      color: '#e0e0e0',
      family: 'Inter, sans-serif',
    });
  });

  it('maps axis grid, line, and tick colors', () => {
    const tmpl = buildTemplate();
    const xaxis = tmpl.layout.xaxis as Record<string, unknown>;
    expect(xaxis.gridcolor).toBe('#2a2a44');
    expect(xaxis.linecolor).toBe('#333355');
    expect(xaxis.zerolinecolor).toBe('#333355');
    expect(xaxis.tickfont).toEqual({ color: '#707080' });
    expect(xaxis.title).toEqual({ font: { color: '#a0a0b0' } });

    const yaxis = tmpl.layout.yaxis as Record<string, unknown>;
    expect(yaxis).toEqual(xaxis);
  });

  it('maps hoverlabel from tooltip tokens', () => {
    const tmpl = buildTemplate();
    expect(tmpl.layout.hoverlabel).toEqual({
      bgcolor: '#111133',
      font: { color: '#f0f0f0' },
      bordercolor: '#333355',
    });
  });

  it('maps legend with bgcolor and bordercolor', () => {
    const tmpl = buildTemplate();
    expect(tmpl.layout.legend).toEqual({
      font: { color: '#a0a0b0' },
      bgcolor: '#222244',
      bordercolor: '#2a2a44',
    });
  });

  it('maps coloraxis colorbar', () => {
    const tmpl = buildTemplate();
    const coloraxis = tmpl.layout.coloraxis as Record<string, unknown>;
    const colorbar = coloraxis.colorbar as Record<string, unknown>;
    expect(colorbar.tickfont).toEqual({ color: '#707080' });
    expect(colorbar.title).toEqual({ font: { color: '#a0a0b0' } });
    expect(colorbar.outlinecolor).toBe('#333355');
  });
});

describe('autoSync', () => {
  beforeEach(() => {
    setCssProps(CSS_PROPS);
  });
  afterEach(() => {
    clearCssProps();
  });

  it('calls callback immediately with current template', () => {
    const cb = vi.fn();
    const sync = autoSync(cb);

    expect(cb).toHaveBeenCalledOnce();
    expect(cb).toHaveBeenCalledWith(
      expect.objectContaining({
        layout: expect.objectContaining({
          paper_bgcolor: '#1a1a2e',
        }) as unknown,
      })
    );

    const template = cb.mock.calls[0][0] as { layout: Record<string, unknown> };
    expect(template.layout.colorway).toEqual([
      '#6c63ff',
      '#3b82f6',
      '#22c55e',
      '#f59e0b',
      '#ec4899',
      '#ef4444',
    ]);
    expect(template.layout.font).toEqual({ color: '#e0e0e0', family: 'Inter, sans-serif' });
    expect(template.layout.plot_bgcolor).toBe('#222244');

    sync.destroy();
  });

  it('calls callback on soltana:change events', () => {
    const cb = vi.fn();
    const sync = autoSync(cb);

    expect(cb).toHaveBeenCalledTimes(1);

    document.documentElement.dispatchEvent(
      new CustomEvent('soltana:change', { detail: { type: 'theme', value: 'light' } })
    );

    expect(cb).toHaveBeenCalledTimes(2);

    const reTemplate = cb.mock.calls[1][0] as { layout: Record<string, unknown> };
    expect(reTemplate.layout).toHaveProperty('colorway');
    expect(reTemplate.layout).toHaveProperty('paper_bgcolor');
    expect(reTemplate.layout).toHaveProperty('font');

    sync.destroy();
  });

  it('stops calling after destroy()', () => {
    const cb = vi.fn();
    const sync = autoSync(cb);

    sync.destroy();
    cb.mockClear();

    document.documentElement.dispatchEvent(
      new CustomEvent('soltana:change', { detail: { type: 'theme', value: 'dark' } })
    );

    expect(cb).not.toHaveBeenCalled();
  });
});

describe('CSS token structure', () => {
  it('reads all expected CSS custom properties from the DOM', () => {
    setCssProps(CSS_PROPS);
    const tmpl = buildTemplate();
    // Verify the colorway palette maps from CSS properties
    expect(tmpl.layout.colorway).toHaveLength(6);
    for (const c of tmpl.layout.colorway as string[]) {
      expect(c).toMatch(/^#[0-9a-f]{6}$/i);
    }
    clearCssProps();
  });

  it('returns fallback values when CSS properties are missing', () => {
    clearCssProps();
    const tmpl = buildTemplate();
    // Without CSS properties, values should be empty strings or graceful defaults
    expect(tmpl.layout.paper_bgcolor).toBe('');
  });
});

describe('static JSON exports', () => {
  it('exports dark theme with expected structure', () => {
    expect(dark).toHaveProperty('layout');
    const layout = (dark as Record<string, Record<string, unknown>>).layout;
    expect(layout).toHaveProperty('colorway');
    expect(layout).toHaveProperty('paper_bgcolor');
  });

  it('exports light theme with expected structure', () => {
    expect(light).toHaveProperty('layout');
  });

  it('exports sepia theme with expected structure', () => {
    expect(sepia).toHaveProperty('layout');
  });
});
