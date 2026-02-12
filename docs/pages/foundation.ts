/** Foundation page — Estate palette, typography, spacing specimens. */

function colorSwatch(name: string, variable: string, hex: string): string {
  return `
    <div class="swatch" data-copy="var(${variable})" title="Click to copy">
      <div class="swatch__color" style="background-color: var(${variable})"></div>
      <div class="swatch__info">
        <span class="swatch__name">${name}</span>
        <code class="swatch__var">${variable}</code>
        <span class="swatch__hex text-muted">${hex}</span>
      </div>
    </div>`;
}

function sectionHeading(title: string, id: string, description?: string): string {
  return `
    <div class="section-heading" id="${id}">
      <h2 class="text-3xl font-bold">${title}</h2>
      ${description ? `<p class="text-secondary mt-2">${description}</p>` : ''}
    </div>
    <div class="section-divider"></div>`;
}

export function renderFoundation(): string {
  return `
<div class="page-foundation">

  ${sectionHeading('Gold Scale', 'gold', 'The signature accent palette. Click any swatch to copy its CSS variable.')}

  <div class="swatch-grid">
    ${colorSwatch('Gold 50', '--gold-50', '#fefce8')}
    ${colorSwatch('Gold 100', '--gold-100', '#fef3c7')}
    ${colorSwatch('Gold 200', '--gold-200', '#fde68a')}
    ${colorSwatch('Gold 300', '--gold-300', '#fcd34d')}
    ${colorSwatch('Gold 400', '--gold-400', '#d4a843')}
    ${colorSwatch('Gold 500', '--gold-500', '#b8860b')}
    ${colorSwatch('Gold 600', '--gold-600', '#92700c')}
    ${colorSwatch('Gold 700', '--gold-700', '#6b4f0a')}
    ${colorSwatch('Gold 800', '--gold-800', '#4a3608')}
    ${colorSwatch('Gold 900', '--gold-900', '#2c2005')}
  </div>

  <!-- Metallic Scales -->
  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif">Silver Scale</h3>
  <div class="swatch-grid">
    ${colorSwatch('Silver 200', '--silver-200', '#d8dde6')}
    ${colorSwatch('Silver 400', '--silver-400', '#929cb0')}
    ${colorSwatch('Silver 600', '--silver-600', '#576378')}
    ${colorSwatch('Silver 800', '--silver-800', '#353c4a')}
  </div>

  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif">Bronze Scale</h3>
  <div class="swatch-grid">
    ${colorSwatch('Bronze 200', '--bronze-200', '#f0cd9e')}
    ${colorSwatch('Bronze 400', '--bronze-400', '#cd8d3a')}
    ${colorSwatch('Bronze 600', '--bronze-600', '#7e5522')}
    ${colorSwatch('Bronze 800', '--bronze-800', '#422c14')}
  </div>

  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif">Copper Scale</h3>
  <div class="swatch-grid">
    ${colorSwatch('Copper 200', '--copper-200', '#f5c4a1')}
    ${colorSwatch('Copper 400', '--copper-400', '#d97e4a')}
    ${colorSwatch('Copper 600', '--copper-600', '#934f2b')}
  </div>

  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif">Platinum Scale</h3>
  <div class="swatch-grid">
    ${colorSwatch('Platinum 200', '--platinum-200', '#dce1ea')}
    ${colorSwatch('Platinum 400', '--platinum-400', '#a8b3c7')}
    ${colorSwatch('Platinum 600', '--platinum-600', '#6d7b94')}
  </div>

  <!-- Jewel Tones -->
  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif">Jewel Tones</h3>
  <div class="swatch-grid">
    ${colorSwatch('Emerald', '--jewel-emerald', '#10b981')}
    ${colorSwatch('Emerald Deep', '--jewel-emerald-deep', '#0d6b4e')}
    ${colorSwatch('Sapphire', '--jewel-sapphire', '#3b82f6')}
    ${colorSwatch('Sapphire Deep', '--jewel-sapphire-deep', '#1e40af')}
    ${colorSwatch('Ruby', '--jewel-ruby', '#ef4444')}
    ${colorSwatch('Ruby Deep', '--jewel-ruby-deep', '#991b1b')}
    ${colorSwatch('Amethyst', '--jewel-amethyst', '#a855f7')}
    ${colorSwatch('Amethyst Deep', '--jewel-amethyst-deep', '#6b21a8')}
    ${colorSwatch('Citrine', '--jewel-citrine', '#e8c840')}
    ${colorSwatch('Topaz', '--jewel-topaz', '#e8922e')}
    ${colorSwatch('Jade', '--jewel-jade', '#2ea87a')}
    ${colorSwatch('Turquoise', '--jewel-turquoise', '#3cc0b8')}
    ${colorSwatch('Onyx', '--jewel-onyx', '#1a1c2e')}
    ${colorSwatch('Pearl', '--jewel-pearl', '#f0ecf8')}
  </div>

  <!-- Ivory Scale -->
  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif">Ivory / Warm Neutrals</h3>
  <div class="swatch-grid">
    ${colorSwatch('Ivory 50', '--ivory-50', '#fefdf5')}
    ${colorSwatch('Ivory 100', '--ivory-100', '#faf8f4')}
    ${colorSwatch('Ivory 200', '--ivory-200', '#f5f0e6')}
    ${colorSwatch('Ivory 300', '--ivory-300', '#ede5d5')}
    ${colorSwatch('Ivory 400', '--ivory-400', '#e0d5c0')}
    ${colorSwatch('Ivory 500', '--ivory-500', '#c5b99b')}
    ${colorSwatch('Ivory 600', '--ivory-600', '#a89a78')}
    ${colorSwatch('Ivory 700', '--ivory-700', '#8a7e6a')}
    ${colorSwatch('Ivory 800', '--ivory-800', '#5a5245')}
    ${colorSwatch('Ivory 900', '--ivory-900', '#3a332a')}
  </div>

  <!-- Surfaces -->
  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif">Theme Surfaces</h3>
  <div class="swatch-grid">
    ${colorSwatch('Surface BG', '--surface-bg', 'theme')}
    ${colorSwatch('Surface 1', '--surface-1', 'theme')}
    ${colorSwatch('Surface 2', '--surface-2', 'theme')}
    ${colorSwatch('Surface 3', '--surface-3', 'theme')}
    ${colorSwatch('Surface 4', '--surface-4', 'theme')}
  </div>

  <!-- Semantic Colors -->
  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif">Semantic Colors</h3>
  <div class="swatch-grid">
    ${colorSwatch('Success', '--color-success', 'theme')}
    ${colorSwatch('Warning', '--color-warning', 'theme')}
    ${colorSwatch('Error', '--color-error', 'theme')}
    ${colorSwatch('Info', '--color-info', 'theme')}
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  ${sectionHeading('Typography', 'typography', 'Cinzel (serif) for display headings, Raleway (sans) for body and UI, JetBrains Mono for code.')}

  <!-- Font Family Specimen -->
  <div class="specimen-block mt-8">
    <h3 class="text-xl font-semibold mb-4 font-serif">Font Families</h3>
    <div class="card">
      <div class="card-body">
        <div class="mb-6">
          <p class="overline mb-2">Display / Serif — Cinzel</p>
          <p class="text-4xl font-serif font-bold mb-2 tracking-display">Cinzel</p>
          <p class="text-lg text-secondary font-serif tracking-elegant">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>
            abcdefghijklmnopqrstuvwxyz<br/>
            0123456789 !@#$%^&amp;*()
          </p>
        </div>
        <hr class="divider" />
        <div class="mb-6">
          <p class="overline mb-2">Ornamental Display — Cinzel Decorative</p>
          <p class="text-4xl font-display mb-2 tracking-inscriptional">Cinzel Decorative</p>
        </div>
        <hr class="divider" />
        <div class="mb-6">
          <p class="overline mb-2">Body / UI — Raleway</p>
          <p class="text-4xl font-sans mb-2">Raleway</p>
          <p class="text-lg text-secondary font-sans">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>
            abcdefghijklmnopqrstuvwxyz<br/>
            0123456789 !@#$%^&amp;*()
          </p>
        </div>
        <hr class="divider" />
        <div>
          <p class="overline mb-2">Monospace — JetBrains Mono</p>
          <p class="text-base text-secondary" style="font-family: var(--font-mono)">
            <code>var(--font-mono)</code>: 0123456789 {} [] () =&gt;
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Display Sizes -->
  <div class="specimen-block mt-8">
    <h3 class="text-xl font-semibold mb-4 font-serif">Display Sizes</h3>
    <div class="card">
      <div class="card-body flex flex-col gap-4">
        <div>
          <code class="text-xs text-muted">.display-ornate</code>
          <p class="display-ornate" style="font-size: var(--text-5xl)">Ornate Display</p>
        </div>
        <div>
          <code class="text-xs text-muted">.display-lg</code>
          <p class="display-lg">Display Large</p>
        </div>
        <div>
          <code class="text-xs text-muted">.display-md</code>
          <p class="display-md">Display Medium</p>
        </div>
        <div>
          <code class="text-xs text-muted">.display-sm</code>
          <p class="display-sm">Display Small</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Gold Text Effects -->
  <div class="specimen-block mt-8">
    <h3 class="text-xl font-semibold mb-4 font-serif">Gold Text Effects</h3>
    <div class="card">
      <div class="card-body flex flex-col gap-4">
        <div>
          <code class="text-xs text-muted">.gold-text</code>
          <p class="text-4xl font-serif font-bold gold-text">Metallic Gold</p>
        </div>
        <div>
          <code class="text-xs text-muted">.gold-embossed</code>
          <p class="text-4xl font-serif font-bold gold-embossed">Embossed Gold</p>
        </div>
        <div>
          <code class="text-xs text-muted">.gold-intaglio</code>
          <p class="text-4xl font-serif font-bold gold-intaglio">Intaglio Gold</p>
        </div>
        <div>
          <code class="text-xs text-muted">.gold-rose</code>
          <p class="text-4xl font-serif font-bold gold-rose">Rose Gold</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Headings -->
  <div class="specimen-block mt-8">
    <h3 class="text-xl font-semibold mb-4 font-serif">Headings</h3>
    <div class="card">
      <div class="card-body flex flex-col gap-4">
        <h1>Heading 1 — Cinzel</h1>
        <h2>Heading 2 — Cinzel</h2>
        <h3>Heading 3 — Cinzel</h3>
        <h4>Heading 4 — Raleway</h4>
        <h5>Heading 5 — Raleway</h5>
        <h6>Heading 6 — Raleway</h6>
      </div>
    </div>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  ${sectionHeading('Spacing', 'spacing', 'A consistent spacing scale based on a 4px (0.25rem) base unit.')}

  <div class="specimen-block mt-8">
    <div class="card">
      <div class="card-body flex flex-col gap-2">
        ${[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24]
          .map(
            (s) => `
          <div class="flex items-center gap-4">
            <code class="text-xs text-muted" style="min-width: 4rem">${String(s)}</code>
            <div style="width: calc(${String(s)} * 0.25rem); min-width: 2px; height: 1.25rem; background: var(--gold-400); border-radius: var(--radius-sm); opacity: 0.8;"></div>
            <span class="text-sm text-secondary">${String(s * 4)}px / ${String(s * 0.25)}rem</span>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  ${sectionHeading('Material Surfaces', 'materials', 'Marble, stone, and decorative surface treatments.')}

  <div class="specimen-block mt-8">
    <h3 class="text-lg font-semibold mb-4 font-serif">Marble</h3>
    <div class="grid grid-cols-3 gap-6" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
      <div class="marble p-6 rounded-xl" style="min-height: 120px;">
        <code class="text-sm">.marble</code>
        <p class="text-sm mt-2 text-secondary">Carrara</p>
      </div>
      <div class="marble-dark p-6 rounded-xl" style="min-height: 120px;">
        <code class="text-sm">.marble-dark</code>
        <p class="text-sm mt-2" style="color: var(--ivory-200)">Nero Marquina</p>
      </div>
      <div class="marble-warm p-6 rounded-xl" style="min-height: 120px;">
        <code class="text-sm">.marble-warm</code>
        <p class="text-sm mt-2 text-secondary">Crema Marfil</p>
      </div>
      <div class="marble-onyx p-6 rounded-xl" style="min-height: 120px;">
        <code class="text-sm">.marble-onyx</code>
        <p class="text-sm mt-2" style="color: var(--ivory-200)">Onyx (gold veins)</p>
      </div>
      <div class="marble-verde p-6 rounded-xl" style="min-height: 120px;">
        <code class="text-sm">.marble-verde</code>
        <p class="text-sm mt-2" style="color: #f0ece0">Verde</p>
      </div>
      <div class="marble-rosa p-6 rounded-xl" style="min-height: 120px;">
        <code class="text-sm">.marble-rosa</code>
        <p class="text-sm mt-2 text-secondary">Rosa Portogallo</p>
      </div>
    </div>

    <h3 class="text-lg font-semibold mt-8 mb-4 font-serif">Granite</h3>
    <div class="grid grid-cols-3 gap-6" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
      <div class="granite" style="min-height: 120px;">
        <code class="text-sm">.granite</code>
        <p class="text-sm mt-2">Bianco Sardo</p>
      </div>
      <div class="granite-dark" style="min-height: 120px;">
        <code class="text-sm">.granite-dark</code>
        <p class="text-sm mt-2">Absolute Black</p>
      </div>
      <div class="granite-rose" style="min-height: 120px;">
        <code class="text-sm">.granite-rose</code>
        <p class="text-sm mt-2">Rosa Beta</p>
      </div>
      <div class="granite-verde" style="min-height: 120px;">
        <code class="text-sm">.granite-verde</code>
        <p class="text-sm mt-2">Verde Butterfly</p>
      </div>
    </div>

    <h3 class="text-lg font-semibold mt-8 mb-4 font-serif">Metallic Surfaces</h3>
    <div class="grid grid-cols-3 gap-6" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
      <div class="gold-surface p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.gold-surface</code>
      </div>
      <div class="silver-surface p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.silver-surface</code>
      </div>
      <div class="bronze-surface p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.bronze-surface</code>
      </div>
      <div class="copper-surface p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.copper-surface</code>
      </div>
      <div class="platinum-surface p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.platinum-surface</code>
      </div>
    </div>

    <h3 class="text-lg font-semibold mt-8 mb-4 font-serif">Stone Finishes</h3>
    <div class="grid grid-cols-3 gap-6" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
      <div class="stone-carved p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.stone-carved</code>
        <p class="text-sm mt-2 text-secondary">Carved inset</p>
      </div>
      <div class="stone-polished p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.stone-polished</code>
        <p class="text-sm mt-2 text-secondary">Polished</p>
      </div>
      <div class="stone-rough p-6 rounded-xl" style="min-height: 100px;">
        <code class="text-sm">.stone-rough</code>
        <p class="text-sm mt-2 text-secondary">Rough grain</p>
      </div>
    </div>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  ${sectionHeading('Ornamental Dividers', 'dividers', 'Classical ornamental separators.')}

  <div class="specimen-block mt-8 flex flex-col gap-8">
    <div>
      <code class="text-xs text-muted mb-2 block">.ornament-divider</code>
      <div class="ornament-divider"></div>
    </div>
    <div>
      <code class="text-xs text-muted mb-2 block">.ornament-divider-greek-key</code>
      <div class="ornament-divider-greek-key"></div>
    </div>
    <div>
      <code class="text-xs text-muted mb-2 block">.ornament-divider-scrollwork</code>
      <div class="ornament-divider-scrollwork"></div>
    </div>
    <div>
      <code class="text-xs text-muted mb-2 block">.ornament-divider-dentil</code>
      <div class="ornament-divider-dentil"></div>
    </div>
    <div>
      <code class="text-xs text-muted mb-2 block">.ornament-divider-filigree</code>
      <div class="ornament-divider-filigree"></div>
    </div>
    <div>
      <code class="text-xs text-muted mb-2 block">.ornament-divider-rococo</code>
      <div class="ornament-divider-rococo"></div>
    </div>
    <div>
      <code class="text-xs text-muted mb-2 block">.ornament-acanthus</code>
      <div class="ornament-acanthus"></div>
    </div>
    <div>
      <code class="text-xs text-muted mb-2 block">.ornament-divider-fleur</code>
      <div class="ornament-divider-fleur"></div>
    </div>
  </div>

</div>
`;
}
