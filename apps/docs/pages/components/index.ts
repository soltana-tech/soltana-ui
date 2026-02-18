/** Components index page — overview with links to individual component pages. */

import { sectionHeading } from '../../utils/helpers';

export function renderComponentsIndex(): string {
  return `
<div class="page-components-index">
  ${sectionHeading('Components', 'components', 'Estate-styled atoms and molecules for composing interfaces.')}
  <div class="grid gap-4 mt-6" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
    <a href="#/components/buttons" class="card card-hover p-4">
      <h3 class="font-semibold">Buttons</h3>
      <p class="text-sm text-secondary mt-1">Variants, sizes, states, groups</p>
    </a>
    <a href="#/components/inputs" class="card card-hover p-4">
      <h3 class="font-semibold">Inputs</h3>
      <p class="text-sm text-secondary mt-1">Text fields, selects, checkboxes</p>
    </a>
    <a href="#/components/cards" class="card card-hover p-4">
      <h3 class="font-semibold">Cards</h3>
      <p class="text-sm text-secondary mt-1">Layouts, image cards, ornamental variants</p>
    </a>
    <a href="#/components/badges" class="card card-hover p-4">
      <h3 class="font-semibold">Badges & Tags</h3>
      <p class="text-sm text-secondary mt-1">Status badges, pills, content tags</p>
    </a>
    <a href="#/components/alerts" class="card card-hover p-4">
      <h3 class="font-semibold">Alerts</h3>
      <p class="text-sm text-secondary mt-1">Success, warning, error, info</p>
    </a>
    <a href="#/components/avatars" class="card card-hover p-4">
      <h3 class="font-semibold">Avatars</h3>
      <p class="text-sm text-secondary mt-1">Sizes and accent colors</p>
    </a>
    <a href="#/components/progress" class="card card-hover p-4">
      <h3 class="font-semibold">Progress Bars</h3>
      <p class="text-sm text-secondary mt-1">Determinate indicators, color variants</p>
    </a>
    <a href="#/components/toggles" class="card card-hover p-4">
      <h3 class="font-semibold">Toggles</h3>
      <p class="text-sm text-secondary mt-1">Switch-style boolean controls</p>
    </a>
    <a href="#/components/tooltips" class="card card-hover p-4">
      <h3 class="font-semibold">Tooltips</h3>
      <p class="text-sm text-secondary mt-1">Hover-triggered contextual hints</p>
    </a>
    <a href="#/components/tables" class="card card-hover p-4">
      <h3 class="font-semibold">Tables</h3>
      <p class="text-sm text-secondary mt-1">Striped data tables with actions</p>
    </a>
    <a href="#/components/modals" class="card card-hover p-4">
      <h3 class="font-semibold">Modals</h3>
      <p class="text-sm text-secondary mt-1">Dialog overlays with triggers</p>
    </a>
    <a href="#/components/skeletons" class="card card-hover p-4">
      <h3 class="font-semibold">Skeletons</h3>
      <p class="text-sm text-secondary mt-1">Animated loading placeholders</p>
    </a>
    <a href="#/components/relief-demo" class="card card-hover p-4">
      <h3 class="font-semibold">Relief Demo</h3>
      <p class="text-sm text-secondary mt-1">Per-relief context and hewn components</p>
    </a>
  </div>
</div>`;
}
