import { describe, it, expect } from 'vitest';
import { parseIndexExports } from './extract-integrations.js';

const ECHARTS_INDEX = `
export { buildTheme } from './build-theme.js';
export type { EChartsThemeObject } from './build-theme.js';
export { registerSoltanaTheme, autoSync } from './auto-sync.js';
export { dark, light, sepia } from './themes.js';
`;

const REACT_INDEX = `
export { useSoltana } from './use-soltana.js';
export { useSoltanaContext } from './context.js';
export { SoltanaProvider } from './provider.js';
export type { SoltanaContextValue, SoltanaProviderProps } from './types.js';

export {
  useAccordions,
  useDropdowns,
} from './use-enhancers.js';

export { showToast, dismissToast } from 'soltana-ui';
export type { ToastOptions, ToastType, ToastPosition } from 'soltana-ui';
`;

describe('parseIndexExports', () => {
  it('extracts value exports from echarts index', () => {
    // Pass a non-existent src dir so JSDoc resolution returns empty strings
    const exports = parseIndexExports(ECHARTS_INDEX, '/nonexistent');
    const names = exports.map((e) => e.name);
    expect(names).toContain('buildTheme');
    expect(names).toContain('registerSoltanaTheme');
    expect(names).toContain('autoSync');
  });

  it('extracts type exports', () => {
    const exports = parseIndexExports(ECHARTS_INDEX, '/nonexistent');
    const types = exports.filter((e) => e.kind === 'type');
    expect(types.map((t) => t.name)).toContain('EChartsThemeObject');
  });

  it('skips static theme names (dark, light, sepia)', () => {
    const exports = parseIndexExports(ECHARTS_INDEX, '/nonexistent');
    const names = exports.map((e) => e.name);
    expect(names).not.toContain('dark');
    expect(names).not.toContain('light');
    expect(names).not.toContain('sepia');
  });

  it('classifies React components correctly', () => {
    const exports = parseIndexExports(REACT_INDEX, '/nonexistent');
    const provider = exports.find((e) => e.name === 'SoltanaProvider');
    expect(provider?.kind).toBe('component');
  });

  it('classifies hooks as functions', () => {
    const exports = parseIndexExports(REACT_INDEX, '/nonexistent');
    const hook = exports.find((e) => e.name === 'useSoltana');
    expect(hook?.kind).toBe('function');
  });

  it('classifies type exports from re-exports', () => {
    const exports = parseIndexExports(REACT_INDEX, '/nonexistent');
    const types = exports.filter((e) => e.kind === 'type');
    const typeNames = types.map((t) => t.name);
    expect(typeNames).toContain('SoltanaContextValue');
    expect(typeNames).toContain('SoltanaProviderProps');
    expect(typeNames).toContain('ToastOptions');
  });
});
