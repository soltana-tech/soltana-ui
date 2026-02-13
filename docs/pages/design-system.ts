/** Design System page — Colors, typography, materials, surfaces, and ornaments. */

import {
  ornamentDivider,
  quickNav,
  sectionHeading,
  specimenBlock,
  codeExample,
} from '../utils/helpers';

// Color card that uses the color as a tinted glass background
function jewelCard(name: string, variable: string, hex: string): string {
  return `
    <div class="jewel-card" data-copy="var(${variable})" title="Click to copy"
         style="background: linear-gradient(145deg, ${hex}dd, ${hex}88); box-shadow: 0 8px 24px ${hex}44;">
      <div class="text-lg font-semibold">${name}</div>
      <code class="text-xs" style="opacity: 0.8;">${variable}</code>
      <div class="text-xs mt-1" style="opacity: 0.7;">${hex}</div>
      <div class="flex gap-2 mt-3">
        <button class="btn btn-sm" style="background: ${hex}; color: #fff; border: none; box-shadow: 0 2px 8px ${hex}66;">Button</button>
        <span class="badge" style="background: ${hex}33; color: ${hex}; border: 1px solid ${hex}44;">Badge</span>
      </div>
    </div>`;
}

// Gold scale card with gradient
function swatchCard(name: string, variable: string, hex: string): string {
  return `
    <div class="swatch" data-copy="var(${variable})" title="Click to copy">
      <div class="swatch__color" style="background: ${hex}; box-shadow: 0 2px 8px ${hex}44;"></div>
      <div class="swatch__info">
        <span class="swatch__name">${name}</span>
        <code class="swatch__var">${variable}</code>
      </div>
    </div>`;
}

// Metallic button preview
function metallicPreview(name: string, className: string): string {
  return `
    <button class="btn ${className}">${name}</button>`;
}

