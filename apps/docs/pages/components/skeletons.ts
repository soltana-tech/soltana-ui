/** Skeletons component page — loading placeholder patterns. */

import { sectionHeading, specimen } from '../../utils/helpers';

export function renderSkeletons(): string {
  return `
<div class="page-skeletons">
  ${sectionHeading('Skeletons', 'skeletons', 'Animated loading placeholders for content-heavy layouts.')}

  ${specimen(
    'Card Skeleton',
    'skeleton-card',
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
</div>`;
}
