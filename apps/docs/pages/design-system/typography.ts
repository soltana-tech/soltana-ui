/** Design System — Typography page. */

import { sectionHeading, specimenBlock } from '../../utils/helpers';

export function renderTypography(): string {
  return `
<div class="page-typography">

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
        <p class="text-2xl font-serif mt-2">Cinzel</p>
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

</div>`;
}
