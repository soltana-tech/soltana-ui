/** Dynamic components gallery — renders all registered components grouped by category. */

import { sectionHeading } from '../../utils/helpers';
import { getComponentsByCategory } from '../../lib/component-registry';
import { createDefaultState } from '../../lib/sandbox-state';

export function renderComponentsIndex(): HTMLElement {
  const groups = getComponentsByCategory();
  const defaultState = createDefaultState();

  const sectionsHtml = groups
    .map(({ category, entries }) => {
      const cardsHtml = entries
        .map((entry) => {
          const previewHtml = entry.renderPreview(defaultState);
          return `
            <div class="card card-hover rounded-xl border overflow-hidden" style="display: flex; flex-direction: column; height: 420px;">
              <h3 class="p-5 border-b border-subtle text-lg font-semibold" style="flex-shrink: 0;">${entry.name}</h3>
              <div class="flex items-center justify-center p-8 bg-surface" style="flex: 1; overflow: hidden;">
                ${previewHtml}
              </div>
              <a href="#/playground?component=${entry.id}" class="block p-3 text-center text-sm font-medium border-t border-subtle hover:bg-surface-1 transition-colors">
                Open in Playground →
              </a>
            </div>
          `;
        })
        .join('');

      return `
        <h2 class="text-2xl font-semibold mt-12 mb-6" id="cat-${category.toLowerCase().replace(/\s+/g, '-')}">${category}</h2>
        <div class="grid gap-8" style="grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));">
          ${cardsHtml}
        </div>
      `;
    })
    .join('');

  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-components-index">
  ${sectionHeading('Components', 'components', 'Live component gallery. Click any component to open it in the interactive playground.')}
  ${sectionsHtml}
</div>`;
  return page;
}