export function renderDesignSystem(): string {
  return `
<div class="page-design-system">

  ${sectionHeading('Design System', 'overview', 'Colors, typography, materials, surfaces, and ornamental details — all reactive to the 4-tier system.')}

  ${quickNav([
    { label: 'Colors', href: '#colors' },
    { label: 'Typography', href: '#typography' },
    { label: 'Materials', href: '#materials' },
    { label: 'Surfaces', href: '#surfaces' },
    { label: 'Ornaments', href: '#ornaments' },
    { label: 'Spacing', href: '#spacing' },
  ])}

  ${ornamentDivider()}

  <!-- ================================================================== -->
  <!-- COLORS -->
  <!-- ================================================================== -->

  ${sectionHeading('Color Palette', 'colors', 'The signature estate palette. Click any item to copy its CSS variable.')}

  <h3 class="text-xl font-semibold mt-6 mb-4 font-serif">Jewel Tones</h3>
  <p class="text-sm text-secondary mb-4">Rich, saturated colors inspired by precious gemstones. Each shown as an interactive component.</p>
  <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
    ${jewelCard('Emerald', '--jewel-emerald', '#10b981')}
    ${jewelCard('Sapphire', '--jewel-sapphire', '#3b82f6')}
    ${jewelCard('Ruby', '--jewel-ruby', '#ef4444')}
    ${jewelCard('Amethyst', '--jewel-amethyst', '#a855f7')}
    ${jewelCard('Citrine', '--jewel-citrine', '#e8c840')}
    ${jewelCard('Topaz', '--jewel-topaz', '#e8922e')}
    ${jewelCard('Jade', '--jewel-jade', '#2ea87a')}
    ${jewelCard('Turquoise', '--jewel-turquoise', '#3cc0b8')}
  </div>

  <h3 class="text-xl font-semibold mt-10 mb-4 font-serif">Gold Scale</h3>
  <p class="text-sm text-secondary mb-4">The primary accent palette, from light cream to deep brown.</p>
  <div class="swatch-grid">
    ${swatchCard('Gold 50', '--gold-50', '#fefce8')}
    ${swatchCard('Gold 100', '--gold-100', '#fef3c7')}
    ${swatchCard('Gold 200', '--gold-200', '#fde68a')}
    ${swatchCard('Gold 300', '--gold-300', '#fcd34d')}
    ${swatchCard('Gold 400', '--gold-400', '#d4a843')}
    ${swatchCard('Gold 500', '--gold-500', '#b8860b')}
    ${swatchCard('Gold 600', '--gold-600', '#92700c')}
    ${swatchCard('Gold 700', '--gold-700', '#6b4f0a')}
    ${swatchCard('Gold 800', '--gold-800', '#4a3608')}
    ${swatchCard('Gold 900', '--gold-900', '#2c2005')}
  </div>

  <h3 class="text-xl font-semibold mt-10 mb-4 font-serif">Metallic Surfaces</h3>
  <p class="text-sm text-secondary mb-4">Gradient-based metallic finishes with animated shine on hover.</p>
  <div class="flex flex-wrap gap-3 mt-4">
    ${metallicPreview('Gold', 'btn-gold')}
    ${metallicPreview('Silver', 'btn-silver')}
    ${metallicPreview('Bronze', 'btn-bronze')}
    ${metallicPreview('Platinum', 'btn-platinum')}
  </div>

  <div class="grid gap-6 mt-6" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
    <div>
      <h4 class="text-sm font-semibold mb-2 text-secondary">Silver</h4>
      <div class="swatch-grid swatch-grid--compact">
        ${swatchCard('200', '--silver-200', '#d8dde6')}
        ${swatchCard('400', '--silver-400', '#929cb0')}
        ${swatchCard('600', '--silver-600', '#576378')}
      </div>
    </div>
    <div>
      <h4 class="text-sm font-semibold mb-2 text-secondary">Bronze</h4>
      <div class="swatch-grid swatch-grid--compact">
        ${swatchCard('200', '--bronze-200', '#f0cd9e')}
        ${swatchCard('400', '--bronze-400', '#cd8d3a')}
        ${swatchCard('600', '--bronze-600', '#7e5522')}
      </div>
    </div>
    <div>
      <h4 class="text-sm font-semibold mb-2 text-secondary">Copper</h4>
      <div class="swatch-grid swatch-grid--compact">
        ${swatchCard('200', '--copper-200', '#f5c4a1')}
        ${swatchCard('400', '--copper-400', '#d97e4a')}
        ${swatchCard('600', '--copper-600', '#934f2b')}
      </div>
    </div>
    <div>
      <h4 class="text-sm font-semibold mb-2 text-secondary">Platinum</h4>
      <div class="swatch-grid swatch-grid--compact">
        ${swatchCard('200', '--platinum-200', '#dce1ea')}
        ${swatchCard('400', '--platinum-400', '#a8b3c7')}
        ${swatchCard('600', '--platinum-600', '#6d7b94')}
      </div>
    </div>
  </div>

  ${ornamentDivider()}

  <!-- ================================================================== -->
  <!-- TYPOGRAPHY -->
  <!-- ================================================================== -->

  ${sectionHeading('Typography', 'typography', 'Classical serif headings with modern sans-serif body text.')}

  ${specimenBlock(
    'Type Scale',
    `
    <div class="space-y-4">
      <div class="flex items-baseline gap-4">
        <span class="tag tag-gold" style="min-width: 3rem; justify-content: center;">5xl</span>
        <span class="text-5xl font-serif">Display</span>
      </div>
      <div class="flex items-baseline gap-4">
        <span class="tag tag-gold" style="min-width: 3rem; justify-content: center;">4xl</span>
        <span class="text-4xl font-serif">Heading 1</span>
      </div>
      <div class="flex items-baseline gap-4">
        <span class="tag tag-gold" style="min-width: 3rem; justify-content: center;">3xl</span>
        <span class="text-3xl font-serif">Heading 2</span>
      </div>
      <div class="flex items-baseline gap-4">
        <span class="tag tag-gold" style="min-width: 3rem; justify-content: center;">2xl</span>
        <span class="text-2xl font-serif">Heading 3</span>
      </div>
      <div class="flex items-baseline gap-4">
        <span class="tag" style="min-width: 3rem; justify-content: center;">xl</span>
        <span class="text-xl">Large Text</span>
      </div>
      <div class="flex items-baseline gap-4">
        <span class="tag" style="min-width: 3rem; justify-content: center;">base</span>
        <span class="text-base">Body Text</span>
      </div>
      <div class="flex items-baseline gap-4">
        <span class="tag" style="min-width: 3rem; justify-content: center;">sm</span>
        <span class="text-sm">Small Text</span>
      </div>
      <div class="flex items-baseline gap-4">
        <span class="tag" style="min-width: 3rem; justify-content: center;">xs</span>
        <span class="text-xs">Caption</span>
      </div>
    </div>
  `
  )}

  ${specimenBlock(
    'Font Families',
    `
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
      <div class="card p-4">
        <span class="tag tag-gold mb-2">--font-serif</span>
        <p class="text-2xl font-serif mt-2">Cinzel Decorative</p>
        <p class="text-sm text-secondary mt-1">Headlines, display text, formal elements</p>
      </div>
      <div class="card p-4">
        <span class="tag tag-sapphire mb-2">--font-sans</span>
        <p class="text-2xl font-sans mt-2">Raleway</p>
        <p class="text-sm text-secondary mt-1">Body text, UI elements, buttons</p>
      </div>
      <div class="card p-4">
        <span class="tag tag-emerald mb-2">--font-mono</span>
        <p class="text-2xl font-mono mt-2">JetBrains Mono</p>
        <p class="text-sm text-secondary mt-1">Code, technical content</p>
      </div>
    </div>
  `
  )}

  ${ornamentDivider()}

  <!-- ================================================================== -->
  <!-- MATERIALS -->
  <!-- ================================================================== -->

  ${sectionHeading('Materials', 'materials', 'Six materials that fundamentally transform how every component renders. Use the settings panel to preview globally.')}

  <div class="grid gap-6 mt-8" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))">
    <div class="material-flat p-6 rounded-xl" style="min-height: 200px;">
      <span class="tag mb-3">.material-flat</span>
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
    <div class="material-soft p-6 rounded-xl" style="min-height: 200px;">
      <span class="tag mb-3">.material-soft</span>
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
    <div class="material-neu p-6 rounded-xl" style="min-height: 200px;">
      <span class="tag tag-gold mb-3">.material-neu</span>
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
    <div class="material-glass p-6 rounded-xl" style="min-height: 200px;">
      <span class="tag tag-sapphire mb-3">.material-glass</span>
      <p class="text-sm text-secondary mb-4 mt-3">Translucent backgrounds with backdrop blur and saturation. Single-direction drop shadows. The crystal palace aesthetic.</p>
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
    <div class="material-metallic p-6 rounded-xl" style="min-height: 200px;">
      <span class="tag tag-citrine mb-3">.material-metallic</span>
      <p class="text-sm text-secondary mb-4 mt-3">Sharp, polished surfaces with crisp edge shadows and reflective highlights. The brushed metal aesthetic.</p>
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
    <div class="material-stone p-6 rounded-xl" style="min-height: 200px;">
      <span class="tag tag-emerald mb-3">.material-stone</span>
      <p class="text-sm text-secondary mb-4 mt-3">Heavy, carved surfaces with chiseled asymmetric inset shadows. The quarried stone aesthetic.</p>
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
    'Material Override Classes',
    `
    <p class="text-sm text-secondary mb-4">The global material is set via <code>initSoltana()</code>. Use override classes for per-element exceptions:</p>
    ${codeExample('<!-- Global material from config applies to all components -->\n<button class="btn btn-primary">Uses Global Material</button>\n<div class="card p-6">Uses Global Material</div>\n\n<!-- Override specific elements -->\n<button class="btn material-glass">Glass Button</button>\n<div class="card material-neu p-6">Neumorphic Card</div>', 'html')}
  `
  )}

  ${ornamentDivider()}

  <!-- ================================================================== -->
  <!-- SURFACES -->
  <!-- ================================================================== -->

  ${sectionHeading('Surface Treatments', 'surfaces', 'Four texture and finish variations applied on top of materials. Surfaces adapt to the active material.')}

  <h3 class="text-xl font-semibold mt-6 mb-4 font-serif">Surface Comparison Matrix</h3>
  <p class="text-sm text-secondary mb-6">Each surface renders differently depending on the active material. Glass uses blur effects, while neumorphic uses texture overlays and gradients.</p>

  <!-- Neu + Surfaces -->
  <h4 class="text-lg font-semibold mt-8 mb-3 text-secondary">Neumorphic Material</h4>
  <div class="grid gap-4 mb-8" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
    <div class="material-neu surface-polished card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-gold mb-2">polished</span>
      <p class="text-sm text-secondary mt-2">Clean, solid surface. Default neumorphic look.</p>
    </div>
    <div class="material-neu surface-frosted card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-sapphire mb-2">frosted</span>
      <p class="text-sm text-secondary mt-2">Subtle matte texture overlay for etched stone effect.</p>
    </div>
    <div class="material-neu surface-stained card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-ruby mb-2">stained</span>
      <p class="text-sm text-secondary mt-2">Jewel-toned color overlay for tinted stone.</p>
    </div>
    <div class="material-neu surface-metallic card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-citrine mb-2">metallic</span>
      <p class="text-sm text-secondary mt-2">Brushed metal gradient sheen.</p>
    </div>
  </div>

  <!-- Glass + Surfaces -->
  <h4 class="text-lg font-semibold mt-8 mb-3 text-secondary">Glassmorphic Material</h4>
  <div class="grid gap-4 mb-8" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
    <div class="material-glass surface-polished card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-gold mb-2">polished</span>
      <p class="text-sm text-secondary mt-2">Clear glass with standard blur.</p>
    </div>
    <div class="material-glass surface-frosted card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-sapphire mb-2">frosted</span>
      <p class="text-sm text-secondary mt-2">Heavy blur with desaturation, like etched glass.</p>
    </div>
    <div class="material-glass surface-stained card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-ruby mb-2">stained</span>
      <p class="text-sm text-secondary mt-2">Colored translucent gradient.</p>
    </div>
    <div class="material-glass surface-metallic card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-citrine mb-2">metallic</span>
      <p class="text-sm text-secondary mt-2">Reflective gradient highlights.</p>
    </div>
  </div>

  <!-- Metallic + Surfaces -->
  <h4 class="text-lg font-semibold mt-8 mb-3 text-secondary">Metallic Material</h4>
  <div class="grid gap-4 mb-8" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
    <div class="material-metallic surface-polished card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-gold mb-2">polished</span>
      <p class="text-sm text-secondary mt-2">Clean reflective metal surface.</p>
    </div>
    <div class="material-metallic surface-frosted card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-sapphire mb-2">frosted</span>
      <p class="text-sm text-secondary mt-2">Brushed satin metal finish.</p>
    </div>
    <div class="material-metallic surface-stained card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-ruby mb-2">stained</span>
      <p class="text-sm text-secondary mt-2">Anodized tinted metal.</p>
    </div>
    <div class="material-metallic surface-metallic card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-citrine mb-2">metallic</span>
      <p class="text-sm text-secondary mt-2">Full chrome with directional sheen.</p>
    </div>
  </div>

  <!-- Stone + Surfaces -->
  <h4 class="text-lg font-semibold mt-8 mb-3 text-secondary">Stone Material</h4>
  <div class="grid gap-4 mb-8" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
    <div class="material-stone surface-polished card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-gold mb-2">polished</span>
      <p class="text-sm text-secondary mt-2">Smooth carved stone surface.</p>
    </div>
    <div class="material-stone surface-frosted card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-sapphire mb-2">frosted</span>
      <p class="text-sm text-secondary mt-2">Rough-hewn sandblasted stone.</p>
    </div>
    <div class="material-stone surface-stained card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-ruby mb-2">stained</span>
      <p class="text-sm text-secondary mt-2">Mineral-stained quarried stone.</p>
    </div>
    <div class="material-stone surface-metallic card p-5 rounded-xl text-center" style="min-height: 140px;">
      <span class="tag tag-citrine mb-2">metallic</span>
      <p class="text-sm text-secondary mt-2">Ore-veined polished stone.</p>
    </div>
  </div>

  ${specimenBlock(
    'Applying Surfaces',
    `
    <p class="text-sm text-secondary mb-4">Surfaces are set globally via <code>initSoltana()</code>. Use override classes for per-element exceptions:</p>
    ${codeExample('// Set surface globally\nconst soltana = initSoltana({\n  material: "neu",\n  surface: "frosted",  // All components get frosted surface\n});\n\n// Change at runtime\nsoltana.setSurface("metallic");', 'javascript')}
    ${codeExample('<!-- Override surface on specific elements -->\n<div class="card surface-frosted p-6">Frosted card</div>\n\n<!-- Combine material + surface overrides -->\n<div class="card material-glass surface-stained p-6">Stained glass card</div>', 'html')}
  `
  )}

  ${ornamentDivider()}

  <!-- ================================================================== -->
  <!-- ORNAMENTS -->
  <!-- ================================================================== -->

  ${sectionHeading('Ornamental Details', 'ornaments', 'Structural embellishments applied globally via config or per-element via utility classes.')}

  <p class="text-sm text-secondary mb-6">Ornaments are opt-in per element. Add <code>.ornament</code> to inherit the config default, or use an explicit class like <code>.ornament-baroque</code> to force a specific style. All ornaments use <code>box-shadow</code> only — no pseudo-element conflicts.</p>

  <div class="grid gap-6 mt-8" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))">
    <div class="ornament-baroque card p-6 rounded-lg" style="min-height: 160px;">
      <span class="tag tag-gold mb-2">.ornament-baroque</span>
      <p class="text-sm text-secondary mt-2">Rococo frame with inner border and medallion accent at top.</p>
      <button class="btn btn-sm mt-3">Inside Baroque</button>
    </div>
    <div class="ornament-carved card p-6 rounded-lg" style="min-height: 160px;">
      <span class="tag tag-emerald mb-2">.ornament-carved</span>
      <p class="text-sm text-secondary mt-2">Stone relief border with beveled light/dark edges.</p>
      <button class="btn btn-sm mt-3">Inside Carved</button>
    </div>
    <div class="ornament-faceted card p-6 rounded-lg" style="min-height: 160px;">
      <span class="tag tag-sapphire mb-2">.ornament-faceted</span>
      <p class="text-sm text-secondary mt-2">Gem-cut edge highlights with diagonal gradient overlay.</p>
      <button class="btn btn-sm mt-3">Inside Faceted</button>
    </div>
    <div class="ornament-gilt card p-6 rounded-lg" style="min-height: 160px;">
      <span class="tag tag-citrine mb-2">.ornament-gilt</span>
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
    'Ornament + Material Combos',
    `
    <p class="text-sm text-secondary mb-4">Ornaments compose with any material for unique combinations:</p>
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
      <div class="material-glass p-5 rounded-xl">
        <div class="ornament-gilt card p-4 rounded-lg">
          <span class="tag tag-citrine">.ornament-gilt</span>
          <p class="text-sm text-secondary mt-2">Glass + Gold leaf border</p>
        </div>
      </div>
      <div class="material-neu p-5 rounded-xl">
        <div class="ornament-carved card p-4 rounded-lg">
          <span class="tag tag-emerald">.ornament-carved</span>
          <p class="text-sm text-secondary mt-2">Neu + Carved stone relief</p>
        </div>
      </div>
    </div>
  `
  )}

  ${ornamentDivider()}

  <!-- ================================================================== -->
  <!-- SPACING -->
  <!-- ================================================================== -->

  ${sectionHeading('Spacing Scale', 'spacing', 'Consistent spacing tokens for margins, padding, and gaps.')}

  ${specimenBlock(
    'Spacing Tokens',
    `
    <div class="space-y-3">
      ${[
        ['0', '0px'],
        ['1', '0.25rem (4px)'],
        ['2', '0.5rem (8px)'],
        ['3', '0.75rem (12px)'],
        ['4', '1rem (16px)'],
        ['6', '1.5rem (24px)'],
        ['8', '2rem (32px)'],
        ['12', '3rem (48px)'],
        ['16', '4rem (64px)'],
      ]
        .map(
          ([key, value]) => `
        <div class="flex items-center gap-4">
          <span class="tag" style="min-width: 2.5rem; justify-content: center;">${key}</span>
          <div class="h-4 rounded" style="width: calc(${key} * 0.25rem + 4px); background: linear-gradient(90deg, var(--accent-primary), var(--gold-400));"></div>
          <span class="text-sm text-secondary">${value}</span>
        </div>
      `
        )
        .join('')}
    </div>
  `
  )}

</div>
`;
}
