/** Playground page — mounts CentralPlayground with full tier controls. */

import { CentralPlayground } from '../components/CentralPlayground';

export function renderPlayground(): HTMLElement {
  const page = document.createElement('div');
  page.className = 'page-playground';

  const header = document.createElement('div');
  header.innerHTML = `
    <div class="section-heading" id="playground">
      <h2 class="text-3xl font-bold">Playground</h2>
      <p class="text-secondary mt-2">
        Interactive sandbox with full tier controls. Select a component, tweak theme,
        relief, finish, and ornament, then copy the generated HTML or share the URL.
      </p>
    </div>
    <div class="section-divider"></div>
  `;
  page.appendChild(header);

  const playground = new CentralPlayground();
  page.appendChild(playground.getElement());

  return page;
}
