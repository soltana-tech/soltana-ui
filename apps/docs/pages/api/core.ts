/** API Reference — Core API: initialization, state, and overrides. */

import {
  sectionHeading,
  codeExample,
  specimenBlock,
  quickNav,
  sectionDivider,
} from '../../utils/helpers';

export function renderApiCore(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-api-core">
  ${sectionHeading('Core API', 'api-core', 'Initialization, state management, and CSS custom property overrides.')}

  ${quickNav([
    { label: 'Initialization', href: '#api-init' },
    { label: 'State', href: '#api-state' },
    { label: 'Overrides', href: '#api-overrides' },
  ])}

  ${sectionDivider()}

  <!-- Initialization -->
  <h3 class="text-2xl font-bold mb-6" id="api-init">Initialization</h3>

  ${specimenBlock(
    'initSoltana()',
    `
    <p class="text-secondary mb-4">
      Creates a <code>SoltanaInstance</code> that manages global tier state, applies
      data attributes to <code>&lt;html&gt;</code>, and optionally initializes enhancers.
    </p>

    <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(
      `function initSoltana(
  config?: Partial<SoltanaConfig & SoltanaInitOptions>
): SoltanaInstance`,
      'typescript'
    )}

    <h4 class="text-lg font-semibold mt-6 mb-2">Parameters</h4>
    <div class="table-container">
      <table class="table">
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

    <h4 class="text-lg font-semibold mt-6 mb-2">Returns</h4>
    <p class="text-secondary">
      A <code>SoltanaInstance</code> object with methods for state access, tier setters,
      recipe management, overrides, runtime registration, and lifecycle control.
      See <a href="#api-state">State</a> for the full instance API.
    </p>
  `
  )}

  ${specimenBlock(
    'Usage',
    `
    ${codeExample(
      `import { initSoltana } from 'soltana-ui';

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

  ${sectionDivider()}

  <!-- State -->
  <h3 class="text-2xl font-bold mb-6" id="api-state">State</h3>

  ${specimenBlock(
    'getState()',
    `
    <p class="text-secondary mb-4">
      Returns a snapshot of the current configuration. The returned object is a
      copy — mutating it does not affect the instance.
    </p>

    <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`getState(): SoltanaConfig`, 'typescript')}

    <h4 class="text-lg font-semibold mt-6 mb-2">Example</h4>
    ${codeExample(
      `const state = soltana.getState();
console.log(state.theme);  // 'dark'
console.log(state.relief); // 'neumorphic'`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'Tier Setters',
    `
    <p class="text-secondary mb-4">
      Each setter updates the corresponding <code>data-*</code> attribute on
      <code>&lt;html&gt;</code> and triggers a CSS cascade update. In strict mode,
      invalid values throw an <code>Error</code>.
    </p>

    <h4 class="text-lg font-semibold mt-6 mb-2">Signatures</h4>
    ${codeExample(
      `setTheme(theme: Theme): void
setRelief(relief: Relief): void
setFinish(finish: Finish): void`,
      'typescript'
    )}

    <h4 class="text-lg font-semibold mt-6 mb-2">Parameters</h4>
    <div class="table-container">
      <table class="table">
        <thead>
          <tr><th>Method</th><th>Accepted values</th></tr>
        </thead>
        <tbody>
          <tr><td><code>setTheme()</code></td><td><code>'dark'</code>, <code>'light'</code>, <code>'sepia'</code>, <code>'auto'</code>, or any registered custom theme</td></tr>
          <tr><td><code>setRelief()</code></td><td><code>'flat'</code>, <code>'glassmorphic'</code>, <code>'skeuomorphic'</code>, <code>'neumorphic'</code>, or custom</td></tr>
          <tr><td><code>setFinish()</code></td><td><code>'matte'</code>, <code>'frosted'</code>, <code>'tinted'</code>, <code>'glossy'</code>, or custom</td></tr>
        </tbody>
      </table>
    </div>

    <h4 class="text-lg font-semibold mt-6 mb-2">Example</h4>
    ${codeExample(
      `soltana.setTheme('light');
soltana.setRelief('skeuomorphic');
soltana.setFinish('frosted');`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'reinitEnhancers()',
    `
    <p class="text-secondary mb-4">
      Re-runs all enhancer initializers. Useful after dynamic DOM changes that
      add new modal, tab, or tooltip elements. Previous enhancer listeners are
      cleaned up automatically. Only effective when <code>enhancers: true</code>
      was passed to <code>initSoltana()</code>.
    </p>
    ${codeExample(`soltana.reinitEnhancers();`, 'typescript')}

    <h4 class="text-lg font-semibold mt-6 mb-2">Use Case: Dynamic DOM Injection</h4>
    <p class="text-secondary mb-4">
      After injecting new HTML containing modal, tab, or tooltip elements,
      call <code>reinitEnhancers()</code> so the new elements receive behavior:
    </p>
    ${codeExample(
      "// Inject dynamic content\nconst section = document.getElementById('dynamic-content');\nsection.innerHTML = await fetchPartial('/components/settings');\n\n// Re-initialize enhancers to pick up new elements\nsoltana.reinitEnhancers();",
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'reset()',
    `
    <p class="text-secondary mb-4">
      Resets all tiers to library defaults, clears overrides, removes runtime
      recipe and tier registrations, and tears down the managed stylesheet.
      DOM attributes are re-applied from the default state.
    </p>
    ${codeExample(`soltana.reset();`, 'typescript')}
  `
  )}

  ${specimenBlock(
    'destroy()',
    `
    <p class="text-secondary mb-4">
      Tears down the instance: removes all <code>data-*</code> attributes from
      <code>&lt;html&gt;</code>, clears overrides, and destroys active enhancers.
      The instance should not be used after calling <code>destroy()</code>.
    </p>
    <p class="text-secondary mb-4">
      <strong>Stale instance detection:</strong> if <code>initSoltana()</code> has been
      called again since this instance was created, <code>destroy()</code> will warn
      (or throw in strict mode) and no-op to avoid tearing down the newer instance.
    </p>
    ${codeExample(`soltana.destroy();`, 'typescript')}
  `
  )}

  ${specimenBlock(
    'version',
    `
    <p class="text-secondary mb-4">
      The <code>version</code> export contains the package version string,
      useful for runtime diagnostics.
    </p>
    ${codeExample(
      "import { version } from 'soltana-ui';\nconsole.log(version); // '1.0.0'",
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'DEFAULT_STATE',
    `
    <p class="text-secondary mb-4">
      The <code>DEFAULT_STATE</code> export provides the default tier configuration
      used when no overrides are provided to <code>initSoltana()</code>.
    </p>
    ${codeExample(
      `import { DEFAULT_STATE } from 'soltana-ui';

console.log(DEFAULT_STATE);
// { theme: 'auto', relief: 'neumorphic', finish: 'matte', overrides: {} }`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'soltana:change Event',
    `
    <p class="text-secondary mb-4">
      Every tier setter and override mutation dispatches a
      <code>soltana:change</code> <code>CustomEvent</code> on
      <code>document.documentElement</code>. Listen for it to synchronize
      external state or trigger side effects.
    </p>

    <h4 class="text-lg font-semibold mt-6 mb-2">Event Detail</h4>
    ${codeExample(
      `interface SoltanaChangeDetail {
  type: string;   // 'theme' | 'relief' | 'finish' | 'overrides' | 'reset'
  value: unknown;  // The new value (or null for reset/override removal)
}`,
      'typescript'
    )}

    <h4 class="text-lg font-semibold mt-6 mb-2">Example</h4>
    ${codeExample(
      `document.documentElement.addEventListener('soltana:change', (e) => {
  const { type, value } = (e as CustomEvent).detail;
  console.log('Changed:', type, value);
});

soltana.setTheme('light'); // logs: Changed: theme light`,
      'typescript'
    )}
  `
  )}

  ${sectionDivider()}

  <!-- Overrides -->
  <h3 class="text-2xl font-bold mb-6" id="api-overrides">Overrides</h3>

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

    <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`setOverrides(overrides: Record<string, string>): void`, 'typescript')}

    <h4 class="text-lg font-semibold mt-6 mb-2">Example</h4>
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

    <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`removeOverrides(keys: string[]): void`, 'typescript')}

    <h4 class="text-lg font-semibold mt-6 mb-2">Example</h4>
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

    <h4 class="text-lg font-semibold mt-6 mb-2">Common Use Cases</h4>
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
      Calling <code>reset()</code> clears all overrides, including those set
      at initialization time. The instance reverts to default tier values
      with an empty overrides map.
    </p>
  `
  )}
</div>`;
  return page;
}
