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

  ${sectionHeading('Material Philosophy', 'philosophy', 'Soltana uses a three-layer material system inspired by classical architecture and precious materials.')}

  <div class="specimen-block mt-8">
    <div class="card card-glass p-6">
      <h3 class="text-lg font-semibold mb-4 font-serif">The Three-Layer System</h3>
      <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
        <div class="p-4 neuro-raised rounded-xl">
          <h4 class="font-semibold text-accent-primary mb-2">1. Base Materials</h4>
          <p class="text-sm text-secondary mb-2">The foundational surface treatment:</p>
          <ul class="text-sm text-secondary list-disc pl-4">
            <li><strong>Neumorphic</strong> — Polished stone surfaces with soft shadows</li>
            <li><strong>Glassmorphic</strong> — Crystal transparency with blur effects</li>
            <li><strong>Hybrid</strong> — Glass with neumorphic shadow depth</li>
          </ul>
        </div>
        <div class="p-4 neuro-raised rounded-xl">
          <h4 class="font-semibold text-accent-primary mb-2">2. Surface Treatments</h4>
          <p class="text-sm text-secondary mb-2">Texture and finish variations:</p>
          <ul class="text-sm text-secondary list-disc pl-4">
            <li><strong>Polished</strong> — Clean, reflective surfaces</li>
            <li><strong>Frosted</strong> — Heavy blur, matte appearance</li>
            <li><strong>Stained</strong> — Colored translucent panels</li>
            <li><strong>Metallic</strong> — Gold, silver, bronze finishes</li>
          </ul>
        </div>
        <div class="p-4 neuro-raised rounded-xl">
          <h4 class="font-semibold text-accent-primary mb-2">3. Ornamental Details</h4>
          <p class="text-sm text-secondary mb-2">Structural embellishments:</p>
          <ul class="text-sm text-secondary list-disc pl-4">
            <li><strong>Baroque</strong> — Rococo scrollwork and flourishes</li>
            <li><strong>Carved</strong> — Stone relief borders</li>
            <li><strong>Faceted</strong> — Gem-cut edge highlights</li>
            <li><strong>Gilt</strong> — Gold leaf accents</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="specimen-block mt-8">
    <h3 class="text-lg font-semibold mb-4 font-serif">Theme Defaults</h3>
    <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
      <div class="p-4 rounded-xl border border-default">
        <code class="text-xs text-muted">Light Mode</code>
        <p class="font-semibold mt-1">Neumorphic</p>
        <p class="text-sm text-secondary">Polished marble aesthetic</p>
      </div>
      <div class="p-4 rounded-xl border border-default">
        <code class="text-xs text-muted">Dark Mode</code>
        <p class="font-semibold mt-1">Glassmorphic</p>
        <p class="text-sm text-secondary">Crystal palace at night</p>
      </div>
      <div class="p-4 rounded-xl border border-default">
        <code class="text-xs text-muted">Sepia Mode</code>
        <p class="font-semibold mt-1">Neumorphic</p>
        <p class="text-sm text-secondary">Warm antique tones</p>
      </div>
    </div>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  ${sectionHeading('Base Materials', 'base-materials', 'Apply material classes or data attributes to switch between surface systems.')}

  <div class="specimen-block mt-8">
    <h3 class="text-lg font-semibold mb-4 font-serif">Material Comparison</h3>
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
      <div class="material-neuro p-6 rounded-xl">
        <code class="text-sm">.material-neuro</code>
        <p class="text-sm mt-2">Soft shadows, no transparency. Best for light themes.</p>
      </div>
      <div class="material-glass p-6 rounded-xl">
        <code class="text-sm">.material-glass</code>
        <p class="text-sm mt-2">Frosted transparency with blur. Best for dark themes.</p>
      </div>
      <div class="material-hybrid p-6 rounded-xl">
        <code class="text-sm">.material-hybrid</code>
        <p class="text-sm mt-2">Glass with neumorphic shadows. Works on any theme.</p>
      </div>
    </div>
  </div>

  <div class="specimen-block mt-8">
    <h3 class="text-lg font-semibold mb-4 font-serif">Data Attribute Usage</h3>
    <div class="card p-4">
      <pre class="text-sm"><code>&lt;!-- Apply to any container --&gt;
