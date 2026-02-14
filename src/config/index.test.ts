import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initSoltana } from './index';
import { _resetFontLoader } from '../fonts/index';

const mockDestroy = vi.fn();
vi.mock('../enhancers/index.js', () => ({
  initAll: vi.fn(() => ({ destroy: mockDestroy })),
}));

// Access the mock after vi.mock hoisting
import { initAll } from '../enhancers/index.js';
const mockInitAll = vi.mocked(initAll);

describe('initSoltana', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-relief');
    document.documentElement.removeAttribute('data-finish');
    document.documentElement.removeAttribute('style');
    document.body.className = '';
    document.documentElement.removeAttribute('data-ornament');
    document.head.innerHTML = '';
    _resetFontLoader();
    mockInitAll.mockClear();
    mockDestroy.mockClear();
  });

  it('applies default config', () => {
    initSoltana();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-relief')).toBe('neu');
    expect(document.documentElement.getAttribute('data-finish')).toBe('polished');
    expect(document.documentElement.getAttribute('data-ornament')).toBe('none');
  });

  it('applies custom config', () => {
    initSoltana({
      theme: 'light',
      relief: 'glass',
      finish: 'frosted',
      ornament: 'gilt',
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-relief')).toBe('glass');
    expect(document.documentElement.getAttribute('data-finish')).toBe('frosted');
    expect(document.documentElement.getAttribute('data-ornament')).toBe('gilt');
  });

  it('setTheme updates data-theme', () => {
    const soltana = initSoltana();
    soltana.setTheme('sepia');
    expect(document.documentElement.getAttribute('data-theme')).toBe('sepia');
  });

  it('setRelief updates data-relief', () => {
    const soltana = initSoltana();
    soltana.setRelief('metallic');
    expect(document.documentElement.getAttribute('data-relief')).toBe('metallic');
  });

  it('setFinish updates data-finish', () => {
    const soltana = initSoltana();
    soltana.setFinish('stained');
    expect(document.documentElement.getAttribute('data-finish')).toBe('stained');
  });

  it('setOrnament updates data-ornament attribute', () => {
    const soltana = initSoltana({ ornament: 'baroque' });
    expect(document.documentElement.getAttribute('data-ornament')).toBe('baroque');

    soltana.setOrnament('carved');
    expect(document.documentElement.getAttribute('data-ornament')).toBe('carved');

    soltana.setOrnament('none');
    expect(document.documentElement.getAttribute('data-ornament')).toBe('none');
  });

  it('setOverrides applies inline CSS variables', () => {
    const soltana = initSoltana();
    soltana.setOverrides({ '--custom-color': '#ff0000' });
    expect(document.documentElement.style.getPropertyValue('--custom-color')).toBe('#ff0000');
  });

  it('reset restores defaults and clears overrides', () => {
    const soltana = initSoltana({
      theme: 'sepia',
      relief: 'glass',
      ornament: 'gilt',
    });
    soltana.setOverrides({ '--custom': 'value' });
    soltana.reset();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-relief')).toBe('neu');
    expect(document.documentElement.getAttribute('data-finish')).toBe('polished');
    expect(document.documentElement.getAttribute('data-ornament')).toBe('none');
    expect(document.documentElement.style.getPropertyValue('--custom')).toBe('');
  });

  it('getState returns current config', () => {
    const soltana = initSoltana({ theme: 'light', relief: 'metallic' });
    const state = soltana.getState();
    expect(state.theme).toBe('light');
    expect(state.relief).toBe('metallic');
    expect(state.finish).toBe('polished');
    expect(state.ornament).toBe('none');
  });

  it('auto theme resolves to dark or light', () => {
    const soltana = initSoltana({ theme: 'auto' });
    const resolved = document.documentElement.getAttribute('data-theme');
    expect(['dark', 'light']).toContain(resolved);
    expect(soltana.getState().theme).toBe('auto');
  });

  it('destroy removes all data attributes and inline styles', () => {
    const soltana = initSoltana({
      theme: 'sepia',
      relief: 'glass',
      finish: 'frosted',
      ornament: 'baroque',
    });
    soltana.setOverrides({ '--x': '10' });

    soltana.destroy();

    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    expect(document.documentElement.getAttribute('data-relief')).toBeNull();
    expect(document.documentElement.getAttribute('data-finish')).toBeNull();
    expect(document.documentElement.getAttribute('data-ornament')).toBeNull();
    expect(document.documentElement.getAttribute('style')).toBeNull();
  });

  it.each([
    ['theme', { theme: 'neon' as never }],
    ['relief', { relief: 'paper' as never }],
    ['finish', { finish: 'matte' as never }],
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

  it('auto-initializes enhancers by default', () => {
    initSoltana();
    expect(mockInitAll).toHaveBeenCalledTimes(1);
  });

  it('skips enhancers when enhancers: false', () => {
    initSoltana({ enhancers: false });
    expect(mockInitAll).not.toHaveBeenCalled();
  });

  it('destroy cleans up enhancer listeners', () => {
    const soltana = initSoltana();
    expect(mockInitAll).toHaveBeenCalledTimes(1);

    soltana.destroy();
    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });

  it('destroy with enhancers: false does not call enhancer cleanup', () => {
    const soltana = initSoltana({ enhancers: false });
    soltana.destroy();
    expect(mockDestroy).not.toHaveBeenCalled();
  });

  it('reinit destroys and re-initializes enhancers', () => {
    const soltana = initSoltana();
    expect(mockInitAll).toHaveBeenCalledTimes(1);

    soltana.reinit();
    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(mockInitAll).toHaveBeenCalledTimes(2);
  });

  it('reset re-initializes enhancers', () => {
    const soltana = initSoltana();
    const destroyCountAfterInit = mockDestroy.mock.calls.length;
    const initCountAfterInit = mockInitAll.mock.calls.length;

    soltana.reset();
    expect(mockDestroy).toHaveBeenCalledTimes(destroyCountAfterInit + 1);
    expect(mockInitAll).toHaveBeenCalledTimes(initCountAfterInit + 1);
  });

  it('multiple initSoltana calls clean up previous enhancers', () => {
    initSoltana();
    const destroyCountAfterFirst = mockDestroy.mock.calls.length;

    initSoltana();
    // Second call should destroy the first enhancer setup
    expect(mockDestroy).toHaveBeenCalledTimes(destroyCountAfterFirst + 1);
  });
});
