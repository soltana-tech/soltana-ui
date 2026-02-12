/** Components page — Atom and molecule specimens with interactive controls. */

import { sectionHeading, quickNavFromLabels, specimen } from '../utils/helpers';

export function renderComponents(): string {
  return `
<div class="page-components">
  ${sectionHeading('Components', 'components', 'Estate-styled atoms and molecules for composing interfaces.')}

  ${quickNavFromLabels(
    [
      'Buttons',
      'Inputs',
      'Cards',
      'Badges',
      'Alerts',
      'Avatars',
      'Progress',
      'Switches',
      'Tooltips',
      'Tables',
      'Modals',
      'Material Demo',
      'Neumorphic',
      'Glassmorphic',
      'Neuro-Glass',
    ],
    'comp-'
  )}

  <!-- ====== BUTTONS ====== -->
  ${specimen(
    'Buttons',
    'comp-buttons',
    `
    <p class="text-sm font-medium mb-3">Variants</p>
    <div class="flex flex-wrap gap-3 mb-6">
      <button class="btn btn-primary">Primary</button>
      <button class="btn btn-secondary">Secondary</button>
      <button class="btn btn-ghost">Ghost</button>
      <button class="btn btn-outline">Outline</button>
      <button class="btn btn-danger">Danger</button>
      <button class="btn btn-success">Success</button>
    </div>

    <p class="text-sm font-medium mb-3">Sizes</p>
    <div class="flex flex-wrap gap-3 items-center mb-6">
      <button class="btn btn-primary btn-xs">Extra Small</button>
      <button class="btn btn-primary btn-sm">Small</button>
      <button class="btn btn-primary">Default</button>
      <button class="btn btn-primary btn-lg">Large</button>
      <button class="btn btn-primary btn-xl">Extra Large</button>
    </div>

    <p class="text-sm font-medium mb-3">States</p>
    <div class="flex flex-wrap gap-3 items-center mb-6">
      <button class="btn btn-primary">Normal</button>
      <button class="btn btn-primary" disabled>Disabled</button>
    </div>

    <p class="text-sm font-medium mb-3">Button Group</p>
    <div class="btn-group">
      <button class="btn btn-outline">Left</button>
      <button class="btn btn-outline">Center</button>
      <button class="btn btn-outline">Right</button>
    </div>

    <!-- Interactive playground -->
    <div class="playground mt-8 p-4 rounded-xl" style="background: var(--surface-2)">
      <p class="text-sm font-semibold mb-3">Playground</p>
      <div class="flex flex-wrap gap-4 items-end mb-4">
        <div class="input-group">
          <label class="input-label">Variant</label>
          <select class="select input-sm" data-class-swap data-target="#playground-btn" id="btn-variant-select">
            <option value="btn-primary">Primary</option>
            <option value="btn-secondary">Secondary</option>
            <option value="btn-ghost">Ghost</option>
            <option value="btn-outline">Outline</option>
            <option value="btn-danger">Danger</option>
            <option value="btn-success">Success</option>
          </select>
        </div>
        <div class="input-group">
          <label class="input-label">Size</label>
          <select class="select input-sm" data-class-swap data-target="#playground-btn" id="btn-size-select">
            <option value="">Default</option>
            <option value="btn-xs">Extra Small</option>
            <option value="btn-sm">Small</option>
            <option value="btn-lg">Large</option>
            <option value="btn-xl">Extra Large</option>
          </select>
        </div>
      </div>
      <div class="p-6 rounded-lg flex items-center justify-center" style="background: var(--surface-bg)">
        <button class="btn btn-primary" id="playground-btn">Button Preview</button>
      </div>
    </div>
  `
  )}

  <!-- ====== INPUTS ====== -->
  ${specimen(
    'Inputs',
    'comp-inputs',
    `
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
      <div class="input-group">
        <label class="input-label">Text Input</label>
        <input type="text" class="input" placeholder="Enter text..." />
        <span class="input-help">Helper text goes here</span>
      </div>
      <div class="input-group">
        <label class="input-label">Email</label>
        <input type="email" class="input" placeholder="user@example.com" />
      </div>
      <div class="input-group">
        <label class="input-label">Password</label>
        <input type="password" class="input" value="password123" />
      </div>
      <div class="input-group">
        <label class="input-label">Disabled</label>
        <input type="text" class="input" disabled value="Cannot edit" />
      </div>
      <div class="input-group">
        <label class="input-label">Error State</label>
        <input type="text" class="input input-error" value="Invalid value" />
        <span class="input-error-text">This field is required</span>
      </div>
      <div class="input-group">
        <label class="input-label">Select</label>
        <select class="select">
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </select>
      </div>
      <div class="input-group">
        <label class="input-label">Small Input</label>
        <input type="text" class="input input-sm" placeholder="Small size" />
      </div>
      <div class="input-group">
        <label class="input-label">Large Input</label>
        <input type="text" class="input input-lg" placeholder="Large size" />
      </div>
    </div>

    <div class="mt-6">
      <p class="text-sm font-medium mb-3">Textarea</p>
      <textarea class="textarea" placeholder="Write a longer message..."></textarea>
    </div>

    <div class="mt-6 flex flex-wrap gap-8">
      <div>
        <p class="text-sm font-medium mb-3">Checkboxes</p>
        <div class="flex flex-col gap-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="checkbox" checked /> <span class="text-sm">Option A</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="checkbox" /> <span class="text-sm">Option B</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="checkbox" disabled /> <span class="text-sm text-muted">Disabled</span>
          </label>
        </div>
      </div>
      <div>
        <p class="text-sm font-medium mb-3">Radio Buttons</p>
        <div class="flex flex-col gap-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="radio-demo" class="radio" checked /> <span class="text-sm">Choice 1</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="radio-demo" class="radio" /> <span class="text-sm">Choice 2</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="radio-demo" class="radio" /> <span class="text-sm">Choice 3</span>
          </label>
        </div>
      </div>
    </div>
  `
  )}

  <!-- ====== CARDS ====== -->
  ${specimen(
    'Cards',
    'comp-cards',
    `
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
      <div class="card card-hover">
        <div class="card-body">
          <h4 class="text-lg font-semibold mb-2">Simple Card</h4>
          <p class="text-secondary text-sm">A basic card with just a body. Hover to see the elevation effect.</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">Card Header</div>
        <div class="card-body">
          <p class="text-secondary text-sm">Card with header and footer sections for structured content layout.</p>
        </div>
        <div class="card-footer flex justify-end gap-2">
          <button class="btn btn-ghost btn-sm">Cancel</button>
          <button class="btn btn-primary btn-sm">Confirm</button>
        </div>
      </div>

      <div class="card card-hover">
        <div style="height: 140px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));" class="card-image"></div>
        <div class="card-body">
          <h4 class="text-lg font-semibold mb-1">Image Card</h4>
          <p class="text-secondary text-sm">Card with an image or gradient header area.</p>
        </div>
      </div>
    </div>
  `
  )}

  <!-- ====== BADGES ====== -->
  ${specimen(
    'Badges & Tags',
    'comp-badges',
    `
    <p class="text-sm font-medium mb-3">Badges</p>
    <div class="flex flex-wrap gap-3 mb-6">
      <span class="badge">Default</span>
      <span class="badge badge-primary">Primary</span>
      <span class="badge badge-success">Success</span>
      <span class="badge badge-warning">Warning</span>
      <span class="badge badge-error">Error</span>
      <span class="badge badge-info">Info</span>
    </div>
    <p class="text-sm font-medium mb-3">Pills</p>
    <div class="flex flex-wrap gap-3 mb-6">
      <span class="badge badge-pill">Default</span>
      <span class="badge badge-pill badge-primary">Primary</span>
      <span class="badge badge-pill badge-success">Success</span>
      <span class="badge badge-pill badge-warning">Warning</span>
      <span class="badge badge-pill badge-error">Error</span>
      <span class="badge badge-pill badge-info">Info</span>
    </div>
    <p class="text-sm font-medium mb-3">Tags</p>
    <div class="flex flex-wrap gap-2 mb-6">
      <span class="tag">TypeScript</span>
      <span class="tag">Design System</span>
      <span class="tag">SCSS</span>
      <span class="tag">Vite</span>
    </div>
    <p class="text-sm font-medium mb-3">Jewel-Toned Tags</p>
    <div class="flex flex-wrap gap-2">
      <span class="tag tag-emerald">Emerald</span>
      <span class="tag tag-sapphire">Sapphire</span>
      <span class="tag tag-ruby">Ruby</span>
      <span class="tag tag-amethyst">Amethyst</span>
      <span class="tag tag-gold">Gold</span>
      <span class="tag tag-citrine">Citrine</span>
    </div>
  `
  )}

  <!-- ====== ALERTS ====== -->
  ${specimen(
    'Alerts',
    'comp-alerts',
    `
    <div class="flex flex-col gap-4">
      <div class="alert alert-success">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>Operation completed successfully. All changes have been saved.</span>
      </div>
      <div class="alert alert-warning">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>Disk space is running low. Consider cleaning up unused resources.</span>
      </div>
      <div class="alert alert-error">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        <span>Failed to process the request. Check the connection and try again.</span>
      </div>
      <div class="alert alert-info">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>A new version is available. Refresh the page to update.</span>
      </div>
    </div>
  `
  )}

  <!-- ====== AVATARS ====== -->
  ${specimen(
    'Avatars',
    'comp-avatars',
    `
    <div class="flex items-center gap-4">
      <div class="avatar avatar-sm">S</div>
      <div class="avatar">MD</div>
      <div class="avatar avatar-lg">LG</div>
      <div class="avatar avatar-xl">XL</div>
      <div class="avatar" style="background: var(--dracula-cyan); color: var(--dracula-bg)">AC</div>
      <div class="avatar" style="background: var(--dracula-green); color: var(--dracula-bg)">JS</div>
      <div class="avatar" style="background: var(--dracula-orange); color: var(--dracula-bg)">RK</div>
    </div>
  `
  )}

  <!-- ====== PROGRESS ====== -->
  ${specimen(
    'Progress Bars',
    'comp-progress',
    `
    <div class="flex flex-col gap-4">
      <div>
        <div class="flex justify-between mb-1"><span class="text-sm">Default</span><span class="text-sm text-muted">65%</span></div>
        <div class="progress"><div class="progress-bar" style="width: 65%"></div></div>
      </div>
      <div>
        <div class="flex justify-between mb-1"><span class="text-sm">Success</span><span class="text-sm text-muted">80%</span></div>
        <div class="progress progress-success"><div class="progress-bar" style="width: 80%"></div></div>
      </div>
      <div>
        <div class="flex justify-between mb-1"><span class="text-sm">Warning</span><span class="text-sm text-muted">45%</span></div>
        <div class="progress progress-warning"><div class="progress-bar" style="width: 45%"></div></div>
      </div>
      <div>
        <div class="flex justify-between mb-1"><span class="text-sm">Error</span><span class="text-sm text-muted">20%</span></div>
        <div class="progress progress-error"><div class="progress-bar" style="width: 20%"></div></div>
      </div>
    </div>

    <!-- Interactive playground -->
    <div class="playground mt-6 p-4 rounded-xl" style="background: var(--surface-2)">
      <p class="text-sm font-semibold mb-3">Playground</p>
      <div class="input-group mb-4">
        <label class="input-label">Progress Value: <span class="range-value">50%</span></label>
        <input type="range" min="0" max="100" value="50" data-css-var="--pg-width" data-unit="%" data-target="#playground-progress" style="width: 100%" />
      </div>
      <div class="progress" id="playground-progress" style="--pg-width: 50%">
        <div class="progress-bar" style="width: var(--pg-width)"></div>
      </div>
    </div>
  `
  )}

  <!-- ====== SWITCHES ====== -->
  ${specimen(
    'Switches',
    'comp-switches',
    `
    <div class="flex flex-wrap gap-6 items-center">
      <label class="flex items-center gap-3">
        <label class="switch">
          <input type="checkbox" checked />
          <span class="switch-slider"></span>
        </label>
        <span class="text-sm">Enabled</span>
      </label>
      <label class="flex items-center gap-3">
        <label class="switch">
          <input type="checkbox" />
          <span class="switch-slider"></span>
        </label>
        <span class="text-sm">Disabled</span>
      </label>
    </div>
  `
  )}

  <!-- ====== TOOLTIPS ====== -->
  ${specimen(
    'Tooltips',
    'comp-tooltips',
    `
    <div class="flex flex-wrap gap-4">
      <button class="btn btn-outline tooltip" data-tooltip="Tooltip text here">Hover me</button>
      <button class="btn btn-primary tooltip" data-tooltip="Save your changes">Save</button>
      <span class="badge badge-primary tooltip" data-tooltip="12 notifications">Notifications</span>
    </div>
  `
  )}

  <!-- ====== TABLES ====== -->
  ${specimen(
    'Tables',
    'comp-tables',
    `
    <div class="overflow-x-auto">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="font-medium">Alice Chen</td>
            <td class="text-secondary">Engineer</td>
            <td><span class="badge badge-success">Active</span></td>
            <td><button class="btn btn-ghost btn-xs">Edit</button></td>
          </tr>
          <tr>
            <td class="font-medium">Bob Martin</td>
            <td class="text-secondary">Designer</td>
            <td><span class="badge badge-success">Active</span></td>
            <td><button class="btn btn-ghost btn-xs">Edit</button></td>
          </tr>
          <tr>
            <td class="font-medium">Carol Davis</td>
            <td class="text-secondary">Product</td>
            <td><span class="badge badge-warning">Away</span></td>
            <td><button class="btn btn-ghost btn-xs">Edit</button></td>
          </tr>
          <tr>
            <td class="font-medium">Dan Lopez</td>
            <td class="text-secondary">Marketing</td>
            <td><span class="badge badge-error">Offline</span></td>
            <td><button class="btn btn-ghost btn-xs">Edit</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `
  )}

  <!-- ====== MODALS ====== -->
  ${specimen(
    'Modals',
    'comp-modals',
    `
    <button class="btn btn-primary" data-modal-open="demo-modal">Open Modal</button>

    <div class="modal-backdrop" id="demo-modal">
      <div class="modal">
        <div class="modal-header">
          <span>Confirm Action</span>
          <button class="btn btn-ghost btn-icon btn-xs" data-modal-close="demo-modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="text-secondary">Are you sure you want to proceed? This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" data-modal-close="demo-modal">Cancel</button>
          <button class="btn btn-primary" data-modal-close="demo-modal">Confirm</button>
        </div>
      </div>
    </div>
  `
  )}

  <!-- ====== MATERIAL DEMO ====== -->
  ${specimen(
    'Material Demo',
    'comp-material-demo',
    `
    <p class="text-sm text-muted mb-6">The same components rendered in each material context. Change the global material in the settings panel to see all components update.</p>
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))">
      <div data-material="neuro" class="p-6 rounded-xl" style="background: var(--neuro-bg); box-shadow: 6px 6px 14px var(--neuro-shadow-dark), -6px -6px 14px var(--neuro-shadow-light);">
        <span class="tag tag-gold mb-3">Neumorphic</span>
        <div class="flex flex-wrap gap-2 mt-3 mb-3">
          <button class="btn btn-primary btn-sm">Primary</button>
          <button class="btn btn-secondary btn-sm">Secondary</button>
        </div>
        <input class="input input-sm mb-3" placeholder="Neuro input..." />
        <div class="flex gap-2">
          <span class="badge badge-success">Active</span>
          <span class="tag tag-sapphire">Status</span>
        </div>
        <div class="progress mt-3"><div class="progress-bar" style="width: 65%"></div></div>
      </div>
      <div data-material="glass" class="p-6 rounded-xl" style="background: var(--glass-bg); backdrop-filter: blur(16px) saturate(140%); border: 1px solid var(--glass-border);">
        <span class="tag tag-sapphire mb-3">Glassmorphic</span>
        <div class="flex flex-wrap gap-2 mt-3 mb-3">
          <button class="btn btn-primary btn-sm">Primary</button>
          <button class="btn btn-secondary btn-sm">Secondary</button>
        </div>
        <input class="input input-sm mb-3" placeholder="Glass input..." />
        <div class="flex gap-2">
          <span class="badge badge-success">Active</span>
          <span class="tag tag-sapphire">Status</span>
        </div>
        <div class="progress mt-3"><div class="progress-bar" style="width: 65%"></div></div>
      </div>
      <div data-material="hybrid" class="p-6 rounded-xl" style="background: linear-gradient(145deg, var(--glass-gradient-start), var(--glass-gradient-end)); backdrop-filter: blur(12px) saturate(120%); border: 1px solid var(--glass-border);">
        <span class="tag tag-amethyst mb-3">Hybrid</span>
        <div class="flex flex-wrap gap-2 mt-3 mb-3">
          <button class="btn btn-primary btn-sm">Primary</button>
          <button class="btn btn-secondary btn-sm">Secondary</button>
        </div>
        <input class="input input-sm mb-3" placeholder="Hybrid input..." />
        <div class="flex gap-2">
          <span class="badge badge-success">Active</span>
          <span class="tag tag-sapphire">Status</span>
        </div>
        <div class="progress mt-3"><div class="progress-bar" style="width: 65%"></div></div>
      </div>
    </div>
  `
  )}

  <!-- ====== NEUMORPHIC ====== -->
  ${specimen(
    'Neumorphic Components',
    'comp-neumorphic',
    `
    <p class="text-sm text-muted mb-4">Multi-layer neumorphism with elevated, floating, and soft variants. Theme-aware shadow pairs.</p>
    <div class="p-8 rounded-2xl" style="background: var(--neuro-bg)">
      <p class="overline mb-4">Basic Variants</p>
      <div class="grid gap-8" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
        <div class="neuro-raised p-6 text-center">
          <p class="text-sm font-medium">.neuro-raised</p>
        </div>
        <div class="neuro-inset p-6 text-center">
          <p class="text-sm font-medium">.neuro-inset</p>
        </div>
        <div class="neuro-flat p-6 text-center">
          <p class="text-sm font-medium">.neuro-flat</p>
        </div>
        <div class="neuro-soft p-6 text-center">
          <p class="text-sm font-medium">.neuro-soft</p>
        </div>
      </div>

      <p class="overline mt-8 mb-4">Enhanced Variants</p>
      <div class="grid gap-8" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
        <div class="neuro-elevated p-6 text-center">
          <p class="text-sm font-medium">.neuro-elevated</p>
          <p class="text-xs text-muted mt-1">3-layer shadow with highlight</p>
        </div>
        <div class="neuro-floating p-6 text-center">
          <p class="text-sm font-medium">.neuro-floating</p>
          <p class="text-xs text-muted mt-1">Dramatic elevation</p>
        </div>
        <div class="neuro-pressed-active p-6 text-center">
          <p class="text-sm font-medium">.neuro-pressed-active</p>
          <p class="text-xs text-muted mt-1">Accent-tinted inset</p>
        </div>
        <div class="neuro-card-layered">
          <p class="text-sm font-medium mb-2">.neuro-card-layered</p>
          <p class="text-xs text-muted">Gradient overlay card</p>
        </div>
      </div>

      <p class="overline mt-8 mb-4">Interactive Elements</p>
      <div class="flex flex-wrap gap-6 items-center">
        <button class="neuro-button px-6 py-3 text-sm font-medium">.neuro-button</button>
        <input class="neuro-input" placeholder=".neuro-input" />
        <div class="neuro-toggle" id="neuro-toggle-demo"></div>
      </div>

      <div class="mt-8">
        <p class="text-sm font-medium mb-2">.neuro-progress</p>
        <div class="neuro-progress">
          <div class="neuro-progress-fill" style="width: 60%"></div>
        </div>
      </div>
    </div>

    <!-- Playground -->
    <div class="playground mt-6 p-4 rounded-xl" style="background: var(--surface-2)">
      <p class="text-sm font-semibold mb-3">Playground — Neumorphic Depth</p>
      <div class="flex flex-wrap gap-4 items-end mb-4">
        <div class="input-group">
          <label class="input-label">Shadow Spread: <span class="range-value">12px</span></label>
          <input type="range" min="2" max="30" value="12" data-css-var="--playground-neuro-spread" data-unit="px" data-target="#neuro-playground-box" />
        </div>
      </div>
      <div class="p-8 rounded-2xl" style="background: var(--neuro-bg)">
        <div id="neuro-playground-box" class="p-6 rounded-xl text-center text-sm font-medium"
          style="background: var(--neuro-bg); --playground-neuro-spread: 12px; box-shadow: var(--playground-neuro-spread) var(--playground-neuro-spread) calc(var(--playground-neuro-spread) * 2) var(--neuro-shadow-dark), calc(var(--playground-neuro-spread) * -1) calc(var(--playground-neuro-spread) * -1) calc(var(--playground-neuro-spread) * 2) var(--neuro-shadow-light); border-radius: var(--radius-xl);">
          Interactive Neumorphic Box
        </div>
      </div>
    </div>
  `
  )}

  <!-- ====== GLASSMORPHIC ====== -->
  ${specimen(
    'Glassmorphic Components',
    'comp-glassmorphic',
    `
    <p class="text-sm text-muted mb-4">Advanced frosted glass effects including luxury, chrome, frosted-heavy, and tinted-gradient variants.</p>
    <div class="p-8 rounded-2xl relative overflow-hidden" style="background: linear-gradient(135deg, #1a1b3a, #2d1b4e, #1a2a3a); min-height: 500px">
      <!-- Decorative blobs -->
      <div class="absolute" style="width: 200px; height: 200px; border-radius: 50%; background: rgba(189,147,249,0.3); filter: blur(50px); top: -30px; left: 20%;"></div>
      <div class="absolute" style="width: 160px; height: 160px; border-radius: 50%; background: rgba(255,121,198,0.2); filter: blur(40px); bottom: -20px; right: 15%;"></div>
      <div class="absolute" style="width: 120px; height: 120px; border-radius: 50%; background: rgba(139,233,253,0.15); filter: blur(30px); top: 50%; left: 60%;"></div>

      <div class="relative z-10">
        <p class="overline mb-4" style="color: rgba(255,255,255,0.5)">Standard</p>
        <div class="grid gap-6 mb-8" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
          <div class="glass-card">
            <p class="text-sm font-semibold mb-1" style="color: #fff">.glass-card</p>
            <p class="text-xs" style="color: rgba(255,255,255,0.6)">Default frosted glass card.</p>
          </div>
          <div class="glass-accent p-5 rounded-2xl">
            <p class="text-sm font-semibold mb-1" style="color: #fff">.glass-accent</p>
            <p class="text-xs" style="color: rgba(255,255,255,0.6)">Purple-tinted variant.</p>
          </div>
          <div class="glass-cyan p-5 rounded-2xl">
            <p class="text-sm font-semibold mb-1" style="color: #fff">.glass-cyan</p>
            <p class="text-xs" style="color: rgba(255,255,255,0.6)">Cyan-tinted variant.</p>
          </div>
        </div>

        <p class="overline mb-4" style="color: rgba(255,255,255,0.5)">Premium</p>
        <div class="grid gap-6 mb-8" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
          <div class="glass-luxury p-5 rounded-2xl">
            <p class="text-sm font-semibold mb-1" style="color: #fff">.glass-luxury</p>
            <p class="text-xs" style="color: rgba(255,255,255,0.6)">Multi-layer with inner glow.</p>
          </div>
          <div class="glass-frosted-heavy p-5 rounded-2xl">
            <p class="text-sm font-semibold mb-1" style="color: #fff">.glass-frosted-heavy</p>
            <p class="text-xs" style="color: rgba(255,255,255,0.6)">Strong blur + saturate.</p>
          </div>
          <div class="glass-chrome p-5 rounded-2xl">
            <p class="text-sm font-semibold mb-1" style="color: #fff">.glass-chrome</p>
            <p class="text-xs" style="color: rgba(255,255,255,0.6)">Metallic/reflective variant.</p>
          </div>
          <div class="glass-tinted-gradient p-5 rounded-2xl">
            <p class="text-sm font-semibold mb-1" style="color: #fff">.glass-tinted-gradient</p>
            <p class="text-xs" style="color: rgba(255,255,255,0.6)">Directional gradient glass.</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-4 items-center">
          <button class="glass-button px-5 py-2 text-sm font-medium" style="color: #fff">.glass-button</button>
          <input class="glass-input" placeholder=".glass-input" style="color: #fff; max-width: 200px" />
        </div>
      </div>
    </div>

    <!-- Playground -->
    <div class="playground mt-6 p-4 rounded-xl" style="background: var(--surface-2)">
      <p class="text-sm font-semibold mb-3">Playground — Glass Blur Intensity</p>
      <div class="flex flex-wrap gap-4 items-end mb-4">
        <div class="input-group">
          <label class="input-label">Blur: <span class="range-value">12px</span></label>
          <input type="range" min="0" max="40" value="12" data-css-var="--playground-blur" data-unit="px" data-target="#glass-playground-box" />
        </div>
        <div class="input-group">
          <label class="input-label">Opacity: <span class="range-value">0.55</span></label>
          <input type="range" min="0" max="100" value="55" data-css-var="--playground-opacity" data-unit="" data-target="#glass-playground-box" />
        </div>
      </div>
      <div class="p-8 rounded-2xl relative overflow-hidden" style="background: linear-gradient(135deg, var(--dracula-green), var(--dracula-purple), var(--dracula-pink))">
        <div id="glass-playground-box" class="p-6 rounded-xl text-center text-sm font-medium"
          style="color: #fff; --playground-blur: 12px; --playground-opacity: 55; backdrop-filter: blur(var(--playground-blur)); -webkit-backdrop-filter: blur(var(--playground-blur)); background: rgba(255,255,255, calc(var(--playground-opacity) / 100 * 0.3)); border: 1px solid rgba(255,255,255, calc(var(--playground-opacity) / 100 * 0.4)); border-radius: var(--radius-xl); box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
          Interactive Glass Box
        </div>
      </div>
    </div>
  `
  )}

  <!-- ====== NEURO-GLASS HYBRIDS ====== -->
  ${specimen(
    'Neuro-Glass Hybrids',
    'comp-neuro-glass',
    `
    <p class="text-sm text-muted mb-4">Combined neumorphic depth with glassmorphic translucency. Soft 3D shadows meet modern frosted glass.</p>
    <div class="p-8 rounded-2xl relative overflow-hidden" style="background: linear-gradient(135deg, #0e1020, #1a1d42, #141628); min-height: 480px">
      <!-- Decorative blobs -->
      <div class="absolute" style="width: 200px; height: 200px; border-radius: 50%; background: rgba(189,147,249,0.15); filter: blur(50px); top: 10%; left: 10%;"></div>
      <div class="absolute" style="width: 180px; height: 180px; border-radius: 50%; background: rgba(139,233,253,0.1); filter: blur(40px); bottom: 10%; right: 20%;"></div>

      <div class="relative z-10">
        <p class="overline mb-4" style="color: rgba(255,255,255,0.5)">Hybrid Variants</p>
        <div class="grid gap-6 mb-8" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))">
          <div class="neuro-glass p-5">
            <p class="text-sm font-semibold mb-1" style="color: #fff">.neuro-glass</p>
            <p class="text-xs" style="color: rgba(255,255,255,0.6)">Base hybrid: shadows + blur + gradient.</p>
          </div>
          <div class="neuro-glass-card">
            <p class="text-sm font-semibold mb-1" style="color: #fff">.neuro-glass-card</p>
            <p class="text-xs" style="color: rgba(255,255,255,0.6)">Card with hover lift effect.</p>
          </div>
          <div class="neuro-glass-elevated p-5">
            <p class="text-sm font-semibold mb-1" style="color: #fff">.neuro-glass-elevated</p>
            <p class="text-xs" style="color: rgba(255,255,255,0.6)">Dramatic depth hybrid.</p>
          </div>
          <div class="neuro-glass-inset p-5">
            <p class="text-sm font-semibold mb-1" style="color: #fff">.neuro-glass-inset</p>
            <p class="text-xs" style="color: rgba(255,255,255,0.6)">Pressed glass interior.</p>
          </div>
          <div class="neuro-glass-floating p-5">
            <p class="text-sm font-semibold mb-1" style="color: #fff">.neuro-glass-floating</p>
            <p class="text-xs" style="color: rgba(255,255,255,0.6)">Extra dramatic with glow.</p>
          </div>
          <div class="neuro-glass-accent p-5">
            <p class="text-sm font-semibold mb-1" style="color: #fff">.neuro-glass-accent</p>
            <p class="text-xs" style="color: rgba(255,255,255,0.6)">Purple-tinted hybrid.</p>
          </div>
        </div>

        <p class="overline mb-4" style="color: rgba(255,255,255,0.5)">Interactive</p>
        <div class="flex flex-wrap gap-4 items-center">
          <button class="neuro-glass-button px-6 py-3 text-sm font-medium" style="color: #fff">.neuro-glass-button</button>
          <input class="neuro-glass-input" placeholder=".neuro-glass-input" style="color: #fff; max-width: 220px" />
        </div>
      </div>
    </div>
  `
  )}

  <!-- ====== SKELETON ====== -->
  ${specimen(
    'Skeletons',
    'comp-skeletons',
    `
    <div class="card" style="max-width: 320px">
      <div class="card-body">
        <div class="flex items-center gap-3 mb-4">
          <div class="skeleton skeleton-circle" style="width: 2.5rem; height: 2.5rem"></div>
          <div class="flex-1">
            <div class="skeleton-text" style="width: 60%"></div>
            <div class="skeleton-text" style="width: 40%"></div>
          </div>
        </div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text" style="width: 75%"></div>
      </div>
    </div>
  `
  )}

  <div class="ornament-divider mt-12 mb-12"></div>

  <!-- ====== WEB COMPONENTS ====== -->
  <div class="section-heading" id="comp-web-components">
    <h2 class="text-2xl font-bold">Web Components</h2>
    <p class="text-secondary mt-2">Shadow DOM components with encapsulated styling. Use as custom HTML elements.</p>
  </div>

  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif" id="wc-card">sol-card</h3>
  <p class="text-secondary mb-4">Card with ornamental corners, gold borders, and multiple variants.</p>
  <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
    <sol-card variant="default" elevation="raised">
      <span slot="header">Default Card</span>
      <p>Neumorphic raised card with soft depth.</p>
    </sol-card>
    <sol-card variant="ornate" elevation="raised">
      <span slot="header">Ornate Card</span>
      <p>Four corner ornaments for a classical frame.</p>
    </sol-card>
    <sol-card variant="baroque" elevation="raised">
      <span slot="header">Baroque Card</span>
      <p>Full ornamental frame with medallion.</p>
    </sol-card>
    <sol-card variant="glass" elevation="raised">
      <span slot="header">Glass Card</span>
      <p>Crystal glass with backdrop blur effect.</p>
    </sol-card>
  </div>

  <h3 class="text-xl font-semibold mt-10 mb-4 font-serif" id="wc-button">sol-button</h3>
  <p class="text-secondary mb-4">Button with material-aware styling and metallic finishes.</p>

  <h4 class="text-lg font-semibold mt-4 mb-3">Standard Variants</h4>
  <div class="flex flex-wrap gap-4 items-center mb-6">
    <sol-button variant="primary">Primary</sol-button>
    <sol-button variant="secondary">Secondary</sol-button>
    <sol-button variant="outline">Outline</sol-button>
    <sol-button variant="ghost">Ghost</sol-button>
    <sol-button variant="danger">Danger</sol-button>
    <sol-button variant="success">Success</sol-button>
  </div>

  <h4 class="text-lg font-semibold mt-4 mb-3">Material Variants</h4>
  <div class="flex flex-wrap gap-4 items-center mb-6">
    <sol-button variant="primary" material="neuro">Neuro</sol-button>
    <sol-button variant="primary" material="glass">Glass</sol-button>
    <sol-button variant="primary" material="hybrid">Hybrid</sol-button>
  </div>

  <h4 class="text-lg font-semibold mt-4 mb-3">Metallic Variants</h4>
  <div class="flex flex-wrap gap-4 items-center mb-6">
    <sol-button variant="gold">Gold</sol-button>
    <sol-button variant="silver">Silver</sol-button>
    <sol-button variant="bronze">Bronze</sol-button>
    <sol-button variant="platinum">Platinum</sol-button>
  </div>

  <h4 class="text-lg font-semibold mt-4 mb-3">Structural Variants</h4>
  <div class="flex flex-wrap gap-4 items-center">
    <sol-button variant="chiseled">Chiseled</sol-button>
    <sol-button variant="baroque">Baroque</sol-button>
    <sol-button variant="faceted">Faceted</sol-button>
    <sol-button variant="medallion">M</sol-button>
  </div>

  <h3 class="text-xl font-semibold mt-10 mb-4 font-serif" id="wc-input">sol-input</h3>
  <p class="text-secondary mb-4">Input field with label, validation states, and icons.</p>
  <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
    <sol-input label="Default Input" placeholder="Enter text..."></sol-input>
    <sol-input label="With Value" value="Hello World"></sol-input>
    <sol-input label="Disabled" placeholder="Cannot edit" disabled></sol-input>
  </div>

</div>
`;
}
