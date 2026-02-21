/** Feedback component reference — alerts, progress bars, results, skeletons, and spinners. */

import {
  sectionHeading,
  specimen,
  codeExample,
  quickNavFromLabels,
  sectionDivider,
} from '../../../lib/helpers';

function classTable(rows: [string, string][]): string {
  return `
    <div class="table-responsive">
      <table class="table table-compact">
        <thead><tr><th>Class</th><th>Description</th></tr></thead>
        <tbody>
          ${rows.map(([cls, desc]) => `<tr><td><code>${cls}</code></td><td>${desc}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

export function renderFeedbackRef(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-feedback-reference">

  ${sectionHeading('Feedback', 'feedback', 'Status indicators, loading states, and outcome displays.')}

  ${quickNavFromLabels(['Alerts', 'Progress Bars', 'Results', 'Skeletons', 'Spinners'], 'feedback-')}

  ${sectionDivider()}

  ${sectionHeading('Alerts', 'feedback-alerts', 'Contextual messages for success, warning, error, and informational states.')}

  ${classTable([
    ['.alert', 'Base alert container'],
    ['.alert-success', 'Success variant (green)'],
    ['.alert-warning', 'Warning variant (amber)'],
    ['.alert-error', 'Error variant (red)'],
    ['.alert-info', 'Informational variant (blue)'],
    ['.alert-dismissible', 'Adds close button support'],
  ])}

  ${specimen(
    'Alert Variants',
    'feedback-alert-variants',
    `
    <div class="flex flex-col gap-3">
      <div class="alert alert-success">Operation completed successfully.</div>
      <div class="alert alert-warning">Please review before continuing.</div>
      <div class="alert alert-error">Something went wrong.</div>
      <div class="alert alert-info">Here is some useful information.</div>
    </div>`,
    `<div class="alert alert-success">Operation completed successfully.</div>
<div class="alert alert-warning">Please review before continuing.</div>
<div class="alert alert-error">Something went wrong.</div>
<div class="alert alert-info">Here is some useful information.</div>`
  )}

  ${codeExample(`<!-- Dismissible alert -->
<div class="alert alert-warning alert-dismissible">
  Please review before continuing.
  <button class="btn-close" aria-label="Close"></button>
</div>`)}

  ${sectionDivider()}

  ${sectionHeading('Progress Bars', 'feedback-progress-bars', 'Linear and radial progress indicators.')}

  ${classTable([
    ['.progress', 'Base progress bar container'],
    ['.progress-bar', 'Inner fill element (set width via inline style)'],
    ['.progress-success', 'Success variant (green)'],
    ['.progress-warning', 'Warning variant (amber)'],
    ['.progress-error', 'Error variant (red)'],
    ['.radial-progress', 'Radial (circular) progress indicator'],
    ['.radial-progress-sm', 'Small radial variant'],
    ['.radial-progress-lg', 'Large radial variant'],
  ])}

  ${specimen(
    'Linear Progress',
    'feedback-linear-progress',
    `
    <div class="flex flex-col gap-4">
      <div class="progress"><div class="progress-bar" style="width: 45%"></div></div>
      <div class="progress progress-success"><div class="progress-bar" style="width: 80%"></div></div>
      <div class="progress progress-warning"><div class="progress-bar" style="width: 55%"></div></div>
      <div class="progress progress-error"><div class="progress-bar" style="width: 30%"></div></div>
    </div>`,
    `<div class="progress"><div class="progress-bar" style="width: 45%"></div></div>
<div class="progress progress-success"><div class="progress-bar" style="width: 80%"></div></div>
<div class="progress progress-warning"><div class="progress-bar" style="width: 55%"></div></div>
<div class="progress progress-error"><div class="progress-bar" style="width: 30%"></div></div>`
  )}

  ${specimen(
    'Radial Progress',
    'feedback-radial-progress',
    `
    <div class="flex items-center gap-6">
      <div class="radial-progress radial-progress-sm" style="--progress: 40%"></div>
      <div class="radial-progress" style="--progress: 65%"></div>
      <div class="radial-progress radial-progress-lg" style="--progress: 85%"></div>
    </div>`,
    `<div class="radial-progress radial-progress-sm" style="--progress: 40%"></div>
<div class="radial-progress" style="--progress: 65%"></div>
<div class="radial-progress radial-progress-lg" style="--progress: 85%"></div>`
  )}

  ${sectionDivider()}

  ${sectionHeading('Results', 'feedback-results', 'Outcome displays for completed actions or terminal states.')}

  ${classTable([
    ['.result', 'Base result container'],
    ['.result-success', 'Success outcome variant'],
    ['.result-error', 'Error outcome variant'],
    ['.result-icon', 'Icon area'],
    ['.result-title', 'Primary heading'],
    ['.result-subtitle', 'Secondary description'],
    ['.result-actions', 'Action button container'],
  ])}

  ${specimen(
    'Result States',
    'feedback-result-states',
    `
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))">
      <div class="result result-success">
        <div class="result-title">Payment Successful</div>
        <div class="result-subtitle">Your transaction has been processed.</div>
        <div class="result-actions"><button class="btn btn-primary btn-sm">View Receipt</button></div>
      </div>
      <div class="result result-error">
        <div class="result-title">Submission Failed</div>
        <div class="result-subtitle">Please check the form and try again.</div>
        <div class="result-actions"><button class="btn btn-primary btn-sm">Retry</button></div>
      </div>
    </div>`,
    `<div class="result result-success">
  <div class="result-title">Payment Successful</div>
  <div class="result-subtitle">Your transaction has been processed.</div>
  <div class="result-actions"><button class="btn btn-primary btn-sm">View Receipt</button></div>
</div>

<div class="result result-error">
  <div class="result-title">Submission Failed</div>
  <div class="result-subtitle">Please check the form and try again.</div>
  <div class="result-actions"><button class="btn btn-primary btn-sm">Retry</button></div>
</div>`
  )}

  ${sectionDivider()}

  ${sectionHeading('Skeletons', 'feedback-skeletons', 'Animated loading placeholders for content that has not yet loaded.')}

  ${classTable([
    ['.skeleton', 'Base skeleton placeholder (block)'],
    ['.skeleton-text', 'Text-line shaped skeleton'],
    ['.skeleton-circle', 'Circular skeleton (avatars, icons)'],
  ])}

  ${specimen(
    'Skeleton Variants',
    'feedback-skeleton-variants',
    `
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <div class="skeleton skeleton-circle" style="width: 2.5rem; height: 2.5rem;"></div>
        <div class="flex flex-col gap-2 flex-1">
          <div class="skeleton skeleton-text" style="width: 60%; height: 0.75rem;"></div>
          <div class="skeleton skeleton-text" style="width: 40%; height: 0.75rem;"></div>
        </div>
      </div>
      <div class="skeleton" style="width: 100%; height: 6rem; border-radius: var(--radius-md);"></div>
      <div class="skeleton skeleton-text" style="width: 80%; height: 0.75rem;"></div>
      <div class="skeleton skeleton-text" style="width: 50%; height: 0.75rem;"></div>
    </div>`,
    `<div class="skeleton skeleton-circle" style="width: 2.5rem; height: 2.5rem;"></div>
<div class="skeleton skeleton-text" style="width: 60%; height: 0.75rem;"></div>
<div class="skeleton" style="width: 100%; height: 6rem; border-radius: var(--radius-md);"></div>`
  )}

  ${sectionDivider()}

  ${sectionHeading('Spinners', 'feedback-spinners', 'Loading indicators for asynchronous operations.')}

  ${classTable([
    ['.spinner', 'Base spinner (ring style)'],
    ['.spinner-sm', 'Small spinner'],
    ['.spinner-lg', 'Large spinner'],
    ['.spinner-dots', 'Dot-style loader (requires <code>&lt;span&gt;&lt;/span&gt;</code> child)'],
  ])}

  ${specimen(
    'Spinner Sizes',
    'feedback-spinner-sizes',
    `
    <div class="flex items-center gap-6">
      <div class="spinner spinner-sm"></div>
      <div class="spinner"></div>
      <div class="spinner spinner-lg"></div>
    </div>`,
    `<div class="spinner spinner-sm"></div>
<div class="spinner"></div>
<div class="spinner spinner-lg"></div>`
  )}

  ${specimen(
    'Dot Spinner',
    'feedback-spinner-dots',
    `
    <div class="spinner-dots"><span></span></div>`,
    `<div class="spinner-dots"><span></span></div>`
  )}

</div>`;
  return page;
}
