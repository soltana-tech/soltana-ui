/** Overlays component reference — modals, drawers, alert dialogs, toasts, tooltips, popovers, context menus, hover cards. */

import {
  sectionHeading,
  specimen,
  codeExample,
  quickNavFromLabels,
  sectionDivider,
} from '../../../lib/helpers';

export function renderOverlaysRef(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-overlays-ref">

  ${sectionHeading('Overlays', 'overlays', 'Modals, drawers, alert dialogs, toasts, tooltips, popovers, context menus, and hover cards.')}

  ${quickNavFromLabels(
    [
      'Modals',
      'Drawers',
      'Alert Dialogs',
      'Toasts',
      'Tooltips',
      'Popovers',
      'Context Menus',
      'Hover Cards',
    ],
    'overlays-'
  )}

  ${sectionDivider()}

  <!-- Modals -->
  ${sectionHeading('Modals', 'overlays-modals', 'Centered overlay dialogs with backdrop, sizing variants, and JS-enhanced open/close triggers.')}

  <div class="table-responsive">
    <table class="table">
      <thead><tr><th>Class / Attribute</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>.modal</code></td><td>Base modal container</td></tr>
        <tr><td><code>.modal-sm</code></td><td>Small modal width</td></tr>
        <tr><td><code>.modal-lg</code></td><td>Large modal width</td></tr>
        <tr><td><code>.modal-backdrop</code></td><td>Full-screen backdrop overlay</td></tr>
        <tr><td><code>.modal-header</code></td><td>Header region with title and close button</td></tr>
        <tr><td><code>.modal-body</code></td><td>Scrollable content area</td></tr>
        <tr><td><code>.modal-footer</code></td><td>Action bar (cancel / confirm buttons)</td></tr>
        <tr><td><code>data-sol-modal</code></td><td>Enables JS enhancer (<code>initModals()</code>)</td></tr>
        <tr><td><code>data-modal-open="id"</code></td><td>Opens modal with matching <code>id</code></td></tr>
        <tr><td><code>data-modal-close="id"</code></td><td>Closes modal with matching <code>id</code></td></tr>
      </tbody>
    </table>
  </div>

  ${specimen(
    'Modal',
    'overlays-modals-specimen',
    `
    <button class="btn btn-primary" data-modal-open="demo-modal">Open Modal</button>
    <div class="modal-backdrop" id="demo-modal" data-sol-modal>
      <div class="modal">
        <div class="modal-header">
          <h4>Title</h4>
          <button class="close" data-modal-close="demo-modal"></button>
        </div>
        <div class="modal-body">Content</div>
        <div class="modal-footer">
          <button class="btn btn-ghost" data-modal-close="demo-modal">Cancel</button>
          <button class="btn btn-primary">Confirm</button>
        </div>
      </div>
    </div>
  `,
    `<button class="btn btn-primary" data-modal-open="my-modal">Open Modal</button>
<div class="modal-backdrop" id="my-modal" data-sol-modal>
  <div class="modal">
    <div class="modal-header">
      <h4>Title</h4>
      <button class="close" data-modal-close="my-modal"></button>
    </div>
    <div class="modal-body">Content</div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-modal-close="my-modal">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Drawers -->
  ${sectionHeading('Drawers', 'overlays-drawers', 'Slide-in panels from any edge with sizing and position variants.')}

  <div class="table-responsive">
    <table class="table">
      <thead><tr><th>Class / Attribute</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>.drawer</code></td><td>Base drawer container</td></tr>
        <tr><td><code>.drawer-sm</code></td><td>Narrow drawer width</td></tr>
        <tr><td><code>.drawer-lg</code></td><td>Wide drawer width</td></tr>
        <tr><td><code>.drawer-start</code></td><td>Slides from the start (left in LTR) — default</td></tr>
        <tr><td><code>.drawer-end</code></td><td>Slides from the end (right in LTR)</td></tr>
        <tr><td><code>.drawer-top</code></td><td>Slides from the top</td></tr>
        <tr><td><code>.drawer-bottom</code></td><td>Slides from the bottom</td></tr>
        <tr><td><code>.drawer-backdrop</code></td><td>Full-screen backdrop behind the drawer</td></tr>
        <tr><td><code>.drawer-header</code></td><td>Header region</td></tr>
        <tr><td><code>.drawer-body</code></td><td>Scrollable content area</td></tr>
        <tr><td><code>.drawer-footer</code></td><td>Action bar</td></tr>
        <tr><td><code>data-sol-drawer</code></td><td>Enables JS enhancer (<code>initDrawers()</code>)</td></tr>
      </tbody>
    </table>
  </div>

  ${specimen(
    'Drawer',
    'overlays-drawers-specimen',
    `
    <div class="drawer" data-sol-drawer style="position:relative; height:200px;">
      <div class="drawer-header">
        <h4>Drawer Title</h4>
        <button class="close close-sm"></button>
      </div>
      <div class="drawer-body">Content</div>
      <div class="drawer-footer">
        <button class="btn btn-ghost btn-sm">Cancel</button>
        <button class="btn btn-primary btn-sm">Apply</button>
      </div>
    </div>
  `,
    `<div class="drawer" data-sol-drawer>
  <div class="drawer-header">
    <h4>Drawer Title</h4>
    <button class="close close-sm"></button>
  </div>
  <div class="drawer-body">Content</div>
  <div class="drawer-footer">
    <button class="btn btn-ghost btn-sm">Cancel</button>
    <button class="btn btn-primary btn-sm">Apply</button>
  </div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Alert Dialogs -->
  ${sectionHeading('Alert Dialogs', 'overlays-alert-dialogs', 'Confirmation dialogs with icon variants for destructive or informational actions.')}

  <div class="table-responsive">
    <table class="table">
      <thead><tr><th>Class</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>.alert-dialog</code></td><td>Base alert dialog container</td></tr>
        <tr><td><code>.alert-dialog-icon</code></td><td>Icon region</td></tr>
        <tr><td><code>.alert-dialog-icon-warning</code></td><td>Warning icon variant</td></tr>
        <tr><td><code>.alert-dialog-icon-danger</code></td><td>Danger icon variant</td></tr>
        <tr><td><code>.alert-dialog-icon-info</code></td><td>Info icon variant</td></tr>
        <tr><td><code>.alert-dialog-title</code></td><td>Dialog title</td></tr>
        <tr><td><code>.alert-dialog-body</code></td><td>Dialog body text</td></tr>
        <tr><td><code>.alert-dialog-actions</code></td><td>Action button row</td></tr>
      </tbody>
    </table>
  </div>

  ${specimen(
    'Alert Dialog — Warning',
    'overlays-alert-dialogs-specimen',
    `
    <div class="alert-dialog">
      <div class="alert-dialog-icon alert-dialog-icon-warning">!</div>
      <div class="alert-dialog-title">Delete Item</div>
      <div class="alert-dialog-body">Are you sure? This cannot be undone.</div>
      <div class="alert-dialog-actions">
        <button class="btn btn-secondary btn-sm">Cancel</button>
        <button class="btn btn-danger btn-sm">Delete</button>
      </div>
    </div>
  `,
    `<div class="alert-dialog">
  <div class="alert-dialog-icon alert-dialog-icon-warning">!</div>
  <div class="alert-dialog-title">Delete Item</div>
  <div class="alert-dialog-body">Are you sure? This cannot be undone.</div>
  <div class="alert-dialog-actions">
    <button class="btn btn-secondary btn-sm">Cancel</button>
    <button class="btn btn-danger btn-sm">Delete</button>
  </div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Toasts -->
  ${sectionHeading('Toasts', 'overlays-toasts', 'Notification toasts with status variants, positioned containers, and JS-enhanced lifecycle.')}

  <div class="table-responsive">
    <table class="table">
      <thead><tr><th>Class / Attribute</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>.toast</code></td><td>Base toast element</td></tr>
        <tr><td><code>.toast-success</code></td><td>Success variant</td></tr>
        <tr><td><code>.toast-error</code></td><td>Error variant</td></tr>
        <tr><td><code>.toast-warning</code></td><td>Warning variant</td></tr>
        <tr><td><code>.toast-info</code></td><td>Info variant</td></tr>
        <tr><td><code>.toast-header</code></td><td>Header with title and close button</td></tr>
        <tr><td><code>.toast-body</code></td><td>Body content</td></tr>
        <tr><td><code>.toast.active</code></td><td>Shows the toast</td></tr>
        <tr><td><code>.toast-container</code></td><td>Positioned wrapper for toast stack</td></tr>
        <tr><td><code>.toast-container-top-right</code></td><td>Position: top-right</td></tr>
        <tr><td><code>.toast-container-top-left</code></td><td>Position: top-left</td></tr>
        <tr><td><code>.toast-container-top-center</code></td><td>Position: top-center</td></tr>
        <tr><td><code>.toast-container-bottom-right</code></td><td>Position: bottom-right</td></tr>
        <tr><td><code>.toast-container-bottom-left</code></td><td>Position: bottom-left</td></tr>
        <tr><td><code>.toast-container-bottom-center</code></td><td>Position: bottom-center</td></tr>
        <tr><td><code>data-sol-toast-container</code></td><td>Enables JS enhancer (<code>initToasts()</code>)</td></tr>
      </tbody>
    </table>
  </div>

  ${specimen(
    'Toast — Success',
    'overlays-toasts-specimen',
    `
    <div class="toast toast-success active" style="position:relative;">
      <div class="toast-header">
        <strong>Success</strong>
        <button class="close close-sm"></button>
      </div>
      <div class="toast-body">Changes saved successfully.</div>
    </div>
  `,
    `<div class="toast toast-success active">
  <div class="toast-header">
    <strong>Success</strong>
    <button class="close close-sm"></button>
  </div>
  <div class="toast-body">Changes saved successfully.</div>
</div>`
  )}

  <h4 class="text-lg font-semibold mt-6 mb-3">Programmatic API</h4>
  ${codeExample(
    `import { showToast, dismissToast } from 'soltana-ui';

showToast({ variant: 'success', title: 'Saved', body: 'Changes saved.' });
dismissToast(toastElement);`,
    'typescript'
  )}

  ${sectionDivider()}

  <!-- Tooltips -->
  ${sectionHeading('Tooltips', 'overlays-tooltips', 'CSS-only tooltips via pseudo-elements and JS-enhanced viewport-aware tooltips.')}

  <div class="table-responsive">
    <table class="table">
      <thead><tr><th>Class / Attribute</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>.tooltip</code></td><td>CSS-only tooltip (uses <code>::after</code> pseudo-element)</td></tr>
        <tr><td><code>data-tooltip="text"</code></td><td>Tooltip content for CSS-only variant</td></tr>
        <tr><td><code>.tooltip-bottom</code></td><td>Position below the element</td></tr>
        <tr><td><code>.tooltip-left</code></td><td>Position to the left</td></tr>
        <tr><td><code>.tooltip-right</code></td><td>Position to the right</td></tr>
        <tr><td><code>data-sol-tooltip="text"</code></td><td>JS-enhanced tooltip (<code>initTooltips()</code>) with viewport-aware positioning</td></tr>
      </tbody>
    </table>
  </div>

  <div class="callout callout-warning mt-4 mb-4">
    <div class="callout-content text-sm">
      Do not combine the <code>.tooltip</code> class with <code>[data-sol-tooltip]</code> on the same element.
    </div>
  </div>

  ${specimen(
    'CSS-only Tooltips',
    'overlays-tooltips-specimen-css',
    `
    <div class="flex gap-4 flex-wrap">
      <button class="btn tooltip" data-tooltip="Tooltip text">Top (default)</button>
      <button class="btn tooltip tooltip-bottom" data-tooltip="Bottom">Bottom</button>
      <button class="btn tooltip tooltip-left" data-tooltip="Left">Left</button>
      <button class="btn tooltip tooltip-right" data-tooltip="Right">Right</button>
    </div>
  `,
    `<button class="btn tooltip" data-tooltip="Tooltip text">Hover me</button>
<button class="btn tooltip tooltip-bottom" data-tooltip="Bottom">Below</button>`
  )}

  ${specimen(
    'JS-enhanced Tooltip',
    'overlays-tooltips-specimen-js',
    `
    <button data-sol-tooltip="Dynamic tooltip">Hover me</button>
  `,
    `<button data-sol-tooltip="Dynamic tooltip">Hover me</button>`
  )}

  ${sectionDivider()}

  <!-- Popovers -->
  ${sectionHeading('Popovers', 'overlays-popovers', 'Rich floating content panels with directional positioning and sizing.')}

  <div class="table-responsive">
    <table class="table">
      <thead><tr><th>Class</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>.popover</code></td><td>Base popover container</td></tr>
        <tr><td><code>.popover-top</code></td><td>Position above</td></tr>
        <tr><td><code>.popover-bottom</code></td><td>Position below</td></tr>
        <tr><td><code>.popover-left</code></td><td>Position to the left</td></tr>
        <tr><td><code>.popover-right</code></td><td>Position to the right</td></tr>
        <tr><td><code>.popover-sm</code></td><td>Small popover</td></tr>
        <tr><td><code>.popover-lg</code></td><td>Large popover</td></tr>
        <tr><td><code>.popover-header</code></td><td>Header region</td></tr>
        <tr><td><code>.popover-body</code></td><td>Body content</td></tr>
      </tbody>
    </table>
  </div>

  ${specimen(
    'Popover',
    'overlays-popovers-specimen',
    `
    <div class="popover popover-bottom" style="position:relative; display:inline-block;">
      <div class="popover-header">Popover Title</div>
      <div class="popover-body">Rich popover content.</div>
    </div>
  `,
    `<div class="popover popover-bottom">
  <div class="popover-header">Popover Title</div>
  <div class="popover-body">Rich popover content.</div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Context Menus -->
  ${sectionHeading('Context Menus', 'overlays-context-menus', 'Right-click menus with grouped items and dividers.')}

  <div class="table-responsive">
    <table class="table">
      <thead><tr><th>Class / Attribute</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>.context-menu</code></td><td>Base context menu container</td></tr>
        <tr><td><code>.context-menu-header</code></td><td>Section header label</td></tr>
        <tr><td><code>.context-menu-item</code></td><td>Clickable menu item</td></tr>
        <tr><td><code>.context-menu-divider</code></td><td>Horizontal separator</td></tr>
        <tr><td><code>data-sol-context-menu</code></td><td>Enables JS enhancer (<code>initContextMenus()</code>)</td></tr>
      </tbody>
    </table>
  </div>

  ${specimen(
    'Context Menu',
    'overlays-context-menus-specimen',
    `
    <div data-sol-context-menu style="position:relative;">
      <p class="text-sm text-secondary mb-3">Right-click here</p>
      <div class="context-menu" role="menu" style="position:relative; display:block;">
        <div class="context-menu-header">Edit</div>
        <button class="context-menu-item" role="menuitem">Cut</button>
        <button class="context-menu-item" role="menuitem">Copy</button>
        <div class="context-menu-divider"></div>
        <button class="context-menu-item" role="menuitem">Select All</button>
      </div>
    </div>
  `,
    `<div data-sol-context-menu>
  <p>Right-click here</p>
  <div class="context-menu" role="menu">
    <div class="context-menu-header">Edit</div>
    <button class="context-menu-item" role="menuitem">Cut</button>
    <button class="context-menu-item" role="menuitem">Copy</button>
    <div class="context-menu-divider"></div>
    <button class="context-menu-item" role="menuitem">Select All</button>
  </div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Hover Cards -->
  ${sectionHeading('Hover Cards', 'overlays-hover-cards', 'Content cards revealed on hover with trigger elements and sizing variants.')}

  <div class="table-responsive">
    <table class="table">
      <thead><tr><th>Class / Attribute</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>.hover-card</code></td><td>Base hover card container</td></tr>
        <tr><td><code>.hover-card-sm</code></td><td>Small hover card</td></tr>
        <tr><td><code>.hover-card-lg</code></td><td>Large hover card</td></tr>
        <tr><td><code>.hover-card-trigger</code></td><td>Element that activates the card on hover</td></tr>
        <tr><td><code>.hover-card-content</code></td><td>Revealed content panel</td></tr>
        <tr><td><code>data-sol-hover-card</code></td><td>Enables JS enhancer (<code>initHoverCards()</code>)</td></tr>
      </tbody>
    </table>
  </div>

  ${specimen(
    'Hover Card',
    'overlays-hover-cards-specimen',
    `
    <div data-sol-hover-card class="hover-card">
      <span class="hover-card-trigger">Hover me</span>
      <div class="hover-card-content">Rich hover content here.</div>
    </div>
  `,
    `<div data-sol-hover-card class="hover-card">
  <span class="hover-card-trigger">Hover me</span>
  <div class="hover-card-content">Rich hover content here.</div>
</div>`
  )}

</div>`;
  return page;
}
