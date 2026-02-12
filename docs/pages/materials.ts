/** Materials page — Comprehensive showcase of all material systems. */

function sectionHeading(title: string, id: string, description?: string): string {
  return `
    <div class="section-heading" id="${id}">
      <h2 class="text-3xl font-bold">${title}</h2>
      ${description ? `<p class="text-secondary mt-2">${description}</p>` : ''}
    </div>
    <div class="section-divider"></div>`;
}

export function renderMaterials(): string {
  return `
<div class="page-materials">

  ${sectionHeading('Metallic Surfaces', 'metals', 'Gold, silver, bronze, copper, and platinum material effects with text gradients, surfaces, and borders.')}

  <div class="specimen-block mt-8">
    <h3 class="text-lg font-semibold mb-4 font-serif">Text Effects</h3>
    <div class="card">
      <div class="card-body flex flex-col gap-4">
        <p class="text-3xl font-serif font-bold gold-text">Gold Text Gradient</p>
        <p class="text-3xl font-serif font-bold silver-text">Silver Text Gradient</p>
        <p class="text-3xl font-serif font-bold bronze-text">Bronze Text Gradient</p>
        <p class="text-3xl font-serif font-bold copper-text">Copper Text Gradient</p>
        <p class="text-3xl font-serif font-bold platinum-text">Platinum Text Gradient</p>
      </div>
    </div>
  </div>

  <div class="specimen-block mt-8">
    <h3 class="text-lg font-semibold mb-4 font-serif">Surface Materials</h3>
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
      <div class="gold-surface p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.gold-surface</code>
      </div>
      <div class="gold-surface-subtle p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.gold-surface-subtle</code>
      </div>
      <div class="silver-surface p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.silver-surface</code>
      </div>
      <div class="silver-surface-subtle p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.silver-surface-subtle</code>
      </div>
      <div class="bronze-surface p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.bronze-surface</code>
      </div>
      <div class="bronze-surface-subtle p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.bronze-surface-subtle</code>
      </div>
      <div class="copper-surface p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.copper-surface</code>
      </div>
      <div class="copper-surface-subtle p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.copper-surface-subtle</code>
      </div>
      <div class="platinum-surface p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.platinum-surface</code>
      </div>
      <div class="platinum-surface-subtle p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.platinum-surface-subtle</code>
      </div>
    </div>
  </div>

  <div class="specimen-block mt-8">
    <h3 class="text-lg font-semibold mb-4 font-serif">Borders &amp; Shine</h3>
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
      <div class="gold-border p-6 rounded-xl" style="min-height: 80px;">
        <code class="text-sm">.gold-border</code>
      </div>
      <div class="silver-border p-6 rounded-xl" style="min-height: 80px;">
        <code class="text-sm">.silver-border</code>
      </div>
      <div class="bronze-border p-6 rounded-xl" style="min-height: 80px;">
        <code class="text-sm">.bronze-border</code>
      </div>
      <div class="copper-border p-6 rounded-xl" style="min-height: 80px;">
        <code class="text-sm">.copper-border</code>
      </div>
      <div class="platinum-border p-6 rounded-xl" style="min-height: 80px;">
        <code class="text-sm">.platinum-border</code>
      </div>
    </div>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  ${sectionHeading('Stained Glass', 'stained-glass', 'Theme-aware translucent panels with lead-line borders and color tints.')}

  <div class="specimen-block mt-8">
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))">
      <div class="glass-stained p-6 rounded-xl" style="min-height: 120px;">
        <code class="text-sm">.glass-stained</code>
        <p class="text-sm mt-2">Theme primary tint</p>
      </div>
      <div class="glass-stained-gold p-6 rounded-xl" style="min-height: 120px;">
        <code class="text-sm">.glass-stained-gold</code>
        <p class="text-sm mt-2">Cathedral gold</p>
      </div>
      <div class="glass-stained-jewel p-6 rounded-xl" style="min-height: 120px;">
        <code class="text-sm">.glass-stained-jewel</code>
        <p class="text-sm mt-2">Multi-color jewel</p>
      </div>
      <div class="glass-stained-rose p-6 rounded-xl" style="min-height: 120px;">
        <code class="text-sm">.glass-stained-rose</code>
        <p class="text-sm mt-2">Rose window radial</p>
      </div>
      <div class="glass-stained glass-stained-lead p-6 rounded-xl" style="min-height: 120px;">
        <code class="text-sm">.glass-stained-lead</code>
        <p class="text-sm mt-2">Lead-line grid overlay</p>
      </div>
    </div>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  ${sectionHeading('Neumorphic Cards', 'neuro-cards', 'All cards now use neumorphic shadows by default. Compare SCSS class variants.')}

  <div class="specimen-block mt-8">
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))">
      <div class="card">
        <div class="card-body">
          <h4 class="font-serif font-semibold mb-2">.card (default)</h4>
          <p class="text-sm text-secondary">Neumorphic raised shadows applied by default.</p>
        </div>
      </div>
      <div class="card card-baroque">
        <span class="card-baroque-corner top-left"></span>
        <span class="card-baroque-corner top-right"></span>
        <span class="card-baroque-corner bottom-left"></span>
        <span class="card-baroque-corner bottom-right"></span>
        <h4 class="font-serif font-semibold mb-2">.card-baroque</h4>
        <p class="text-sm text-secondary">Full ornamental frame with carved relief, border gradient, and medallion.</p>
      </div>
      <div class="card card-carved">
        <div class="card-body">
          <h4 class="font-serif font-semibold mb-2">.card-carved</h4>
          <p class="text-sm text-secondary">Stone-carved frame with inverted neumorphic rim and corner rosette.</p>
        </div>
      </div>
      <div class="card card-stained-glass">
        <div class="card-body">
          <h4 class="font-serif font-semibold mb-2">.card-stained-glass</h4>
          <p class="text-sm text-secondary">Theme-aware stained glass with lead-line frame.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  ${sectionHeading('Structural Buttons', 'struct-buttons', 'Buttons that differ by shape, not just color.')}

  <div class="specimen-block mt-8">
    <h3 class="text-lg font-semibold mb-4 font-serif">Metallic Buttons</h3>
    <div class="flex flex-wrap gap-4 items-center mb-6">
      <button class="btn btn-gold">Gold</button>
      <button class="btn btn-silver">Silver</button>
      <button class="btn btn-bronze">Bronze</button>
      <button class="btn btn-platinum">Platinum</button>
    </div>

    <h3 class="text-lg font-semibold mb-4 font-serif">Shaped Buttons</h3>
    <div class="flex flex-wrap gap-4 items-center">
      <button class="btn btn-chiseled">Chiseled</button>
      <button class="btn btn-baroque">Baroque</button>
      <button class="btn btn-faceted">Faceted</button>
      <button class="btn btn-medallion">M</button>
    </div>
  </div>

</div>
`;
}
