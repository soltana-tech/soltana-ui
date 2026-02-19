/** Design System — Ornaments page. */

import { sectionHeading, specimenBlock, codeExample } from '../../utils/helpers';

export function renderOrnaments(): string {
  return `
<div class="page-ornaments">

  ${sectionHeading('Ornamental Details', 'ornaments', 'Structural embellishments applied globally via config or per-element via utility classes.')}

  <p class="text-sm text-secondary mb-6">Ornaments are opt-in per element. Add <code>.ornament</code> to inherit the config default, or use an explicit class like <code>.ornament-baroque</code> to force a specific style. Ornaments compose borders, shadows, clip-paths, and pseudo-element decorations to create visual embellishments.</p>

  <div class="grid gap-6 mt-8" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))">
    <div class="ornament-baroque card p-6 rounded-lg" style="min-height: 160px;">
      <span class="tag mb-2">.ornament-baroque</span>
      <p class="text-sm text-secondary mt-2">Rococo frame with inner border and medallion accent at top.</p>
      <button class="btn btn-sm mt-3">Inside Baroque</button>
    </div>
    <div class="ornament-beveled card p-6 rounded-lg" style="min-height: 160px;">
      <span class="tag mb-2">.ornament-beveled</span>
      <p class="text-sm text-secondary mt-2">Light/dark edge highlights creating a subtle 3D frame.</p>
      <button class="btn btn-sm mt-3">Inside Beveled</button>
    </div>
    <div class="ornament-faceted card p-6 rounded-lg" style="min-height: 160px;">
      <span class="tag mb-2">.ornament-faceted</span>
      <p class="text-sm text-secondary mt-2">Gem-cut edge highlights with diagonal gradient overlay.</p>
      <button class="btn btn-sm mt-3">Inside Faceted</button>
    </div>
    <div class="ornament-gilt card p-6 rounded-lg" style="min-height: 160px;">
      <span class="tag mb-2">.ornament-gilt</span>
      <p class="text-sm text-secondary mt-2">Gold leaf border with subtle warm glow.</p>
      <button class="btn btn-sm mt-3">Inside Gilt</button>
    </div>
  </div>

  ${specimenBlock(
    'Ornament Configuration',
    `
    <p class="text-sm text-secondary mb-4">Set the config default via <code>initSoltana()</code>, then opt in per element with <code>.ornament</code>:</p>
    ${codeExample('// Set config default ornament\nconst soltana = initSoltana({\n  ornament: "baroque",  // .ornament elements get baroque\n});\n\n// Change at runtime\nsoltana.setOrnament("gilt");', 'javascript')}
    ${codeExample('<!-- .ornament inherits the config default -->\n<button class="btn btn-primary ornament">Decorated Button</button>\n<div class="card ornament p-6">Decorated Card</div>\n\n<!-- Explicit class overrides config default -->\n<div class="card ornament-gilt p-6">Always Gilt</div>\n\n<!-- No .ornament = no decoration -->\n<button class="btn btn-primary">Plain Button</button>', 'html')}
  `
  )}

  ${specimenBlock(
    'Ornament + Relief Combos',
    `
    <p class="text-sm text-secondary mb-4">Ornaments compose with any relief for unique combinations:</p>
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
      <div class="relief-skeuomorphic p-5 rounded-xl">
        <div class="ornament-gilt card p-4 rounded-lg">
          <span class="tag">.ornament-gilt</span>
          <p class="text-sm text-secondary mt-2">Skeuomorphic + Gold leaf border</p>
        </div>
      </div>
      <div class="relief-neumorphic p-5 rounded-xl">
        <div class="ornament-beveled card p-4 rounded-lg">
          <span class="tag">.ornament-beveled</span>
          <p class="text-sm text-secondary mt-2">Neumorphic + Beveled frame</p>
        </div>
      </div>
    </div>
  `
  )}

</div>`;
}
