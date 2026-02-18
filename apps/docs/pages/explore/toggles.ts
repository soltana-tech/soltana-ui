/** Toggles component page — switch-style toggle controls. */

import { sectionHeading, specimen } from '../../utils/helpers';

export function renderToggles(): string {
  return `
<div class="page-toggles">
  ${sectionHeading('Toggles', 'toggles', 'Switch-style toggle controls for boolean settings.')}

  ${specimen(
    'Toggle States',
    'toggle-states',
    `
    <div class="flex flex-wrap gap-6 items-center">
      <label class="flex items-center gap-3">
        <div class="toggle active" role="switch" aria-checked="true" tabindex="0"></div>
        <span class="text-sm">Enabled</span>
      </label>
      <label class="flex items-center gap-3">
        <div class="toggle" role="switch" aria-checked="false" tabindex="0"></div>
        <span class="text-sm">Disabled</span>
      </label>
    </div>
  `
  )}

  <div class="mt-10 pt-6" style="border-top: 1px solid var(--border-subtle)">
    <a href="#/playground?component=toggles" class="btn btn-primary">Open in Playground</a>
  </div>
</div>`;
}
