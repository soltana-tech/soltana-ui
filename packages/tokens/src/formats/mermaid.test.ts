import { describe, it, expect } from 'vitest';
import { buildMermaidConfig } from './mermaid.js';
import { darkTheme, foundationMinimal as foundation } from '../__fixtures__/tokens.js';

describe('buildMermaidConfig', () => {
  const result = buildMermaidConfig(darkTheme, foundation);
  const vars = result.themeVariables;

  it('sets theme to "base"', () => {
    expect(result.theme).toBe('base');
  });

  it('sets darkMode from colorScheme', () => {
    expect(vars.darkMode).toBe(true);
  });

  it('produces only #rrggbb hex color values', () => {
    const hexPattern = /^#[0-9a-f]{6}$/;
    for (const [key, value] of Object.entries(vars)) {
      if (key === 'darkMode' || key === 'fontFamily') continue;
      expect(value, `${key} should be #rrggbb hex`).toMatch(hexPattern);
    }
  });

  it('sets background from surfaceBg', () => {
    expect(vars.background).toBe('#08091a');
  });

  it('sets primaryColor from surface1', () => {
    expect(vars.primaryColor).toBe('#0e1028');
  });

  it('sets secondaryColor from surface2', () => {
    expect(vars.secondaryColor).toBe('#151838');
  });

  it('sets tertiaryColor from surface3', () => {
    expect(vars.tertiaryColor).toBe('#1c2048');
  });

  it('sets text colors from textPrimary', () => {
    expect(vars.primaryTextColor).toBe('#f5f0e6');
    expect(vars.secondaryTextColor).toBe('#f5f0e6');
    expect(vars.tertiaryTextColor).toBe('#f5f0e6');
  });

  it('sets labelTextColor from textMuted', () => {
    expect(vars.labelTextColor).toBe('#897d69');
  });

  it('alpha-composites border tokens to solid hex', () => {
    // borderDefault is rgb(255 255 255 / 6%) composited against #08091a
    const borderHex = vars.primaryBorderColor;
    expect(borderHex).toMatch(/^#[0-9a-f]{6}$/);
    expect(borderHex).not.toContain('rgb(');
  });

  it('sets sequence diagram variables', () => {
    expect(vars.actorBkg).toBe('#0e1028');
    expect(vars.actorTextColor).toBe('#f5f0e6');
    expect(vars.signalColor).toBe('#f5f0e6');
    expect(vars.noteBkgColor).toBe('#151838');
    expect(vars.noteTextColor).toBe('#f5f0e6');
  });

  it('sets activation colors from accentPrimary', () => {
    expect(vars.activationBorderColor).toBe('#d4a843');
    expect(vars.activeBorderColor).toBe('#d4a843');
    expect(vars.activeBkgColor).toBe('#d4a843');
  });

  it('sets Gantt done colors from colorSuccess', () => {
    expect(vars.doneBorderColor).toBe('#10b981');
    expect(vars.doneBkgColor).toBe('#10b981');
  });

  it('sets Gantt crit colors from colorError', () => {
    expect(vars.critBorderColor).toBe('#ef4444');
    expect(vars.critBkgColor).toBe('#ef4444');
  });

  it('sets fontFamily from foundation', () => {
    expect(vars.fontFamily).toContain('Raleway');
  });

  it('maps pie1–pie6 from palette', () => {
    expect(vars.pie1).toBe('#d4a843');
    expect(vars.pie2).toBe('#3b82f6');
    expect(vars.pie3).toBe('#10b981');
    expect(vars.pie4).toBe('#fcd34d');
    expect(vars.pie5).toBe('#a855f7');
    expect(vars.pie6).toBe('#ef4444');
  });
});
