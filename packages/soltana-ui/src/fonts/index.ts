// ---------------------------------------------------------------------------
// Font Loading
// ---------------------------------------------------------------------------
// Injects a font stylesheet <link> and (for Google Fonts) preconnect hints
// into <head>. Idempotent: safe to call multiple times.
// ---------------------------------------------------------------------------

export const DEFAULT_FONT_URL =
  'https://fonts.googleapis.com/css2?' +
  'family=Cinzel:wght@400;500;600;700;800;900' +
  '&family=Cinzel+Decorative:wght@400;700;900' +
  '&family=Raleway:ital,wght@0,100..900;1,400;1,500' +
  '&family=JetBrains+Mono:wght@400;500;600' +
  '&display=swap';

let _loaded = false;

/**
 * Inject a font stylesheet (and optional preconnect hints) into `<head>`.
 *
 * @param url - Font CSS URL. Defaults to the bundled Google Fonts URL
 *              containing Cinzel, Raleway, and JetBrains Mono. When the URL
 *              points to `fonts.googleapis.com`, preconnect links are also
 *              injected automatically.
 */
export function loadSoltanaFonts(url?: string): void {
  if (_loaded || typeof document === 'undefined') return;
  _loaded = true;

  const fontUrl = url ?? DEFAULT_FONT_URL;
  const head = document.head;

  if (fontUrl.startsWith('https://fonts.googleapis.com')) {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.googleapis.com';
    head.appendChild(preconnect);

    const preconnectStatic = document.createElement('link');
    preconnectStatic.rel = 'preconnect';
    preconnectStatic.href = 'https://fonts.gstatic.com';
    preconnectStatic.crossOrigin = '';
    head.appendChild(preconnectStatic);
  }

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = fontUrl;
  stylesheet.onerror = () => {
    console.warn('[soltana] Failed to load fonts from Google Fonts CDN');
  };
  head.appendChild(stylesheet);
}

/** Reset internal loaded flag — for test isolation only. */
export function _resetFontLoader(): void {
  _loaded = false;
}
