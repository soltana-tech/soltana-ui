/** Typography system reference page — visual specimens for weights, scale, and families. */

import { sectionHeading } from '../../utils/helpers';

const WEIGHTS: [string, number][] = [
  ['Light', 300],
  ['Regular', 400],
  ['Medium', 500],
  ['Semibold', 600],
  ['Bold', 700],
  ['Extrabold', 800],
];

const TYPE_SCALE: [string, string, string, string][] = [
  ['--text-5xl', 'text-5xl', 'Display Heading', 'font-bold'],
  ['--text-4xl', 'text-4xl', 'Hero Title', 'font-bold'],
  ['--text-3xl', 'text-3xl', 'Page Title', 'font-bold'],
  ['--text-2xl', 'text-2xl', 'Section Heading', 'font-semibold'],
  ['--text-xl', 'text-xl', 'Subsection Title', 'font-semibold'],
  ['--text-lg', 'text-lg', 'Card Title / Large Text', 'font-medium'],
  ['--text-base', 'text-base', 'Body text for paragraphs and content', ''],
  ['--text-sm', 'text-sm', 'Secondary text, labels, and UI elements', ''],
  ['--text-xs', 'text-xs', 'Captions, hints, and metadata', ''],
];

const TRACKING: [string, string, string][] = [
  ['--tracking-refined', 'tracking-refined', '0.02em'],
  ['--tracking-elegant', 'tracking-elegant', '0.04em'],
  ['--tracking-display', 'tracking-display', '0.08em'],
  ['--tracking-inscriptional', 'tracking-inscriptional', '0.12em'],
];

function weightCard(name: string, value: number): string {
  return `
    <div class="card p-5 rounded-xl">
      <p class="text-4xl mb-4" style="font-weight: ${String(value)}">Aa</p>
      <p class="text-base font-medium">${name}</p>
      <p class="text-sm text-muted font-mono">${String(value)}</p>
    </div>`;
}

function scaleRow(varName: string, sizeClass: string, label: string, weightClass: string): string {
  return `
    <div class="flex items-baseline gap-4 py-3" style="border-bottom: 1px solid var(--border-subtle);">
      <code class="text-xs text-muted font-mono flex-shrink-0" style="min-width: 7rem">${varName}</code>
      <span class="${sizeClass} ${weightClass} flex-1">${label}</span>
    </div>`;
}

export function renderTypography(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-typography">

  ${sectionHeading('Typography', 'typography', 'Raleway is a clean geometric sans-serif for body text and UI elements. Cinzel is used for display headings and branding. Available in weights from Light to Extrabold.')}

  <h3 class="text-2xl font-semibold mt-10 mb-4">Font Weights</h3>
  <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))">
    ${WEIGHTS.map(([name, val]) => weightCard(name, val)).join('')}
  </div>

  <h3 class="text-2xl font-semibold mt-12 mb-4">Type Scale</h3>
  <div class="card p-6 rounded-xl">
    ${TYPE_SCALE.map(([v, c, l, w]) => scaleRow(v, c, l, w)).join('')}
  </div>

  <h3 class="text-2xl font-semibold mt-12 mb-4">Font Families</h3>
  <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
    <div class="card p-5 rounded-xl">
      <span class="tag mb-2">--font-serif</span>
      <p class="text-3xl font-serif mt-3">Cinzel</p>
      <p class="text-sm text-secondary mt-2">Branding, display text, opt-in via <code>.font-serif</code></p>
    </div>
    <div class="card p-5 rounded-xl">
      <span class="tag mb-2">--font-sans</span>
      <p class="text-3xl font-sans mt-3">Raleway</p>
      <p class="text-sm text-secondary mt-2">Body text, UI elements, buttons</p>
    </div>
    <div class="card p-5 rounded-xl">
      <span class="tag mb-2">--font-mono</span>
      <p class="text-3xl font-mono mt-3">JetBrains Mono</p>
      <p class="text-sm text-secondary mt-2">Code, technical content</p>
    </div>
  </div>

  <h3 class="text-2xl font-semibold mt-12 mb-4">Letter Spacing</h3>
  <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
    ${TRACKING.map(
      ([varName, cls, val]) => `
      <div class="card p-5 rounded-xl">
        <p class="text-xl ${cls}">Soltana Design</p>
        <p class="text-sm text-muted font-mono mt-3">${varName}</p>
        <p class="text-xs text-secondary">${val}</p>
      </div>`
    ).join('')}
  </div>

</div>`;
  return page;
}
