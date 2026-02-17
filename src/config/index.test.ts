import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  initSoltana,
  registerTierValue,
  VALID_THEMES,
  VALID_RELIEFS,
  VALID_FINISHES,
  VALID_ORNAMENTS,
} from './index';
import { _resetFontLoader } from '../fonts/index';
import { _resetStylesheet } from './stylesheet';
import { _resetIntrospectionCache } from './register';

vi.mock('../enhancers/index.js');

import { initAll } from '../enhancers/index.js';
import { mockEnhancerDestroy } from '../enhancers/__mocks__/index';

const mockInitAll = vi.mocked(initAll);
const mockDestroy = mockEnhancerDestroy;

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
    _resetStylesheet();
    _resetIntrospectionCache();
    mockInitAll.mockClear();
    mockDestroy.mockClear();
  });

  it('applies default config', () => {
    initSoltana();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-relief')).toBe('neu');
    expect(document.documentElement.getAttribute('data-finish')).toBe('matte');
    expect(document.documentElement.getAttribute('data-ornament')).toBe('none');
  });

  it('applies custom config', () => {
    initSoltana({
      theme: 'light',
      relief: 'lifted',
      finish: 'frosted',
      ornament: 'gilt',
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-relief')).toBe('lifted');
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
    soltana.setRelief('sharp');
    expect(document.documentElement.getAttribute('data-relief')).toBe('sharp');
  });

  it('setFinish updates data-finish', () => {
    const soltana = initSoltana();
    soltana.setFinish('tinted');
    expect(document.documentElement.getAttribute('data-finish')).toBe('tinted');
  });

  it('setOrnament updates data-ornament attribute', () => {
    const soltana = initSoltana({ ornament: 'baroque' });
    expect(document.documentElement.getAttribute('data-ornament')).toBe('baroque');

    soltana.setOrnament('beveled');
    expect(document.documentElement.getAttribute('data-ornament')).toBe('beveled');

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
      relief: 'lifted',
      ornament: 'gilt',
    });
    soltana.setOverrides({ '--custom': 'value' });
    soltana.reset();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-relief')).toBe('neu');
    expect(document.documentElement.getAttribute('data-finish')).toBe('matte');
    expect(document.documentElement.getAttribute('data-ornament')).toBe('none');
    expect(document.documentElement.style.getPropertyValue('--custom')).toBe('');
  });

  it('getState returns current config', () => {
    const soltana = initSoltana({ theme: 'light', relief: 'sharp' });
    const state = soltana.getState();
    expect(state.theme).toBe('light');
    expect(state.relief).toBe('sharp');
    expect(state.finish).toBe('matte');
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
      relief: 'lifted',
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
    ['theme', { theme: 'neon', strict: true }],
    ['relief', { relief: 'paper', strict: true }],
    ['finish', { finish: 'satin', strict: true }],
    ['ornament', { ornament: 'gothic', strict: true }],
  ] as const)('warns on unknown %s in strict mode', (name, overrides) => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    initSoltana(overrides);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining(`Unknown ${name}`));
    spy.mockRestore();
  });

  it('does not warn on custom tier values by default', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    initSoltana({ theme: 'neon', relief: 'paper', finish: 'satin', ornament: 'gothic' });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('custom tier values set data attributes', () => {
    const soltana = initSoltana({
      theme: 'neon',
      relief: 'glass',
      finish: 'satin',
      ornament: 'celtic',
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('neon');
    expect(document.documentElement.getAttribute('data-relief')).toBe('glass');
    expect(document.documentElement.getAttribute('data-finish')).toBe('satin');
    expect(document.documentElement.getAttribute('data-ornament')).toBe('celtic');
    expect(soltana.getState().theme).toBe('neon');
    expect(soltana.getState().relief).toBe('glass');
  });

  it('setTheme accepts custom values', () => {
    const soltana = initSoltana();
    soltana.setTheme('neon');
    expect(document.documentElement.getAttribute('data-theme')).toBe('neon');
    expect(soltana.getState().theme).toBe('neon');
  });

  it('registerRecipe adds a recipe that applyRecipe can use', () => {
    const soltana = initSoltana();
    soltana.registerRecipe('my-preset', {
      name: 'My Preset',
      description: 'Custom recipe for testing.',
      theme: 'dark',
      relief: 'flat',
      finish: 'matte',
      ornament: 'gilt',
    });
    soltana.applyRecipe('my-preset');
    expect(document.documentElement.getAttribute('data-ornament')).toBe('gilt');
    expect(document.documentElement.getAttribute('data-relief')).toBe('flat');
  });

  it('default config does not inject font links', () => {
    initSoltana();
    const links = document.head.querySelectorAll('link');
    expect(links.length).toBe(0);
  });

  it('fonts: true injects font links', () => {
    initSoltana({ fonts: true });
    const links = document.head.querySelectorAll('link');
    expect(links.length).toBe(3);

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

  it('setOverrides accumulates across multiple calls', () => {
    const soltana = initSoltana();
    soltana.setOverrides({ '--a': '1' });
    soltana.setOverrides({ '--b': '2' });

    expect(document.documentElement.style.getPropertyValue('--a')).toBe('1');
    expect(document.documentElement.style.getPropertyValue('--b')).toBe('2');

    const state = soltana.getState();
    expect(state.overrides).toEqual({ '--a': '1', '--b': '2' });
  });

  it('applies overrides from initial config', () => {
    initSoltana({ overrides: { '--init-var': 'hello' } });
    expect(document.documentElement.style.getPropertyValue('--init-var')).toBe('hello');
  });

  it('removeOverrides removes individual keys', () => {
    const soltana = initSoltana();
    soltana.setOverrides({ '--a': '1', '--b': '2', '--c': '3' });
    soltana.removeOverrides(['--a', '--c']);

    expect(document.documentElement.style.getPropertyValue('--a')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--b')).toBe('2');
    expect(document.documentElement.style.getPropertyValue('--c')).toBe('');
    expect(soltana.getState().overrides).toEqual({ '--b': '2' });
  });

  it('warns on non-custom-property override keys', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    const soltana = initSoltana();
    soltana.setOverrides({ color: 'red' });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('not a CSS custom property'));
    spy.mockRestore();
  });

  it('strict mode skips non-custom-property override keys', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    initSoltana({ strict: true, overrides: { color: 'red', '--valid': 'ok' } });
    expect(document.documentElement.style.getPropertyValue('color')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--valid')).toBe('ok');
    spy.mockRestore();
  });

  it('reinit respects enhancers: false', () => {
    const soltana = initSoltana({ enhancers: false });
    mockInitAll.mockClear();
    soltana.reinit();
    expect(mockInitAll).not.toHaveBeenCalled();
  });
});

describe('registerTierValue', () => {
  it.each([
    ['theme', VALID_THEMES],
    ['relief', VALID_RELIEFS],
    ['finish', VALID_FINISHES],
    ['ornament', VALID_ORNAMENTS],
  ] as const)('registers a custom %s value', (tier, validArray) => {
    const value = `custom-${tier}-${String(Date.now())}`;
    expect(validArray).not.toContain(value);

    registerTierValue(tier, value);
    expect(validArray).toContain(value);
  });

  it('does not duplicate an already-registered value', () => {
    const value = `dedup-${String(Date.now())}`;
    registerTierValue('theme', value);
    const countAfterFirst = VALID_THEMES.filter((v) => v === value).length;

    registerTierValue('theme', value);
    const countAfterSecond = VALID_THEMES.filter((v) => v === value).length;

    expect(countAfterFirst).toBe(1);
    expect(countAfterSecond).toBe(1);
  });

  it('suppresses strict-mode warning after registration', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    const value = `registered-${String(Date.now())}`;

    registerTierValue('relief', value);
    initSoltana({ relief: value, strict: true });

    expect(spy).not.toHaveBeenCalledWith(expect.stringContaining(`Unknown relief`));
    spy.mockRestore();
  });
});

describe('runtime registration (integration)', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-relief');
    document.documentElement.removeAttribute('data-finish');
    document.documentElement.removeAttribute('style');
    document.documentElement.removeAttribute('data-ornament');
    document.body.className = '';
    document.head.innerHTML = '';
    _resetFontLoader();
    _resetStylesheet();
    _resetIntrospectionCache();
    mockInitAll.mockClear();
    mockDestroy.mockClear();
  });

  it('registerTheme + setTheme applies data attribute', () => {
    const soltana = initSoltana();
    soltana.registerTheme('brand', {
      seed: { surfaceBg: '#1a1a2e', textPrimary: '#e0e0e0', accentPrimary: '#e94560' },
    });
    soltana.setTheme('brand');
    expect(document.documentElement.getAttribute('data-theme')).toBe('brand');
  });

  it('registerRelief + setRelief applies data attribute', () => {
    const soltana = initSoltana();
    soltana.registerRelief('paper', {
      tokens: {
        '--relief-bg': 'var(--surface-1)',
        '--relief-shadow-sm': 'none',
        '--relief-shadow': 'none',
        '--relief-shadow-lg': 'none',
        '--relief-shadow-inset-sm': 'none',
        '--relief-shadow-inset': 'none',
        '--relief-shadow-inset-lg': 'none',
        '--relief-border': '1px solid var(--border-default)',
      },
    });
    soltana.setRelief('paper');
    expect(document.documentElement.getAttribute('data-relief')).toBe('paper');
  });

  it('registerFinish + setFinish applies data attribute', () => {
    const soltana = initSoltana();
    soltana.registerFinish('satin', {
      tokens: {
        '--finish-blur': '0px',
        '--finish-saturation': '1',
        '--finish-opacity': '1',
        '--finish-overlay': 'none',
        '--finish-sheen': 'none',
      },
    });
    soltana.setFinish('satin');
    expect(document.documentElement.getAttribute('data-finish')).toBe('satin');
  });

  it('registerOrnament + setOrnament applies data attribute', () => {
    const soltana = initSoltana();
    soltana.registerOrnament('art-deco', {
      tokens: { '--ornament-color': 'gold' },
    });
    soltana.setOrnament('art-deco');
    expect(document.documentElement.getAttribute('data-ornament')).toBe('art-deco');
  });

  it('strict mode does not warn after registerTheme', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    const soltana = initSoltana({ strict: true });
    soltana.registerTheme('brand', {
      seed: { surfaceBg: '#111', textPrimary: '#eee', accentPrimary: '#f00' },
    });
    soltana.setTheme('brand');
    expect(spy).not.toHaveBeenCalledWith(expect.stringContaining('Unknown theme'));
    spy.mockRestore();
  });

  it('destroy() cleans up all registrations and stylesheet', () => {
    const soltana = initSoltana();
    soltana.registerTheme('brand', {
      seed: { surfaceBg: '#111', textPrimary: '#eee', accentPrimary: '#f00' },
    });
    soltana.registerRelief('paper', {
      tokens: {
        '--relief-bg': 'a',
        '--relief-shadow-sm': 'b',
        '--relief-shadow': 'c',
        '--relief-shadow-lg': 'd',
        '--relief-shadow-inset-sm': 'e',
        '--relief-shadow-inset': 'f',
        '--relief-shadow-inset-lg': 'g',
        '--relief-border': 'h',
      },
    });

    soltana.destroy();

    // Stylesheet element should be removed
    expect(document.getElementById('soltana-custom')).toBeNull();
  });

  it('reset() cleans up registrations and stylesheet', () => {
    const soltana = initSoltana();
    soltana.registerTheme('brand', {
      seed: { surfaceBg: '#111', textPrimary: '#eee', accentPrimary: '#f00' },
    });
    soltana.setTheme('brand');

    soltana.reset();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.getElementById('soltana-custom')).toBeNull();
  });

  it('registers all 4 tiers simultaneously without conflicts', () => {
    const soltana = initSoltana();

    soltana.registerTheme('brand', {
      seed: { surfaceBg: '#111', textPrimary: '#eee', accentPrimary: '#f00' },
    });
    soltana.registerRelief('paper', {
      tokens: {
        '--relief-bg': 'a',
        '--relief-shadow-sm': 'b',
        '--relief-shadow': 'c',
        '--relief-shadow-lg': 'd',
        '--relief-shadow-inset-sm': 'e',
        '--relief-shadow-inset': 'f',
        '--relief-shadow-inset-lg': 'g',
        '--relief-border': 'h',
      },
    });
    soltana.registerFinish('satin', {
      tokens: {
        '--finish-blur': '0px',
        '--finish-saturation': '1',
        '--finish-opacity': '1',
        '--finish-overlay': 'none',
        '--finish-sheen': 'none',
      },
    });
    soltana.registerOrnament('art-deco', {
      tokens: { '--ornament-color': 'gold' },
    });

    soltana.setTheme('brand');
    soltana.setRelief('paper');
    soltana.setFinish('satin');
    soltana.setOrnament('art-deco');

    expect(document.documentElement.getAttribute('data-theme')).toBe('brand');
    expect(document.documentElement.getAttribute('data-relief')).toBe('paper');
    expect(document.documentElement.getAttribute('data-finish')).toBe('satin');
    expect(document.documentElement.getAttribute('data-ornament')).toBe('art-deco');
  });
});

