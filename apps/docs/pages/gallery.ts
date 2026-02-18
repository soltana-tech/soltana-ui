/** Gallery — Recipe showcase with live previews and sandbox links. */

import { sectionHeading } from '../utils/helpers';
import { RECIPES } from '@soltana/config';
import type { RecipeName } from '@soltana/config';

function galleryCard(key: RecipeName): string {
  const recipe = RECIPES[key];
  const tierClasses = [
    `theme-${recipe.theme}`,
    `relief-${recipe.relief}`,
    `finish-${recipe.finish}`,
    recipe.ornament !== 'none' ? `ornament-${recipe.ornament}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const sandboxUrl = `#/components/buttons?theme=${recipe.theme}&relief=${recipe.relief}&finish=${recipe.finish}&ornament=${recipe.ornament}`;

  return `
    <div class="gallery-card ${tierClasses}">
      <div class="gallery-card__header">
        <h3 class="font-semibold text-lg">${recipe.name}</h3>
        <p class="text-sm text-secondary mt-1">${recipe.description}</p>
      </div>
      <div class="gallery-card__preview">
        <div class="flex flex-wrap gap-2 mb-3">
          <button class="btn btn-primary btn-sm">Primary</button>
          <button class="btn btn-secondary btn-sm">Secondary</button>
        </div>
        <div class="flex flex-wrap gap-2 mb-3">
          <span class="badge badge-primary">Badge</span>
          <span class="tag">Tag</span>
          <span class="badge badge-pill">Pill</span>
        </div>
        <div class="card p-3">
          <p class="text-sm text-secondary">Card preview with <code>${recipe.relief}</code> relief and <code>${recipe.finish}</code> finish.</p>
        </div>
      </div>
      <div class="gallery-card__footer">
        <span class="text-xs text-tertiary">${recipe.theme} / ${recipe.relief} / ${recipe.finish} / ${recipe.ornament}</span>
        <a href="${sandboxUrl}" class="btn btn-sm btn-primary">Try in Sandbox</a>
      </div>
    </div>`;
}

export function renderGallery(): string {
  const keys = Object.keys(RECIPES) as RecipeName[];

  return `
<div class="page-gallery">
  ${sectionHeading('Gallery', 'gallery', "Browse curated recipe combinations. Each card renders live components in the recipe's tier configuration.")}

  <div class="gallery-grid mt-8">
    ${keys.map((key) => galleryCard(key)).join('')}
  </div>
</div>`;
}
