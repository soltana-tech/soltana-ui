/** Alerts component page — success, warning, error, and info alerts. */

import { sectionHeading, specimen } from '../../utils/helpers';

export function renderAlerts(): string {
  return `
<div class="page-alerts">
  ${sectionHeading('Alerts', 'alerts', 'Contextual feedback messages for user actions.')}

  ${specimen(
    'Alert Variants',
    'alert-variants',
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
</div>`;
}
