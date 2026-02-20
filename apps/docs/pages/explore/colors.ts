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

  <h3 class="text-2xl font-semibold mt-8 mb-4">Interactive State Tokens</h3>
  <p class="text-sm text-secondary mb-4">Background and ring colors for hover, active, focus, and disabled states. Derived from the accent primary color.</p>
  <div class="swatch-grid">
    ${liveSwatchCard('Hover', '--state-hover')}
    ${liveSwatchCard('Active', '--state-active')}
    ${liveSwatchCard('Focus Ring', '--state-focus-ring')}
    ${liveSwatchCard('Disabled BG', '--state-disabled-bg')}
    ${liveSwatchCard('Disabled Text', '--state-disabled-text')}
  </div>

  <h3 class="text-2xl font-semibold mt-8 mb-4">Channel Tokens</h3>
  <p class="text-sm text-secondary mb-4">Low-level R G B channel values (space-separated) used in <code>rgb()</code> expressions to build contextual shadows, highlights, and finish overlays. Not usable as standalone colors — combine with alpha via <code>rgb(var(--token) / &lt;alpha&gt;)</code>.</p>
  <div class="swatch-grid">
    ${liveSwatchCard('Shadow Color', '--shadow-color')}
    ${liveSwatchCard('Highlight Color', '--highlight-color')}
    ${liveSwatchCard('Sheen Color', '--channel-sheen-color')}
    ${liveSwatchCard('Tint Color', '--channel-tint-color')}
  </div>

  <h3 class="text-2xl font-semibold mt-8 mb-4">Component Tokens</h3>
  <p class="text-sm text-secondary mb-4">Scoped tokens consumed by specific components. Derived from the active theme seed and overridable via <code>setOverrides()</code>.</p>
  <div class="swatch-grid">
    ${liveSwatchCard('Input BG', '--input-bg')}
    ${liveSwatchCard('Input Border', '--input-border')}
    ${liveSwatchCard('Input Border Focus', '--input-border-focus')}
    ${liveSwatchCard('Input Placeholder', '--input-placeholder')}
    ${liveSwatchCard('Card BG', '--card-bg')}
    ${liveSwatchCard('Card Border', '--card-border')}
    ${liveSwatchCard('Badge BG', '--badge-bg')}
    ${liveSwatchCard('Tooltip BG', '--tooltip-bg')}
    ${liveSwatchCard('Tooltip Text', '--tooltip-text')}
    ${liveSwatchCard('Code BG', '--code-bg')}
    ${liveSwatchCard('Modal BG', '--modal-bg')}
    ${liveSwatchCard('Drawer BG', '--drawer-bg')}
    ${liveSwatchCard('Popover BG', '--popover-bg')}
    ${liveSwatchCard('Popover Border', '--popover-border')}
    ${liveSwatchCard('Toast BG', '--toast-bg')}
    ${liveSwatchCard('Toast Text', '--toast-text')}
    ${liveSwatchCard('Kbd BG', '--kbd-bg')}
    ${liveSwatchCard('Kbd Border', '--kbd-border')}
    ${liveSwatchCard('Scrollbar Thumb', '--scrollbar-thumb')}
    ${liveSwatchCard('Scrollbar Track', '--scrollbar-track')}
    ${liveSwatchCard('Overlay Backdrop', '--overlay-backdrop-bg')}
  </div>

</div>`;
  return page;
}
