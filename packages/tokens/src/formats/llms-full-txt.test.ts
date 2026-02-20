import { describe, it, expect } from 'vitest';
import { buildLlmsFullTxt } from './llms-full-txt.js';
import { darkTheme, foundationStandard as foundation } from '../__fixtures__/tokens.js';
import type { AgentDocsInput, EnhancerData, IntegrationData } from '../types.js';

const mockEnhancers: EnhancerData[] = [
  {
    fileName: 'accordion',
    initFunction: 'initAccordions',
    selector: '[data-sol-accordion]',
    selectorConst: 'ACCORDION_SELECTOR',
    description: 'Enhance all [data-sol-accordion] elements',
    htmlExample: '<div data-sol-accordion>…</div>',
  },
  {
    fileName: 'tabs',
    initFunction: 'initTabs',
    selector: '[data-sol-tabs]',
    selectorConst: 'TABS_SELECTOR',
    description: 'Enhance all [data-sol-tabs] elements',
    htmlExample: '<div data-sol-tabs>…</div>',
  },
];

const mockIntegrations: IntegrationData[] = [
  {
    package: '@soltana-ui/echarts',
    description: 'ECharts theme bridge for Soltana UI.',
    language: 'typescript',
    exports: [{ name: 'buildTheme', kind: 'function', description: 'Build an ECharts theme' }],
    staticThemes: ['dark', 'light', 'sepia'],
  },
  {
    package: 'soltana-matplotlib',
    description: 'Matplotlib styles for the Soltana UI design system.',
    language: 'python',
    install: 'pip install soltana-matplotlib',
    exports: [],
    staticThemes: ['dark', 'light', 'sepia'],
  },
];

const input: AgentDocsInput = {
  foundation,
  themes: { dark: darkTheme },
  utilities: [
    {
      category: 'spacing',
      description: 'Padding and margin utilities',
      responsive: true,
      classes: { padding: { pattern: 'p-{step}', range: '0–64' } },
    },
  ],
  components: [
    {
      name: 'Buttons',
      baseClass: '.btn',
      description: 'Action triggers with color variants',
      tierAware: true,
      variants: ['.btn-primary'],
      sizes: ['.btn-sm'],
      children: [],
      example: '<button class="btn btn-primary">Label</button>',
    },
  ],
  enhancers: mockEnhancers,
  integrations: mockIntegrations,
};

describe('buildLlmsFullTxt', () => {
  const output = buildLlmsFullTxt(input, {
    imperatives: [
      { name: 'showToast', description: 'Programmatically show a toast notification.' },
    ],
  });

  it('starts with the full reference heading', () => {
    expect(output).toContain('# Soltana UI — Full Reference');
  });

  it('contains all major section headings', () => {
    const headings = [
      '## Tier System',
      '## Foundation Tokens',
      '## Themes',
      '## Components',
      '## Utilities',
      '## JavaScript API',
      '## Integrations',
      '## Patterns',
      '## Accessibility',
    ];
    for (const heading of headings) {
      expect(output).toContain(heading);
    }
  });

  it('contains fenced code blocks', () => {
    expect(output).toContain('```html');
    expect(output).toContain('```js');
  });

  it('lists integration packages', () => {
    expect(output).toContain('@soltana-ui/echarts');
    expect(output).toContain('soltana-matplotlib');
  });

  it('includes enhancers', () => {
    expect(output).toContain('initAccordions');
    expect(output).toContain('initTabs');
  });

  it('includes imperative APIs', () => {
    expect(output).toContain('showToast');
  });

  it('includes component details', () => {
    expect(output).toContain('### Buttons');
    expect(output).toContain('btn-primary');
  });
});
