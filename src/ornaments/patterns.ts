// ---------------------------------------------------------------------------
// SVG Ornament Pattern Templates
// ---------------------------------------------------------------------------
// Inline SVG template literals for classical ornamental patterns.
// All patterns use currentColor for theme-awareness.
// ---------------------------------------------------------------------------

export const greekKey = (color = 'currentColor'): string => `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path fill="none" stroke="${color}" stroke-width="1.5" d="M0 12h6v6h12v-12h-12v6"/>
</svg>`;

export const scrollwork = (color = 'currentColor'): string => `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="32" viewBox="0 0 200 32">
  <path fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"
    d="M10 16c0-8 12-8 12 0s12 8 12 0-12-8-12 0 M56 16c0-8 12-8 12 0s12 8 12 0-12-8-12 0 M100 8l0 16 M122 16c0-8 12-8 12 0s12 8 12 0-12-8-12 0 M166 16c0-8 12-8 12 0s12 8 12 0-12-8-12 0"/>
  <circle cx="100" cy="16" r="4" fill="${color}" opacity="0.6"/>
</svg>`;

export const dentil = (color = 'currentColor'): string => `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12">
  <rect x="2" y="2" width="6" height="8" fill="${color}" opacity="0.5"/>
</svg>`;

export const medallion = (color = 'currentColor'): string => `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="20" fill="none" stroke="${color}" stroke-width="1.5"/>
  <circle cx="24" cy="24" r="16" fill="none" stroke="${color}" stroke-width="0.75" opacity="0.5"/>
  <circle cx="24" cy="24" r="3" fill="${color}" opacity="0.4"/>
</svg>`;

export const cornerOrnament = (color = 'currentColor'): string => `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <path fill="none" stroke="${color}" stroke-width="1.5"
    d="M4 28V8a4 4 0 0 1 4-4h20"/>
  <path fill="none" stroke="${color}" stroke-width="1" opacity="0.5"
    d="M8 28V12a4 4 0 0 1 4-4h16"/>
</svg>`;

export type PatternName = 'greek-key' | 'scrollwork' | 'dentil' | 'medallion' | 'corner';

export const patterns: Record<PatternName, (color?: string) => string> = {
  'greek-key': greekKey,
  scrollwork,
  dentil,
  medallion,
  corner: cornerOrnament,
};