&lt;div data-material="glass"&gt;...&lt;/div&gt;
&lt;div data-material="neuro"&gt;...&lt;/div&gt;
&lt;div data-material="hybrid"&gt;...&lt;/div&gt;

&lt;!-- Web components --&gt;
&lt;sol-card material="glass"&gt;...&lt;/sol-card&gt;
&lt;sol-button material="hybrid"&gt;Click&lt;/sol-button&gt;</code></pre>
    </div>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  ${sectionHeading('Ornamental Library', 'ornamental', 'Structural details that can be layered on any base material.')}

  <div class="specimen-block mt-8">
    <h3 class="text-lg font-semibold mb-4 font-serif">Frame Systems</h3>
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))">
      <div class="frame-baroque p-6 rounded-sm" style="min-height: 120px;">
        <code class="text-sm">.frame-baroque</code>
        <p class="text-sm mt-2">Rococo frame with medallion</p>
      </div>
      <div class="frame-carved p-6 rounded-lg" style="min-height: 120px;">
        <code class="text-sm">.frame-carved</code>
        <p class="text-sm mt-2">Stone relief border</p>
      </div>
      <div class="frame-gilt p-6 rounded-lg" style="min-height: 120px;">
        <code class="text-sm">.frame-gilt</code>
        <p class="text-sm mt-2">Gold leaf edge</p>
      </div>
      <div class="frame-colonnade p-6" style="min-height: 120px;">
        <code class="text-sm">.frame-colonnade</code>
        <p class="text-sm mt-2">Column-inspired sides</p>
      </div>
    </div>
  </div>

  <div class="specimen-block mt-8">
    <h3 class="text-lg font-semibold mb-4 font-serif">Corner Ornaments</h3>
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
      <div class="corner-flourish p-6 rounded-lg border border-default" style="min-height: 100px;">
        <code class="text-sm">.corner-flourish</code>
      </div>
      <div class="corner-rosette p-6 rounded-lg border border-default" style="min-height: 100px;">
        <code class="text-sm">.corner-rosette</code>
      </div>
      <div class="corner-shell p-6 rounded-lg border border-default" style="min-height: 100px;">
        <code class="text-sm">.corner-shell</code>
      </div>
      <div class="corner-fleur p-6 rounded-lg border border-default" style="min-height: 100px;">
        <code class="text-sm">.corner-fleur</code>
      </div>
    </div>
  </div>

  <div class="specimen-block mt-8">
    <h3 class="text-lg font-semibold mb-4 font-serif">Edge Treatments</h3>
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
      <div class="edge-beveled p-6 rounded-lg" style="min-height: 80px;">
        <code class="text-sm">.edge-beveled</code>
      </div>
      <div class="edge-gilded p-6 rounded-lg" style="min-height: 80px;">
        <code class="text-sm">.edge-gilded</code>
      </div>
      <div class="edge-beaded p-6 rounded-lg" style="min-height: 80px;">
        <code class="text-sm">.edge-beaded</code>
      </div>
    </div>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  ${sectionHeading('Combination Examples', 'combinations', 'Mix base materials with ornamental details for rich visual effects.')}

  <div class="specimen-block mt-8">
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
      <div class="material-glass ornament-baroque p-6 rounded-xl" style="min-height: 140px;">
        <code class="text-sm">glass + baroque</code>
        <p class="text-sm mt-2 text-secondary">Crystal with gold flourishes</p>
      </div>
      <div class="material-neuro ornament-carved p-6 rounded-xl" style="min-height: 140px;">
        <code class="text-sm">neuro + carved</code>
        <p class="text-sm mt-2 text-secondary">Stone with relief frame</p>
      </div>
      <div class="material-hybrid ornament-gilt p-6 rounded-xl" style="min-height: 140px;">
        <code class="text-sm">hybrid + gilt</code>
        <p class="text-sm mt-2 text-secondary">Glass-stone with gold edge</p>
      </div>
      <div class="material-glass ornament-faceted p-6 rounded-xl" style="min-height: 140px;">
        <code class="text-sm">glass + faceted</code>
        <p class="text-sm mt-2 text-secondary">Crystal with gem-cut highlights</p>
      </div>
    </div>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  ${sectionHeading('Jewel-Toned Glass', 'jewel-glass', 'Vibrant tinted glass with gradient depth for gem-like quality.')}

  <div class="specimen-block mt-8">
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
      <div class="glass-gold p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.glass-gold</code>
      </div>
      <div class="glass-emerald p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.glass-emerald</code>
      </div>
      <div class="glass-sapphire p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.glass-sapphire</code>
      </div>
      <div class="glass-ruby p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.glass-ruby</code>
      </div>
      <div class="glass-amethyst p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.glass-amethyst</code>
      </div>
      <div class="glass-citrine p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.glass-citrine</code>
      </div>
      <div class="glass-topaz p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.glass-topaz</code>
      </div>
      <div class="glass-jade p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.glass-jade</code>
      </div>
      <div class="glass-turquoise p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.glass-turquoise</code>
      </div>
      <div class="glass-onyx p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.glass-onyx</code>
      </div>
      <div class="glass-pearl p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.glass-pearl</code>
      </div>
    </div>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

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
    <h3 class="text-lg font-semibold mb-4 font-serif">Pattern Variants</h3>
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
      <div class="glass-stained-cathedral p-6 rounded-xl" style="min-height: 120px;">
        <code class="text-sm">.glass-stained-cathedral</code>
        <p class="text-sm mt-2">Gothic arch panels</p>
      </div>
      <div class="glass-stained-medallion p-6 rounded-xl" style="min-height: 120px;">
        <code class="text-sm">.glass-stained-medallion</code>
        <p class="text-sm mt-2">Circular center pattern</p>
      </div>
      <div class="glass-stained-mosaic p-6 rounded-xl" style="min-height: 120px;">
        <code class="text-sm">.glass-stained-mosaic</code>
        <p class="text-sm mt-2">Small tile overlay</p>
      </div>
      <div class="glass-stained-triptych p-6 rounded-xl" style="min-height: 120px;">
        <code class="text-sm">.glass-stained-triptych</code>
        <p class="text-sm mt-2">Three-panel design</p>
      </div>
    </div>
  </div>

  <div class="specimen-block mt-8">
    <h3 class="text-lg font-semibold mb-4 font-serif">Lead-Line Patterns</h3>
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))">
      <div class="glass-stained glass-stained-lead p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.glass-stained-lead</code>
        <p class="text-sm mt-2">Grid overlay</p>
      </div>
      <div class="glass-stained lead-gothic p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.lead-gothic</code>
        <p class="text-sm mt-2">Pointed arch pattern</p>
      </div>
      <div class="glass-stained lead-art-nouveau p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.lead-art-nouveau</code>
        <p class="text-sm mt-2">Flowing organic curves</p>
      </div>
      <div class="glass-stained lead-geometric p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.lead-geometric</code>
        <p class="text-sm mt-2">Angular modern</p>
      </div>
      <div class="glass-stained lead-celtic p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.lead-celtic</code>
        <p class="text-sm mt-2">Interlaced knots</p>
      </div>
    </div>
  </div>

  <div class="specimen-block mt-8">
    <h3 class="text-lg font-semibold mb-4 font-serif">Custom Color Presets</h3>
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
      <div class="glass-stained stained-ruby-emerald p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.stained-ruby-emerald</code>
      </div>
      <div class="glass-stained stained-sapphire-gold p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.stained-sapphire-gold</code>
      </div>
      <div class="glass-stained stained-amethyst-rose p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.stained-amethyst-rose</code>
      </div>
      <div class="glass-stained stained-sunset p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.stained-sunset</code>
      </div>
      <div class="glass-stained stained-ocean p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.stained-ocean</code>
      </div>
      <div class="glass-stained stained-forest p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.stained-forest</code>
      </div>
    </div>
    <div class="card p-4 mt-4">
      <h4 class="font-semibold mb-2">Custom Colors via Data Attribute</h4>
      <pre class="text-sm"><code>&lt;div class="glass-stained" data-stained-colors="ruby-emerald"&gt;...&lt;/div&gt;</code></pre>
    </div>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  ${sectionHeading('Jewel-Toned Glass', 'jewel-glass', 'Vibrant tinted glass with gradient depth for gem-like quality.')}

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
