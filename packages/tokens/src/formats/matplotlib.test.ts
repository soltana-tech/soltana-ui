import { describe, it, expect } from 'vitest';
import { buildMplStyle } from './matplotlib.js';
import { darkTheme, foundationMinimal as foundation } from '../__fixtures__/tokens.js';

describe('buildMplStyle', () => {
  const result = buildMplStyle(darkTheme, foundation);
  const lines = result.split('\n').filter(Boolean);

  function getLine(key: string): string | undefined {
    return lines.find((l) => l.startsWith(`${key}:`));
  }

  it('produces valid key: value format', () => {
    for (const line of lines) {
      expect(line).toMatch(/^[\w.-]+:\s*.+/);
    }
  });

  it('sets figure.facecolor from surfaceBg', () => {
    expect(getLine('figure.facecolor')).toBe('figure.facecolor: 08091a');
  });

  it('sets axes.facecolor from surface1', () => {
    expect(getLine('axes.facecolor')).toBe('axes.facecolor: 0e1028');
  });

  it('sets text.color from textPrimary', () => {
    expect(getLine('text.color')).toBe('text.color: f5f0e6');
  });

  it('sets axes.prop_cycle with cycler', () => {
    const line = getLine('axes.prop_cycle');
    expect(line).toContain("cycler('color'");
    expect(line).toContain('d4a843');
    expect(line).toContain('3b82f6');
  });

  it('sets font.family as sans-serif', () => {
    expect(getLine('font.family')).toBe('font.family: sans-serif');
  });

  it('sets font.sans-serif from foundation', () => {
    const line = getLine('font.sans-serif');
    expect(line).toContain('Raleway');
  });

  it('sets legend.facecolor from surface1', () => {
    expect(getLine('legend.facecolor')).toBe('legend.facecolor: 0e1028');
  });

  it('sets legend.edgecolor from borderDefault', () => {
    const line = getLine('legend.edgecolor');
    expect(line).toMatch(/^legend\.edgecolor: [0-9a-f]{8}$/);
  });

  it('sets legend.labelcolor from textSecondary', () => {
    expect(getLine('legend.labelcolor')).toBe('legend.labelcolor: c5b99b');
  });

  it('sets axes.titlecolor from textPrimary', () => {
    expect(getLine('axes.titlecolor')).toBe('axes.titlecolor: f5f0e6');
  });

  it('sets patch.edgecolor from borderDefault', () => {
    const line = getLine('patch.edgecolor');
    expect(line).toMatch(/^patch\.edgecolor: [0-9a-f]{8}$/);
  });

  it('sets lines.color from accentPrimary', () => {
    expect(getLine('lines.color')).toBe('lines.color: d4a843');
  });

  it('converts rgb() color values to bare hex', () => {
    // borderDefault is rgb(255 255 255 / 6%) → ffffff0f
    const axesEdge = getLine('axes.edgecolor');
    expect(axesEdge).toMatch(/^axes\.edgecolor: [0-9a-f]{8}$/);
    expect(axesEdge).not.toContain('rgb(');
    expect(axesEdge).not.toContain('#');

    // borderSubtle is rgb(255 255 255 / 3%) → ffffff08
    const gridColor = getLine('grid.color');
    expect(gridColor).toMatch(/^grid\.color: [0-9a-f]{8}$/);
    expect(gridColor).not.toContain('rgb(');
    expect(gridColor).not.toContain('#');
  });

  it('ends with newline', () => {
    expect(result.endsWith('\n')).toBe(true);
  });
});
