import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildConfig, initSoltanaMermaid, autoSync, dark, light, sepia } from './index.js';
import {
  CSS_PROPS as BASE_CSS_PROPS,
  setCssProps,
  clearCssProps,
} from '@soltana-ui/chart-shared/test-helpers';

const CSS_PROPS: Record<string, string> = {
  ...BASE_CSS_PROPS,
  'color-scheme': 'dark',
  '--surface-1': '#1a1a30',
  '--surface-2': '#252540',
  '--surface-3': '#303050',
  '--tooltip-bg': '#252540',
  '--tooltip-text': '#ffffff',
};

describe('buildConfig', () => {
  beforeEach(() => {
    setCssProps(CSS_PROPS);
  });
  afterEach(() => {
    clearCssProps();
  });

  it('returns theme "base"', () => {
    const config = buildConfig();
    expect(config.theme).toBe('base');
  });

  it('sets darkMode from color-scheme', () => {
    const config = buildConfig();
    expect(config.themeVariables.darkMode).toBe(true);
  });

  it('sets darkMode false for light scheme', () => {
    document.documentElement.style.setProperty('color-scheme', 'light');
    const config = buildConfig();
    expect(config.themeVariables.darkMode).toBe(false);
  });

  it('maps surface tokens to Mermaid variables', () => {
    const config = buildConfig();
    const vars = config.themeVariables;
    expect(vars.background).toBe('#1a1a2e');
    expect(vars.primaryColor).toBe('#1a1a30');
    expect(vars.secondaryColor).toBe('#252540');
    expect(vars.tertiaryColor).toBe('#303050');
    expect(vars.mainBkg).toBe('#1a1a30');
  });

  it('maps text tokens', () => {
    const config = buildConfig();
    const vars = config.themeVariables;
    expect(vars.primaryTextColor).toBe('#e0e0e0');
    expect(vars.labelTextColor).toBe('#707080');
  });

  it('maps border tokens', () => {
    const config = buildConfig();
    const vars = config.themeVariables;
    expect(vars.nodeBorder).toBe('#333355');
    expect(vars.lineColor).toBe('#333355');
  });

  it('maps pie palette from CSS properties', () => {
    const config = buildConfig();
    const vars = config.themeVariables;
    expect(vars.pie1).toBe('#6c63ff');
    expect(vars.pie2).toBe('#3b82f6');
    expect(vars.pie3).toBe('#22c55e');
    expect(vars.pie4).toBe('#f59e0b');
    expect(vars.pie5).toBe('#ec4899');
    expect(vars.pie6).toBe('#ef4444');
  });

  it('sets fontFamily from --font-sans', () => {
    const config = buildConfig();
    expect(config.themeVariables.fontFamily).toBe('Inter, sans-serif');
  });

  it('produces only #rrggbb hex for color values', () => {
    const config = buildConfig();
    const hexPattern = /^#[0-9a-f]{6}$/;
    for (const [key, value] of Object.entries(config.themeVariables)) {
      if (key === 'darkMode' || key === 'fontFamily') continue;
      expect(value, `${key} should be #rrggbb hex`).toMatch(hexPattern);
    }
  });
});

describe('initSoltanaMermaid', () => {
  beforeEach(() => {
    setCssProps(CSS_PROPS);
  });
  afterEach(() => {
    clearCssProps();
  });

  it('calls mermaid.initialize with the built config', () => {
    const mermaid = { initialize: vi.fn(), run: vi.fn() };
    initSoltanaMermaid(mermaid);

    expect(mermaid.initialize).toHaveBeenCalledOnce();
    expect(mermaid.initialize).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'base',
        themeVariables: expect.objectContaining({
          background: '#1a1a2e',
        }) as unknown,
      })
    );
  });
});

describe('autoSync', () => {
  beforeEach(() => {
    setCssProps(CSS_PROPS);
  });
  afterEach(() => {
    clearCssProps();
  });

  it('initializes immediately on creation', () => {
    const mermaid = { initialize: vi.fn(), run: vi.fn().mockResolvedValue(undefined) };
    const sync = autoSync(mermaid);

    expect(mermaid.initialize).toHaveBeenCalledOnce();
    sync.destroy();
  });

  it('re-initializes and calls run on soltana:change', () => {
    // Set up a pre.mermaid element for snapshot
    const wrapper = document.createElement('div');
    const pre = document.createElement('pre');
    pre.className = 'mermaid';
    pre.textContent = 'graph TD; A-->B';
    wrapper.appendChild(pre);
    document.body.appendChild(wrapper);

    const mermaid = { initialize: vi.fn(), run: vi.fn().mockResolvedValue(undefined) };
    const sync = autoSync(mermaid);

    expect(mermaid.initialize).toHaveBeenCalledTimes(1);

    document.documentElement.dispatchEvent(
      new CustomEvent('soltana:change', { detail: { type: 'theme', value: 'light' } })
    );

    expect(mermaid.initialize).toHaveBeenCalledTimes(2);
    expect(mermaid.run).toHaveBeenCalledOnce();
    expect(mermaid.run).toHaveBeenCalledWith(
      expect.objectContaining({ nodes: expect.any(Array) as unknown })
    );

    sync.destroy();
    document.body.removeChild(wrapper);
  });

  it('stops listening after destroy()', () => {
    const mermaid = { initialize: vi.fn(), run: vi.fn().mockResolvedValue(undefined) };
    const sync = autoSync(mermaid);

    sync.destroy();
    mermaid.initialize.mockClear();
    mermaid.run.mockClear();

    document.documentElement.dispatchEvent(
      new CustomEvent('soltana:change', { detail: { type: 'theme', value: 'dark' } })
    );

    expect(mermaid.initialize).not.toHaveBeenCalled();
    expect(mermaid.run).not.toHaveBeenCalled();
  });

  it('does not call run when no diagrams exist', () => {
    const mermaid = { initialize: vi.fn(), run: vi.fn().mockResolvedValue(undefined) };
    const sync = autoSync(mermaid);

    document.documentElement.dispatchEvent(
      new CustomEvent('soltana:change', { detail: { type: 'theme', value: 'light' } })
    );

    expect(mermaid.initialize).toHaveBeenCalledTimes(2);
    expect(mermaid.run).not.toHaveBeenCalled();

    sync.destroy();
  });
});

describe('static JSON exports', () => {
  it('exports dark theme with expected structure', () => {
    expect(dark).toHaveProperty('theme', 'base');
    expect(dark).toHaveProperty('themeVariables');
    const vars = (dark as unknown as Record<string, Record<string, unknown>>).themeVariables;
    expect(vars).toHaveProperty('background');
    expect(vars).toHaveProperty('primaryColor');
    expect(vars).toHaveProperty('fontFamily');
  });

  it('exports light theme with expected structure', () => {
    expect(light).toHaveProperty('theme', 'base');
    expect(light).toHaveProperty('themeVariables');
  });

  it('exports sepia theme with expected structure', () => {
    expect(sepia).toHaveProperty('theme', 'base');
    expect(sepia).toHaveProperty('themeVariables');
  });
});
