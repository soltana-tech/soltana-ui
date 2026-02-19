/** Design System — Reliefs page. */

import { sectionHeading, specimenBlock, codeExample } from '../../utils/helpers';

export function renderReliefs(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-reliefs">

  ${sectionHeading('Reliefs', 'reliefs', 'Four design paradigms that fundamentally transform how every component renders. Use the <a href="#/playground">Playground</a> to preview interactively.')}

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
    <div class="relief-flat p-6 rounded-xl" style="min-height: 200px;">
      <span class="tag mb-3">.relief-flat</span>
      <p class="text-sm text-secondary mb-4 mt-3">Zero depth, clean, modern. No shadows — just borders. The minimalist baseline.</p>
      <div class="flex flex-wrap gap-2">
        <button class="btn btn-primary btn-sm">Primary</button>
        <button class="btn btn-secondary btn-sm">Secondary</button>
        <button class="btn btn-ghost btn-sm">Ghost</button>
      </div>
      <div class="flex gap-2 mt-3">
        <span class="badge badge-primary">Badge</span>
        <span class="tag">Tag</span>
      </div>
    </div>
    <div class="bg-mesh rounded-xl">
      <div class="relief-glassmorphic p-6 rounded-xl" style="min-height: 200px;">
        <span class="tag mb-3">.relief-glassmorphic</span>
        <p class="text-sm text-secondary mb-4 mt-3">Soft diffused shadows with luminous borders. Transparent, layered glass-panel aesthetic.</p>
        <div class="flex flex-wrap gap-2">
          <button class="btn btn-primary btn-sm">Primary</button>
          <button class="btn btn-secondary btn-sm">Secondary</button>
          <button class="btn btn-ghost btn-sm">Ghost</button>
        </div>
        <div class="flex gap-2 mt-3">
          <span class="badge badge-primary">Badge</span>
          <span class="tag">Tag</span>
        </div>
      </div>
    </div>
    <div class="relief-skeuomorphic p-6 rounded-xl" style="min-height: 200px;">
      <span class="tag mb-3">.relief-skeuomorphic</span>
      <p class="text-sm text-secondary mb-4 mt-3">Layered shadows with inset top-edge highlights for tactile realism. Physical, tangible depth.</p>
      <div class="flex flex-wrap gap-2">
        <button class="btn btn-primary btn-sm">Primary</button>
        <button class="btn btn-secondary btn-sm">Secondary</button>
        <button class="btn btn-ghost btn-sm">Ghost</button>
      </div>
      <div class="flex gap-2 mt-3">
        <span class="badge badge-primary">Badge</span>
        <span class="tag">Tag</span>
      </div>
    </div>
    <div class="relief-neumorphic p-6 rounded-xl" style="min-height: 200px;">
      <span class="tag mb-3">.relief-neumorphic</span>
      <p class="text-sm text-secondary mb-4 mt-3">Solid surfaces with soft dual shadows extruding from the surface. The polished marble aesthetic.</p>
      <div class="flex flex-wrap gap-2">
        <button class="btn btn-primary btn-sm">Primary</button>
        <button class="btn btn-secondary btn-sm">Secondary</button>
        <button class="btn btn-ghost btn-sm">Ghost</button>
      </div>
      <div class="flex gap-2 mt-3">
        <span class="badge badge-primary">Badge</span>
        <span class="tag">Tag</span>
      </div>
    </div>
  </div>

  ${specimenBlock(
    'Relief Override Classes',
    `
    <p class="text-sm text-secondary mb-4">The global relief is set via <code>initSoltana()</code>. Use override classes for per-element exceptions:</p>
    ${codeExample('<!-- Global relief from config applies to all components -->\n<button class="btn btn-primary">Uses Global Relief</button>\n<div class="card p-6">Uses Global Relief</div>\n\n<!-- Override specific elements -->\n<button class="btn relief-skeuomorphic">Skeuomorphic Button</button>\n<div class="card relief-neumorphic p-6">Neumorphic Card</div>', 'html')}
  `
  )}

</div>`;
  return page;
}
