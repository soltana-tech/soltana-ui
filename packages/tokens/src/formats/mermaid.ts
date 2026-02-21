// ---------------------------------------------------------------------------
// Mermaid Theme Builder
// ---------------------------------------------------------------------------
// Builds a Mermaid-compatible theme config from extracted tokens. All color
// values are alpha-composited to solid hex — Mermaid only accepts #rrggbb.
// ---------------------------------------------------------------------------

import type { ThemeTokens, FoundationTokens } from '../types.js';
import { buildPalette } from '../resolve.js';
import { toHex } from '@soltana-ui/chart-shared';

/** Mermaid theme config shape passed to `mermaid.initialize()`. */
export interface MermaidConfig {
  theme: 'base';
  themeVariables: Record<string, string | boolean>;
}

/** Build a Mermaid theme config from extracted tokens. */
export function buildMermaidConfig(
  theme: ThemeTokens,
  foundation: FoundationTokens
): MermaidConfig {
  const palette = buildPalette(theme);
  const bg = theme.surfaceBg;
  const hex = (color: string): string => toHex(color, bg);

  const fontFamily = foundation.fontFamily.sans;

  return {
    theme: 'base',
    themeVariables: {
      darkMode: theme.colorScheme === 'dark',

      // Surfaces
      background: hex(bg),
      primaryColor: hex(theme.surface1),
      secondaryColor: hex(theme.surface2),
      tertiaryColor: hex(theme.surface3),
      mainBkg: hex(theme.surface1),

      // Text
      primaryTextColor: hex(theme.textPrimary),
      secondaryTextColor: hex(theme.textPrimary),
      tertiaryTextColor: hex(theme.textPrimary),
      labelTextColor: hex(theme.textMuted),

      // Borders / Lines
      primaryBorderColor: hex(theme.borderDefault),
      secondaryBorderColor: hex(theme.borderDefault),
      tertiaryBorderColor: hex(theme.borderDefault),
      nodeBorder: hex(theme.borderDefault),
      lineColor: hex(theme.borderDefault),

      // Sequence diagrams
      actorBkg: hex(theme.surface1),
      actorTextColor: hex(theme.textPrimary),
      actorBorder: hex(theme.borderDefault),
      signalColor: hex(theme.textPrimary),
      noteBkgColor: hex(theme.surface2),
      noteTextColor: hex(theme.textPrimary),
      noteBorderColor: hex(theme.borderDefault),

      // Flowcharts
      clusterBkg: hex(theme.surface1),
      edgeLabelBackground: hex(theme.surface2),

      // Activation / state
      activationBorderColor: hex(theme.accentPrimary),
      activeBorderColor: hex(theme.accentPrimary),
      activeBkgColor: hex(theme.accentPrimary),

      // Gantt semantic
      doneBorderColor: hex(theme.colorSuccess),
      doneBkgColor: hex(theme.colorSuccess),
      critBorderColor: hex(theme.colorError),
      critBkgColor: hex(theme.colorError),

      // Font
      fontFamily,

      // Pie chart palette
      pie1: hex(palette[0]),
      pie2: hex(palette[1]),
      pie3: hex(palette[2]),
      pie4: hex(palette[3]),
      pie5: hex(palette[4]),
      pie6: hex(palette[5]),
    },
  };
}
