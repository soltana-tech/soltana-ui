/** API Reference — Enhancer initializers (modals, tabs, tooltips). */

import { sectionHeading, codeExample, specimenBlock } from '../../utils/helpers';

export function renderApiEnhancers(): string {
  return `
<div class="page-api-enhancers">
  ${sectionHeading('Enhancers', 'api-enhancers', 'Progressive enhancement for modals, tabs, and tooltips.')}

  <p class="text-secondary mt-4 mb-6">
    Enhancers attach behavior to DOM elements via data attributes. Each returns
    an <code>EnhancerCleanup</code> handle. Re-calling an initializer implicitly
    cleans up previous listeners — only one active instance per enhancer type.
  </p>

  ${specimenBlock(
    'initAll()',
    `
    <p class="text-secondary mb-4">
      Initializes all enhancers (modals, tabs, tooltips) in a single call.
      Equivalent to calling each initializer individually.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`function initAll(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}

    <h4 class="font-semibold mt-6 mb-2">EnhancerOptions</h4>
    ${codeExample(
      `interface EnhancerOptions {
  root?: Element | Document; // Scope for querySelector (default: document)
  selector?: string;         // Override the default selector
}`,
      'typescript'
    )}

    <h4 class="font-semibold mt-6 mb-2">EnhancerCleanup</h4>
    ${codeExample(
      `interface EnhancerCleanup {
  destroy(): void; // Remove all listeners and DOM artifacts
}`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'initModals()',
    `
    <p class="text-secondary mb-4">
      Enhances <code>[data-sol-modal]</code> elements with open/close behavior,
      focus trapping, <kbd>Escape</kbd> key handling, and backdrop click dismissal.
      Adds <code>.sol-modal-open</code> to <code>document.body</code> while any
      modal is open to prevent background scrolling.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`function initModals(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}

    <h4 class="font-semibold mt-6 mb-2">Selectors</h4>
    <div class="table-container">
      <table class="table table-striped">
        <thead>
          <tr><th>Constant</th><th>Value</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td><code>MODAL_SELECTOR</code></td><td><code>'[data-sol-modal]'</code></td><td>Modal container elements</td></tr>
          <tr><td><code>MODAL_OPEN_SELECTOR</code></td><td><code>'[data-modal-open]'</code></td><td>Trigger elements — value is the modal ID</td></tr>
        </tbody>
      </table>
    </div>

    <h4 class="font-semibold mt-6 mb-2">Expected Markup</h4>
    ${codeExample(`<!-- Trigger -->
<button data-modal-open="my-modal">Open Modal</button>

<!-- Modal -->
<div data-sol-modal id="my-modal">
  <div class="modal-content">
    <h2>Modal Title</h2>
    <p>Modal body content.</p>
    <button data-modal-close>Close</button>
  </div>
</div>`)}
  `
  )}

  ${specimenBlock(
    'initTabs()',
    `
    <p class="text-secondary mb-4">
      Enhances <code>[data-sol-tabs]</code> containers with tab switching, keyboard
      navigation (<kbd>&larr;</kbd> / <kbd>&rarr;</kbd>), and ARIA attribute management.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`function initTabs(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}

    <h4 class="font-semibold mt-6 mb-2">Selector</h4>
    <p class="text-secondary mb-2">
      <code>TABS_SELECTOR = '[data-sol-tabs]'</code>
    </p>

    <h4 class="font-semibold mt-6 mb-2">Expected Markup</h4>
    ${codeExample(`<div data-sol-tabs>
  <div role="tablist">
    <button role="tab" aria-selected="true">Tab 1</button>
    <button role="tab">Tab 2</button>
  </div>
  <div role="tabpanel">Panel 1</div>
  <div role="tabpanel" hidden>Panel 2</div>
</div>`)}

    <p class="text-secondary mt-4">
      The enhancer automatically sets <code>id</code>, <code>aria-controls</code>,
      and <code>aria-labelledby</code> attributes on tabs and panels.
    </p>
  `
  )}

  ${specimenBlock(
    'initTooltips()',
    `
    <p class="text-secondary mb-4">
      Enhances <code>[data-sol-tooltip]</code> elements with positioned tooltips
      on hover and focus. Creates a single shared tooltip element appended to
      <code>document.body</code>.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`function initTooltips(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}

    <h4 class="font-semibold mt-6 mb-2">Selector</h4>
    <p class="text-secondary mb-2">
      <code>TOOLTIP_SELECTOR = '[data-sol-tooltip]'</code>
    </p>

    <h4 class="font-semibold mt-6 mb-2">Expected Markup</h4>
    ${codeExample(`<button data-sol-tooltip="Tooltip text here">
  Hover me
</button>`)}
  `
  )}

  ${specimenBlock(
    'Scoped Initialization',
    `
    <p class="text-secondary mb-4">
      Pass <code>root</code> to limit enhancer scope to a subtree. Useful for
      dynamically loaded content or shadow DOM boundaries.
    </p>
    ${codeExample(
      `const section = document.getElementById('dynamic-section');
const cleanup = initAll({ root: section });

// Later, tear down listeners for just that section:
cleanup.destroy();`,
      'typescript'
    )}
  `
  )}
</div>`;
}
