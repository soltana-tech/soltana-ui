/** API Reference — CSS custom property overrides. */

import { sectionHeading, codeExample, specimenBlock } from '../../utils/helpers';

export function renderApiOverrides(): string {
  return `
<div class="page-api-overrides">
  ${sectionHeading('Overrides', 'api-overrides', 'Fine-grained CSS custom property control.')}

  <p class="text-secondary mt-4 mb-6">
    Overrides apply CSS custom properties directly to <code>:root</code>,
    taking precedence over tier-derived tokens. Useful for brand color
    injection, one-off adjustments, or A/B testing token values.
  </p>

  ${specimenBlock(
    'setOverrides()',
    `
    <p class="text-secondary mb-4">
      Merges the given key–value pairs into the active override set. Keys must
      be valid CSS custom property names (starting with <code>--</code>). Values
      are applied to <code>document.documentElement.style</code>.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`setOverrides(overrides: Record<string, string>): void`, 'typescript')}

    <h4 class="font-semibold mt-6 mb-2">Example</h4>
    ${codeExample(
      `soltana.setOverrides({
  '--accent-primary': '#6366f1',
  '--accent-decorative': '#f59e0b',
  '--surface-bg': '#0f0f0f',
});`,
      'typescript'
    )}

    <p class="text-secondary mt-4">
      Calling <code>setOverrides()</code> multiple times merges into the existing
      set. To replace a value, include it in the new call. To remove values, use
      <code>removeOverrides()</code>.
    </p>
  `
  )}

  ${specimenBlock(
    'removeOverrides()',
    `
    <p class="text-secondary mb-4">
      Removes specific overrides by key. The corresponding CSS custom properties
      are cleared from <code>document.documentElement.style</code>, allowing
      tier-derived values to take effect again.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`removeOverrides(keys: string[]): void`, 'typescript')}

    <h4 class="font-semibold mt-6 mb-2">Example</h4>
    ${codeExample(
      `// Remove specific overrides
soltana.removeOverrides(['--accent-primary', '--surface-bg']);`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'Override Precedence',
    `
    <p class="text-secondary mb-4">
      CSS specificity order (highest wins):
    </p>
    <ol class="text-secondary" style="padding-left: 1.5rem;">
      <li><code>setOverrides()</code> — inline style on <code>:root</code></li>
      <li>Per-element utility classes (<code>.theme-*</code>, <code>.relief-*</code>, etc.)</li>
      <li>Global tier tokens from <code>[data-theme]</code>, <code>[data-relief]</code>, etc.</li>
      <li>Built-in defaults</li>
    </ol>

    <h4 class="font-semibold mt-6 mb-2">Common Use Cases</h4>
    ${codeExample(
      `// Brand color injection
soltana.setOverrides({
  '--accent-primary': 'var(--brand-blue)',
  '--accent-primary-hover': 'var(--brand-blue-dark)',
});

// Temporary A/B testing
soltana.setOverrides({
  '--card-bg': 'rgb(20 20 30 / 0.9)',
});

// Reset to tier defaults
soltana.removeOverrides(['--card-bg']);`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'Overrides in Config',
    `
    <p class="text-secondary mb-4">
      Overrides can also be set at initialization time via the
      <code>overrides</code> property in <code>SoltanaConfig</code>.
    </p>
    ${codeExample(
      `const soltana = initSoltana({
  theme: 'dark',
  relief: 'neumorphic',
  overrides: {
    '--accent-primary': '#8b5cf6',
    '--accent-decorative': '#fbbf24',
  },
});`,
      'typescript'
    )}

    <p class="text-secondary mt-4">
      These initial overrides are preserved across <code>reset()</code> calls.
      Overrides added via <code>setOverrides()</code> after initialization
      are cleared on <code>reset()</code>.
    </p>
  `
  )}
</div>`;
}
