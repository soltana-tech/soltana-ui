/** Cards component page — basic cards and ornamental card variants. */

import { sectionHeading, specimen } from '../../utils/helpers';

export function renderCards(): string {
  return `
<div class="page-cards">
  ${sectionHeading('Cards', 'cards', 'Card layouts, image cards, and ornamental card variants.')}

  ${specimen(
    'Basic Cards',
    'card-basic',
    `
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
      <div class="card card-hover">
        <div class="card-body">
          <h4 class="text-lg font-semibold mb-2">Simple Card</h4>
          <p class="text-secondary text-sm">A basic card with just a body. Hover to see the elevation effect.</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">Card Header</div>
        <div class="card-body">
          <p class="text-secondary text-sm">Card with header and footer sections for structured content layout.</p>
        </div>
        <div class="card-footer flex justify-end gap-2">
          <button class="btn btn-ghost btn-sm">Cancel</button>
          <button class="btn btn-primary btn-sm">Confirm</button>
        </div>
      </div>

      <div class="card card-hover">
        <div style="height: 140px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));" class="card-image"></div>
        <div class="card-body">
          <h4 class="text-lg font-semibold mb-1">Image Card</h4>
          <p class="text-secondary text-sm">Card with an image or gradient header area.</p>
        </div>
      </div>
    </div>
  `
  )}

  ${specimen(
    'Card Variants',
    'card-variants',
    `
    <p class="text-secondary mb-4">Cards with ornamental styling, gold borders, and multiple visual variants.</p>
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
      <div class="card">
        <div class="card-header">Default Card</div>
        <div class="card-body">
          <p>Neumorphic raised card with soft depth.</p>
        </div>
      </div>
      <div class="card ornament-baroque">
        <div class="card-header">Ornate Card</div>
        <div class="card-body">
          <p>Four corner ornaments for a classical frame.</p>
        </div>
      </div>
      <div class="card ornament-baroque">
        <div class="card-header">Baroque Card</div>
        <div class="card-body">
          <p>Full ornamental frame with medallion.</p>
        </div>
      </div>
      <div class="card relief-lifted">
        <div class="card-header">Lifted Card</div>
        <div class="card-body">
          <p>Material-style layered elevation shadows.</p>
        </div>
      </div>
    </div>
  `
  )}
</div>`;
}
