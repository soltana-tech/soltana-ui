/** API Reference — SoltanaInstance state methods. */

import { sectionHeading, codeExample, specimenBlock } from '../../utils/helpers';

export function renderApiState(): string {
  return `
<div class="page-api-state">
  ${sectionHeading('State', 'api-state', 'Read and mutate the global tier configuration.')}

  ${specimenBlock(
    'getState()',
    `
    <p class="text-secondary mb-4">
      Returns a snapshot of the current configuration. The returned object is a
      copy — mutating it does not affect the instance.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`getState(): SoltanaConfig`, 'typescript')}

    <h4 class="font-semibold mt-6 mb-2">Example</h4>
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
      invalid values throw a <code>TypeError</code>.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signatures</h4>
    ${codeExample(
      `setTheme(theme: Theme): void
setRelief(relief: Relief): void
setFinish(finish: Finish): void`,
      'typescript'
    )}

    <h4 class="font-semibold mt-6 mb-2">Parameters</h4>
    <div class="table-container">
      <table class="table table-striped">
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

    <h4 class="font-semibold mt-6 mb-2">Example</h4>
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
      cleaned up automatically.
    </p>
    ${codeExample(`soltana.reinitEnhancers();`, 'typescript')}

    <h4 class="font-semibold mt-6 mb-2">Use Case: Dynamic DOM Injection</h4>
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
      Restores the instance to its initial configuration (the values passed to
      <code>initSoltana()</code>). All tiers, overrides, and DOM attributes are
      reverted.
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
    ${codeExample(`soltana.destroy();`, 'typescript')}
  `
  )}
</div>`;
}
