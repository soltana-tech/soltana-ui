/** Shared seed data for registration tests. */

export const THEME_SEED = {
  surfaceBg: '#1a1a2e',
  textPrimary: '#e0e0e0',
  accentPrimary: '#e94560',
};

export const SECOND_THEME_SEED = {
  surfaceBg: '#f6f7fa',
  textPrimary: '#1e2128',
  accentPrimary: '#576378',
  colorScheme: 'light' as const,
};

export const RELIEF_TOKENS = {
  '--relief-bg': 'var(--surface-1)',
  '--relief-shadow-sm': 'none',
  '--relief-shadow': 'none',
  '--relief-shadow-lg': 'none',
  '--relief-shadow-inset-sm': 'none',
  '--relief-shadow-inset': 'none',
  '--relief-shadow-inset-lg': 'none',
  '--relief-border': '1px solid var(--border-default)',
};

export const FINISH_TOKENS = {
  '--finish-blur': '0px',
  '--finish-saturation': '1',
  '--finish-opacity': '1',
  '--finish-overlay': 'none',
  '--finish-sheen': 'none',
};
