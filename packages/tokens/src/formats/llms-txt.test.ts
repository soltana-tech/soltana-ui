import { describe, it, expect } from 'vitest';
import { buildLlmsTxt } from './llms-txt.js';
import type { IntegrationData } from '../types.js';

const mockIntegrations: IntegrationData[] = [
  {
    package: '@soltana-ui/mermaid',
    description: 'Mermaid theme bridge for Soltana UI.',
    language: 'typescript',
    exports: [],
    staticThemes: ['dark', 'light', 'sepia'],
  },
  {
    package: '@soltana-ui/react',
    description: 'React bindings for Soltana UI.',
    language: 'typescript',
    exports: [],
    staticThemes: [],
  },
];

describe('buildLlmsTxt', () => {
  const output = buildLlmsTxt({
    themeNames: ['dark', 'light', 'sepia'],
    integrations: mockIntegrations,
  });

  // Format tests
  it('starts with the project name', () => {
    expect(output.startsWith('# Soltana UI')).toBe(true);
  });

  it('links to the full reference', () => {
    expect(output).toContain('/llms-full.txt');
  });

  it('lists all three tiers', () => {
    expect(output).toContain('Theme');
    expect(output).toContain('Relief');
    expect(output).toContain('Finish');
  });

  it('is under 8 KB', () => {
    expect(Buffer.byteLength(output, 'utf-8')).toBeLessThan(8192);
  });

  // Data completeness tests
  it('mentions all built-in themes', () => {
    expect(output).toContain('dark');
    expect(output).toContain('light');
    expect(output).toContain('sepia');
  });

  it('lists all provided integration packages', () => {
    expect(output).toContain('@soltana-ui/mermaid');
    expect(output).toContain('@soltana-ui/react');
  });

  it('includes package descriptions for integrations', () => {
    expect(output).toContain('Mermaid theme bridge');
    expect(output).toContain('React bindings');
  });

  it('mentions activation mechanisms', () => {
    expect(output).toContain('data-theme');
    expect(output).toContain('data-relief');
    expect(output).toContain('data-finish');
  });

  it('includes per-element utility class activation', () => {
    expect(output).toContain('class=');
    expect(output.toLowerCase()).toMatch(/theme-|relief-|finish-/);
  });
});
