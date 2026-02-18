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
