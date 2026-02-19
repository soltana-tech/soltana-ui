/** Dynamic components gallery — renders all registered components as live previews. */

import { sectionHeading } from '../../utils/helpers';
import { getAllComponents } from '../../lib/component-registry';
import { createDefaultState } from '../../lib/sandbox-state';

export function renderComponentsIndex(): string {
  const components = getAllComponents();
  const defaultState = createDefaultState();

  const componentsHtml = components
    .map((entry) => {
      const previewHtml = entry.renderPreview(defaultState);
      return `
        <div class="card card-hover rounded-xl border overflow-hidden" style="display: flex; flex-direction: column;">
          <h3 class="p-5 border-b border-subtle text-lg font-semibold">${entry.name}</h3>
          <div class="flex items-center justify-center p-8 bg-surface" style="min-height: 280px; flex: 1;">
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
<div class="page-components-index">
  ${sectionHeading('Components', 'components', 'Live component gallery. Click any component to open it in the interactive playground.')}
  <div class="grid gap-8 mt-8" style="grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));">
    ${componentsHtml}
  </div>
</div>`;
}
