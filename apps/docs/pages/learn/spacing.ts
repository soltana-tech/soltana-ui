/** Design System — Spacing Scale page. */

import { sectionHeading, specimenBlock } from '../../utils/helpers';

export function renderSpacing(): string {
  return `
<div class="page-spacing">

  ${sectionHeading('Spacing Scale', 'spacing', 'Consistent spacing tokens for margins, padding, and gaps.')}

  ${specimenBlock(
    'Spacing Tokens',
    `
    <div class="space-y-3">
      ${[
        ['0', '0px'],
        ['1', '0.25rem (4px)'],
        ['2', '0.5rem (8px)'],
        ['3', '0.75rem (12px)'],
        ['4', '1rem (16px)'],
        ['6', '1.5rem (24px)'],
        ['8', '2rem (32px)'],
        ['12', '3rem (48px)'],
        ['16', '4rem (64px)'],
      ]
        .map(
          ([key, value]) => `
        <div class="flex items-center gap-4">
          <span class="tag" style="min-width: 2.5rem; justify-content: center;">${key}</span>
          <div class="h-4 rounded" style="width: calc(${key} * 0.25rem + 4px); background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));"></div>
          <span class="text-sm text-secondary">${value}</span>
        </div>
      `
        )
        .join('')}
    </div>
  `
  )}

</div>`;
}
