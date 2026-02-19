/** Design System — Finishes page. */

import { sectionHeading, specimenBlock, codeExample } from '../../utils/helpers';

export function renderFinishes(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-finishes">

  ${sectionHeading('Finish Treatments', 'finishes', 'Four texture and finish variations applied on top of reliefs. Finishes adapt to the active relief.')}

  <h3 class="text-xl font-semibold mt-6 mb-4">Finish Comparison Matrix</h3>
  <p class="text-sm text-secondary mb-6">Each finish renders differently depending on the active relief. Finishes control blur, opacity, overlays, and sheen — orthogonal to the relief's shadow structure.</p>

  <!-- Neumorphic + Finishes -->
  <h4 class="text-lg font-semibold mt-8 mb-3 text-secondary">Neumorphic Relief</h4>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div class="relief-neumorphic finish-matte card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">matte</span>
      <p class="text-sm text-secondary mt-2">Clean, solid surface. Default look.</p>
    </div>
    <div class="relief-neumorphic finish-frosted card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">frosted</span>
      <p class="text-sm text-secondary mt-2">Backdrop blur with desaturation.</p>
    </div>
    <div class="relief-neumorphic finish-tinted card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">tinted</span>
      <p class="text-sm text-secondary mt-2">Colored accent overlay.</p>
    </div>
    <div class="relief-neumorphic finish-glossy card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">glossy</span>
      <p class="text-sm text-secondary mt-2">Directional specular highlight.</p>
    </div>
  </div>

  <!-- Skeuomorphic + Finishes -->
  <h4 class="text-lg font-semibold mt-8 mb-3 text-secondary">Skeuomorphic Relief</h4>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div class="relief-skeuomorphic finish-matte card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">matte</span>
      <p class="text-sm text-secondary mt-2">Clean elevated surface.</p>
    </div>
    <div class="relief-skeuomorphic finish-frosted card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">frosted</span>
      <p class="text-sm text-secondary mt-2">Frosted glass with elevation.</p>
    </div>
    <div class="relief-skeuomorphic finish-tinted card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">tinted</span>
      <p class="text-sm text-secondary mt-2">Tinted elevated surface.</p>
    </div>
    <div class="relief-skeuomorphic finish-glossy card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag mb-2">glossy</span>
      <p class="text-sm text-secondary mt-2">Polished elevated sheen.</p>
    </div>
  </div>

  <!-- Glassmorphic + Finishes -->
  <h4 class="text-lg font-semibold mt-8 mb-3 text-secondary">Glassmorphic Relief</h4>
  <div class="bg-mesh rounded-xl p-4 mb-8">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="relief-glassmorphic finish-matte card p-5 rounded-xl text-center" style="min-height: 140px;">
        <span class="tag mb-2">matte</span>
        <p class="text-sm text-secondary mt-2">Solid glass panel.</p>
      </div>
      <div class="relief-glassmorphic finish-frosted card p-5 rounded-xl text-center" style="min-height: 140px;">
        <span class="tag mb-2">frosted</span>
        <p class="text-sm text-secondary mt-2">Frosted glass with luminous borders.</p>
      </div>
      <div class="relief-glassmorphic finish-tinted card p-5 rounded-xl text-center" style="min-height: 140px;">
        <span class="tag mb-2">tinted</span>
        <p class="text-sm text-secondary mt-2">Color-washed glass panel.</p>
      </div>
      <div class="relief-glassmorphic finish-glossy card p-5 rounded-xl text-center" style="min-height: 140px;">
        <span class="tag mb-2">glossy</span>
        <p class="text-sm text-secondary mt-2">Polished glass surface.</p>
      </div>
    </div>
  </div>

  ${specimenBlock(
    'Applying Finishes',
    `
    <p class="text-sm text-secondary mb-4">Finishes are set globally via <code>initSoltana()</code>. Use override classes for per-element exceptions:</p>
    ${codeExample('// Set finish globally\nconst soltana = initSoltana({\n  relief: "neumorphic",\n  finish: "frosted",  // All components get frosted finish\n});\n\n// Change at runtime\nsoltana.setFinish("glossy");', 'javascript')}
    ${codeExample('<!-- Override finish on specific elements -->\n<div class="card finish-frosted p-6">Frosted card</div>\n\n<!-- Combine relief + finish overrides -->\n<div class="card relief-skeuomorphic finish-tinted p-6">Tinted skeuomorphic card</div>', 'html')}
  `
  )}

</div>`;
  return page;
}
