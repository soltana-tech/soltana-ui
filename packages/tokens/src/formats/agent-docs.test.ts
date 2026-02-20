import { describe, it, expect } from 'vitest';
import yaml from 'js-yaml';
import { buildAgentDocs } from './agent-docs.js';
import { darkTheme, foundationStandard as foundation } from '../__fixtures__/tokens.js';
import type { UtilityGroup, ComponentData } from '../types.js';

const mockUtilities: UtilityGroup[] = [
  {
    category: 'spacing',
    description: 'Padding, margin, and gap utilities',
    responsive: true,
    classes: { padding: { pattern: 'p-{step}', range: '0–64' } },
  },
  {
    category: 'layout',
    description: 'Display, flexbox, grid, and positioning',
    responsive: true,
    classes: { display: ['block', 'flex', 'grid', 'hidden'] },
  },
];

const mockComponents: ComponentData[] = [
  {
    name: 'Buttons',
    baseClass: '.btn',
    description: 'Action triggers with color variants and size modifiers',
    tierAware: true,
    variants: ['.btn-primary', '.btn-secondary'],
    sizes: ['.btn-sm', '.btn-lg'],
    children: [],
    example: '<button class="btn btn-primary">Label</button>',
  },
  {
    name: 'Cards',
    baseClass: '.card',
    description: 'Content containers with header/body/footer sections',
    tierAware: true,
    variants: ['.card-flat', '.card-hover'],
    sizes: [],
    children: ['.card-header', '.card-body', '.card-footer'],
    example: '<div class="card"><div class="card-body">Content</div></div>',
  },
];

describe('buildAgentDocs', () => {
  const yamlStr = buildAgentDocs({
    foundation,
    themes: { dark: darkTheme },
    utilities: mockUtilities,
    components: mockComponents,
  });

  it('returns valid YAML that round-trips', () => {
    const parsed = yaml.load(yamlStr);
    expect(parsed).toBeDefined();
    expect(typeof parsed).toBe('object');
  });

  it('includes all required top-level keys', () => {
    const doc = yaml.load(yamlStr) as Record<string, unknown>;
    const requiredKeys = [
      '_meta',
      'tier_system',
      'foundation',
      'themes',
      'utilities',
      'components',
      'javascript_api',
      'patterns',
      'accessibility',
    ];
    for (const key of requiredKeys) {
      expect(doc).toHaveProperty(key);
    }
  });

  it('includes ISO timestamp in _meta.generated', () => {
    const doc = yaml.load(yamlStr) as Record<string, Record<string, string>>;
    expect(doc._meta.generated).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('includes source path in _meta', () => {
    const doc = yaml.load(yamlStr) as Record<string, Record<string, string>>;
    expect(doc._meta.source).toContain('soltana-ui.css');
  });

  it('lists tier system values', () => {
    const doc = yaml.load(yamlStr) as Record<string, Record<string, unknown>>;
    const ts = doc.tier_system;
    expect(ts.themes).toEqual(['dark', 'light', 'sepia', 'auto']);
    expect(ts.reliefs).toEqual(['flat', 'glassmorphic', 'skeuomorphic', 'neumorphic']);
    expect(ts.finishes).toEqual(['matte', 'frosted', 'tinted', 'glossy']);
  });

  it('includes foundation typography', () => {
    const doc = yaml.load(yamlStr) as Record<string, Record<string, unknown>>;
    const f = doc.foundation;
    expect(f).toHaveProperty('typography');
    expect(f).toHaveProperty('radius');
  });

  it('includes dark theme tokens', () => {
    const doc = yaml.load(yamlStr) as Record<string, Record<string, Record<string, string>>>;
    expect(doc.themes.dark.surfaceBg).toBe('#08091a');
    expect(doc.themes.dark.colorScheme).toBe('dark');
  });

  it('includes utility categories', () => {
    const doc = yaml.load(yamlStr) as Record<string, Record<string, unknown>>;
    expect(doc.utilities).toHaveProperty('spacing');
    expect(doc.utilities).toHaveProperty('layout');
  });

  it('includes component entries', () => {
    const doc = yaml.load(yamlStr) as Record<string, Record<string, unknown>>;
    expect(doc.components).toHaveProperty('buttons');
    expect(doc.components).toHaveProperty('cards');
  });

  it('includes javascript_api with init and methods', () => {
    const doc = yaml.load(yamlStr) as Record<string, Record<string, unknown>>;
    const api = doc.javascript_api;
    expect(api).toHaveProperty('init');
    expect(api).toHaveProperty('instance_methods');
    expect(api).toHaveProperty('registration');
    expect(api).toHaveProperty('enhancers');
    expect(api).toHaveProperty('events');
    expect(api).toHaveProperty('postcss_plugin');
    expect(api).toHaveProperty('fonts');
  });

  it('includes patterns section', () => {
    const doc = yaml.load(yamlStr) as Record<string, Record<string, unknown>>;
    expect(doc.patterns).toHaveProperty('tier_composition');
    expect(doc.patterns).toHaveProperty('responsive_layout');
    expect(doc.patterns).toHaveProperty('common_compositions');
  });

  it('includes accessibility section', () => {
    const doc = yaml.load(yamlStr) as Record<string, Record<string, unknown>>;
    expect(doc.accessibility).toHaveProperty('classes');
    expect(doc.accessibility).toHaveProperty('features');
  });

  it('starts with comment header', () => {
    expect(yamlStr.startsWith('# Soltana UI')).toBe(true);
    expect(yamlStr).toContain('Do not edit');
  });
});
