import { describe, it, expect } from 'vitest';

type FormatTestCallback<T> = (result: T) => void;

export function describeFormatBuilder<T, TTheme, TFoundation>(
  formatName: string,
  builderFn: (theme: TTheme, foundation: TFoundation) => T,
  theme: TTheme,
  foundation: TFoundation,
  tests: FormatTestCallback<T>
): void {
  describe(formatName, () => {
    const result = builderFn(theme, foundation);
    tests(result);
  });
}

export { it, expect };
