/**
 * Registers all component previews with the component registry.
 * Imported as a side-effect in main.ts so the registry is populated
 * before CentralPlayground reads it.
 */

import { registerComponent } from './component-registry';
import type { SandboxState } from './sandbox-state';

registerComponent({
  id: 'buttons',
  name: 'Buttons',
  description: 'Variants, sizes, states, and groups.',
  renderPreview: (_state: SandboxState) => `
    <div class="flex flex-wrap gap-3 mb-4">
      <button class="btn btn-primary">Primary</button>
      <button class="btn btn-secondary">Secondary</button>
      <button class="btn btn-ghost">Ghost</button>
      <button class="btn btn-outline">Outline</button>
      <button class="btn btn-danger">Danger</button>
      <button class="btn btn-success">Success</button>
    </div>
    <div class="flex flex-wrap gap-3 items-center">
      <button class="btn btn-primary btn-sm">Small</button>
      <button class="btn btn-primary">Default</button>
      <button class="btn btn-primary btn-lg">Large</button>
    </div>`,
});

registerComponent({
  id: 'inputs',
  name: 'Inputs',
  description: 'Text fields, selects, checkboxes, and textareas.',
  renderPreview: (_state: SandboxState) => `
    <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
      <div class="input-group">
        <label class="input-label">Text</label>
        <input type="text" class="input" placeholder="Enter text" />
      </div>
      <div class="input-group">
        <label class="input-label">Email</label>
        <input type="email" class="input" placeholder="user@example.com" />
      </div>
      <div class="input-group">
        <label class="input-label">Select</label>
        <select class="select">
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
      </div>
    </div>
    <div class="input-group mt-4">
      <label class="input-label">Textarea</label>
      <textarea class="textarea" placeholder="Write something..." style="min-height: 80px"></textarea>
    </div>`,
});

registerComponent({
  id: 'cards',
  name: 'Cards',
  description: 'Layouts, image cards, and ornamental variants.',
  renderPreview: (_state: SandboxState) => `
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))">
      <div class="card card-hover">
        <div class="card-body">
          <h4 class="text-lg font-semibold mb-2">Simple Card</h4>
          <p class="text-secondary text-sm">A basic card with body content.</p>
        </div>
      </div>
      <div class="card">
        <div class="card-header">Card Header</div>
        <div class="card-body">
          <p class="text-secondary text-sm">Card with header and footer sections.</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-sm">Action</button>
        </div>
      </div>
    </div>`,
});

registerComponent({
  id: 'badges',
  name: 'Badges & Tags',
  description: 'Status badges, pills, and content tags.',
  renderPreview: (_state: SandboxState) => `
    <div class="flex flex-wrap gap-2 mb-4">
      <span class="badge">Default</span>
      <span class="badge badge-primary">Primary</span>
      <span class="badge badge-success">Success</span>
      <span class="badge badge-warning">Warning</span>
      <span class="badge badge-error">Error</span>
      <span class="badge badge-info">Info</span>
    </div>
    <div class="flex flex-wrap gap-2 mb-4">
      <span class="badge badge-pill">Pill</span>
      <span class="badge badge-pill badge-primary">Primary</span>
      <span class="badge badge-pill badge-success">Success</span>
    </div>
    <div class="flex flex-wrap gap-2">
      <span class="tag">Tag</span>
      <span class="tag">Design</span>
      <span class="tag">System</span>
    </div>`,
});

registerComponent({
  id: 'alerts',
  name: 'Alerts',
  description: 'Success, warning, error, and info alerts.',
  renderPreview: (_state: SandboxState) => `
    <div class="flex flex-col gap-3">
      <div class="alert alert-success">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>Operation completed successfully.</span>
      </div>
      <div class="alert alert-warning">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>Please review before continuing.</span>
      </div>
      <div class="alert alert-error">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        <span>Something went wrong.</span>
      </div>
      <div class="alert alert-info">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>Here is some useful information.</span>
      </div>
    </div>`,
});

registerComponent({
  id: 'avatars',
  name: 'Avatars',
  description: 'Sizes and accent color variants.',
  renderPreview: (_state: SandboxState) => `
    <div class="flex flex-wrap gap-3 items-center">
      <div class="avatar avatar-sm">SM</div>
      <div class="avatar">MD</div>
      <div class="avatar avatar-lg">LG</div>
      <div class="avatar avatar-xl">XL</div>
    </div>
    <div class="flex flex-wrap gap-3 items-center mt-4">
      <div class="avatar" style="background: var(--accent-primary); color: var(--text-inverse)">AP</div>
      <div class="avatar" style="background: var(--color-success); color: var(--text-inverse)">SC</div>
      <div class="avatar" style="background: var(--color-warning); color: var(--text-inverse)">WN</div>
      <div class="avatar" style="background: var(--color-info); color: var(--text-inverse)">IN</div>
    </div>`,
});

