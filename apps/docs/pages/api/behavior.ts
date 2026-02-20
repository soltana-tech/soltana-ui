/** API Reference — Behavior: enhancer initializers and font loading. */

import {
  sectionHeading,
  codeExample,
  specimenBlock,
  quickNav,
  sectionDivider,
} from '../../utils/helpers';

export function renderApiBehavior(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-api-behavior">
  ${sectionHeading('Behavior', 'api-behavior', 'Progressive enhancement for interactive components and font loading.')}

  ${quickNav([
    { label: 'Enhancers', href: '#api-enhancers' },
    { label: 'Font Loading', href: '#api-fonts' },
  ])}

  ${sectionDivider()}

  <!-- Enhancers -->
  <div id="api-enhancers">
    <h3 class="text-2xl font-bold mb-6">Enhancers</h3>

    <p class="text-secondary mt-4 mb-6">
      Enhancers attach behavior to DOM elements via data attributes. Each returns
      an <code>EnhancerCleanup</code> handle. Re-calling an initializer implicitly
      cleans up previous listeners — only one active instance per enhancer type.
    </p>

    ${specimenBlock(
      'initAll()',
      `
      <p class="text-secondary mb-4">
        Initializes all 16 enhancers (modals, tabs, tooltips, accordions, dropdowns,
        drawers, toasts, collapsibles, comboboxes, hover cards, context menus, carousels,
        scroll areas, date pickers, color pickers, and trees) in a single call.
        Equivalent to calling each initializer individually.
      </p>

      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initAll(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}

      <h4 class="text-lg font-semibold mt-6 mb-2">EnhancerOptions</h4>
      ${codeExample(
        `interface EnhancerOptions {
  root?: Element | Document; // Scope for querySelector (default: document)
  selector?: string;         // Override the default selector
}`,
        'typescript'
      )}

      <h4 class="text-lg font-semibold mt-6 mb-2">EnhancerCleanup</h4>
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

      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initModals(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}

      <h4 class="text-lg font-semibold mt-6 mb-2">Selectors</h4>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr><th>Constant</th><th>Value</th><th>Purpose</th></tr>
          </thead>
          <tbody>
            <tr><td><code>MODAL_SELECTOR</code></td><td><code>'[data-sol-modal]'</code></td><td>Modal container elements</td></tr>
            <tr><td><code>MODAL_OPEN_SELECTOR</code></td><td><code>'[data-modal-open]'</code></td><td>Trigger elements — value is the modal ID</td></tr>
          </tbody>
        </table>
      </div>

      <h4 class="text-lg font-semibold mt-6 mb-2">Expected Markup</h4>
      ${codeExample(`<!-- Trigger -->
<button data-modal-open="my-modal">Open Modal</button>

<!-- Modal -->
<div class="modal-backdrop" data-sol-modal id="my-modal">
  <div class="modal">
    <div class="modal-header">
      <h2>Modal Title</h2>
      <button class="close" data-modal-close>&times;</button>
    </div>
    <div class="modal-body">
      <p>Modal body content.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" data-modal-close>Close</button>
    </div>
  </div>
</div>`)}
    `
    )}

    ${specimenBlock(
      'initTabs()',
      `
      <p class="text-secondary mb-4">
        Enhances <code>[data-sol-tabs]</code> containers with tab switching, keyboard
        navigation (<kbd>&larr;</kbd> / <kbd>&rarr;</kbd> / <kbd>&uarr;</kbd> / <kbd>&darr;</kbd> / <kbd>Home</kbd> / <kbd>End</kbd>), and ARIA attribute management.
      </p>

      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initTabs(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}

      <h4 class="text-lg font-semibold mt-6 mb-2">Selector</h4>
      <p class="text-secondary mb-2">
        <code>TABS_SELECTOR = '[data-sol-tabs]'</code>
      </p>

      <h4 class="text-lg font-semibold mt-6 mb-2">Expected Markup</h4>
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

      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initTooltips(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}

      <h4 class="text-lg font-semibold mt-6 mb-2">Selector</h4>
      <p class="text-secondary mb-2">
        <code>TOOLTIP_SELECTOR = '[data-sol-tooltip]'</code>
      </p>

      <h4 class="text-lg font-semibold mt-6 mb-2">Expected Markup</h4>
      ${codeExample(`<button data-sol-tooltip="Tooltip text here">
  Hover me
</button>`)}

      <h4 class="text-lg font-semibold mt-6 mb-2">Positioning</h4>
      <p class="text-secondary mb-4">
        Use <code>data-tooltip-position</code> to control placement.
        Defaults to <code>top</code>.
      </p>
      ${codeExample(`<button data-sol-tooltip="Help" data-tooltip-position="bottom">
  Bottom tooltip
</button>`)}
      <div class="table-container">
        <table class="table">
          <thead>
            <tr><th>Value</th><th>Placement</th></tr>
          </thead>
          <tbody>
            <tr><td><code>top</code></td><td>Above the element (default)</td></tr>
            <tr><td><code>bottom</code></td><td>Below the element</td></tr>
            <tr><td><code>left</code></td><td>Left of the element</td></tr>
            <tr><td><code>right</code></td><td>Right of the element</td></tr>
          </tbody>
        </table>
      </div>
    `
    )}

    ${specimenBlock(
      'CSS-Only Tooltip Positions',
      `
      <p class="text-secondary mb-4">
        For tooltips that use the CSS-only <code>.tooltip</code> class (no JS enhancer),
        position variants are available as additional classes. The base <code>.tooltip</code>
        class positions the tooltip above the element by default.
      </p>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr><th>Class</th><th>Placement</th></tr>
          </thead>
          <tbody>
            <tr><td><code>.tooltip</code></td><td>Above the element (default)</td></tr>
            <tr><td><code>.tooltip-bottom</code></td><td>Below the element</td></tr>
            <tr><td><code>.tooltip-left</code></td><td>Left of the element</td></tr>
            <tr><td><code>.tooltip-right</code></td><td>Right of the element</td></tr>
          </tbody>
        </table>
      </div>

      <h4 class="text-lg font-semibold mt-6 mb-2">Example</h4>
      ${codeExample(
        `<!-- CSS-only tooltip, positioned to the right -->
<span class="tooltip tooltip-right" data-tooltip="Hint text">
  Hover me
</span>`,
        'html'
      )}
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

      <h4 class="text-lg font-semibold mt-6 mb-2">Per-Enhancer Scoping</h4>
      <p class="text-secondary mb-4">
        Individual enhancers can also be scoped independently:
      </p>
      ${codeExample(
        `import { initModals, initTooltips } from 'soltana-ui';

// Only re-init modals in a specific section
const section = document.getElementById('settings-panel');
const modalCleanup = initModals({ root: section });

// Tooltips scoped to a different area
const sidebar = document.getElementById('sidebar');
const tooltipCleanup = initTooltips({ root: sidebar });`,
        'typescript'
      )}

      <h4 class="text-lg font-semibold mt-6 mb-2">Custom Selectors</h4>
      <p class="text-secondary mb-4">
        Override the default selector to target different elements:
      </p>
      ${codeExample(
        `import { initTooltips } from 'soltana-ui';

// Only enhance elements with a custom attribute
const cleanup = initTooltips({ selector: '[data-help-tip]' });`,
        'typescript'
      )}
    `
    )}

    ${specimenBlock(
      'EnhancerCleanup',
      `
      <p class="text-secondary mb-4">
        Every enhancer initializer returns an <code>EnhancerCleanup</code> handle.
        Call <code>destroy()</code> to remove all event listeners and DOM artifacts
        created by that enhancer.
      </p>
      ${codeExample(
        `interface EnhancerCleanup {
  destroy(): void;
}`,
        'typescript'
      )}
      <p class="text-secondary mt-4">
        Re-calling an initializer (e.g. <code>initModals()</code>) implicitly
        destroys the previous instance — only one active instance per enhancer type
        exists at any time.
      </p>
    `
    )}

    ${specimenBlock(
      'Selector Constants',
      `
      <p class="text-secondary mb-4">
        Each enhancer exports a constant with its default CSS selector.
        Use these for custom queries or conditional initialization.
      </p>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr><th>Constant</th><th>Value</th></tr>
          </thead>
          <tbody>
            <tr><td><code>MODAL_SELECTOR</code></td><td><code>'[data-sol-modal]'</code></td></tr>
            <tr><td><code>MODAL_OPEN_SELECTOR</code></td><td><code>'[data-modal-open]'</code></td></tr>
            <tr><td><code>TABS_SELECTOR</code></td><td><code>'[data-sol-tabs]'</code></td></tr>
            <tr><td><code>TOOLTIP_SELECTOR</code></td><td><code>'[data-sol-tooltip]'</code></td></tr>
            <tr><td><code>ACCORDION_SELECTOR</code></td><td><code>'[data-sol-accordion]'</code></td></tr>
            <tr><td><code>DROPDOWN_SELECTOR</code></td><td><code>'[data-sol-dropdown]'</code></td></tr>
            <tr><td><code>DRAWER_SELECTOR</code></td><td><code>'[data-sol-drawer]'</code></td></tr>
            <tr><td><code>DRAWER_OPEN_SELECTOR</code></td><td><code>'[data-drawer-open]'</code></td></tr>
            <tr><td><code>TOAST_CONTAINER_SELECTOR</code></td><td><code>'[data-sol-toast-container]'</code></td></tr>
            <tr><td><code>COLLAPSIBLE_SELECTOR</code></td><td><code>'[data-sol-collapsible]'</code></td></tr>
            <tr><td><code>COMBOBOX_SELECTOR</code></td><td><code>'[data-sol-combobox]'</code></td></tr>
            <tr><td><code>HOVER_CARD_SELECTOR</code></td><td><code>'[data-sol-hover-card]'</code></td></tr>
            <tr><td><code>CONTEXT_MENU_SELECTOR</code></td><td><code>'[data-sol-context-menu]'</code></td></tr>
            <tr><td><code>CAROUSEL_SELECTOR</code></td><td><code>'[data-sol-carousel]'</code></td></tr>
            <tr><td><code>SCROLL_AREA_SELECTOR</code></td><td><code>'[data-sol-scroll-area]'</code></td></tr>
            <tr><td><code>DATE_PICKER_SELECTOR</code></td><td><code>'[data-sol-date-picker]'</code></td></tr>
            <tr><td><code>COLOR_PICKER_SELECTOR</code></td><td><code>'[data-sol-color-picker]'</code></td></tr>
            <tr><td><code>TREE_SELECTOR</code></td><td><code>'[data-sol-tree]'</code></td></tr>
          </tbody>
        </table>
      </div>
    `
    )}

    ${specimenBlock(
      'initAccordions()',
      `
      <p class="text-secondary mb-4">
        Enhances <code>[data-sol-accordion]</code> elements with expand/collapse,
        keyboard navigation, and ARIA attributes. Add <code>data-accordion-exclusive</code>
        for single-open mode.
      </p>
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initAccordions(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}
      <h4 class="text-lg font-semibold mt-6 mb-2">Expected Markup</h4>
      ${codeExample(`<div data-sol-accordion>
  <div class="accordion-item active">
    <div class="accordion-header">Title</div>
    <div class="accordion-body">Content</div>
  </div>
</div>`)}
    `
    )}

    ${specimenBlock(
      'initDropdowns()',
      `
      <p class="text-secondary mb-4">
        Enhances <code>[data-sol-dropdown]</code> elements with toggle, click-away,
        keyboard navigation, and ARIA behavior.
      </p>
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initDropdowns(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}
      <h4 class="text-lg font-semibold mt-6 mb-2">Expected Markup</h4>
      ${codeExample(`<div data-sol-dropdown class="dropdown">
  <button class="dropdown-toggle">Options</button>
  <div class="dropdown-menu" role="menu">
    <button class="dropdown-item" role="menuitem">Edit</button>
  </div>
</div>`)}
    `
    )}

    ${specimenBlock(
      'initDrawers()',
      `
      <p class="text-secondary mb-4">
        Enhances <code>[data-sol-drawer]</code> elements with open/close, focus trapping,
        <kbd>Escape</kbd> key, and backdrop click behavior. Open triggers use
        <code>[data-drawer-open="&lt;drawer-id&gt;"]</code>. Adds
        <code>.sol-drawer-open</code> to <code>document.body</code> while any drawer is open.
      </p>
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initDrawers(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}
      <h4 class="text-lg font-semibold mt-6 mb-2">Expected Markup</h4>
      ${codeExample(`<button data-drawer-open="my-drawer">Open Drawer</button>

<div data-sol-drawer id="my-drawer" aria-hidden="true">
  <div class="drawer-backdrop"></div>
  <div class="drawer drawer-right">
    <div class="drawer-header">
      <h2>Drawer Title</h2>
      <button class="close" data-drawer-close>&times;</button>
    </div>
    <div class="drawer-body">Content</div>
  </div>
</div>`)}
    `
    )}

    ${specimenBlock(
      'initToasts()',
      `
      <p class="text-secondary mb-4">
        Enhances <code>[data-sol-toast-container]</code> elements with ARIA attributes
        and close button behavior. See also <code>showToast()</code> for programmatic usage.
      </p>
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initToasts(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}
    `
    )}

    ${specimenBlock(
      'showToast()',
      `
      <p class="text-secondary mb-4">
        Programmatically show a toast notification. Creates DOM, animates in,
        and auto-dismisses after <code>duration</code> ms (default 5000).
        Returns the created toast element.
      </p>
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function showToast(opts: ToastOptions): HTMLElement`, 'typescript')}
      <h4 class="text-lg font-semibold mt-6 mb-2">ToastOptions</h4>
      ${codeExample(
        `interface ToastOptions {
  message: string;
  type?: ToastType;       // 'success' | 'warning' | 'error' | 'info'
  duration?: number;      // Auto-dismiss ms (default 5000, 0 = persistent)
  position?: ToastPosition;
}

type ToastType = 'success' | 'warning' | 'error' | 'info';
type ToastPosition = 'top-right' | 'top-left' | 'top-center'
                   | 'bottom-right' | 'bottom-left' | 'bottom-center';`,
        'typescript'
      )}
      <h4 class="text-lg font-semibold mt-6 mb-2">Example</h4>
      ${codeExample(
        `import { showToast } from 'soltana-ui';

showToast({ message: 'Settings saved', type: 'success' });
showToast({ message: 'Connection lost', type: 'error', position: 'bottom-center' });`,
        'typescript'
      )}
    `
    )}

    ${specimenBlock(
      'dismissToast()',
      `
      <p class="text-secondary mb-4">
        Dismiss a specific toast element. Animates out and removes from DOM.
      </p>
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function dismissToast(toast: HTMLElement): void`, 'typescript')}
    `
    )}

    ${specimenBlock(
      'initCollapsibles()',
      `
      <p class="text-secondary mb-4">
        Enhances <code>[data-sol-collapsible]</code> elements with expand/collapse behavior.
        Simpler single-panel version of accordion.
      </p>
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initCollapsibles(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}
      <h4 class="text-lg font-semibold mt-6 mb-2">Expected Markup</h4>
      ${codeExample(`<div data-sol-collapsible class="collapsible">
  <button class="collapsible-trigger">Toggle</button>
  <div class="collapsible-content">Content</div>
</div>`)}
    `
    )}

    ${specimenBlock(
      'initComboboxes()',
      `
      <p class="text-secondary mb-4">
        Enhances <code>[data-sol-combobox]</code> elements with typeahead filtering,
        keyboard navigation, and ARIA combobox pattern.
      </p>
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initComboboxes(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}
      <h4 class="text-lg font-semibold mt-6 mb-2">Expected Markup</h4>
      ${codeExample(`<div data-sol-combobox class="combobox">
  <input class="combobox-input input" role="combobox" />
  <ul class="combobox-listbox" role="listbox">
    <li class="combobox-option" role="option">Option 1</li>
  </ul>
</div>`)}
    `
    )}

    ${specimenBlock(
      'initHoverCards()',
      `
      <p class="text-secondary mb-4">
        Enhances <code>[data-sol-hover-card]</code> elements with positioned hover
        content shown on mouseenter/focus with a configurable delay.
      </p>
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initHoverCards(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}
      <h4 class="text-lg font-semibold mt-6 mb-2">Expected Markup</h4>
      ${codeExample(`<div data-sol-hover-card class="hover-card">
  <span class="hover-card-trigger">Hover me</span>
  <div class="hover-card-content">Rich content</div>
</div>`)}
    `
    )}

    ${specimenBlock(
      'initContextMenus()',
      `
      <p class="text-secondary mb-4">
        Enhances <code>[data-sol-context-menu]</code> elements with right-click context
        menus, keyboard navigation, and click-away dismissal.
      </p>
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initContextMenus(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}
      <h4 class="text-lg font-semibold mt-6 mb-2">Expected Markup</h4>
      ${codeExample(`<div data-sol-context-menu>
  <div class="context-menu" role="menu">
    <button class="context-menu-item" role="menuitem">Cut</button>
    <button class="context-menu-item" role="menuitem">Copy</button>
  </div>
  <p>Right-click here</p>
</div>`)}
    `
    )}

    ${specimenBlock(
      'initCarousels()',
      `
      <p class="text-secondary mb-4">
        Enhances <code>[data-sol-carousel]</code> elements with slide navigation,
        keyboard controls, autoplay, and indicator dots.
      </p>
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initCarousels(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}
      <h4 class="text-lg font-semibold mt-6 mb-2">Expected Markup</h4>
      ${codeExample(`<div data-sol-carousel class="carousel"
     data-carousel-autoplay data-carousel-interval="5000" data-carousel-loop>
  <div class="carousel-track">
    <div class="carousel-slide">Slide 1</div>
    <div class="carousel-slide">Slide 2</div>
  </div>
  <button class="carousel-prev" aria-label="Previous slide">&lsaquo;</button>
  <button class="carousel-next" aria-label="Next slide">&rsaquo;</button>
  <div class="carousel-dots"></div>
</div>`)}
    `
    )}

    ${specimenBlock(
      'initScrollAreas()',
      `
      <p class="text-secondary mb-4">
        Enhances <code>[data-sol-scroll-area]</code> elements with custom scrollbar
        styling awareness and optional scroll indicators.
      </p>
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initScrollAreas(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}
      <h4 class="text-lg font-semibold mt-6 mb-2">Expected Markup</h4>
      ${codeExample(`<div data-sol-scroll-area class="scroll-area" style="max-height: 20rem;">
  <!-- Scrollable content -->
</div>`)}
    `
    )}

    ${specimenBlock(
      'initDatePickers()',
      `
      <p class="text-secondary mb-4">
        Enhances <code>[data-sol-date-picker]</code> elements with a calendar popup,
        keyboard navigation, and ARIA attributes. Falls back to native date input
        when <code>data-sol-date-native</code> is present.
      </p>
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initDatePickers(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}
    `
    )}

    ${specimenBlock(
      'initColorPickers()',
      `
      <p class="text-secondary mb-4">
        Enhances <code>[data-sol-color-picker]</code> elements with HSV-based color
        selection using a 2D area, hue slider, and optional swatches.
      </p>
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initColorPickers(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}
      <h4 class="text-lg font-semibold mt-6 mb-2">Expected Markup</h4>
      ${codeExample(`<div data-sol-color-picker class="color-picker">
  <button class="color-picker-trigger"></button>
  <div class="color-picker-popup">
    <div class="color-picker-area"></div>
    <div class="color-picker-hue"></div>
    <input class="color-picker-input input" value="#d4a843" />
    <div class="color-picker-swatches" data-swatches='["#d4a843","#a855f7"]'></div>
  </div>
</div>`)}
    `
    )}

    ${specimenBlock(
      'initTrees()',
      `
      <p class="text-secondary mb-4">
        Enhances <code>[data-sol-tree]</code> elements with expandable tree nodes,
        keyboard navigation, and ARIA treeview pattern.
      </p>
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function initTrees(options?: EnhancerOptions): EnhancerCleanup`, 'typescript')}
      <h4 class="text-lg font-semibold mt-6 mb-2">Expected Markup</h4>
      ${codeExample(`<div data-sol-tree class="tree" role="tree">
  <div class="tree-branch tree-node" role="treeitem">
    <div class="tree-node-content">
      <button class="tree-toggle"></button>
      Folder
    </div>
    <div class="tree-children">
      <div class="tree-leaf tree-node" role="treeitem">
        <div class="tree-node-content">File</div>
      </div>
    </div>
  </div>
</div>`)}
    `
    )}
  </div>

  ${sectionDivider()}

  <!-- Font Loading -->
  <div id="api-fonts">
    <h3 class="text-2xl font-bold mb-6">Font Loading</h3>

    ${specimenBlock(
      'loadSoltanaFonts()',
      `
      <p class="text-secondary mb-4">
        Injects a font stylesheet <code>&lt;link&gt;</code> into <code>&lt;head&gt;</code>.
        When the URL points to <code>fonts.googleapis.com</code>, preconnect hints
        are also injected automatically. Safe to call multiple times — subsequent
        calls are no-ops.
      </p>

      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(`function loadSoltanaFonts(url?: string): void`, 'typescript')}

      <h4 class="text-lg font-semibold mt-6 mb-2">Parameters</h4>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>url</code></td>
              <td><code>string</code></td>
              <td><code>DEFAULT_FONT_URL</code></td>
              <td>Font CSS URL. Defaults to the bundled Google Fonts URL.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 class="text-lg font-semibold mt-6 mb-2">Example</h4>
      ${codeExample(
        `import { loadSoltanaFonts } from 'soltana-ui';

// Use the bundled Google Fonts URL
loadSoltanaFonts();

// Or provide a custom font source
loadSoltanaFonts('https://fonts.example.com/custom.css');`,
        'typescript'
      )}
    `
    )}

    ${specimenBlock(
      'DEFAULT_FONT_URL',
      `
      <p class="text-secondary mb-4">
        The default Google Fonts URL bundled with Soltana. Includes all weights
        needed for the design system.
      </p>

      ${codeExample(`const DEFAULT_FONT_URL: string`, 'typescript')}

      <h4 class="text-lg font-semibold mt-6 mb-2">Included Fonts</h4>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr><th>Font Family</th><th>Weights</th><th>Role</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Cinzel</strong></td>
              <td>400, 500, 600, 700, 800, 900</td>
              <td>Display / heading serif</td>
            </tr>
            <tr>
              <td><strong>Cinzel Decorative</strong></td>
              <td>400, 700, 900</td>
              <td>Ornamental display serif</td>
            </tr>
            <tr>
              <td><strong>Raleway</strong></td>
              <td>Regular: 100–900; Italic: 400, 500</td>
              <td>Body / UI sans-serif</td>
            </tr>
            <tr>
              <td><strong>JetBrains Mono</strong></td>
              <td>400, 500, 600</td>
              <td>Code / monospace</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 class="text-lg font-semibold mt-6 mb-2">CSS Token</h4>
      <p class="text-secondary">
        The <code>--font-display</code> custom property maps to Cinzel Decorative
        for ornamental display text (e.g. <code>.display-ornate</code>).
        <code>loadSoltanaFonts()</code> uses <code>display=swap</code> via the
        Google Fonts URL to control font-loading behavior.
      </p>
    `
    )}
  </div>
</div>`;
  return page;
}
