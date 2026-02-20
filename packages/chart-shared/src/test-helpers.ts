// ---------------------------------------------------------------------------
// Shared Test Helpers for Charting Packages
// ---------------------------------------------------------------------------
// Common CSS property fixtures and DOM helpers used by @soltana-ui/echarts
// and @soltana-ui/plotly test suites. Centralizes the mock CSS setup to
// avoid duplication across charting test files.
// ---------------------------------------------------------------------------

/** Base set of CSS custom properties shared across charting test suites. */
export const CSS_PROPS: Record<string, string> = {
  '--surface-bg': '#1a1a2e',
  '--text-primary': '#e0e0e0',
  '--text-secondary': '#a0a0b0',
  '--text-muted': '#707080',
  '--border-default': '#333355',
  '--border-subtle': '#2a2a44',
  '--font-sans': 'Inter, sans-serif',
  '--accent-primary': '#6c63ff',
  '--color-info': '#3b82f6',
  '--color-success': '#22c55e',
  '--color-warning': '#f59e0b',
  '--accent-secondary': '#ec4899',
  '--color-error': '#ef4444',
};

/** Apply CSS custom properties to the document root element. */
export function setCssProps(props: Record<string, string>): void {
  for (const [key, value] of Object.entries(props)) {
    document.documentElement.style.setProperty(key, value);
  }
}

/** Remove all inline styles from the document root element. */
export function clearCssProps(): void {
  document.documentElement.removeAttribute('style');
}
