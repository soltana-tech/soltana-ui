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

// ---------------------------------------------------------------------------
// Agent Documentation Types
// ---------------------------------------------------------------------------

/** A group of related utility classes extracted from compiled CSS. */
export interface UtilityGroup {
  category: string;
  description: string;
  responsive: boolean;
  classes: Record<string, unknown>;
}

/** A component module extracted from SCSS source files. */
export interface ComponentData {
  name: string;
  baseClass: string;
  description: string;
  tierAware: boolean;
  variants: string[];
  sizes: string[];
  children: string[];
  example: string;
}

/** An enhancer module extracted from TypeScript source files. */
export interface EnhancerData {
  fileName: string;
  initFunction: string;
  selector: string;
  selectorConst: string;
  description: string;
  htmlExample: string;
}

/** A single export extracted from an integration package. */
export interface IntegrationExport {
  name: string;
  kind: 'function' | 'component' | 'type' | 'constant';
  signature?: string;
  description: string;
  returns?: string;
}

/** An integration package extracted from the monorepo. */
export interface IntegrationData {
  package: string;
  description: string;
  language: 'typescript' | 'python';
  install?: string;
  exports: IntegrationExport[];
  staticThemes: string[];
}

/** Input for the agent documentation YAML builder. */
export interface AgentDocsInput {
  foundation: FoundationTokens;
  themes: Record<string, ThemeTokens>;
  utilities: UtilityGroup[];
  components: ComponentData[];
  enhancers: EnhancerData[];
  integrations: IntegrationData[];
}
