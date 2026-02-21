import { describeFormatBuilder, it, expect } from './__test-utils__.js';
import { buildPlotlyTemplate } from './plotly.js';
import { darkTheme, foundationMinimal as foundation } from '../__fixtures__/tokens.js';

describeFormatBuilder(
  'buildPlotlyTemplate',
  buildPlotlyTemplate,
  darkTheme,
  foundation,
  (result) => {
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

    it('sets hoverlabel from tooltip tokens', () => {
      const hoverlabel = layout.hoverlabel as Record<string, unknown>;
      expect(hoverlabel.bgcolor).toBe('#08091a');
      expect(hoverlabel.font).toEqual({ color: '#f5f0e6' });
      expect(hoverlabel.bordercolor).toBe('rgb(255 255 255 / 6%)');
    });

    it('sets legend with bgcolor and bordercolor', () => {
      const legend = layout.legend as Record<string, unknown>;
      expect((legend.font as Record<string, unknown>).color).toBe('#c5b99b');
      expect(legend.bgcolor).toBe('#0e1028');
      expect(legend.bordercolor).toBe('rgb(255 255 255 / 3%)');
    });

    it('sets coloraxis colorbar', () => {
      const coloraxis = layout.coloraxis as Record<string, unknown>;
      const colorbar = coloraxis.colorbar as Record<string, unknown>;
      expect(colorbar.tickfont).toEqual({ color: '#897d69' });
      expect(colorbar.title).toEqual({ font: { color: '#c5b99b' } });
      expect(colorbar.outlinecolor).toBe('rgb(255 255 255 / 6%)');
    });
  }
);
