import { describe, it, expect, beforeEach } from 'vitest';
import { loadSoltanaFonts } from './index';

describe('loadSoltanaFonts', () => {
  beforeEach(() => {
    // Clear head of injected links
    document.head.innerHTML = '';
  });

  it('adds preconnect and stylesheet links to head', () => {
    loadSoltanaFonts();
    const links = document.head.querySelectorAll('link');
    expect(links.length).toBeGreaterThanOrEqual(3);

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
});
