// ---------------------------------------------------------------------------
// Font Loading
// ---------------------------------------------------------------------------
// Injects Google Fonts <link> and preconnect hints for Soltana's typefaces.
// Idempotent: safe to call multiple times.
// ---------------------------------------------------------------------------

const FONT_CSS_URL =
  'https://fonts.googleapis.com/css2?' +
  'family=Cinzel:wght@400;500;600;700;800;900' +
  '&family=Cinzel+Decorative:wght@400;700;900' +
  '&family=Raleway:ital,wght@0,100..900;1,400;1,500' +
  '&family=JetBrains+Mono:wght@400;500;600' +
  '&display=swap';

let _loaded = false;

/**
 * Inject Google Fonts stylesheet and preconnect hints into <head>.
 * Call once at application startup. Subsequent calls are no-ops.
 */
export function loadSoltanaFonts(): void {
  if (_loaded || typeof document === 'undefined') return;
  _loaded = true;

  const head = document.head;

  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://fonts.googleapis.com';
  head.appendChild(preconnect);

  const preconnectStatic = document.createElement('link');
  preconnectStatic.rel = 'preconnect';
  preconnectStatic.href = 'https://fonts.gstatic.com';
  preconnectStatic.crossOrigin = '';
  head.appendChild(preconnectStatic);

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = FONT_CSS_URL;
  head.appendChild(stylesheet);
}
