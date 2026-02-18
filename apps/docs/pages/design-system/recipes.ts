/** Design System — Recipes page. */

import { sectionHeading, specimenBlock, codeExample } from '../../utils/helpers';
import { RECIPES } from '@soltana/config';
import type { RecipeName } from '@soltana/config';

function recipeCard(key: RecipeName): string {
  const recipe = RECIPES[key];
  const tierClasses = [
    `theme-${recipe.theme}`,
    `relief-${recipe.relief}`,
    `finish-${recipe.finish}`,
    recipe.ornament !== 'none' ? `ornament-${recipe.ornament}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `
    <div class="${tierClasses} card p-6 rounded-xl" style="min-height: 180px;">
      <span class="tag mb-2">${recipe.name}</span>
      <p class="text-sm text-secondary mt-2">${recipe.description}</p>
      <div class="flex flex-wrap gap-2 mt-3">
        <button class="btn btn-primary btn-sm">Primary</button>
        <button class="btn btn-secondary btn-sm">Secondary</button>
        <span class="badge badge-primary">Badge</span>
      </div>
      <div class="text-xs text-tertiary mt-3">
        ${recipe.theme} / ${recipe.relief} / ${recipe.finish} / ${recipe.ornament}
      </div>
    </div>`;
}

export function renderRecipes(): string {
  return `
<div class="page-recipes">

  ${sectionHeading('Recipes', 'recipes', 'Named presets of proven tier combinations. Apply a recipe as a starting point, then customize individual tiers.')}

  <div class="grid gap-6 mt-8" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
    ${(Object.keys(RECIPES) as RecipeName[]).map((key) => recipeCard(key)).join('')}
  </div>

  ${specimenBlock(
    'Using Recipes',
    `
    <p class="text-sm text-secondary mb-4">Recipes set all four tiers at once via the <code>applyRecipe()</code> API. They are starting points — individual tiers can be changed afterward.</p>
    ${codeExample("import { initSoltana } from 'soltana-ui';\n\nconst soltana = initSoltana();\n\n// Apply a recipe\nsoltana.applyRecipe('luxury-dark');\n\n// Customize individual tiers afterward\nsoltana.setFinish('frosted');", 'javascript')}
    ${codeExample("import { RECIPES } from 'soltana-ui';\n\n// Inspect available recipes\nfor (const [key, recipe] of Object.entries(RECIPES)) {\n  console.log(key, recipe.name, recipe.description);\n}", 'javascript')}
  `
  )}

</div>`;
}
