import { describe, it, expect } from 'vitest';
import { buildLlmsTxt } from './llms-txt.js';
import type { IntegrationData } from '../types.js';

const mockIntegrations: IntegrationData[] = [
  {
    package: '@soltana-ui/echarts',
    description: 'ECharts theme bridge for Soltana UI.',
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
  {
    package: 'soltana-matplotlib',
    description: 'Matplotlib styles for the Soltana UI design system.',
    language: 'python',
    install: 'pip install soltana-matplotlib',
    exports: [],
    staticThemes: ['dark', 'light', 'sepia'],
  },
];

describe('buildLlmsTxt', () => {
  const output = buildLlmsTxt({
    themeNames: ['dark', 'light', 'sepia'],
    integrations: mockIntegrations,
  });

  it('starts with the project name', () => {
    expect(output.startsWith('# Soltana UI')).toBe(true);
  });

  it('links to the full reference', () => {
    expect(output).toContain('/llms-full.txt');
  });

  it('lists integration packages', () => {
    expect(output).toContain('@soltana-ui/echarts');
    expect(output).toContain('@soltana-ui/react');
    expect(output).toContain('soltana-matplotlib');
  });

  it('lists all three tiers', () => {
    expect(output).toContain('Theme');
    expect(output).toContain('Relief');
    expect(output).toContain('Finish');
  });

  it('is under 2 KB', () => {
    expect(Buffer.byteLength(output, 'utf-8')).toBeLessThan(2048);
  });
});
