/** Design System — Reliefs page. */

import { sectionHeading, specimenBlock, codeExample } from '../../utils/helpers';

export function renderReliefs(): string {
  return `
<div class="page-reliefs">

  ${sectionHeading('Reliefs', 'reliefs', 'Six reliefs that fundamentally transform how every component renders. Use the <a href="#/playground">Playground</a> to preview interactively.')}

  <div class="grid gap-6 mt-8" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))">
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
    <div class="relief-soft p-6 rounded-xl" style="min-height: 200px;">
      <span class="tag mb-3">.relief-soft</span>
      <p class="text-sm text-secondary mb-4 mt-3">Gentle one-directional elevation with subtle borders. Approachable and familiar.</p>
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
    <div class="relief-neu p-6 rounded-xl" style="min-height: 200px;">
      <span class="tag mb-3">.relief-neu</span>
      <p class="text-sm text-secondary mb-4 mt-3">Solid surfaces with soft dual shadows extruding from the surface. No transparency or blur. The polished marble aesthetic.</p>
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
    <div class="relief-lifted p-6 rounded-xl" style="min-height: 200px;">
      <span class="tag mb-3">.relief-lifted</span>
      <p class="text-sm text-secondary mb-4 mt-3">Layered ambient + key shadows creating Material Design-style elevation. Versatile and modern.</p>
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
    <div class="relief-sharp p-6 rounded-xl" style="min-height: 200px;">
      <span class="tag mb-3">.relief-sharp</span>
      <p class="text-sm text-secondary mb-4 mt-3">Hard-edged shadows with crisp offsets and zero blur. Bold and graphic.</p>
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
    <div class="relief-hewn p-6 rounded-xl" style="min-height: 200px;">
      <span class="tag mb-3">.relief-hewn</span>
      <p class="text-sm text-secondary mb-4 mt-3">Chiseled asymmetric inset shadows creating a carved-from-surface appearance.</p>
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
    ${codeExample('<!-- Global relief from config applies to all components -->\n<button class="btn btn-primary">Uses Global Relief</button>\n<div class="card p-6">Uses Global Relief</div>\n\n<!-- Override specific elements -->\n<button class="btn relief-lifted">Lifted Button</button>\n<div class="card relief-neu p-6">Neumorphic Card</div>', 'html')}
  `
  )}

</div>`;
}
