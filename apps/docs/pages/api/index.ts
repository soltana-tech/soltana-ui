/** API Reference — Index page with categorized links to each API section. */

import { sectionHeading } from '../../utils/helpers';

export function renderApiIndex(): string {
  return `
<div class="page-api-index">
  ${sectionHeading('API Reference', 'api', 'Complete reference for the Soltana UI JavaScript API.')}
  <div class="grid gap-4 mt-6" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
    <a href="#/api/init" class="card card-hover p-4">
      <h3 class="font-semibold">Initialization</h3>
      <p class="text-sm text-secondary mt-1"><code>initSoltana()</code> and configuration options</p>
    </a>
    <a href="#/api/state" class="card card-hover p-4">
      <h3 class="font-semibold">State</h3>
      <p class="text-sm text-secondary mt-1"><code>getState()</code>, tier setters, <code>reset()</code></p>
    </a>
    <a href="#/api/recipes" class="card card-hover p-4">
      <h3 class="font-semibold">Recipes</h3>
      <p class="text-sm text-secondary mt-1"><code>applyRecipe()</code> and recipe registry</p>
    </a>
    <a href="#/api/registration" class="card card-hover p-4">
      <h3 class="font-semibold">Tier Registration</h3>
      <p class="text-sm text-secondary mt-1">Runtime theme, relief, finish registration</p>
    </a>
    <a href="#/api/enhancers" class="card card-hover p-4">
      <h3 class="font-semibold">Enhancers</h3>
      <p class="text-sm text-secondary mt-1"><code>initAll()</code>, modals, tabs, tooltips</p>
    </a>
    <a href="#/api/svg-patterns" class="card card-hover p-4">
      <h3 class="font-semibold">SVG Patterns</h3>
      <p class="text-sm text-secondary mt-1"><code>patterns</code>, <code>toDataUri()</code>, <code>toElement()</code></p>
    </a>
    <a href="#/api/fonts" class="card card-hover p-4">
      <h3 class="font-semibold">Font Loading</h3>
      <p class="text-sm text-secondary mt-1"><code>loadSoltanaFonts()</code></p>
    </a>
    <a href="#/api/overrides" class="card card-hover p-4">
      <h3 class="font-semibold">Overrides</h3>
      <p class="text-sm text-secondary mt-1"><code>setOverrides()</code>, <code>removeOverrides()</code></p>
    </a>
  </div>
</div>`;
}
