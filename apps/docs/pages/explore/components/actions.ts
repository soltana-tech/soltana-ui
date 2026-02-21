/** Actions component reference — buttons, close buttons, and floating action buttons. */

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

export function renderActionsRef(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-actions-reference">

  ${sectionHeading('Actions', 'actions', 'Buttons, close buttons, and floating action buttons for user interaction.')}

  ${quickNavFromLabels(['Buttons', 'Close Button', 'FAB'], 'actions-')}

  ${sectionDivider()}

  ${sectionHeading('Buttons', 'actions-buttons', 'Base button uses --relief-* variables for automatic relief switching. Semantic variants override as needed.')}

  ${classTable([
    ['.btn', 'Base button'],
    ['.btn-primary', 'Primary action variant'],
    ['.btn-secondary', 'Secondary action variant'],
    ['.btn-ghost', 'Ghost variant (transparent background)'],
    ['.btn-outline', 'Outline variant (border only)'],
    ['.btn-danger', 'Danger/destructive variant'],
    ['.btn-success', 'Success/confirmation variant'],
    ['.btn-xs', 'Extra-small size modifier'],
    ['.btn-sm', 'Small size modifier'],
    ['.btn-lg', 'Large size modifier'],
    ['.btn-icon', 'Icon-only child element'],
    ['.btn-group', 'Groups adjacent buttons with shared borders'],
  ])}

  ${specimen(
    'Variants',
    'actions-button-variants',
    `
    <div class="flex flex-wrap gap-3 mb-4">
      <button class="btn btn-primary">Primary</button>
      <button class="btn btn-secondary">Secondary</button>
      <button class="btn btn-ghost">Ghost</button>
      <button class="btn btn-outline">Outline</button>
      <button class="btn btn-danger">Danger</button>
      <button class="btn btn-success">Success</button>
    </div>`,
    `<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-success">Success</button>`
  )}

  ${specimen(
    'Sizes',
    'actions-button-sizes',
    `
    <div class="flex flex-wrap gap-3 items-center">
      <button class="btn btn-primary btn-xs">Extra Small</button>
      <button class="btn btn-primary btn-sm">Small</button>
      <button class="btn btn-primary">Default</button>
      <button class="btn btn-primary btn-lg">Large</button>
    </div>`,
    `<button class="btn btn-primary btn-xs">Extra Small</button>
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-lg">Large</button>`
  )}

  ${specimen(
    'Button Group',
    'actions-button-group',
    `
    <div class="btn-group">
      <button class="btn btn-outline">Left</button>
      <button class="btn btn-outline">Center</button>
      <button class="btn btn-outline">Right</button>
    </div>`,
    `<div class="btn-group">
  <button class="btn btn-outline">Left</button>
  <button class="btn btn-outline">Center</button>
  <button class="btn btn-outline">Right</button>
</div>`
  )}

  ${codeExample(`<!-- Disabled state -->
<button class="btn btn-primary" disabled>Disabled</button>

<!-- With icon -->
<button class="btn btn-primary">
  <span class="btn-icon">+</span> Add Item
</button>`)}

  ${sectionDivider()}

  ${sectionHeading('Close Button', 'actions-close-button', 'Reusable dismiss trigger for alerts, toasts, drawers, and modals. X rendered via ::before/::after rotated lines (no icon dependency).')}

  ${classTable([
    ['.close', 'Base close button'],
    ['.close-sm', 'Small size modifier'],
    ['.close-lg', 'Large size modifier'],
  ])}

  ${specimen(
    'Sizes',
    'actions-close-sizes',
    `
    <div class="flex flex-wrap gap-6 items-center">
      <button class="close close-sm"></button>
      <button class="close"></button>
      <button class="close close-lg"></button>
    </div>`,
    `<button class="close close-sm"></button>
<button class="close"></button>
<button class="close close-lg"></button>`
  )}

  ${codeExample(`<!-- Inside a dismissible alert -->
<div class="alert alert-warning alert-dismissible">
  Please review before continuing.
  <button class="close" aria-label="Close"></button>
</div>`)}

  ${sectionDivider()}

  ${sectionHeading('FAB', 'actions-fab', 'Fixed-position circular action triggers.')}

  ${classTable([
    ['.fab', 'Base floating action button'],
    ['.fab-sm', 'Small size modifier'],
    ['.fab-lg', 'Large size modifier'],
    ['.fab-bottom-right', 'Position: fixed bottom-right'],
    ['.fab-bottom-left', 'Position: fixed bottom-left'],
  ])}

  ${specimen(
    'Sizes',
    'actions-fab-sizes',
    `
    <div class="flex flex-wrap gap-6 items-end">
      <button class="fab fab-sm" style="position: static;">+</button>
      <button class="fab" style="position: static;">+</button>
      <button class="fab fab-lg" style="position: static;">+</button>
    </div>`,
    `<button class="fab fab-sm">+</button>
<button class="fab">+</button>
<button class="fab fab-lg">+</button>`
  )}

  ${codeExample(`<!-- Fixed-position FAB -->
<button class="fab fab-bottom-right">+</button>

<!-- Fixed bottom-left -->
<button class="fab fab-bottom-left">+</button>`)}

</div>`;
  return page;
}
