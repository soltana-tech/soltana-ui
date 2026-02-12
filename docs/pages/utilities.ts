/** Utilities reference page — demonstrates all CSS utility classes. */

function utilSection(title: string, id: string, description: string, content: string): string {
  return `
    <div class="util-section mt-10" id="${id}">
      <h3 class="text-xl font-semibold mb-2">${title}</h3>
      <p class="text-secondary text-sm mb-4">${description}</p>
      ${content}
    </div>`;
}

function classTable(rows: [string, string][]): string {
  return `
    <div class="card overflow-x-auto">
      <table class="table">
        <thead><tr><th>Class</th><th>CSS Property</th></tr></thead>
        <tbody>
          ${rows.map(([cls, val]) => `<tr><td><code>.${cls}</code></td><td><code>${val}</code></td></tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

export function renderUtilities(): string {
  return `
<div class="page-utilities">
  <div class="section-heading" id="utilities-top">
    <h2 class="text-3xl font-bold">Utility Classes</h2>
    <p class="text-secondary mt-2">A comprehensive set of single-purpose CSS classes for rapid UI construction.</p>
  </div>

  <!-- Quick nav -->
  <div class="flex flex-wrap gap-2 mt-6 mb-8">
    ${[
      'Display',
      'Flexbox',
      'Grid',
      'Spacing',
      'Sizing',
      'Typography',
      'Colors',
      'Borders',
      'Shadows',
      'Opacity',
      'Transitions',
      'Transforms',
      'Position',
    ]
      .map(
        (s) => `
      <a href="#util-${s.toLowerCase()}" class="badge badge-pill">${s}</a>
    `
      )
      .join('')}
  </div>

  ${utilSection(
    'Display',
    'util-display',
    'Control element rendering mode.',
    classTable([
      ['block', 'display: block'],
      ['inline-block', 'display: inline-block'],
      ['inline', 'display: inline'],
      ['flex', 'display: flex'],
      ['inline-flex', 'display: inline-flex'],
      ['grid', 'display: grid'],
      ['hidden', 'display: none'],
      ['contents', 'display: contents'],
    ])
  )}

  ${utilSection(
    'Flexbox',
    'util-flexbox',
    'Flex container and item utilities.',
    `${classTable([
      ['flex-row', 'flex-direction: row'],
      ['flex-col', 'flex-direction: column'],
      ['flex-wrap', 'flex-wrap: wrap'],
      ['flex-nowrap', 'flex-wrap: nowrap'],
      ['flex-1', 'flex: 1 1 0%'],
      ['flex-auto', 'flex: 1 1 auto'],
      ['flex-none', 'flex: none'],
      ['items-center', 'align-items: center'],
      ['items-start', 'align-items: flex-start'],
      ['items-end', 'align-items: flex-end'],
      ['items-stretch', 'align-items: stretch'],
      ['justify-start', 'justify-content: flex-start'],
      ['justify-center', 'justify-content: center'],
      ['justify-end', 'justify-content: flex-end'],
      ['justify-between', 'justify-content: space-between'],
      ['justify-around', 'justify-content: space-around'],
      ['justify-evenly', 'justify-content: space-evenly'],
      ['grow', 'flex-grow: 1'],
      ['shrink-0', 'flex-shrink: 0'],
    ])}
    <div class="mt-4">
      <p class="text-sm font-medium mb-2">Live Example</p>
      <div class="card">
        <div class="card-body">
          <div class="flex gap-3 items-center justify-between p-4 rounded-lg" style="background: var(--surface-2)">
            <div class="p-3 rounded-lg bg-accent text-inverse text-sm font-medium">Item 1</div>
            <div class="p-3 rounded-lg bg-accent text-inverse text-sm font-medium">Item 2</div>
            <div class="p-3 rounded-lg bg-accent text-inverse text-sm font-medium">Item 3</div>
          </div>
          <code class="text-xs text-muted mt-2 block">.flex .gap-3 .items-center .justify-between</code>
        </div>
      </div>
    </div>`
  )}

  ${utilSection(
    'Grid',
    'util-grid',
    'CSS Grid template and span utilities.',
    `${classTable([
      ['grid', 'display: grid'],
      ['grid-cols-1 → 12', 'grid-template-columns: repeat(n, minmax(0, 1fr))'],
      ['col-span-1 → 12', 'grid-column: span n / span n'],
      ['col-span-full', 'grid-column: 1 / -1'],
      ['gap-0 → 24', 'gap: n * 0.25rem'],
      ['gap-x-*', 'column-gap: n * 0.25rem'],
      ['gap-y-*', 'row-gap: n * 0.25rem'],
    ])}
    <div class="mt-4">
      <p class="text-sm font-medium mb-2">Live Example — 3 Column Grid</p>
      <div class="card">
        <div class="card-body">
          <div class="grid grid-cols-3 gap-3">
            <div class="p-3 rounded-lg text-center text-sm font-medium" style="background: var(--surface-3)">1</div>
            <div class="p-3 rounded-lg text-center text-sm font-medium" style="background: var(--surface-3)">2</div>
            <div class="p-3 rounded-lg text-center text-sm font-medium" style="background: var(--surface-3)">3</div>
            <div class="p-3 rounded-lg text-center text-sm font-medium col-span-2" style="background: var(--accent-primary); color: var(--text-inverse)">Span 2</div>
            <div class="p-3 rounded-lg text-center text-sm font-medium" style="background: var(--surface-3)">5</div>
          </div>
          <code class="text-xs text-muted mt-2 block">.grid .grid-cols-3 .gap-3</code>
        </div>
      </div>
    </div>`
  )}

  ${utilSection(
    'Spacing',
    'util-spacing',
    'Margin and padding utilities using 0.25rem (4px) scale.',
    classTable([
      ['p-0 → p-64', 'padding: n * 0.25rem'],
      ['px-*, py-*', 'padding-left/right or top/bottom'],
      ['pt-*, pr-*, pb-*, pl-*', 'Individual side padding'],
      ['m-0 → m-64', 'margin: n * 0.25rem'],
      ['mx-*, my-*', 'margin-left/right or top/bottom'],
      ['mx-auto', 'margin-left: auto; margin-right: auto'],
    ])
  )}

  ${utilSection(
    'Sizing',
    'util-sizing',
    'Width, height, and max-width utilities.',
    classTable([
      ['w-full', 'width: 100%'],
      ['w-screen', 'width: 100vw'],
      ['w-1/2, w-1/3, w-2/3, w-1/4, w-3/4', 'Fractional widths'],
      ['h-full', 'height: 100%'],
      ['h-screen', 'height: 100vh'],
      ['max-w-sm → max-w-7xl', 'Max-width constraints'],
      ['max-w-prose', 'max-width: 65ch'],
      ['min-h-screen', 'min-height: 100vh'],
    ])
  )}

  ${utilSection(
    'Typography',
    'util-typography',
    'Font size, weight, alignment, and text utilities.',
    classTable([
      ['text-xs → text-9xl', 'Font size scale'],
      ['font-light → font-extrabold', 'Font weight 300–800'],
      ['text-left, text-center, text-right', 'Text alignment'],
      ['uppercase, lowercase, capitalize', 'Text transform'],
      ['tracking-tight → tracking-widest', 'Letter spacing'],
      ['leading-none → leading-loose', 'Line height'],
      ['truncate', 'Ellipsis overflow'],
      ['line-clamp-1 → line-clamp-3', 'Multi-line truncation'],
      ['underline, no-underline, line-through', 'Text decoration'],
    ])
  )}

  ${utilSection(
    'Colors',
    'util-colors',
    'Semantic background and text color utilities.',
    `${classTable([
      ['bg-surface → bg-surface-4', 'Themed surface backgrounds'],
      ['bg-accent, bg-accent-secondary', 'Accent backgrounds'],
      ['bg-success, bg-warning, bg-error, bg-info', 'Semantic backgrounds'],
      ['bg-success-subtle, ...', 'Subtle/muted semantic backgrounds'],
      ['bg-dracula-*', 'Raw Dracula palette backgrounds'],
      ['bg-pastel-*', 'Pastel palette backgrounds'],
      ['bg-sepia-*', 'Sepia palette backgrounds'],
      ['text-primary → text-muted', 'Themed text colors'],
      ['text-accent, text-success, ...', 'Semantic text colors'],
    ])}
    <div class="mt-4">
      <p class="text-sm font-medium mb-2">Live Example</p>
      <div class="card">
        <div class="card-body flex flex-wrap gap-3">
          <span class="p-3 rounded-lg bg-accent text-inverse text-sm">bg-accent</span>
          <span class="p-3 rounded-lg bg-success-subtle text-success text-sm">bg-success-subtle</span>
          <span class="p-3 rounded-lg bg-error-subtle text-error text-sm">bg-error-subtle</span>
          <span class="p-3 rounded-lg bg-warning-subtle text-warning text-sm">bg-warning-subtle</span>
          <span class="p-3 rounded-lg bg-info-subtle text-info text-sm">bg-info-subtle</span>
          <span class="p-3 rounded-lg bg-surface-3 text-secondary text-sm">bg-surface-3</span>
        </div>
      </div>
    </div>`
  )}

  ${utilSection(
    'Borders',
    'util-borders',
    'Border width, side, color, and radius utilities.',
    classTable([
      ['border', 'border: 1px solid var(--border-default)'],
      ['border-0', 'border: 0'],
      ['border-2', 'border: 2px solid var(--border-default)'],
      ['border-t, -b, -l, -r', 'Single-side borders'],
      ['border-subtle, -strong, -accent', 'Border color variants'],
      ['rounded-none → rounded-full', 'Border radius scale'],
    ])
  )}

  ${utilSection(
    'Shadows',
    'util-shadows',
    'Box shadow elevation utilities.',
    classTable([
      ['shadow-sm', '0 1px 2px (subtle)'],
      ['shadow', '0 1px 3px (default)'],
      ['shadow-md', '0 4px 6px (medium)'],
      ['shadow-lg', '0 10px 15px (large)'],
      ['shadow-xl', '0 20px 25px (extra large)'],
      ['shadow-2xl', '0 25px 50px (huge)'],
      ['shadow-inner', 'inset 0 2px 4px'],
      ['shadow-none', 'none'],
    ])
  )}

  ${utilSection(
    'Opacity',
    'util-opacity',
    'Element opacity utilities.',
    classTable([
      ['opacity-0', 'opacity: 0'],
      ['opacity-25', 'opacity: 0.25'],
      ['opacity-50', 'opacity: 0.5'],
      ['opacity-75', 'opacity: 0.75'],
      ['opacity-100', 'opacity: 1'],
    ])
  )}

  ${utilSection(
    'Transitions',
    'util-transitions',
    'Transition property, duration, and easing utilities.',
    classTable([
      ['transition', 'Common properties with 150ms ease'],
      ['transition-all', 'All properties with 150ms ease'],
      ['transition-none', 'No transition'],
      ['duration-fast', '75ms'],
      ['duration-normal', '150ms'],
      ['duration-slow', '300ms'],
      ['duration-slower', '500ms'],
      ['ease-in, ease-out, ease-in-out', 'Timing functions'],
    ])
  )}

  ${utilSection(
    'Transforms',
    'util-transforms',
    'Scale and rotation transform utilities.',
    classTable([
      ['scale-95, scale-100, scale-105, scale-110', 'Scale transforms'],
      ['rotate-45, rotate-90, rotate-180', 'Rotation transforms'],
      ['-rotate-45, -rotate-90', 'Negative rotations'],
    ])
  )}

  ${utilSection(
    'Position',
    'util-position',
    'Positioning, z-index, and overflow utilities.',
    classTable([
      ['relative, absolute, fixed, sticky, static', 'Position modes'],
      ['inset-0, top-0, right-0, bottom-0, left-0', 'Edge positioning'],
      ['z-0, z-10, z-20, z-30, z-40, z-50', 'Z-index scale'],
      ['overflow-auto, -hidden, -visible, -scroll', 'Overflow control'],
      ['overflow-x-auto, overflow-y-auto', 'Axis-specific overflow'],
    ])
  )}

  ${utilSection(
    'Interaction',
    'util-interaction',
    'Cursor, pointer events, and selection utilities.',
    classTable([
      ['cursor-pointer, cursor-default, cursor-not-allowed', 'Cursor styles'],
      ['pointer-events-none, pointer-events-auto', 'Pointer events'],
      ['select-none, select-text, select-all', 'User selection'],
      ['focus-ring', 'Visible focus outline on :focus-visible'],
      ['sr-only', 'Screen reader only (visually hidden)'],
    ])
  )}

</div>
`;
}