registerComponent({
  id: 'progress',
  name: 'Progress Bars',
  description: 'Determinate indicators with color variants.',
  renderPreview: (_state: SandboxState) => `
    <div class="flex flex-col gap-4">
      <div>
        <div class="flex justify-between mb-1"><span class="text-sm">Default</span><span class="text-sm text-muted">65%</span></div>
        <div class="progress"><div class="progress-bar" style="width: 65%"></div></div>
      </div>
      <div>
        <div class="flex justify-between mb-1"><span class="text-sm">Success</span><span class="text-sm text-muted">80%</span></div>
        <div class="progress"><div class="progress-bar progress-success" style="width: 80%"></div></div>
      </div>
      <div>
        <div class="flex justify-between mb-1"><span class="text-sm">Warning</span><span class="text-sm text-muted">45%</span></div>
        <div class="progress"><div class="progress-bar progress-warning" style="width: 45%"></div></div>
      </div>
      <div>
        <div class="flex justify-between mb-1"><span class="text-sm">Error</span><span class="text-sm text-muted">20%</span></div>
        <div class="progress"><div class="progress-bar progress-error" style="width: 20%"></div></div>
      </div>
    </div>`,
});

registerComponent({
  id: 'toggles',
  name: 'Toggles',
  description: 'Switch-style boolean controls.',
  renderPreview: (_state: SandboxState) => `
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between" style="max-width: 240px">
        <span class="text-sm">Active toggle</span>
        <div class="toggle active"></div>
      </div>
      <div class="flex items-center justify-between" style="max-width: 240px">
        <span class="text-sm">Inactive toggle</span>
        <div class="toggle"></div>
      </div>
      <div class="flex items-center justify-between" style="max-width: 240px">
        <span class="text-sm">Disabled toggle</span>
        <div class="toggle disabled"></div>
      </div>
    </div>`,
});

registerComponent({
  id: 'tooltips',
  name: 'Tooltips',
  description: 'Hover-triggered contextual hints.',
  renderPreview: (_state: SandboxState) => `
    <div class="flex flex-wrap gap-4 items-center">
      <button class="btn btn-outline tooltip" data-tooltip="Tooltip on button">Hover me</button>
      <button class="btn btn-primary tooltip" data-tooltip="Primary action">Action</button>
      <span class="badge badge-primary tooltip" data-tooltip="Badge tooltip">Hover badge</span>
    </div>`,
});

registerComponent({
  id: 'tables',
  name: 'Tables',
  description: 'Striped data tables with actions.',
  renderPreview: (_state: SandboxState) => `
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="font-medium">Alice Chen</td>
            <td><span class="badge">Admin</span></td>
            <td><span class="badge badge-success">Active</span></td>
            <td><button class="btn btn-ghost btn-xs">Edit</button></td>
          </tr>
          <tr>
            <td class="font-medium">Bob Martin</td>
            <td><span class="badge">Editor</span></td>
            <td><span class="badge badge-success">Active</span></td>
            <td><button class="btn btn-ghost btn-xs">Edit</button></td>
          </tr>
          <tr>
            <td class="font-medium">Carol Davis</td>
            <td><span class="badge">Viewer</span></td>
            <td><span class="badge badge-warning">Away</span></td>
            <td><button class="btn btn-ghost btn-xs">Edit</button></td>
          </tr>
        </tbody>
      </table>
    </div>`,
});

registerComponent({
  id: 'modals',
  name: 'Modals',
  description: 'Dialog overlays with triggers.',
  renderPreview: (_state: SandboxState) => `
    <div>
      <button class="btn btn-primary" data-modal-open="playground-modal">Open Modal</button>
      <div class="modal-backdrop" id="playground-modal">
        <div class="modal">
          <div class="modal-header">
            <h4 class="font-semibold">Confirm Action</h4>
            <button class="modal-close" data-modal-close="playground-modal">&times;</button>
          </div>
          <div class="modal-body">
            <p class="text-secondary text-sm">Are you sure you want to proceed?</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost btn-sm" data-modal-close="playground-modal">Cancel</button>
            <button class="btn btn-primary btn-sm">Confirm</button>
          </div>
        </div>
      </div>
    </div>`,
});

