/** Design System page — Colors, typography, reliefs, finishes, and ornaments. */

import {
  ornamentDivider,
  quickNav,
  sectionHeading,
  specimenBlock,
  codeExample,
} from '../utils/helpers';
import { RECIPES } from '../../src/config';
import type { RecipeName } from '../../src/config';

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

function recipeCard(key: RecipeName): string {
  const recipe = RECIPES[key];
  const tierClasses = [
    `theme-${recipe.theme}`,
    `relief-${recipe.relief}`,
    `finish-${recipe.finish}`,
    recipe.ornament !== 'none' ? `ornament-${recipe.ornament}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `
    <div class="${tierClasses} card p-6 rounded-xl" style="min-height: 180px;">
      <span class="tag mb-2">${recipe.name}</span>
      <p class="text-sm text-secondary mt-2">${recipe.description}</p>
      <div class="flex flex-wrap gap-2 mt-3">
        <button class="btn btn-primary btn-sm">Primary</button>
        <button class="btn btn-secondary btn-sm">Secondary</button>
        <span class="badge badge-primary">Badge</span>
      </div>
      <div class="text-xs text-tertiary mt-3">
        ${recipe.theme} / ${recipe.relief} / ${recipe.finish} / ${recipe.ornament}
      </div>
    </div>`;
}

export function renderDesignSystem(): string {
  return `
<div class="page-design-system">

  ${sectionHeading('Design System', 'overview', 'Colors, typography, reliefs, finishes, and ornamental details — all reactive to the 4-tier system.')}

  ${quickNav([
    { label: 'Recipes', href: '#recipes' },
    { label: 'Colors', href: '#colors' },
    { label: 'Typography', href: '#typography' },
    { label: 'Reliefs', href: '#reliefs' },
    { label: 'Finishes', href: '#finishes' },
    { label: 'Ornaments', href: '#ornaments' },
    { label: 'Composition', href: '#composition' },
    { label: 'Spacing', href: '#spacing' },
  ])}

  ${ornamentDivider()}

  <!-- ================================================================== -->
  <!-- RECIPES -->
  <!-- ================================================================== -->

  ${sectionHeading('Recipes', 'recipes', 'Named presets of proven tier combinations. Apply a recipe as a starting point, then customize individual tiers.')}

  <div class="grid gap-6 mt-8" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
    ${(Object.keys(RECIPES) as RecipeName[]).map((key) => recipeCard(key)).join('')}
  </div>

  ${specimenBlock(
    'Using Recipes',
    `
    <p class="text-sm text-secondary mb-4">Recipes set all four tiers at once via the <code>applyRecipe()</code> API. They are starting points — individual tiers can be changed afterward.</p>
    ${codeExample("import { initSoltana } from 'soltana-ui';\n\nconst soltana = initSoltana();\n\n// Apply a recipe\nsoltana.applyRecipe('luxury-dark');\n\n// Customize individual tiers afterward\nsoltana.setFinish('frosted');", 'javascript')}
    ${codeExample("import { RECIPES } from 'soltana-ui';\n\n// Inspect available recipes\nfor (const [key, recipe] of Object.entries(RECIPES)) {\n  console.log(key, recipe.name, recipe.description);\n}", 'javascript')}
  `
  )}

  ${ornamentDivider()}

  <!-- ================================================================== -->
  <!-- COLORS -->
  <!-- ================================================================== -->

  ${sectionHeading('Color Palette', 'colors', 'The signature estate palette. Click any item to copy its CSS variable.')}

  <h3 class="text-xl font-semibold mt-6 mb-4 font-serif">Gold Scale</h3>
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
        <span class="tag" style="min-width: 3rem; justify-content: center;">5xl</span>
        <span class="text-5xl font-serif">Display</span>
      </div>
      <div class="flex items-baseline gap-4">
        <span class="tag" style="min-width: 3rem; justify-content: center;">4xl</span>
        <span class="text-4xl font-serif">Heading 1</span>
      </div>
      <div class="flex items-baseline gap-4">
        <span class="tag" style="min-width: 3rem; justify-content: center;">3xl</span>
        <span class="text-3xl font-serif">Heading 2</span>
      </div>
      <div class="flex items-baseline gap-4">
        <span class="tag" style="min-width: 3rem; justify-content: center;">2xl</span>
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
        <span class="tag mb-2">--font-serif</span>
        <p class="text-2xl font-serif mt-2">Cinzel Decorative</p>
        <p class="text-sm text-secondary mt-1">Headlines, display text, formal elements</p>
      </div>
      <div class="card p-4">
        <span class="tag mb-2">--font-sans</span>
        <p class="text-2xl font-sans mt-2">Raleway</p>
        <p class="text-sm text-secondary mt-1">Body text, UI elements, buttons</p>
      </div>
      <div class="card p-4">
        <span class="tag mb-2">--font-mono</span>
        <p class="text-2xl font-mono mt-2">JetBrains Mono</p>
        <p class="text-sm text-secondary mt-1">Code, technical content</p>
      </div>
    </div>
  `
  )}

  ${ornamentDivider()}

  <!-- ================================================================== -->
  <!-- RELIEFS -->
  <!-- ================================================================== -->

  ${sectionHeading('Reliefs', 'reliefs', 'Six reliefs that fundamentally transform how every component renders. Use the settings panel to preview globally.')}

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

  ${ornamentDivider()}

  <!-- ================================================================== -->
  <!-- FINISHES -->
  <!-- ================================================================== -->

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

  ${ornamentDivider()}

  <!-- ================================================================== -->
  <!-- ORNAMENTS -->
  <!-- ================================================================== -->

  ${sectionHeading('Ornamental Details', 'ornaments', 'Structural embellishments applied globally via config or per-element via utility classes.')}

  <p class="text-sm text-secondary mb-6">Ornaments are opt-in per element. Add <code>.ornament</code> to inherit the config default, or use an explicit class like <code>.ornament-baroque</code> to force a specific style. All ornaments use <code>box-shadow</code> only — no pseudo-element conflicts.</p>

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
      <div class="relief-lifted p-5 rounded-xl">
        <div class="ornament-gilt card p-4 rounded-lg">
          <span class="tag">.ornament-gilt</span>
          <p class="text-sm text-secondary mt-2">Lifted + Gold leaf border</p>
        </div>
      </div>
      <div class="relief-neu p-5 rounded-xl">
        <div class="ornament-beveled card p-4 rounded-lg">
          <span class="tag">.ornament-beveled</span>
          <p class="text-sm text-secondary mt-2">Neu + Beveled frame</p>
        </div>
      </div>
    </div>
  `
  )}

  ${ornamentDivider()}

  <!-- ================================================================== -->
  <!-- COMPOSITION -->
  <!-- ================================================================== -->

  ${sectionHeading('Per-Element Composition', 'composition', 'All four tiers — theme, relief, finish, ornament — can be independently overridden on any element via utility classes.')}

  ${specimenBlock(
    'Tier Override Classes',
    `
    <p class="text-sm text-secondary mb-4">Each tier provides utility classes that override the global config on a per-element basis. CSS custom properties set directly on an element always override inherited values from ancestors.</p>
    <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
      <div class="card p-4">
        <span class="tag mb-2">Theme</span>
        <div class="space-y-1 mt-2">
          <code class="text-sm">.theme-dark</code><br>
          <code class="text-sm">.theme-light</code><br>
          <code class="text-sm">.theme-sepia</code>
        </div>
      </div>
      <div class="card p-4">
        <span class="tag mb-2">Relief</span>
        <div class="space-y-1 mt-2">
          <code class="text-sm">.relief-flat</code><br>
          <code class="text-sm">.relief-soft</code><br>
          <code class="text-sm">.relief-neu</code><br>
          <code class="text-sm">.relief-lifted</code><br>
          <code class="text-sm">.relief-sharp</code><br>
          <code class="text-sm">.relief-hewn</code>
        </div>
      </div>
      <div class="card p-4">
        <span class="tag mb-2">Finish</span>
        <div class="space-y-1 mt-2">
          <code class="text-sm">.finish-matte</code><br>
          <code class="text-sm">.finish-translucent</code><br>
          <code class="text-sm">.finish-frosted</code><br>
          <code class="text-sm">.finish-tinted</code><br>
          <code class="text-sm">.finish-glossy</code>
        </div>
      </div>
      <div class="card p-4">
        <span class="tag mb-2">Ornament</span>
        <div class="space-y-1 mt-2">
          <code class="text-sm">.ornament-baroque</code><br>
          <code class="text-sm">.ornament-beveled</code><br>
          <code class="text-sm">.ornament-faceted</code><br>
          <code class="text-sm">.ornament-gilt</code>
        </div>
      </div>
    </div>
  `
  )}

  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif">Composition in Action</h3>
  <p class="text-sm text-secondary mb-6">Each card below overrides multiple tiers independently, regardless of the global config.</p>

  <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
    <div class="theme-light relief-lifted finish-frosted card p-5 rounded-xl">
      <span class="tag mb-2">Light + Lifted + Frosted</span>
      <p class="text-sm text-secondary mt-2">Overrides theme to light, relief to lifted, and finish to frosted — independent of global config.</p>
      <button class="btn btn-sm mt-3">Button</button>
    </div>
    <div class="theme-sepia relief-neu ornament-gilt card p-5 rounded-xl">
      <span class="tag mb-2">Sepia + Neu + Gilt</span>
      <p class="text-sm text-secondary mt-2">Warm parchment theme with neumorphic depth and gold leaf ornament.</p>
      <button class="btn btn-sm mt-3">Button</button>
    </div>
    <div class="theme-dark relief-hewn finish-glossy ornament-beveled card p-5 rounded-xl">
      <span class="tag mb-2">Dark + Hewn + Glossy + Beveled</span>
      <p class="text-sm text-secondary mt-2">All four tiers overridden on a single element.</p>
      <button class="btn btn-sm mt-3">Button</button>
    </div>
  </div>

  ${specimenBlock(
    'Usage',
    `
    <p class="text-sm text-secondary mb-4">Add utility classes to any element to override inherited tier values:</p>
    ${codeExample('<!-- Global config: dark theme, neu relief, matte finish -->\n\n<!-- Override theme on a section -->\n<section class="theme-light">\n  <p>Light tokens apply here, even inside a dark page.</p>\n\n  <!-- Further override relief + ornament -->\n  <div class="card relief-lifted ornament-gilt p-6">\n    Lifted relief with gilt ornament, light theme inherited from parent.\n  </div>\n</section>\n\n<!-- Override all four tiers on one element -->\n<div class="theme-sepia relief-hewn finish-frosted ornament-beveled card p-6">\n  Fully composed: sepia + hewn + frosted + beveled.\n</div>', 'html')}
  `
  )}

  ${specimenBlock(
    'How It Works',
    `
    <p class="text-sm text-secondary mb-4">CSS custom properties set directly on an element always override values inherited from ancestors. The innermost class wins:</p>
    ${codeExample('<!-- Stacking depth: innermost wins -->\n<html data-theme="dark">           <!-- dark tokens -->\n  <div class="theme-light">        <!-- light tokens -->\n    <div class="theme-dark">       <!-- dark tokens again -->\n      Content uses dark theme.\n    </div>\n  </div>\n</html>', 'html')}
    <p class="text-sm text-secondary mt-4">Tier combination count is linear (t + m + s + o rulesets), not multiplicative. No combination-specific CSS is generated — each tier cascades independently via custom properties.</p>
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
          <div class="h-4 rounded" style="width: calc(${key} * 0.25rem + 4px); background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));"></div>
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
