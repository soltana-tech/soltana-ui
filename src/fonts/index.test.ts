import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadSoltanaFonts, _resetFontLoader } from './index';

describe('loadSoltanaFonts', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    _resetFontLoader();
  });

  it('adds preconnect and stylesheet links to head', () => {
    loadSoltanaFonts();
    const links = document.head.querySelectorAll('link');
    expect(links.length).toBe(3);

    const rels = Array.from(links).map((l) => l.rel);
    expect(rels).toContain('preconnect');
    expect(rels).toContain('stylesheet');
  });

  it('second call is a no-op', () => {
    loadSoltanaFonts();
    const countAfterFirst = document.head.querySelectorAll('link').length;

    loadSoltanaFonts();
    const countAfterSecond = document.head.querySelectorAll('link').length;

    expect(countAfterSecond).toBe(countAfterFirst);
  });

  it('onerror handler triggers console.warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());

    loadSoltanaFonts();
    const stylesheet = document.head.querySelector('link[rel="stylesheet"]')!;
    expect(stylesheet).toBeInstanceOf(HTMLLinkElement);
    (stylesheet as HTMLLinkElement).onerror!(new Event('error'));

    expect(spy).toHaveBeenCalledWith('[soltana] Failed to load fonts from Google Fonts CDN');
    spy.mockRestore();
  });
});
