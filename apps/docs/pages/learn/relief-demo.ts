/** Relief Demo page — per-relief context specimens and hewn components. */

import { sectionHeading, specimen } from '../../utils/helpers';

export function renderReliefDemo(): string {
  return `
<div class="page-relief-demo">
  ${sectionHeading('Relief Demo', 'relief-demo', 'Components rendered in different relief contexts.')}

  ${specimen(
    'Relief Contexts',
    'relief-contexts',
    `
    <p class="text-sm text-muted mb-6">The same components rendered in each relief context. Change the global relief in the settings panel to see all components update.</p>
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))">
      <div data-relief="neu" class="p-6 rounded-xl" style="background: var(--relief-surface-deep); box-shadow: 6px 6px 14px var(--neu-shadow), -6px -6px 14px var(--neu-light);">
        <span class="tag mb-3">Neumorphic</span>
        <div class="flex flex-wrap gap-2 mt-3 mb-3">
          <button class="btn btn-primary btn-sm">Primary</button>
          <button class="btn btn-secondary btn-sm">Secondary</button>
        </div>
        <input class="input input-sm mb-3" placeholder="Neu input..." />
        <div class="flex gap-2">
          <span class="badge badge-success">Active</span>
          <span class="tag">Status</span>
        </div>
        <div class="progress mt-3"><div class="progress-bar" style="width: 65%"></div></div>
      </div>
      <div data-relief="lifted" class="p-6 rounded-xl" style="background: var(--surface-2);">
        <span class="tag mb-3">Lifted</span>
        <div class="flex flex-wrap gap-2 mt-3 mb-3">
          <button class="btn btn-primary btn-sm">Primary</button>
          <button class="btn btn-secondary btn-sm">Secondary</button>
        </div>
        <input class="input input-sm mb-3" placeholder="Lifted input..." />
        <div class="flex gap-2">
          <span class="badge badge-success">Active</span>
          <span class="tag">Status</span>
        </div>
        <div class="progress mt-3"><div class="progress-bar" style="width: 65%"></div></div>
      </div>
      <div data-relief="sharp" class="p-6 rounded-xl" style="background: var(--surface-2);">
        <span class="tag mb-3">Sharp</span>
        <div class="flex flex-wrap gap-2 mt-3 mb-3">
          <button class="btn btn-primary btn-sm">Primary</button>
          <button class="btn btn-secondary btn-sm">Secondary</button>
        </div>
        <input class="input input-sm mb-3" placeholder="Sharp input..." />
        <div class="flex gap-2">
          <span class="badge badge-success">Active</span>
          <span class="tag">Status</span>
        </div>
        <div class="progress mt-3"><div class="progress-bar" style="width: 65%"></div></div>
      </div>
    </div>
  `
  )}

  ${specimen(
    'Hewn Components',
    'hewn-components',
    `
    <p class="text-sm text-muted mb-4">Chiseled asymmetric inset shadows creating a carved-from-surface appearance.</p>
    <div class="p-8 rounded-2xl" style="background: var(--surface-2)">
      <div class="grid gap-6 mb-8" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
        <div class="card relief-hewn p-5">
          <p class="text-sm font-semibold mb-1">.card.relief-hewn</p>
          <p class="text-xs text-muted">Carved inset shadow effect.</p>
        </div>
        <div class="card relief-sharp p-5">
          <p class="text-sm font-semibold mb-1">.card.relief-sharp</p>
          <p class="text-xs text-muted">Hard-edged crisp shadows.</p>
        </div>
        <div class="card relief-lifted p-5">
          <p class="text-sm font-semibold mb-1">.card.relief-lifted</p>
          <p class="text-xs text-muted">Material-style elevation.</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-4 items-center">
        <button class="btn relief-hewn px-5 py-2 text-sm font-medium">.btn.relief-hewn</button>
        <button class="btn relief-sharp px-5 py-2 text-sm font-medium">.btn.relief-sharp</button>
        <button class="btn relief-lifted px-5 py-2 text-sm font-medium">.btn.relief-lifted</button>
      </div>
    </div>
  `
  )}
</div>`;
}
