/** Buttons component page — variants, sizes, states, groups, and playground. */

import { sectionHeading, specimen } from '../../utils/helpers';

export function renderButtons(): string {
  return `
<div class="page-buttons">
  ${sectionHeading('Buttons', 'buttons', 'Button variants, sizes, states, and interactive playground.')}

  ${specimen(
    'Variants',
    'btn-variants',
    `
    <div class="flex flex-wrap gap-3 mb-6">
      <button class="btn btn-primary">Primary</button>
      <button class="btn btn-secondary">Secondary</button>
      <button class="btn btn-ghost">Ghost</button>
      <button class="btn btn-outline">Outline</button>
      <button class="btn btn-danger">Danger</button>
      <button class="btn btn-success">Success</button>
    </div>
  `
  )}

  ${specimen(
    'Sizes',
    'btn-sizes',
    `
    <div class="flex flex-wrap gap-3 items-center mb-6">
      <button class="btn btn-primary btn-xs">Extra Small</button>
      <button class="btn btn-primary btn-sm">Small</button>
      <button class="btn btn-primary">Default</button>
      <button class="btn btn-primary btn-lg">Large</button>
      <button class="btn btn-primary btn-xl">Extra Large</button>
    </div>
  `
  )}

  ${specimen(
    'States',
    'btn-states',
    `
    <div class="flex flex-wrap gap-3 items-center mb-6">
      <button class="btn btn-primary">Normal</button>
      <button class="btn btn-primary" disabled>Disabled</button>
    </div>
  `
  )}

  ${specimen(
    'Button Group',
    'btn-group',
    `
    <div class="btn-group">
      <button class="btn btn-outline">Left</button>
      <button class="btn btn-outline">Center</button>
      <button class="btn btn-outline">Right</button>
    </div>
  `
  )}

  ${specimen(
    'Playground',
    'btn-playground',
    `
    <div class="playground p-4 rounded-xl" style="background: var(--surface-2)">
      <p class="text-sm font-semibold mb-3">Playground</p>
      <div class="flex flex-wrap gap-4 items-end mb-4">
        <div class="input-group">
          <label class="input-label">Variant</label>
          <select class="select input-sm" data-class-swap data-target="#playground-btn" id="btn-variant-select">
            <option value="btn-primary">Primary</option>
            <option value="btn-secondary">Secondary</option>
            <option value="btn-ghost">Ghost</option>
            <option value="btn-outline">Outline</option>
            <option value="btn-danger">Danger</option>
            <option value="btn-success">Success</option>
          </select>
        </div>
        <div class="input-group">
          <label class="input-label">Size</label>
          <select class="select input-sm" data-class-swap data-target="#playground-btn" id="btn-size-select">
            <option value="">Default</option>
            <option value="btn-xs">Extra Small</option>
            <option value="btn-sm">Small</option>
            <option value="btn-lg">Large</option>
            <option value="btn-xl">Extra Large</option>
          </select>
        </div>
      </div>
      <div class="p-6 rounded-lg flex items-center justify-center" style="background: var(--surface-bg)">
        <button class="btn btn-primary" id="playground-btn">Button Preview</button>
      </div>
    </div>
  `
  )}

  ${specimen(
    'Extended Buttons',
    'btn-extended',
    `
    <p class="text-secondary mb-4">Button with relief-aware styling.</p>

    <h4 class="text-lg font-semibold mt-4 mb-3">Standard Variants</h4>
    <div class="flex flex-wrap gap-4 items-center mb-6">
      <button class="btn btn-primary">Primary</button>
      <button class="btn btn-secondary">Secondary</button>
      <button class="btn btn-outline">Outline</button>
      <button class="btn btn-ghost">Ghost</button>
      <button class="btn btn-danger">Danger</button>
      <button class="btn btn-success">Success</button>
    </div>

    <h4 class="text-lg font-semibold mt-4 mb-3">Relief Variants</h4>
    <div class="flex flex-wrap gap-4 items-center mb-6">
      <button class="btn btn-primary relief-neu">Neu</button>
      <button class="btn btn-primary relief-lifted">Lifted</button>
      <button class="btn btn-primary relief-sharp">Sharp</button>
      <button class="btn btn-primary relief-hewn">Hewn</button>
    </div>

    <h4 class="text-lg font-semibold mt-4 mb-3">Ornament Variants</h4>
    <div class="flex flex-wrap gap-4 items-center">
      <button class="btn ornament-beveled">Beveled</button>
      <button class="btn ornament-baroque">Baroque</button>
      <button class="btn ornament-faceted">Faceted</button>
      <button class="btn btn-primary" style="border-radius: 50%; width: 40px; height: 40px; padding: 0;">M</button>
    </div>
  `
  )}

  <div class="mt-10 pt-6" style="border-top: 1px solid var(--border-subtle)">
    <a href="#/playground?component=buttons" class="btn btn-primary">Open in Playground</a>
  </div>
</div>`;
}
