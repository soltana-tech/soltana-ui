/** Dynamic components gallery — renders all registered components grouped by category. */

import { sectionHeading } from '../../utils/helpers';
import { getAllComponents } from '../../lib/component-registry';
import { createDefaultState } from '../../lib/sandbox-state';

const CATEGORY_ORDER = ['General', 'Navigation', 'Data Entry', 'Data Display', 'Feedback'];

export function renderComponentsIndex(): HTMLElement {
  const components = getAllComponents();
  const defaultState = createDefaultState();

  const grouped = new Map<string, typeof components>();
  for (const entry of components) {
    const cat = entry.category ?? 'Uncategorized';
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(entry);
  }

  // Sort alphabetically within each category
  for (const entries of grouped.values()) {
    entries.sort((a, b) => a.name.localeCompare(b.name));
  }

  const sectionsHtml = CATEGORY_ORDER.filter((cat) => grouped.has(cat))
    .map((cat) => {
      const entries = grouped.get(cat)!;
      const cardsHtml = entries
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
        <h2 class="text-2xl font-semibold mt-12 mb-6" id="cat-${cat.toLowerCase().replace(/\s+/g, '-')}">${cat}</h2>
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
