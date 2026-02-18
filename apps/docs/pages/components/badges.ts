/** Badges & Tags component page — badge variants, pills, and tags. */

import { sectionHeading, specimen } from '../../utils/helpers';

export function renderBadges(): string {
  return `
<div class="page-badges">
  ${sectionHeading('Badges & Tags', 'badges', 'Status badges, pills, and content tags.')}

  ${specimen(
    'Badges',
    'badge-variants',
    `
    <div class="flex flex-wrap gap-3 mb-6">
      <span class="badge">Default</span>
      <span class="badge badge-primary">Primary</span>
      <span class="badge badge-success">Success</span>
      <span class="badge badge-warning">Warning</span>
      <span class="badge badge-error">Error</span>
      <span class="badge badge-info">Info</span>
    </div>
  `
  )}

  ${specimen(
    'Pills',
    'badge-pills',
    `
    <div class="flex flex-wrap gap-3 mb-6">
      <span class="badge badge-pill">Default</span>
      <span class="badge badge-pill badge-primary">Primary</span>
      <span class="badge badge-pill badge-success">Success</span>
      <span class="badge badge-pill badge-warning">Warning</span>
      <span class="badge badge-pill badge-error">Error</span>
      <span class="badge badge-pill badge-info">Info</span>
    </div>
  `
  )}

  ${specimen(
    'Tags',
    'badge-tags',
    `
    <div class="flex flex-wrap gap-2 mb-6">
      <span class="tag">TypeScript</span>
      <span class="tag">Design System</span>
      <span class="tag">SCSS</span>
      <span class="tag">Vite</span>
    </div>
  `
  )}
</div>`;
}
