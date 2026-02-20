// ---------------------------------------------------------------------------
// Shared Static Export Test Factory
// ---------------------------------------------------------------------------
// Parameterized test generator for verifying dark/light/sepia static JSON
// exports across charting packages. Avoids duplicating the same 3-theme
// describe block in each package test file.
//
// Consumers must pass vitest primitives (describe, it, expect) explicitly.
// This avoids a direct vitest import that would break tsc resolution when
// non-test packages walk into chart-shared's source exports.
// ---------------------------------------------------------------------------

type DescribeFn = (name: string, fn: () => void) => void;
interface ItFn {
  each: <T>(cases: readonly T[]) => (name: string, fn: (arg: T) => void) => void;
  (name: string, fn: () => void): void;
}
type ExpectFn = (value: unknown) => { toHaveProperty: (key: string) => void };

export interface StaticExportTestConfig {
  /** The three static theme exports. */
  themes: { dark: unknown; light: unknown; sepia: unknown };
  /** Top-level properties every theme must have. */
  requiredKeys: string[];
  /** Optional deeper assertions on the dark theme export. */
  darkAssertions?: (theme: unknown) => void;
  /** Vitest describe function. */
  describe: DescribeFn;
  /** Vitest it function. */
  it: ItFn;
  /** Vitest expect function. */
  expect: ExpectFn;
}

type ThemeName = 'dark' | 'light' | 'sepia';

/**
 * Generate a `describe('static JSON exports', ...)` block that asserts
 * all three theme exports have the expected structure.
 */
export function describeStaticExports(config: StaticExportTestConfig): void {
  const { themes, requiredKeys, darkAssertions } = config;

  config.describe('static JSON exports', () => {
    const cases: ThemeName[] = ['dark', 'light', 'sepia'];
    config.it.each(cases)('exports %s theme with required keys', (name: ThemeName) => {
      const theme = themes[name];
      for (const key of requiredKeys) {
        config.expect(theme).toHaveProperty(key);
      }
    });

    if (darkAssertions) {
      config.it('dark theme passes additional assertions', () => {
        darkAssertions(themes.dark);
      });
    }
  });
}