registerComponent({
  id: 'skeletons',
  name: 'Skeletons',
  description: 'Animated loading placeholders.',
  renderPreview: (_state: SandboxState) => `
    <div class="card" style="max-width: 320px">
      <div class="card-body">
        <div class="flex items-center gap-3 mb-4">
          <div class="skeleton skeleton-circle" style="width: 2.5rem; height: 2.5rem;"></div>
          <div class="flex-1">
            <div class="skeleton skeleton-text" style="width: 60%; height: 0.75rem; margin-bottom: 0.5rem;"></div>
            <div class="skeleton skeleton-text" style="width: 40%; height: 0.625rem;"></div>
          </div>
        </div>
        <div class="skeleton skeleton-text" style="width: 100%; height: 0.625rem; margin-bottom: 0.5rem;"></div>
        <div class="skeleton skeleton-text" style="width: 90%; height: 0.625rem; margin-bottom: 0.5rem;"></div>
        <div class="skeleton skeleton-text" style="width: 70%; height: 0.625rem;"></div>
      </div>
    </div>`,
});

registerComponent({
  id: 'dropdowns',
  name: 'Dropdowns',
  description: 'Toggle menus with items, dividers, and headers.',
  renderPreview: (_state: SandboxState) => `
    <div class="dropdown" style="position: relative;">
      <button class="btn btn-outline dropdown-toggle">Options</button>
      <div class="dropdown-menu" style="position: static; display: block; opacity: 1; pointer-events: auto;">
        <div class="dropdown-header">Actions</div>
        <a class="dropdown-item" href="#">Edit</a>
        <a class="dropdown-item" href="#">Duplicate</a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href="#">Delete</a>
      </div>
    </div>`,
});

registerComponent({
  id: 'popovers',
  name: 'Popovers',
  description: 'Rich contextual overlays with header and body.',
  renderPreview: (_state: SandboxState) => `
    <div class="flex flex-col gap-4 items-start">
      <div class="popover" style="position: static; display: block; opacity: 1; pointer-events: auto;">
        <div class="popover-header">Popover Title</div>
        <div class="popover-body">
          <p class="text-sm text-secondary">This is a popover with rich content including a header and body section.</p>
        </div>
      </div>
    </div>`,
});

registerComponent({
  id: 'accordions',
  name: 'Accordions',
  description: 'Collapsible content sections.',
  renderPreview: (_state: SandboxState) => `
    <div class="accordion" style="width: 100%;">
      <div class="accordion-item active">
        <div class="accordion-header">Getting Started</div>
        <div class="accordion-body">
          <p class="text-sm text-secondary">Install the package and import the styles into your project entry point.</p>
        </div>
      </div>
      <div class="accordion-item">
        <div class="accordion-header">Configuration</div>
        <div class="accordion-body">
          <p class="text-sm text-secondary">Set data attributes on the root element to configure theme, relief, finish, and ornament.</p>
        </div>
      </div>
      <div class="accordion-item">
        <div class="accordion-header">Customization</div>
        <div class="accordion-body">
          <p class="text-sm text-secondary">Override Sass variables or CSS custom properties to match your brand.</p>
        </div>
      </div>
    </div>`,
});

registerComponent({
  id: 'lists',
  name: 'Lists',
  description: 'Bordered and hoverable item lists.',
  renderPreview: (_state: SandboxState) => `
    <div class="list list-bordered list-hover" style="width: 100%;">
      <div class="list-item">
        <div class="flex items-center gap-3">
          <div class="avatar avatar-sm">AC</div>
          <div>
            <div class="font-medium">Alice Chen</div>
            <div class="text-sm text-secondary">alice@example.com</div>
          </div>
        </div>
      </div>
      <div class="list-item">
        <div class="flex items-center gap-3">
          <div class="avatar avatar-sm">BM</div>
          <div>
            <div class="font-medium">Bob Martin</div>
            <div class="text-sm text-secondary">bob@example.com</div>
          </div>
        </div>
      </div>
      <div class="list-item">
        <div class="flex items-center gap-3">
          <div class="avatar avatar-sm">CD</div>
          <div>
            <div class="font-medium">Carol Davis</div>
            <div class="text-sm text-secondary">carol@example.com</div>
          </div>
        </div>
      </div>
    </div>`,
});

registerComponent({
  id: 'tabs',
  name: 'Tabs',
  description: 'Horizontal navigation tabs.',
  renderPreview: (_state: SandboxState) => `
    <div class="tabs">
      <button class="tab active">Overview</button>
      <button class="tab">Features</button>
      <button class="tab">Pricing</button>
      <button class="tab" disabled>Disabled</button>
    </div>`,
});

