/** Layout utilities and spacing system reference page. */

import { sectionHeading, specimenBlock, codeExample } from '../../utils/helpers';

export function renderLayout(): string {
  return `
<div class="page-layout">

  ${sectionHeading('Layout & Spacing', 'layout', 'Consistent spacing tokens, grid system, and utility classes for composing layouts.')}

  ${specimenBlock(
    'Spacing Scale',
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

  ${specimenBlock(
    'Spacing Utilities',
    `
    <p class="text-sm text-secondary mb-4">Apply spacing with utility classes for margin, padding, and gaps.</p>
    ${codeExample('<!-- Margin -->\n<div class="m-4">Margin all sides</div>\n<div class="mt-8 mb-4">Margin top and bottom</div>\n<div class="mx-auto">Margin auto horizontal</div>\n\n<!-- Padding -->\n<div class="p-6">Padding all sides</div>\n<div class="px-4 py-2">Padding x and y</div>\n\n<!-- Gap (for flex/grid) -->\n<div class="flex gap-3">\n  <div>Item 1</div>\n  <div>Item 2</div>\n</div>', 'html')}
  `
  )}

  ${specimenBlock(
    'Flexbox Utilities',
    `
    <p class="text-sm text-secondary mb-4">Control flexbox layouts with utility classes.</p>
    ${codeExample('<!-- Basic flex -->\n<div class="flex gap-4">\n  <div>Item 1</div>\n  <div>Item 2</div>\n</div>\n\n<!-- Flex with alignment -->\n<div class="flex items-center justify-between">\n  <span>Left</span>\n  <span>Right</span>\n</div>\n\n<!-- Flex direction -->\n<div class="flex flex-col gap-2">\n  <div>Top</div>\n  <div>Bottom</div>\n</div>\n\n<!-- Flex wrap -->\n<div class="flex flex-wrap gap-3">\n  <div>Item 1</div>\n  <div>Item 2</div>\n  <div>Item 3</div>\n</div>', 'html')}
    <div class="mt-6 p-4 card">
      <h4 class="font-semibold mb-3">Live Example</h4>
      <div class="flex items-center justify-between gap-4 p-4 border border-subtle rounded">
        <span class="badge badge-primary">Left</span>
        <span class="badge badge-secondary">Center</span>
        <span class="badge badge-accent">Right</span>
      </div>
    </div>
  `
  )}

  ${specimenBlock(
    'Grid System',
    `
    <p class="text-sm text-secondary mb-4">Responsive grid layouts using CSS Grid utilities.</p>
    ${codeExample('<!-- Auto-fill grid -->\n<div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">\n  <div class="card p-4">Card 1</div>\n  <div class="card p-4">Card 2</div>\n  <div class="card p-4">Card 3</div>\n</div>\n\n<!-- Fixed columns -->\n<div class="grid gap-6" style="grid-template-columns: 1fr 2fr">\n  <div class="card p-4">Sidebar</div>\n  <div class="card p-4">Main content</div>\n</div>', 'html')}
    <div class="mt-6">
      <h4 class="font-semibold mb-3">Live Example</h4>
      <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))">
        <div class="card p-4 text-center">1</div>
        <div class="card p-4 text-center">2</div>
        <div class="card p-4 text-center">3</div>
        <div class="card p-4 text-center">4</div>
      </div>
    </div>
  `
  )}

  ${specimenBlock(
    'Container & Centering',
    `
    ${codeExample('<!-- Container with auto margins -->\n<div class="container mx-auto px-4">\n  <p>Centered container with padding</p>\n</div>\n\n<!-- Max-width container -->\n<div class="mx-auto" style="max-width: 1200px;">\n  <p>Custom max-width container</p>\n</div>', 'html')}
  `
  )}

</div>`;
}
