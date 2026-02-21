/** Dynamic components gallery — renders all registered components grouped by category. */

import { sectionHeading } from '../../lib/helpers';
import { getComponentsByCategory } from '../../lib/component-registry';
import { createDefaultState } from '../../lib/sandbox-state';

export function renderComponentsIndex(): HTMLElement {
  const groups = getComponentsByCategory();
  const defaultState = createDefaultState();

  const galleryItems = groups
    .map(({ category, entries }) => {
      const heading = `<h2 class="gallery-grid__heading col-span-full text-2xl font-semibold" id="cat-${category.toLowerCase().replace(/\s+/g, '-')}">${category}</h2>`;
      const cards = entries
        .map((entry) => {
          const previewHtml = entry.renderPreview(defaultState);
          return `
            <div class="gallery-card card card-hover rounded-xl border overflow-hidden">
              <h3 class="gallery-card__header p-5 border-b border-subtle text-lg font-semibold">${entry.name}</h3>
              <div class="gallery-card__preview bg-surface">
                ${previewHtml}
              </div>
              <a href="#/playground?component=${entry.id}" class="gallery-card__footer block p-3 text-center text-sm font-medium border-t border-subtle hover:bg-surface-1 transition-colors">
                Open in Playground →
              </a>
            </div>`;
        })
        .join('');
      return heading + cards;
    })
    .join('');

  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-components-index">
  ${sectionHeading('Components', 'components', 'Live component gallery. Click any component to open it in the interactive playground.')}
  <div class="callout callout-info mb-6">
    <div class="callout-content text-sm">
      For a machine-readable reference of all components, utility classes, and design tokens, see <code>.claude/agents/reference.yaml</code> in the repository.
    </div>
  </div>
  <div class="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    ${galleryItems}
  </div>
</div>`;
  return page;
}
