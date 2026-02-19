/** Color palette reference page. */

import { sectionHeading } from '../../utils/helpers';

function liveSwatchCard(name: string, variable: string): string {
  return `
    <div class="card card-hover swatch flex items-center gap-3 p-2 rounded-xl border border-subtle cursor-pointer" data-copy="var(${variable})" title="Click to copy">
      <div class="swatch__color" style="background: var(${variable}); box-shadow: 0 2px 8px rgb(0 0 0 / 12%);"></div>
      <div class="flex flex-col min-w-0">
        <span class="swatch__name text-sm font-medium">${name}</span>
        <code class="text-xs text-muted">${variable}</code>
      </div>
    </div>`;
}

export function renderColors(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-colors">

  ${sectionHeading('Color Palette', 'colors', 'Live design tokens that adapt to the active theme. Click any item to copy its CSS variable.')}

  <h3 class="text-2xl font-semibold mt-6 mb-4">Surface Tokens</h3>
  <p class="text-sm text-secondary mb-4">Background layers from deepest to most elevated. Values change per theme.</p>
  <div class="swatch-grid">
    ${liveSwatchCard('Surface BG', '--surface-bg')}
    ${liveSwatchCard('Surface 1', '--surface-1')}
    ${liveSwatchCard('Surface 2', '--surface-2')}
    ${liveSwatchCard('Surface 3', '--surface-3')}
    ${liveSwatchCard('Surface 4', '--surface-4')}
  </div>

  <h3 class="text-2xl font-semibold mt-8 mb-4">Text Tokens</h3>
  <p class="text-sm text-secondary mb-4">Text color hierarchy from primary to muted.</p>
  <div class="swatch-grid">
    ${liveSwatchCard('Primary', '--text-primary')}
    ${liveSwatchCard('Secondary', '--text-secondary')}
    ${liveSwatchCard('Tertiary', '--text-tertiary')}
    ${liveSwatchCard('Muted', '--text-muted')}
    ${liveSwatchCard('Inverse', '--text-inverse')}
  </div>

  <h3 class="text-2xl font-semibold mt-8 mb-4">Border Tokens</h3>
  <p class="text-sm text-secondary mb-4">Border intensity levels.</p>
  <div class="swatch-grid">
    ${liveSwatchCard('Default', '--border-default')}
    ${liveSwatchCard('Subtle', '--border-subtle')}
    ${liveSwatchCard('Strong', '--border-strong')}
  </div>

  <h3 class="text-2xl font-semibold mt-8 mb-4">Accent Tokens</h3>
  <p class="text-sm text-secondary mb-4">Primary and secondary accent colors with interactive states.</p>
  <div class="swatch-grid">
    ${liveSwatchCard('Primary', '--accent-primary')}
    ${liveSwatchCard('Primary Hover', '--accent-primary-hover')}
    ${liveSwatchCard('Primary Active', '--accent-primary-active')}
    ${liveSwatchCard('Secondary', '--accent-secondary')}
    ${liveSwatchCard('Decorative', '--accent-decorative')}
  </div>

  <h3 class="text-2xl font-semibold mt-8 mb-4">Semantic Tokens</h3>
  <p class="text-sm text-secondary mb-4">Status colors for feedback and validation.</p>
  <div class="swatch-grid">
    ${liveSwatchCard('Success', '--color-success')}
    ${liveSwatchCard('Success Text', '--color-success-text')}
    ${liveSwatchCard('Warning', '--color-warning')}
    ${liveSwatchCard('Warning Text', '--color-warning-text')}
    ${liveSwatchCard('Error', '--color-error')}
    ${liveSwatchCard('Error Text', '--color-error-text')}
    ${liveSwatchCard('Info', '--color-info')}
    ${liveSwatchCard('Info Text', '--color-info-text')}
  </div>

</div>`;
  return page;
}
