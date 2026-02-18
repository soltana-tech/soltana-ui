// ---------------------------------------------------------------------------
// Token Type Definitions
// ---------------------------------------------------------------------------
// Intermediate representations used between CSS extraction and format output.
// ---------------------------------------------------------------------------

/** Static color tokens extracted from a single theme rule block. */
export interface ThemeTokens {
  colorScheme: 'dark' | 'light';

  // Surface
  surfaceBg: string;
  surface1: string;
  surface2: string;
  surface3: string;
  surface4: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  textInverse: string;

  // Border
  borderDefault: string;
  borderSubtle: string;
  borderStrong: string;

  // Accent
  accentPrimary: string;
  accentSecondary: string;

  // Semantic
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorInfo: string;

  // Tooltip
  tooltipBg: string;
  tooltipText: string;
}

/** Foundation tokens extracted from the standalone `:root` block. */
export interface FoundationTokens {
  radius: Record<string, string>;
  shadow: Record<string, string>;
  transition: Record<string, string>;
  easing: Record<string, string>;
  z: Record<string, string>;
  fontFamily: Record<string, string>;
  fontSize: Record<string, [size: string, lineHeight: string]>;
  fontWeight: Record<string, string>;
  letterSpacing: Record<string, string>;
}

/** 6-color palette for chart color cycles. */
export type ColorPalette = [string, string, string, string, string, string];
