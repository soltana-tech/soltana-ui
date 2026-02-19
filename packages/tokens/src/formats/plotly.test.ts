import { describe, it, expect } from 'vitest';
import { buildPlotlyTemplate } from './plotly.js';
import { darkTheme, foundationMinimal as foundation } from '../__fixtures__/tokens.js';

describe('buildPlotlyTemplate', () => {
  const result = buildPlotlyTemplate(darkTheme, foundation);
  const layout = result.layout as Record<string, unknown>;

  it('sets paper_bgcolor from surfaceBg', () => {
    expect(layout.paper_bgcolor).toBe('#08091a');
  });

  it('sets plot_bgcolor from surface1', () => {
    expect(layout.plot_bgcolor).toBe('#0e1028');
  });

  it('sets colorway as 6-color palette', () => {
    expect(layout.colorway).toHaveLength(6);
    expect((layout.colorway as string[])[0]).toBe('#d4a843');
  });

  it('sets font color and family', () => {
    const font = layout.font as Record<string, unknown>;
    expect(font.color).toBe('#f5f0e6');
    expect(font.family).toContain('Raleway');
  });

  it('sets xaxis and yaxis grid/line colors', () => {
    const xaxis = layout.xaxis as Record<string, unknown>;
    expect(xaxis.gridcolor).toBe('rgb(255 255 255 / 3%)');
    expect(xaxis.linecolor).toBe('rgb(255 255 255 / 6%)');
  });

  it('sets legend font color', () => {
    const legend = layout.legend as Record<string, Record<string, unknown>>;
    expect(legend.font.color).toBe('#c5b99b');
  });
});
