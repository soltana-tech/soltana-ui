/** Foundation page — Colors, Typography, Spacing specimens. */

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
    </div>`;
}

export function renderFoundation(): string {
  return `
<div class="page-foundation">

  ${sectionHeading('Color System', 'colors', 'Extended Dracula palette with semantic, pastel, and sepia variants. Click any swatch to copy its CSS variable.')}

  <!-- Dracula Core -->
  <h3 class="text-xl font-semibold mt-8 mb-4">Dracula Core</h3>
  <div class="swatch-grid">
    ${colorSwatch('Background', '--dracula-bg', '#282a36')}
    ${colorSwatch('Current Line', '--dracula-current', '#44475a')}
    ${colorSwatch('Foreground', '--dracula-fg', '#f8f8f2')}
    ${colorSwatch('Comment', '--dracula-comment', '#6272a4')}
    ${colorSwatch('Cyan', '--dracula-cyan', '#8be9fd')}
    ${colorSwatch('Green', '--dracula-green', '#50fa7b')}
    ${colorSwatch('Orange', '--dracula-orange', '#ffb86c')}
    ${colorSwatch('Pink', '--dracula-pink', '#ff79c6')}
    ${colorSwatch('Purple', '--dracula-purple', '#bd93f9')}
    ${colorSwatch('Red', '--dracula-red', '#ff5555')}
    ${colorSwatch('Yellow', '--dracula-yellow', '#f1fa8c')}
  </div>

  <!-- Semantic Colors -->
  <h3 class="text-xl font-semibold mt-8 mb-4">Semantic Colors</h3>
  <div class="swatch-grid">
    ${colorSwatch('Success', '--color-success', 'theme')}
    ${colorSwatch('Success Subtle', '--color-success-subtle', 'theme')}
    ${colorSwatch('Warning', '--color-warning', 'theme')}
    ${colorSwatch('Warning Subtle', '--color-warning-subtle', 'theme')}
    ${colorSwatch('Error', '--color-error', 'theme')}
    ${colorSwatch('Error Subtle', '--color-error-subtle', 'theme')}
    ${colorSwatch('Info', '--color-info', 'theme')}
    ${colorSwatch('Info Subtle', '--color-info-subtle', 'theme')}
  </div>

  <!-- Surface Colors -->
  <h3 class="text-xl font-semibold mt-8 mb-4">Surfaces</h3>
  <div class="swatch-grid">
    ${colorSwatch('Surface BG', '--surface-bg', 'theme')}
    ${colorSwatch('Surface 1', '--surface-1', 'theme')}
    ${colorSwatch('Surface 2', '--surface-2', 'theme')}
    ${colorSwatch('Surface 3', '--surface-3', 'theme')}
    ${colorSwatch('Surface 4', '--surface-4', 'theme')}
  </div>

  <!-- Accent Colors -->
  <h3 class="text-xl font-semibold mt-8 mb-4">Accents</h3>
  <div class="swatch-grid">
    ${colorSwatch('Primary', '--accent-primary', 'theme')}
    ${colorSwatch('Primary Hover', '--accent-primary-hover', 'theme')}
    ${colorSwatch('Primary Active', '--accent-primary-active', 'theme')}
    ${colorSwatch('Secondary', '--accent-secondary', 'theme')}
    ${colorSwatch('Secondary Hover', '--accent-secondary-hover', 'theme')}
    ${colorSwatch('Secondary Active', '--accent-secondary-active', 'theme')}
  </div>

  <!-- Gray Scale -->
  <h3 class="text-xl font-semibold mt-8 mb-4">Neutrals</h3>
  <div class="swatch-grid">
    ${colorSwatch('Gray 50', '--gray-50', '#fafafa')}
    ${colorSwatch('Gray 100', '--gray-100', '#f4f4f5')}
    ${colorSwatch('Gray 200', '--gray-200', '#e4e4e7')}
    ${colorSwatch('Gray 300', '--gray-300', '#d4d4d8')}
    ${colorSwatch('Gray 400', '--gray-400', '#a1a1aa')}
    ${colorSwatch('Gray 500', '--gray-500', '#71717a')}
    ${colorSwatch('Gray 600', '--gray-600', '#52525b')}
    ${colorSwatch('Gray 700', '--gray-700', '#3f3f46')}
    ${colorSwatch('Gray 800', '--gray-800', '#27272a')}
    ${colorSwatch('Gray 900', '--gray-900', '#18181b')}
    ${colorSwatch('Gray 950', '--gray-950', '#09090b')}
  </div>

  <!-- Pastels -->
  <h3 class="text-xl font-semibold mt-8 mb-4">Pastels</h3>
  <div class="swatch-grid">
    ${colorSwatch('Lilac', '--pastel-lilac', '#e1d5f3')}
    ${colorSwatch('Peach', '--pastel-peach', '#f8e8d5')}
    ${colorSwatch('Mint', '--pastel-mint', '#d5f3e8')}
    ${colorSwatch('Blush', '--pastel-blush', '#ffd5e5')}
    ${colorSwatch('Sky', '--pastel-sky', '#d5e8f8')}
    ${colorSwatch('Lemon', '--pastel-lemon', '#f3f1d5')}
    ${colorSwatch('Lavender', '--pastel-lavender', '#d8d5f3')}
    ${colorSwatch('Rose', '--pastel-rose', '#f3d5d8')}
    ${colorSwatch('Sage', '--pastel-sage', '#d5e8d5')}
    ${colorSwatch('Coral', '--pastel-coral', '#f3dbd5')}
  </div>

  <!-- Sepia -->
  <h3 class="text-xl font-semibold mt-8 mb-4">Sepia</h3>
  <div class="swatch-grid">
    ${colorSwatch('Cream', '--sepia-cream', '#f4ede1')}
    ${colorSwatch('Parchment', '--sepia-parchment', '#ede3d1')}
    ${colorSwatch('Tan', '--sepia-tan', '#dcc9b3')}
    ${colorSwatch('Sand', '--sepia-sand', '#c4a97d')}
    ${colorSwatch('Coffee', '--sepia-coffee', '#8b7355')}
    ${colorSwatch('Chocolate', '--sepia-chocolate', '#5c4033')}
    ${colorSwatch('Walnut', '--sepia-walnut', '#4a3728')}
    ${colorSwatch('Espresso', '--sepia-espresso', '#3b2d22')}
  </div>

  <hr class="divider mt-12 mb-12" />

  ${sectionHeading('Typography', 'typography', 'Space Grotesk — a geometric grotesque available in weights 300–700.')}

  <!-- Font Family Specimen -->
  <div class="specimen-block mt-8">
    <h3 class="text-xl font-semibold mb-4">Font Family</h3>
    <div class="card">
      <div class="card-body">
        <p class="text-4xl mb-4" style="font-family: var(--font-sans)">Space Grotesk</p>
        <p class="text-lg text-secondary mb-4" style="font-family: var(--font-sans)">
          ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>
          abcdefghijklmnopqrstuvwxyz<br/>
          0123456789 !@#$%^&amp;*()
        </p>
        <p class="text-base text-secondary" style="font-family: var(--font-mono)">
          <code>var(--font-mono)</code>: JetBrains Mono — 0123456789 {} [] () =&gt;
        </p>
      </div>
    </div>
  </div>

  <!-- Font Weights -->
  <div class="specimen-block mt-8">
    <h3 class="text-xl font-semibold mb-4">Font Weights</h3>
    <div class="card">
      <div class="card-body flex flex-col gap-4">
        <p class="text-2xl font-light">Light (300) — The quick brown fox jumps</p>
        <p class="text-2xl font-regular">Regular (400) — The quick brown fox jumps</p>
        <p class="text-2xl font-medium">Medium (500) — The quick brown fox jumps</p>
        <p class="text-2xl font-semibold">Semibold (600) — The quick brown fox jumps</p>
        <p class="text-2xl font-bold">Bold (700) — The quick brown fox jumps</p>
      </div>
    </div>
  </div>

  <!-- Type Scale -->
  <div class="specimen-block mt-8">
    <h3 class="text-xl font-semibold mb-4">Type Scale</h3>
    <div class="card">
      <div class="card-body flex flex-col gap-3">
        <div class="flex items-baseline gap-4">
          <code class="text-xs text-muted" style="min-width: 5rem">.text-xs</code>
          <span class="text-xs">Extra small (0.75rem / 12px)</span>
        </div>
        <div class="flex items-baseline gap-4">
          <code class="text-xs text-muted" style="min-width: 5rem">.text-sm</code>
          <span class="text-sm">Small (0.875rem / 14px)</span>
        </div>
        <div class="flex items-baseline gap-4">
          <code class="text-xs text-muted" style="min-width: 5rem">.text-base</code>
          <span class="text-base">Base (1rem / 16px)</span>
        </div>
        <div class="flex items-baseline gap-4">
          <code class="text-xs text-muted" style="min-width: 5rem">.text-lg</code>
          <span class="text-lg">Large (1.125rem / 18px)</span>
        </div>
        <div class="flex items-baseline gap-4">
          <code class="text-xs text-muted" style="min-width: 5rem">.text-xl</code>
          <span class="text-xl">Extra Large (1.25rem / 20px)</span>
        </div>
        <div class="flex items-baseline gap-4">
          <code class="text-xs text-muted" style="min-width: 5rem">.text-2xl</code>
          <span class="text-2xl">2XL (1.5rem / 24px)</span>
        </div>
        <div class="flex items-baseline gap-4">
          <code class="text-xs text-muted" style="min-width: 5rem">.text-3xl</code>
          <span class="text-3xl">3XL (1.875rem / 30px)</span>
        </div>
        <div class="flex items-baseline gap-4">
          <code class="text-xs text-muted" style="min-width: 5rem">.text-4xl</code>
          <span class="text-4xl">4XL (2.25rem / 36px)</span>
        </div>
        <div class="flex items-baseline gap-4">
          <code class="text-xs text-muted" style="min-width: 5rem">.text-5xl</code>
          <span class="text-5xl">5XL (3rem / 48px)</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Headings -->
  <div class="specimen-block mt-8">
    <h3 class="text-xl font-semibold mb-4">Headings</h3>
    <div class="card">
      <div class="card-body flex flex-col gap-4">
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
      </div>
    </div>
  </div>

  <!-- Paragraph & Prose -->
  <div class="specimen-block mt-8">
    <h3 class="text-xl font-semibold mb-4">Prose</h3>
    <div class="card">
      <div class="card-body max-w-prose">
        <p class="mb-4">A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications. It bridges the gap between design and development, ensuring consistency at scale.</p>
        <p class="text-secondary mb-4">Secondary text is used for supporting information that does not need to be the primary focus but remains important for context.</p>
        <p class="text-muted"><small>Muted small text for captions, timestamps, or metadata.</small></p>
      </div>
    </div>
  </div>

  <hr class="divider mt-12 mb-12" />

  ${sectionHeading('Spacing', 'spacing', 'A consistent spacing scale based on a 4px (0.25rem) base unit.')}

  <div class="specimen-block mt-8">
    <h3 class="text-xl font-semibold mb-4">Spacing Scale</h3>
    <div class="card">
      <div class="card-body flex flex-col gap-2">
        ${[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24]
          .map(
            (s) => `
          <div class="flex items-center gap-4">
            <code class="text-xs text-muted" style="min-width: 4rem">${String(s)}</code>
            <div class="spacing-bar" style="width: calc(${String(s)} * 0.25rem); min-width: 2px; height: 1.25rem; background: var(--accent-primary); border-radius: var(--radius-sm);"></div>
            <span class="text-sm text-secondary">${String(s * 4)}px / ${String(s * 0.25)}rem</span>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  </div>

  <hr class="divider mt-12 mb-12" />

  ${sectionHeading('Shadows', 'shadows', 'Elevation tokens for layered interfaces.')}

  <div class="specimen-block mt-8">
    <div class="grid grid-cols-3 gap-6" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
      ${['shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-inner']
        .map(
          (cls) => `
        <div class="card ${cls}" style="min-height: 100px;">
          <div class="card-body flex items-center justify-center">
            <code class="text-sm">.${cls}</code>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  </div>

  <hr class="divider mt-12 mb-12" />

  ${sectionHeading('Border Radius', 'radii', 'Consistent corner rounding tokens.')}

  <div class="specimen-block mt-8">
    <div class="flex flex-wrap gap-6 items-end">
      ${[
        ['none', 'none'],
        ['sm', 'sm'],
        ['md', 'md'],
        ['', 'DEFAULT'],
        ['lg', 'lg'],
        ['xl', 'xl'],
        ['2xl', '2xl'],
        ['3xl', '3xl'],
        ['full', 'full'],
      ]
        .map(
          ([cls, label]) => `
        <div class="flex flex-col items-center gap-2">
          <div style="width: 4rem; height: 4rem; background: var(--accent-primary); border-radius: var(--radius-${label === 'DEFAULT' ? 'DEFAULT' : label});" class="rounded-${cls}"></div>
          <code class="text-xs">.rounded${cls ? '-' + cls : ''}</code>
        </div>
      `
        )
        .join('')}
    </div>
  </div>

</div>
`;
}
