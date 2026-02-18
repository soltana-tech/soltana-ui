/** Design System — Index/overview page with links to each sub-section. */

import { sectionHeading } from '../../utils/helpers';

export function renderDesignSystemIndex(): string {
  return `
<div class="page-design-system-index">
  ${sectionHeading('Design System', 'design-system', 'Colors, typography, reliefs, finishes, and ornamental details.')}
  <div class="grid gap-4 mt-6" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
    <a href="#/learn/recipes" class="card card-hover p-4">
      <h3 class="font-semibold">Recipes</h3>
      <p class="text-sm text-secondary mt-1">Named tier presets</p>
    </a>
    <a href="#/learn/colors" class="card card-hover p-4">
      <h3 class="font-semibold">Colors</h3>
      <p class="text-sm text-secondary mt-1">Gold palette and tokens</p>
    </a>
    <a href="#/learn/typography" class="card card-hover p-4">
      <h3 class="font-semibold">Typography</h3>
      <p class="text-sm text-secondary mt-1">Type scale and font families</p>
    </a>
    <a href="#/learn/reliefs" class="card card-hover p-4">
      <h3 class="font-semibold">Reliefs</h3>
      <p class="text-sm text-secondary mt-1">Six shadow models</p>
    </a>
    <a href="#/learn/finishes" class="card card-hover p-4">
      <h3 class="font-semibold">Finishes</h3>
      <p class="text-sm text-secondary mt-1">Surface treatments</p>
    </a>
    <a href="#/learn/ornaments" class="card card-hover p-4">
      <h3 class="font-semibold">Ornaments</h3>
      <p class="text-sm text-secondary mt-1">Structural embellishments</p>
    </a>
    <a href="#/learn/composition" class="card card-hover p-4">
      <h3 class="font-semibold">Composition</h3>
      <p class="text-sm text-secondary mt-1">Per-element tier overrides</p>
    </a>
    <a href="#/learn/spacing" class="card card-hover p-4">
      <h3 class="font-semibold">Spacing</h3>
      <p class="text-sm text-secondary mt-1">Spacing scale and tokens</p>
    </a>
  </div>
</div>`;
}
