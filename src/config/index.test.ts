import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initSoltana } from './index';
import { _resetFontLoader } from '../fonts/index';

describe('initSoltana', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-material');
    document.documentElement.removeAttribute('data-surface');
    document.documentElement.removeAttribute('style');
    document.body.className = '';
    document.head.innerHTML = '';
    _resetFontLoader();
  });

  it('applies default config', () => {
    initSoltana();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-material')).toBe('neu');
    expect(document.documentElement.getAttribute('data-surface')).toBe('polished');
    expect(document.body.classList.contains('ornament-baroque')).toBe(false);
  });

  it('applies custom config', () => {
    initSoltana({
      theme: 'light',
      material: 'glass',
      surface: 'frosted',
      ornament: 'gilt',
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-material')).toBe('glass');
    expect(document.documentElement.getAttribute('data-surface')).toBe('frosted');
    expect(document.body.classList.contains('ornament-gilt')).toBe(true);
  });

  it('setTheme updates data-theme', () => {
    const soltana = initSoltana();
    soltana.setTheme('sepia');
    expect(document.documentElement.getAttribute('data-theme')).toBe('sepia');
  });

  it('setMaterial updates data-material', () => {
    const soltana = initSoltana();
    soltana.setMaterial('metallic');
    expect(document.documentElement.getAttribute('data-material')).toBe('metallic');
  });

  it('setSurface updates data-surface', () => {
    const soltana = initSoltana();
    soltana.setSurface('stained');
    expect(document.documentElement.getAttribute('data-surface')).toBe('stained');
  });

  it('setOrnament manages body classes', () => {
    const soltana = initSoltana({ ornament: 'baroque' });
    expect(document.body.classList.contains('ornament-baroque')).toBe(true);

    soltana.setOrnament('carved');
    expect(document.body.classList.contains('ornament-baroque')).toBe(false);
    expect(document.body.classList.contains('ornament-carved')).toBe(true);

    soltana.setOrnament('none');
    expect(document.body.classList.contains('ornament-carved')).toBe(false);
  });

  it('setOverrides applies inline CSS variables', () => {
    const soltana = initSoltana();
    soltana.setOverrides({ '--custom-color': '#ff0000' });
    expect(document.documentElement.style.getPropertyValue('--custom-color')).toBe('#ff0000');
  });

  it('reset restores defaults and clears overrides', () => {
    const soltana = initSoltana({
      theme: 'sepia',
      material: 'glass',
      ornament: 'gilt',
    });
    soltana.setOverrides({ '--custom': 'value' });
    soltana.reset();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-material')).toBe('neu');
    expect(document.documentElement.getAttribute('data-surface')).toBe('polished');
    expect(document.body.classList.contains('ornament-gilt')).toBe(false);
    expect(document.documentElement.style.getPropertyValue('--custom')).toBe('');
  });

  it('getState returns current config', () => {
    const soltana = initSoltana({ theme: 'light', material: 'metallic' });
    const state = soltana.getState();
    expect(state.theme).toBe('light');
    expect(state.material).toBe('metallic');
    expect(state.surface).toBe('polished');
    expect(state.ornament).toBe('none');
  });

  it('auto theme resolves to dark or light', () => {
    const soltana = initSoltana({ theme: 'auto' });
    const resolved = document.documentElement.getAttribute('data-theme');
    expect(['dark', 'light']).toContain(resolved);
    expect(soltana.getState().theme).toBe('auto');
  });

  it('destroy removes data attributes, ornament classes, and inline styles', () => {
    const soltana = initSoltana({
      theme: 'sepia',
      material: 'glass',
      surface: 'frosted',
      ornament: 'baroque',
    });
    soltana.setOverrides({ '--x': '10' });

    soltana.destroy();

    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    expect(document.documentElement.getAttribute('data-material')).toBeNull();
    expect(document.documentElement.getAttribute('data-surface')).toBeNull();
    expect(document.body.classList.contains('ornament-baroque')).toBe(false);
    expect(document.documentElement.getAttribute('style')).toBeNull();
  });

  it.each([
    ['theme', { theme: 'neon' as never }],
    ['material', { material: 'paper' as never }],
    ['surface', { surface: 'matte' as never }],
    ['ornament', { ornament: 'gothic' as never }],
  ] as const)('warns on invalid %s', (name, overrides) => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    initSoltana(overrides);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining(`Invalid ${name}`));
    spy.mockRestore();
  });

  it('default config does not inject font links', () => {
    initSoltana();
    const links = document.head.querySelectorAll('link');
    expect(links.length).toBe(0);
  });

  it('fonts: true injects font links', () => {
    initSoltana({ fonts: true });
    const links = document.head.querySelectorAll('link');
    expect(links.length).toBeGreaterThanOrEqual(3);

    const rels = Array.from(links).map((l) => l.rel);
    expect(rels).toContain('preconnect');
    expect(rels).toContain('stylesheet');
  });

  it('setTheme to auto installs matchMedia listener', () => {
    const addSpy = vi.fn();
    const removeSpy = vi.fn();
    const mql = {
      matches: false,
      addEventListener: addSpy,
      removeEventListener: removeSpy,
    };
    vi.spyOn(window, 'matchMedia').mockReturnValue(mql as unknown as MediaQueryList);

    const soltana = initSoltana({ theme: 'light' });
    expect(addSpy).not.toHaveBeenCalled();

    soltana.setTheme('auto');
    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(soltana.getState().theme).toBe('auto');

    vi.restoreAllMocks();
  });

  it('destroy tears down auto-theme matchMedia listener', () => {
    const removeSpy = vi.fn();
    const mql = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: removeSpy,
    };
    vi.spyOn(window, 'matchMedia').mockReturnValue(mql as unknown as MediaQueryList);

    const soltana = initSoltana({ theme: 'auto' });
    soltana.destroy();

    expect(removeSpy).toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it('multiple initSoltana calls do not accumulate matchMedia listeners', () => {
    const removeSpy = vi.fn();
    const addSpy = vi.fn();
    const mql = {
      matches: false,
      addEventListener: addSpy,
      removeEventListener: removeSpy,
    };
    vi.spyOn(window, 'matchMedia').mockReturnValue(mql as unknown as MediaQueryList);

    initSoltana({ theme: 'auto' });
    initSoltana({ theme: 'auto' });

    // Second call should have removed the first listener before adding a new one
    expect(removeSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledTimes(2);

    vi.restoreAllMocks();
  });
});
