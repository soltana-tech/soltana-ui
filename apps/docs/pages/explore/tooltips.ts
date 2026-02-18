/** Tooltips component page — hover-triggered tooltip specimens. */

import { sectionHeading, specimen } from '../../utils/helpers';

export function renderTooltips(): string {
  return `
<div class="page-tooltips">
  ${sectionHeading('Tooltips', 'tooltips', 'Hover-triggered contextual hints on buttons and badges.')}

  ${specimen(
    'Tooltip Examples',
    'tooltip-examples',
    `
    <div class="flex flex-wrap gap-4">
      <button class="btn btn-outline tooltip" data-tooltip="Tooltip text here">Hover me</button>
      <button class="btn btn-primary tooltip" data-tooltip="Save your changes">Save</button>
      <span class="badge badge-primary tooltip" data-tooltip="12 notifications">Notifications</span>
    </div>
  `
  )}

  <div class="mt-10 pt-6" style="border-top: 1px solid var(--border-subtle)">
    <a href="#/playground?component=tooltips" class="btn btn-primary">Open in Playground</a>
  </div>
</div>`;
}