registerComponent({
  id: 'breadcrumbs',
  name: 'Breadcrumbs',
  description: 'Hierarchical page navigation.',
  renderPreview: (_state: SandboxState) => `
    <nav class="breadcrumb">
      <a class="breadcrumb-item" href="#">Home</a>
      <a class="breadcrumb-item" href="#">Products</a>
      <a class="breadcrumb-item" href="#">Category</a>
      <span class="breadcrumb-item active">Current Page</span>
    </nav>`,
});

registerComponent({
  id: 'pagination',
  name: 'Pagination',
  description: 'Page navigation controls.',
  renderPreview: (_state: SandboxState) => `
    <nav class="pagination">
      <span class="page-item disabled"><span class="page-link">&laquo;</span></span>
      <span class="page-item"><a class="page-link" href="#">1</a></span>
      <span class="page-item active"><a class="page-link" href="#">2</a></span>
      <span class="page-item"><a class="page-link" href="#">3</a></span>
      <span class="page-item"><a class="page-link" href="#">4</a></span>
      <span class="page-item"><a class="page-link" href="#">5</a></span>
      <span class="page-item"><a class="page-link" href="#">&raquo;</a></span>
    </nav>`,
});

registerComponent({
  id: 'drawers',
  name: 'Drawers',
  description: 'Slide-in panel overlays.',
  renderPreview: (_state: SandboxState) => `
    <div class="card" style="width: 100%; max-width: 320px;">
      <div class="drawer-header">
        <h4 class="font-semibold">Drawer Title</h4>
        <button class="close close-sm"></button>
      </div>
      <div class="drawer-body">
        <p class="text-sm text-secondary mb-3">Drawer content goes here. In production, drawers slide in from the edge of the viewport.</p>
        <div class="list list-bordered">
          <div class="list-item text-sm">Navigation Item 1</div>
          <div class="list-item text-sm">Navigation Item 2</div>
          <div class="list-item text-sm">Navigation Item 3</div>
        </div>
      </div>
      <div class="drawer-footer">
        <button class="btn btn-ghost btn-sm">Cancel</button>
        <button class="btn btn-primary btn-sm">Apply</button>
      </div>
    </div>`,
});

registerComponent({
  id: 'toasts',
  name: 'Toasts',
  description: 'Transient notification messages.',
  renderPreview: (_state: SandboxState) => `
    <div class="flex flex-col gap-3" style="width: 100%; max-width: 360px;">
      <div class="toast toast-success active" style="position: static; opacity: 1;">
        <div class="toast-header">
          <strong class="text-sm">Success</strong>
          <button class="close close-sm"></button>
        </div>
        <div class="toast-body text-sm">Changes saved successfully.</div>
      </div>
      <div class="toast toast-error active" style="position: static; opacity: 1;">
        <div class="toast-header">
          <strong class="text-sm">Error</strong>
          <button class="close close-sm"></button>
        </div>
        <div class="toast-body text-sm">Something went wrong.</div>
      </div>
      <div class="toast toast-info active" style="position: static; opacity: 1;">
        <div class="toast-header">
          <strong class="text-sm">Info</strong>
          <button class="close close-sm"></button>
        </div>
        <div class="toast-body text-sm">New update available.</div>
      </div>
    </div>`,
});

registerComponent({
  id: 'steppers',
  name: 'Steppers',
  description: 'Multi-step progress indicators.',
  renderPreview: (_state: SandboxState) => `
    <div class="stepper" style="width: 100%;">
      <div class="step completed">
        <div class="step-indicator">1</div>
        <div class="step-content">Account</div>
      </div>
      <div class="step-connector"></div>
      <div class="step active">
        <div class="step-indicator">2</div>
        <div class="step-content">Profile</div>
      </div>
      <div class="step-connector"></div>
      <div class="step">
        <div class="step-indicator">3</div>
        <div class="step-content">Review</div>
      </div>
      <div class="step-connector"></div>
      <div class="step">
        <div class="step-indicator">4</div>
        <div class="step-content">Confirm</div>
      </div>
    </div>`,
});

registerComponent({
  id: 'timelines',
  name: 'Timelines',
  description: 'Chronological event sequences.',
  renderPreview: (_state: SandboxState) => `
    <div class="timeline" style="width: 100%;">
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="font-medium text-sm">Project created</div>
          <div class="text-xs text-secondary">Jan 15, 2026</div>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="font-medium text-sm">Design review completed</div>
          <div class="text-xs text-secondary">Jan 22, 2026</div>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="font-medium text-sm">Beta release</div>
          <div class="text-xs text-secondary">Feb 10, 2026</div>
        </div>
      </div>
    </div>`,
});

