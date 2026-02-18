/** Design System — Color Palette page. */

import { sectionHeading } from '../../utils/helpers';

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

export function renderColors(): string {
  return `
<div class="page-colors">

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

</div>`;
}
