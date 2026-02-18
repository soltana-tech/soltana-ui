/** Modals component page — dialog with open/close trigger. */

import { sectionHeading, specimen } from '../../utils/helpers';

export function renderModals(): string {
  return `
<div class="page-modals">
  ${sectionHeading('Modals', 'modals', 'Dialog overlays with header, body, and footer sections.')}

  ${specimen(
    'Modal Dialog',
    'modal-dialog',
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
</div>`;
}