registerComponent({
  id: 'stats',
  name: 'Stats',
  description: 'Key metric displays with labels and deltas.',
  renderPreview: (_state: SandboxState) => `
    <div class="stat-group" style="width: 100%;">
      <div class="stat">
        <div class="stat-label">Revenue</div>
        <div class="stat-value">$45.2k</div>
        <div class="stat-delta positive">+12.5%</div>
      </div>
      <div class="stat">
        <div class="stat-label">Users</div>
        <div class="stat-value">2,340</div>
        <div class="stat-delta positive">+8.1%</div>
      </div>
      <div class="stat">
        <div class="stat-label">Bounce Rate</div>
        <div class="stat-value">24.3%</div>
        <div class="stat-delta negative">-3.2%</div>
      </div>
    </div>`,
});

registerComponent({
  id: 'ratings',
  name: 'Ratings',
  description: 'Star-based rating displays.',
  renderPreview: (_state: SandboxState) => `
    <div class="flex flex-col gap-4">
      <div>
        <div class="text-sm mb-1">5 Stars</div>
        <div class="rating rating-lg">
          <span class="rating-star filled"></span>
          <span class="rating-star filled"></span>
          <span class="rating-star filled"></span>
          <span class="rating-star filled"></span>
          <span class="rating-star filled"></span>
        </div>
      </div>
      <div>
        <div class="text-sm mb-1">3.5 Stars</div>
        <div class="rating">
          <span class="rating-star filled"></span>
          <span class="rating-star filled"></span>
          <span class="rating-star filled"></span>
          <span class="rating-star half"></span>
          <span class="rating-star"></span>
        </div>
      </div>
      <div>
        <div class="text-sm mb-1">Small</div>
        <div class="rating rating-sm">
          <span class="rating-star filled"></span>
          <span class="rating-star filled"></span>
          <span class="rating-star filled"></span>
          <span class="rating-star filled"></span>
          <span class="rating-star"></span>
        </div>
      </div>
    </div>`,
});

registerComponent({
  id: 'checkboxes',
  name: 'Checkboxes',
  description: 'Checked, unchecked, and disabled checkbox states.',
  renderPreview: (_state: SandboxState) => `
    <div class="flex flex-col gap-4">
      <label class="flex items-center gap-2">
        <input type="checkbox" class="checkbox" checked />
        <span class="text-sm">Checked</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" class="checkbox" />
        <span class="text-sm">Unchecked</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" class="checkbox" disabled checked />
        <span class="text-sm">Disabled checked</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" class="checkbox" disabled />
        <span class="text-sm">Disabled unchecked</span>
      </label>
    </div>`,
});

registerComponent({
  id: 'radios',
  name: 'Radio Buttons',
  description: 'Selected, unselected, and disabled radio states.',
  renderPreview: (_state: SandboxState) => `
    <fieldset class="flex flex-col gap-4" style="border: none; padding: 0;">
      <legend class="text-sm font-medium mb-2">Select an option</legend>
      <label class="flex items-center gap-2">
        <input type="radio" class="radio" name="playground-radio" checked />
        <span class="text-sm">Selected</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="radio" class="radio" name="playground-radio" />
        <span class="text-sm">Unselected</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="radio" class="radio" name="playground-radio-disabled" disabled checked />
        <span class="text-sm">Disabled selected</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="radio" class="radio" name="playground-radio-disabled" disabled />
        <span class="text-sm">Disabled unselected</span>
      </label>
    </fieldset>`,
});

registerComponent({
  id: 'range',
  name: 'Range Sliders',
  description: 'Default, small, and large range inputs.',
  renderPreview: (_state: SandboxState) => `
    <div class="flex flex-col gap-6" style="max-width: 320px;">
      <div class="input-group">
        <label class="input-label">Default</label>
        <input type="range" class="range" min="0" max="100" value="50" />
      </div>
      <div class="input-group">
        <label class="input-label">Small</label>
        <input type="range" class="range range-sm" min="0" max="100" value="30" />
      </div>
      <div class="input-group">
        <label class="input-label">Large</label>
        <input type="range" class="range range-lg" min="0" max="100" value="70" />
      </div>
    </div>`,
});

registerComponent({
  id: 'file-input',
  name: 'File Input',
  description: 'Default, small, and large file inputs.',
  renderPreview: (_state: SandboxState) => `
    <div class="flex flex-col gap-6" style="max-width: 320px;">
      <div class="input-group">
        <label class="input-label">Default</label>
        <input type="file" class="file-input" />
      </div>
      <div class="input-group">
        <label class="input-label">Small</label>
        <input type="file" class="file-input file-input-sm" />
      </div>
      <div class="input-group">
        <label class="input-label">Large</label>
        <input type="file" class="file-input file-input-lg" />
      </div>
    </div>`,
});
