import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initSoltana } from './index';

describe('initSoltana', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-material');
    document.documentElement.removeAttribute('data-surface');
    document.documentElement.removeAttribute('style');
    document.body.className = '';
  });

  it('applies default config', () => {
    initSoltana();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-material')).toBe('neuro');
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
    soltana.setMaterial('hybrid');
    expect(document.documentElement.getAttribute('data-material')).toBe('hybrid');
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

  it('reset restores defaults', () => {
    const soltana = initSoltana({
      theme: 'sepia',
      material: 'glass',
      ornament: 'gilt',
    });
    soltana.setOverrides({ '--custom': 'value' });
    soltana.reset();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-material')).toBe('neuro');
    expect(document.body.classList.contains('ornament-gilt')).toBe(false);
  });

  it('getState returns current config', () => {
    const soltana = initSoltana({ theme: 'light', material: 'hybrid' });
    const state = soltana.getState();
    expect(state.theme).toBe('light');
    expect(state.material).toBe('hybrid');
    expect(state.surface).toBe('polished');
    expect(state.ornament).toBe('none');
  });

  it('auto theme resolves to dark or light', () => {
    const soltana = initSoltana({ theme: 'auto' });
    const resolved = document.documentElement.getAttribute('data-theme');
    expect(['dark', 'light']).toContain(resolved);
    expect(soltana.getState().theme).toBe('auto');
  });

  it('setOverrides works after reset', () => {
    const soltana = initSoltana();
    soltana.setOverrides({ '--a': '1' });
    soltana.reset();

    // Should not throw
    soltana.setOverrides({ '--b': '2' });
    expect(document.documentElement.style.getPropertyValue('--b')).toBe('2');
  });

  it('destroy removes data attributes and ornament classes', () => {
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
  });

  it('warns on invalid theme', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    initSoltana({ theme: 'neon' as never });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Invalid theme'));
    spy.mockRestore();
  });

  it('warns on invalid material', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    initSoltana({ material: 'paper' as never });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Invalid material'));
    spy.mockRestore();
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
