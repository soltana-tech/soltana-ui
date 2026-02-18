/** Design System — Finishes page. */

import { sectionHeading, specimenBlock, codeExample } from '../../utils/helpers';

export function renderFinishes(): string {
  return `
<div class="page-finishes">

  ${sectionHeading('Finish Treatments', 'finishes', 'Five texture and finish variations applied on top of reliefs. Finishes adapt to the active relief.')}

  <h3 class="text-xl font-semibold mt-6 mb-4 font-serif">Finish Comparison Matrix</h3>
  <p class="text-sm text-secondary mb-6">Each finish renders differently depending on the active relief. Finishes control blur, opacity, overlays, and sheen — orthogonal to the relief's shadow structure.</p>

  <!-- Neu + Finishes -->
  <h4 class="text-lg font-semibold mt-8 mb-3 text-secondary">Neumorphic Relief</h4>
  <div class="grid gap-4 mb-8" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))">
    <div class="relief-neu finish-matte card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">matte</span>
      <p class="text-sm text-secondary mt-2">Clean, solid surface. Default look.</p>
    </div>
    <div class="relief-neu finish-translucent card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">translucent</span>
      <p class="text-sm text-secondary mt-2">Semi-transparent, no blur.</p>
    </div>
    <div class="relief-neu finish-frosted card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">frosted</span>
      <p class="text-sm text-secondary mt-2">Backdrop blur with desaturation.</p>
    </div>
    <div class="relief-neu finish-tinted card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">tinted</span>
      <p class="text-sm text-secondary mt-2">Colored accent overlay.</p>
    </div>
    <div class="relief-neu finish-glossy card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">glossy</span>
      <p class="text-sm text-secondary mt-2">Directional specular highlight.</p>
    </div>
  </div>

  <!-- Lifted + Finishes -->
  <h4 class="text-lg font-semibold mt-8 mb-3 text-secondary">Lifted Relief</h4>
  <div class="grid gap-4 mb-8" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))">
    <div class="relief-lifted finish-matte card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">matte</span>
      <p class="text-sm text-secondary mt-2">Clean elevated surface.</p>
    </div>
    <div class="relief-lifted finish-translucent card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">translucent</span>
      <p class="text-sm text-secondary mt-2">Floating translucent panel.</p>
    </div>
    <div class="relief-lifted finish-frosted card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">frosted</span>
      <p class="text-sm text-secondary mt-2">Frosted glass with elevation.</p>
    </div>
    <div class="relief-lifted finish-tinted card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">tinted</span>
      <p class="text-sm text-secondary mt-2">Tinted elevated surface.</p>
    </div>
    <div class="relief-lifted finish-glossy card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">glossy</span>
      <p class="text-sm text-secondary mt-2">Polished elevated sheen.</p>
    </div>
  </div>

  <!-- Hewn + Finishes -->
  <h4 class="text-lg font-semibold mt-8 mb-3 text-secondary">Hewn Relief</h4>
  <div class="grid gap-4 mb-8" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))">
    <div class="relief-hewn finish-matte card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">matte</span>
      <p class="text-sm text-secondary mt-2">Smooth carved surface.</p>
    </div>
    <div class="relief-hewn finish-translucent card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">translucent</span>
      <p class="text-sm text-secondary mt-2">Translucent chiseled panel.</p>
    </div>
    <div class="relief-hewn finish-frosted card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">frosted</span>
      <p class="text-sm text-secondary mt-2">Rough-hewn sandblasted effect.</p>
    </div>
    <div class="relief-hewn finish-tinted card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">tinted</span>
      <p class="text-sm text-secondary mt-2">Mineral-tinted carved stone.</p>
    </div>
    <div class="relief-hewn finish-glossy card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">glossy</span>
      <p class="text-sm text-secondary mt-2">Polished carved stone.</p>
    </div>
  </div>

  ${specimenBlock(
    'Applying Finishes',
    `
    <p class="text-sm text-secondary mb-4">Finishes are set globally via <code>initSoltana()</code>. Use override classes for per-element exceptions:</p>
    ${codeExample('// Set finish globally\nconst soltana = initSoltana({\n  relief: "neu",\n  finish: "frosted",  // All components get frosted finish\n});\n\n// Change at runtime\nsoltana.setFinish("glossy");', 'javascript')}
    ${codeExample('<!-- Override finish on specific elements -->\n<div class="card finish-frosted p-6">Frosted card</div>\n\n<!-- Combine relief + finish overrides -->\n<div class="card relief-lifted finish-tinted p-6">Tinted lifted card</div>', 'html')}
  `
  )}

</div>`;
}
