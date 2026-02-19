// ---------------------------------------------------------------------------
// Shared Test Fixtures
// ---------------------------------------------------------------------------
// Canonical dark theme and foundation token objects used across format tests.
// Each test file imports from here to avoid duplicating the fixture data.
// ---------------------------------------------------------------------------

import type { ThemeTokens, FoundationTokens } from '../types.js';

export const darkTheme: ThemeTokens = {
  colorScheme: 'dark',
  surfaceBg: '#08091a',
  surface1: '#0e1028',
  surface2: '#151838',
  surface3: '#1c2048',
  surface4: '#252a5a',
  textPrimary: '#f5f0e6',
  textSecondary: '#c5b99b',
  textTertiary: '#978b77',
  textMuted: '#897d69',
  textInverse: '#08091a',
  borderDefault: 'rgb(255 255 255 / 6%)',
  borderSubtle: 'rgb(255 255 255 / 3%)',
  borderStrong: 'rgb(255 255 255 / 10%)',
  accentPrimary: '#d4a843',
  accentSecondary: '#a855f7',
  colorSuccess: '#10b981',
  colorWarning: '#fcd34d',
  colorError: '#ef4444',
  colorInfo: '#3b82f6',
  tooltipBg: '#08091a',
  tooltipText: '#f5f0e6',
};

export const foundationMinimal: FoundationTokens = {
  radius: {},
  shadow: {},
  transition: {},
  easing: {},
  z: {},
  fontFamily: { sans: '"Raleway", ui-sans-serif, sans-serif' },
  fontSize: {},
  fontWeight: {},
  letterSpacing: {},
};

export const foundationStandard: FoundationTokens = {
  radius: { sm: '.25rem' },
  shadow: { sm: '0 1px 2px 0 rgb(0 0 0 / 8%)' },
  transition: { fast: '75ms' },
  easing: { in: 'cubic-bezier(.4, 0, 1, 1)' },
  z: { modal: '200' },
  fontFamily: { sans: '"Raleway", ui-sans-serif, sans-serif' },
  fontSize: { base: ['1rem', '1.65'] },
  fontWeight: { regular: '400' },
  letterSpacing: { refined: '.02em' },
};

export const foundationComprehensive: FoundationTokens = {
  radius: { sm: '.25rem', full: '9999px' },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 8%)',
    none: 'none',
  },
  transition: { fast: '75ms', slow: '.3s' },
  easing: {
    in: 'cubic-bezier(.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, .2, 1)',
  },
  z: { '10': '10', modal: '200' },
  fontFamily: { sans: '"Raleway", ui-sans-serif, sans-serif' },
  fontSize: { base: ['1rem', '1.65'] },
  fontWeight: { regular: '400', bold: '700' },
  letterSpacing: { refined: '.02em' },
};
