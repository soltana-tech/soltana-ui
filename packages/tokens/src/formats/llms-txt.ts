// ---------------------------------------------------------------------------
// llms.txt Builder
// ---------------------------------------------------------------------------
// Generates a concise (<2 KB) project overview following the llms.txt
// convention for external agent discovery.
// ---------------------------------------------------------------------------

import type { IntegrationData } from '../types.js';

export interface LlmsTxtInput {
  themeNames: string[];
  integrations: IntegrationData[];
}

export function buildLlmsTxt(input: LlmsTxtInput): string {
  const packageLines = [
    '- `soltana-ui` — Core CSS + JS enhancers',
    ...input.integrations.map((pkg) => `- \`${pkg.package}\` — ${pkg.description}`),
  ];

  return [
    '# Soltana UI',
    '',
    '> CSS-first design system with a composable 3-tier architecture.',
    '',
    '## Tiers',
    '- **Theme**: dark, light, sepia, auto',
    '- **Relief**: flat, glassmorphic, skeuomorphic, neumorphic',
    '- **Finish**: matte, frosted, tinted, glossy',
    '',
    '## Activation',
    '- Global: `<html data-theme="dark" data-relief="glassmorphic" data-finish="frosted">`',
    '- Per-element: `<div class="theme-dark relief-glassmorphic finish-frosted">`',
    '',
    '## Packages',
    ...packageLines,
    '',
    '## Links',
    '- [Full Reference](/llms-full.txt)',
    '',
  ].join('\n');
}
