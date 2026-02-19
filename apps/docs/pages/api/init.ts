/** API Reference — initSoltana() and SoltanaInitOptions. */

import { sectionHeading, codeExample, specimenBlock } from '../../utils/helpers';

export function renderApiInit(): string {
  return `
<div class="page-api-init">
  ${sectionHeading('Initialization', 'api-init', 'Create and configure a Soltana instance.')}

  ${specimenBlock(
    'initSoltana()',
    `
    <p class="text-secondary mb-4">
      Creates a <code>SoltanaInstance</code> that manages global tier state, applies
      data attributes to <code>&lt;html&gt;</code>, and optionally initializes enhancers.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(
      `function initSoltana(
  config?: Partial<SoltanaConfig & SoltanaInitOptions>
): SoltanaInstance`,
      'typescript'
    )}

    <h4 class="font-semibold mt-6 mb-2">Parameters</h4>
    <div class="table-container">
      <table class="table table-striped">
        <thead>
          <tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>theme</code></td><td><code>Theme</code></td><td><code>'auto'</code></td><td>Color scheme. <code>'auto'</code> resolves via <code>prefers-color-scheme</code>.</td></tr>
          <tr><td><code>relief</code></td><td><code>Relief</code></td><td><code>'neumorphic'</code></td><td>Shadow model applied globally.</td></tr>
          <tr><td><code>finish</code></td><td><code>Finish</code></td><td><code>'matte'</code></td><td>Surface treatment.</td></tr>
          <tr><td><code>overrides</code></td><td><code>Record&lt;string, string&gt;</code></td><td><code>{}</code></td><td>CSS custom property overrides applied to <code>:root</code>.</td></tr>
          <tr><td><code>enhancers</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Auto-initialize modal, tab, and tooltip enhancers. Defaults to <code>false</code> so CSS-only consumers avoid JS enhancer overhead — interactive apps should pass <code>true</code>.</td></tr>
          <tr><td><code>strict</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Throw on invalid tier values instead of logging warnings.</td></tr>
        </tbody>
      </table>
    </div>

    <h4 class="font-semibold mt-6 mb-2">Returns</h4>
    <p class="text-secondary">
      A <code>SoltanaInstance</code> object with methods for state access, tier setters,
      recipe management, overrides, runtime registration, and lifecycle control.
      See <a href="#/api/state">State</a> for the full instance API.
    </p>
  `
  )}

  ${specimenBlock(
    'Usage',
    `
    ${codeExample(
      `import { initSoltana } from '@soltana/init';

// Minimal — uses all defaults
const soltana = initSoltana();

// Fully configured
const soltana = initSoltana({
  theme: 'dark',
  relief: 'skeuomorphic',
  finish: 'frosted',
  enhancers: true,
  strict: true,
});`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'SoltanaConfig',
    `
    <p class="text-secondary mb-4">
      The persistent state managed by the instance. All tiers map to
      <code>data-*</code> attributes on <code>&lt;html&gt;</code>.
    </p>
    ${codeExample(
      `interface SoltanaConfig {
  theme: Theme;       // 'dark' | 'light' | 'sepia' | 'auto' | string
  relief: Relief;     // 'flat' | 'glassmorphic' | 'skeuomorphic' | 'neumorphic' | string
  finish: Finish;     // 'matte' | 'frosted' | 'tinted' | 'glossy' | string
  overrides: Record<string, string>;
}`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'SoltanaInitOptions',
    `
    ${codeExample(
      `interface SoltanaInitOptions {
  enhancers?: boolean; // Auto-init modals, tabs, tooltips (default: false)
  strict?: boolean;    // Throw on invalid values (default: false)
}`,
      'typescript'
    )}
  `
  )}
</div>`;
}