interface ChangeDetail {
  type: string;
  value: unknown;
}

function eventDetail(handler: ReturnType<typeof vi.fn>): ChangeDetail {
  return (handler.mock.calls[0][0] as CustomEvent<ChangeDetail>).detail;
}

describe('soltana:change event', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-relief');
    document.documentElement.removeAttribute('data-finish');
    document.documentElement.removeAttribute('style');
    document.documentElement.removeAttribute('data-ornament');
    document.body.className = '';
    document.head.innerHTML = '';
    _resetFontLoader();
    _resetStylesheet();
    _resetIntrospectionCache();
    mockInitAll.mockClear();
    mockDestroy.mockClear();
  });

  it('fires on setTheme', () => {
    const soltana = initSoltana();
    const handler = vi.fn();
    document.documentElement.addEventListener('soltana:change', handler);

    soltana.setTheme('light');
    expect(handler).toHaveBeenCalledTimes(1);
    expect(eventDetail(handler)).toEqual({ type: 'theme', value: 'light' });

    document.documentElement.removeEventListener('soltana:change', handler);
  });

  it('fires on setRelief', () => {
    const soltana = initSoltana();
    const handler = vi.fn();
    document.documentElement.addEventListener('soltana:change', handler);

    soltana.setRelief('flat');
    expect(handler).toHaveBeenCalledTimes(1);
    expect(eventDetail(handler).type).toBe('relief');

    document.documentElement.removeEventListener('soltana:change', handler);
  });

  it('fires on setFinish', () => {
    const soltana = initSoltana();
    const handler = vi.fn();
    document.documentElement.addEventListener('soltana:change', handler);

    soltana.setFinish('frosted');
    expect(handler).toHaveBeenCalledTimes(1);
    expect(eventDetail(handler).type).toBe('finish');

    document.documentElement.removeEventListener('soltana:change', handler);
  });

  it('fires on setOrnament', () => {
    const soltana = initSoltana();
    const handler = vi.fn();
    document.documentElement.addEventListener('soltana:change', handler);

    soltana.setOrnament('gilt');
    expect(handler).toHaveBeenCalledTimes(1);
    expect(eventDetail(handler).type).toBe('ornament');

    document.documentElement.removeEventListener('soltana:change', handler);
  });

  it('fires on setOverrides', () => {
    const soltana = initSoltana();
    const handler = vi.fn();
    document.documentElement.addEventListener('soltana:change', handler);

    soltana.setOverrides({ '--x': '1' });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(eventDetail(handler).type).toBe('overrides');

    document.documentElement.removeEventListener('soltana:change', handler);
  });

  it('fires on removeOverrides', () => {
    const soltana = initSoltana();
    soltana.setOverrides({ '--x': '1' });

    const handler = vi.fn();
    document.documentElement.addEventListener('soltana:change', handler);

    soltana.removeOverrides(['--x']);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(eventDetail(handler).type).toBe('overrides');

    document.documentElement.removeEventListener('soltana:change', handler);
  });

  it('fires on reset', () => {
    const soltana = initSoltana();
    const handler = vi.fn();
    document.documentElement.addEventListener('soltana:change', handler);

    soltana.reset();
    expect(handler).toHaveBeenCalledTimes(1);
    expect(eventDetail(handler).type).toBe('reset');

    document.documentElement.removeEventListener('soltana:change', handler);
  });
});
