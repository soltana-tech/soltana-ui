// ---------------------------------------------------------------------------
// llms-full.txt Builder
// ---------------------------------------------------------------------------
// Generates a comprehensive markdown reference from AgentDocsInput.
// Covers tier system, foundation tokens, themes, components, utilities,
// JavaScript API, integrations, patterns, and accessibility.
// ---------------------------------------------------------------------------

import type {
  AgentDocsInput,
  FoundationTokens,
  ThemeTokens,
  ComponentData,
  UtilityGroup,
  EnhancerData,
  IntegrationData,
} from '../types.js';
import type { ImperativeExport } from '../extract-enhancers.js';

export interface LlmsFullTxtOptions {
  imperatives?: ImperativeExport[];
}

export function buildLlmsFullTxt(input: AgentDocsInput, options?: LlmsFullTxtOptions): string {
  const sections = [
    buildHeader(),
    buildTierSection(),
    buildFoundationSection(input.foundation),
    buildThemesSection(input.themes),
    buildComponentsSection(input.components),
    buildUtilitiesSection(input.utilities),
    buildJsApiSection(input.enhancers, options?.imperatives),
    buildIntegrationsSection(input.integrations),
    buildPatternsSection(),
    buildAccessibilitySection(),
  ];

  return sections.join('\n\n---\n\n') + '\n';
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

function buildHeader(): string {
  return [
    '# Soltana UI — Full Reference',
    '',
    'CSS-first design system with a composable 3-tier architecture: **Theme** x **Relief** x **Finish**.',
    'Each tier activates independently via `[data-*]` attributes on `<html>` or per-element utility classes.',
  ].join('\n');
}

function buildTierSection(): string {
  return [
    '## Tier System',
    '',
    '| Tier | Options | Attribute | Per-element classes |',
    '|------|---------|-----------|-------------------|',
    '| Theme | dark, light, sepia, auto | `data-theme` | `.theme-dark`, `.theme-light`, `.theme-sepia` |',
    '| Relief | flat, glassmorphic, skeuomorphic, neumorphic | `data-relief` | `.relief-flat`, `.relief-glassmorphic`, `.relief-skeuomorphic`, `.relief-neumorphic` |',
    '| Finish | matte, frosted, tinted, glossy | `data-finish` | `.finish-matte`, `.finish-frosted`, `.finish-tinted`, `.finish-glossy` |',
    '',
    '### Bridge Tokens',
    '',
    'Relief and finish tiers compose via shared channel tokens:',
    '`--shadow-color`, `--highlight-color`, `--accent-glow`, `--channel-sheen-color`, `--channel-tint-color`, `--glass-opacity`, `--relief-opacity`, `--finish-opacity`',
    '',
    '### Breakpoints',
    '',
    '| Token | Value |',
    '|-------|-------|',
    '| sm | 640px |',
    '| md | 768px |',
    '| lg | 1024px |',
    '| xl | 1280px |',
    '| 2xl | 1536px |',
  ].join('\n');
}

function buildFoundationSection(f: FoundationTokens): string {
  const lines = ['## Foundation Tokens'];

  if (Object.keys(f.radius).length > 0) {
    lines.push('', '### Border Radius', '');
    for (const [name, value] of Object.entries(f.radius)) {
      lines.push(`- \`--radius-${name}\`: ${value}`);
    }
  }

  if (Object.keys(f.shadow).length > 0) {
    lines.push('', '### Shadows', '');
    for (const [name, value] of Object.entries(f.shadow)) {
      lines.push(`- \`--shadow-${name}\`: \`${value}\``);
    }
  }

  if (Object.keys(f.fontFamily).length > 0) {
    lines.push('', '### Typography', '');
    for (const [name, value] of Object.entries(f.fontFamily)) {
      lines.push(`- \`--font-${name}\`: ${value}`);
    }
  }

  if (Object.keys(f.fontSize).length > 0) {
    lines.push('', '### Font Sizes', '');
    for (const [name, [size, lh]] of Object.entries(f.fontSize)) {
      lines.push(`- \`--text-${name}\`: ${size} / ${lh}`);
    }
  }

  if (Object.keys(f.fontWeight).length > 0) {
    lines.push('', '### Font Weights', '');
    for (const [name, value] of Object.entries(f.fontWeight)) {
      lines.push(`- \`--weight-${name}\`: ${value}`);
    }
  }

  return lines.join('\n');
}

function buildThemesSection(themes: Record<string, ThemeTokens>): string {
  const lines = ['## Themes'];

  for (const [name, tokens] of Object.entries(themes)) {
    lines.push(
      '',
      `### ${name}`,
      '',
      `- Color scheme: ${tokens.colorScheme}`,
      `- Surface: ${tokens.surfaceBg}`,
      `- Text primary: ${tokens.textPrimary}`,
      `- Accent primary: ${tokens.accentPrimary}`,
      `- Accent secondary: ${tokens.accentSecondary}`,
      `- Success: ${tokens.colorSuccess}`,
      `- Warning: ${tokens.colorWarning}`,
      `- Error: ${tokens.colorError}`,
      `- Info: ${tokens.colorInfo}`
    );
  }

  return lines.join('\n');
}

function buildComponentsSection(components: ComponentData[]): string {
  const lines = ['## Components'];

  for (const comp of components) {
    lines.push('', `### ${comp.name}`, '');
    lines.push(`Base class: \`.${comp.baseClass.replace(/^\./, '')}\``);
    lines.push(`Description: ${comp.description}`);
    if (comp.tierAware) lines.push('Tier-aware: yes');

    if (comp.variants.length > 0) {
      lines.push(`Variants: ${comp.variants.map((v) => `\`${v.replace(/^\./, '')}\``).join(', ')}`);
    }
    if (comp.sizes.length > 0) {
      lines.push(`Sizes: ${comp.sizes.map((s) => `\`${s.replace(/^\./, '')}\``).join(', ')}`);
    }
    if (comp.children.length > 0) {
      lines.push(`Children: ${comp.children.map((c) => `\`${c.replace(/^\./, '')}\``).join(', ')}`);
    }

    if (comp.example) {
      lines.push('', '```html', comp.example, '```');
    }
  }

  return lines.join('\n');
}

function buildUtilitiesSection(groups: UtilityGroup[]): string {
  const lines = ['## Utilities'];

  for (const group of groups) {
    lines.push('', `### ${group.category}`);
    lines.push(`${group.description}${group.responsive ? ' (responsive)' : ''}`);

    if (Object.keys(group.classes).length > 0) {
      for (const [key, value] of Object.entries(group.classes)) {
        if (Array.isArray(value)) {
          lines.push(`- **${key}**: ${value.join(', ')}`);
        } else if (typeof value === 'object' && value !== null) {
          const obj = value as Record<string, string>;
          const parts = Object.entries(obj)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ');
          lines.push(`- **${key}**: ${parts}`);
        }
      }
    }
  }

  lines.push(
    '',
    '### Responsive',
    'Breakpoint prefix before class: `md:flex-col`',
    'Covered: display, flex, grid, gap, padding, margin, sizing, text-align'
  );

  return lines.join('\n');
}

function buildJsApiSection(enhancers: EnhancerData[], imperatives?: ImperativeExport[]): string {
  const lines = [
    '## JavaScript API',
    '',
    '### Initialization',
    '',
    '```js',
    'import { initSoltana } from "soltana-ui";',
    'const sol = initSoltana({ theme: "dark", relief: "glassmorphic", finish: "frosted" });',
    '```',
    '',
    '### Instance Methods',
    '',
    '- `getState()` → SoltanaConfig',
    '- `setTheme(name)` — Switch active theme',
    '- `setRelief(name)` — Switch active relief',
    '- `setFinish(name)` — Switch active finish',
    '- `setOverrides(record)` — Inject CSS custom properties',
    '- `removeOverrides(keys)` — Remove CSS custom property overrides',
    '- `registerTheme(name, options)` — Runtime theme from seed colors',
    '- `registerRelief(name, options)` — Runtime relief from token map',
    '- `registerFinish(name, options)` — Runtime finish from token map',
    '- `reinitEnhancers()` — Destroy and re-create JS enhancers',
    '- `reset()` — Reset all tiers to defaults',
    '- `destroy()` — Tear down instance and remove all attributes',
    '',
    '### Enhancers',
    '',
  ];

  for (const e of enhancers) {
    lines.push(`- \`${e.initFunction}\` — ${e.selector} — ${e.description}`);
  }

  if (imperatives && imperatives.length > 0) {
    lines.push('', '### Imperative APIs', '');
    for (const imp of imperatives) {
      lines.push(`- \`${imp.name}\` — ${imp.description}`);
    }
  }

  lines.push(
    '',
    '### Events',
    '',
    'Event: `soltana:change` on `document.documentElement`',
    'Detail types: theme, relief, finish, overrides, reset, destroy',
    '',
    '### PostCSS Plugin',
    '',
    '`soltanaTreeshake({ themes, reliefs, finishes })` — strips unused tier rulesets.',
    '',
    '### Font Loading',
    '',
    '`loadSoltanaFonts(url?)` — injects Google Fonts link for Cinzel, Cinzel Decorative, Raleway, JetBrains Mono.'
  );

  return lines.join('\n');
}

function buildIntegrationsSection(integrations: IntegrationData[]): string {
  if (integrations.length === 0) return '## Integrations\n\nNo integration packages found.';

  const lines = ['## Integrations'];

  for (const pkg of integrations) {
    lines.push('', `### ${pkg.package}`, '');
    lines.push(pkg.description);

    if (pkg.install) {
      lines.push('', '```', pkg.install, '```');
    }

    if (pkg.exports.length > 0) {
      lines.push('', '| Export | Kind | Description |', '|--------|------|-------------|');
      for (const exp of pkg.exports) {
        lines.push(`| \`${exp.name}\` | ${exp.kind} | ${exp.description} |`);
      }
    }

    if (pkg.staticThemes.length > 0) {
      lines.push('', `Static themes: ${pkg.staticThemes.join(', ')}`);
    }
  }

  return lines.join('\n');
}

function buildPatternsSection(): string {
  return [
    '## Patterns',
    '',
    '### Tier Compositions',
    '',
    '| Theme | Relief | Finish | Use case |',
    '|-------|--------|--------|----------|',
    '| dark | glassmorphic | frosted | Modern overlay panels |',
    '| sepia | skeuomorphic | matte | Vintage document UIs |',
    '| light | neumorphic | matte | Soft minimal dashboards |',
    '| dark | flat | glossy | High-contrast data displays |',
    '',
    '### Responsive Layouts',
    '',
    '- Mobile-first stack: `flex flex-col md:flex-row gap-4`',
    '- Card grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`',
    '- Centered: `flex items-center justify-center min-h-screen`',
    '',
    '### Common HTML',
    '',
    '```html',
    '<!-- Card grid -->',
    '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">',
    '  <div class="card card-hover"><div class="card-body">…</div></div>',
    '</div>',
    '',
    '<!-- Form -->',
    '<form class="flex flex-col gap-4 max-w-md">',
    '  <input class="input" type="text" placeholder="Name" />',
    '  <button class="btn btn-primary">Submit</button>',
    '</form>',
    '',
    '<!-- App shell -->',
    '<div class="app-layout">',
    '  <header class="app-header">…</header>',
    '  <aside class="sidebar">…</aside>',
    '  <main class="main"><div class="main__content">…</div></main>',
    '</div>',
    '```',
  ].join('\n');
}

function buildAccessibilitySection(): string {
  return [
    '## Accessibility',
    '',
    '### Utility Classes',
    '',
    '- `.sr-only` — Visually hidden, accessible to screen readers',
    '- `.skip-link` — Skip navigation link',
    '- `.focus-ring` — Visible focus indicator',
    '',
    '### Features',
    '',
    '- `prefers-reduced-motion`: disables animations',
    '- `prefers-contrast`: increases border contrast',
    '- All interactive components have visible focus states',
    '- Enhancers add ARIA attributes and keyboard navigation',
  ].join('\n');
}
