import { describe, it, expect, vi } from 'vitest';
import postcss from 'postcss';
import soltanaTreeshake from './postcss-soltana-treeshake.js';
import type { SoltanaTreeshakeOptions } from './types.js';

async function run(css: string, options: SoltanaTreeshakeOptions): Promise<string> {
  const result = await postcss([soltanaTreeshake(options)]).process(css, { from: undefined });
  return result.css;
}

describe('postcss-soltana-treeshake', () => {
  describe('theme stripping', () => {
    it('removes excluded theme data-attribute selectors', async () => {
      const input = `
[data-theme='sepia'], .theme-sepia { color: brown; }
[data-theme='dark'], .theme-dark { color: white; }
      `.trim();

      const output = await run(input, { themes: { include: ['dark'] } });

      expect(output).not.toContain('sepia');
      expect(output).toContain("[data-theme='dark']");
      expect(output).toContain('.theme-dark');
    });

    it('removes excluded theme class selectors', async () => {
      const input = `.theme-sepia { color: brown; }`;
      const output = await run(input, { themes: { include: ['dark', 'light'] } });

      expect(output).toBe('');
    });

    it('preserves :root when theme peer is excluded', async () => {
      const input = `:root, [data-theme='dark'], .theme-dark { color: white; }`;
      const output = await run(input, { themes: { include: ['light'] } });

      expect(output).toContain(':root');
      expect(output).not.toContain('dark');
    });
  });

  describe('relief stripping', () => {
    it('strips excluded relief values', async () => {
      const input = `
[data-relief='lifted'], .relief-lifted { box-shadow: 0 4px 8px; }
[data-relief='neu'], .relief-neu { box-shadow: inset 0 2px 4px; }
[data-relief='hewn'], .relief-hewn { box-shadow: none; }
      `.trim();

      const output = await run(input, { reliefs: { include: ['neu'] } });

      expect(output).not.toContain('lifted');
      expect(output).not.toContain('hewn');
      expect(output).toContain("[data-relief='neu']");
      expect(output).toContain('.relief-neu');
    });
  });

  describe('finish stripping', () => {
    it('strips excluded finish values', async () => {
      const input = `
[data-finish='glossy'], .finish-glossy { backdrop-filter: blur(0); }
[data-finish='matte'], .finish-matte { backdrop-filter: none; }
      `.trim();

      const output = await run(input, { finishes: { include: ['matte'] } });

      expect(output).not.toContain('glossy');
      expect(output).toContain("[data-finish='matte']");
    });
  });

  describe('ornament stripping', () => {
    it('strips excluded ornament :where() selectors', async () => {
      const input = `
:where([data-ornament='baroque']) { --ornament-color: gold; }
.ornament-baroque { --ornament-color: gold; }
:where([data-ornament='gilt']) { --ornament-color: #d4a843; }
.ornament-gilt { --ornament-color: #d4a843; }
      `.trim();

      const output = await run(input, { ornaments: { include: ['gilt'] } });

      expect(output).not.toContain('baroque');
      expect(output).toContain('gilt');
    });

    it('preserves consuming selectors without specific tier values', async () => {
      const input = `
:where([data-ornament]:not([data-ornament='none'])) .btn-ornament { display: block; }
:where([data-ornament='baroque']) { --ornament-color: gold; }
      `.trim();

      const output = await run(input, { ornaments: { include: ['gilt'] } });

      // Consuming selector has no specific value → kept
      expect(output).toContain('.btn-ornament');
      expect(output).not.toContain('baroque');
    });
  });

  describe('exclude mode', () => {
    it('supports explicit exclude lists', async () => {
      const input = `
[data-theme='dark'], .theme-dark { color: white; }
[data-theme='light'], .theme-light { color: black; }
[data-theme='sepia'], .theme-sepia { color: brown; }
      `.trim();

      const output = await run(input, { themes: { exclude: ['sepia'] } });

      expect(output).toContain('dark');
      expect(output).toContain('light');
      expect(output).not.toContain('sepia');
    });

    it('ignores non-built-in values in exclude lists', async () => {
      const input = `
[data-theme='midnight'], .theme-midnight { color: navy; }
[data-theme='dark'], .theme-dark { color: white; }
      `.trim();

      const output = await run(input, { themes: { exclude: ['midnight'] } });

      // 'midnight' is not built-in, so it's never stripped
      expect(output).toContain('midnight');
      expect(output).toContain('dark');
    });
  });

  describe('custom tier values', () => {
    it('never strips non-built-in tier values', async () => {
      const input = `
[data-theme='midnight'], .theme-midnight { color: navy; }
[data-theme='dark'], .theme-dark { color: white; }
[data-theme='sepia'], .theme-sepia { color: brown; }
      `.trim();

      const output = await run(input, { themes: { include: ['dark'] } });

      // 'midnight' is custom → always preserved
      expect(output).toContain('midnight');
      // 'sepia' is built-in and excluded
      expect(output).not.toContain('sepia');
      expect(output).toContain('dark');
    });
  });

  describe('selector rewriting', () => {
    it('removes entire rule when all fragments are excluded', async () => {
      const input = `[data-theme='sepia'], .theme-sepia { color: brown; }`;
      const output = await run(input, { themes: { include: ['dark'] } });

      expect(output.trim()).toBe('');
    });

    it('preserves non-tier selectors untouched', async () => {
      const input = `.btn { color: red; }\n.card { padding: 1rem; }`;
      const output = await run(input, { themes: { include: ['dark'] } });

      expect(output).toContain('.btn');
      expect(output).toContain('.card');
    });
  });

  describe('edge cases', () => {
    it('no-ops when options are empty', async () => {
      const input = `[data-theme='sepia'] { color: brown; }`;
      const output = await run(input, {});

      expect(output).toContain('sepia');
    });

    it('no-ops when no tier config is provided', async () => {
      const input = `[data-relief='hewn'] { box-shadow: none; }`;
      const output = await run(input, { themes: { include: ['dark'] } });

      // Relief not configured → nothing stripped
      expect(output).toContain('hewn');
    });

    it('handles @keyframes without touching them', async () => {
      const input = `
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
[data-theme='sepia'] { color: brown; }
      `.trim();

      const output = await run(input, { themes: { include: ['dark'] } });

      expect(output).toContain('@keyframes fade');
      expect(output).toContain('opacity');
      expect(output).not.toContain('sepia');
    });

    it('handles multiple tiers simultaneously', async () => {
      const input = `
[data-theme='sepia'], .theme-sepia { color: brown; }
[data-theme='dark'], .theme-dark { color: white; }
[data-relief='hewn'], .relief-hewn { box-shadow: none; }
[data-relief='neu'], .relief-neu { box-shadow: inset 0 2px 4px; }
[data-finish='glossy'], .finish-glossy { backdrop-filter: blur(0); }
[data-ornament='baroque'] { --ornament-color: gold; }
      `.trim();

      const output = await run(input, {
        themes: { include: ['dark'] },
        reliefs: { include: ['neu', 'flat'] },
        finishes: { exclude: ['glossy'] },
        ornaments: { include: ['none', 'gilt'] },
      });

      expect(output).not.toContain('sepia');
      expect(output).toContain('dark');
      expect(output).not.toContain('hewn');
      expect(output).toContain('neu');
      expect(output).not.toContain('glossy');
      expect(output).not.toContain('baroque');
    });

    it('preserves ornament modifier classes', async () => {
      const input = `
.ornament-subtle { opacity: 0.5; }
.ornament-strong { --ornament-opacity: 0.7; }
.ornament-sm { font-size: 0.875rem; }
:where([data-ornament='baroque']) { --ornament-color: gold; }
      `.trim();

      const output = await run(input, { ornaments: { include: ['gilt'] } });

      // Modifier classes are not built-in tier values → never stripped
      expect(output).toContain('.ornament-subtle');
      expect(output).toContain('.ornament-strong');
      expect(output).toContain('.ornament-sm');
      expect(output).not.toContain('baroque');
    });

    it('handles include with all built-in values (no stripping)', async () => {
      const input = `
[data-theme='dark'] { color: white; }
[data-theme='light'] { color: black; }
[data-theme='sepia'] { color: brown; }
      `.trim();

      const output = await run(input, {
        themes: { include: ['dark', 'light', 'sepia'] },
      });

      expect(output).toContain('dark');
      expect(output).toContain('light');
      expect(output).toContain('sepia');
    });

    it('strips rules inside @media queries', async () => {
      const input = `
@media (min-width: 768px) {
  [data-theme='sepia'], .theme-sepia { font-size: 1.2rem; }
  [data-theme='dark'], .theme-dark { font-size: 1rem; }
}
      `.trim();

      const output = await run(input, { themes: { include: ['dark'] } });

      expect(output).toContain('@media');
      expect(output).not.toContain('sepia');
      expect(output).toContain('dark');
    });

    it('include takes precedence when both include and exclude are provided', async () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
      const input = `
[data-theme='dark'] { color: white; }
[data-theme='light'] { color: black; }
[data-theme='sepia'] { color: brown; }
      `.trim();

      // include is checked first in the if/else chain
      const output = await run(input, {
        themes: { include: ['dark'], exclude: ['dark'] },
      });

      expect(output).toContain('dark');
      expect(output).not.toContain('light');
      expect(output).not.toContain('sepia');
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('both include and exclude'));
      spy.mockRestore();
    });

    it('empty include array excludes all built-in values', async () => {
      const input = `
[data-theme='dark'] { color: white; }
[data-theme='light'] { color: black; }
[data-theme='midnight'] { color: navy; }
      `.trim();

      const output = await run(input, { themes: { include: [] } });

      expect(output).not.toContain("data-theme='dark'");
      expect(output).not.toContain("data-theme='light'");
      // Custom values are always preserved
      expect(output).toContain('midnight');
    });

    it('empty exclude array is a no-op', async () => {
      const input = `
[data-theme='dark'] { color: white; }
[data-theme='sepia'] { color: brown; }
      `.trim();

      const output = await run(input, { themes: { exclude: [] } });

      expect(output).toContain('dark');
      expect(output).toContain('sepia');
    });
  });
});
