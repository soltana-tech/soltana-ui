/** Progress Bars component page — variants and interactive playground. */

import { sectionHeading, specimen } from '../../utils/helpers';

export function renderProgress(): string {
  return `
<div class="page-progress">
  ${sectionHeading('Progress Bars', 'progress', 'Determinate progress indicators with color variants.')}

  ${specimen(
    'Variants',
    'progress-variants',
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
  `
  )}

  ${specimen(
    'Playground',
    'progress-playground',
    `
    <div class="playground p-4 rounded-xl" style="background: var(--surface-2)">
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
</div>`;
}
