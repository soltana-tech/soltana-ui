/** Layout utilities and spacing system reference page — visual specimens. */

import { sectionHeading } from '../../utils/helpers';

const SPACING_STEPS: [string, string][] = [
  ['0', '0px'],
  ['1', '0.25rem'],
  ['2', '0.5rem'],
  ['3', '0.75rem'],
  ['4', '1rem'],
  ['6', '1.5rem'],
  ['8', '2rem'],
  ['12', '3rem'],
  ['16', '4rem'],
  ['24', '6rem'],
];

function spacingRow(step: string, value: string): string {
  const width = step === '0' ? '2px' : `calc(${step} * 0.25rem)`;
  return `
    <div class="flex items-center gap-4">
      <code class="text-sm font-mono text-muted flex-shrink-0" style="min-width: 2rem; text-align: right;">${step}</code>
      <div class="rounded" style="height: 1.25rem; width: ${width}; min-width: 2px; background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));"></div>
      <span class="text-sm text-secondary">${value}</span>
    </div>`;
}

function demoBox(label?: string): string {
  const text = label ?? '';
  return `<div class="rounded-lg p-3 text-xs text-center font-mono" style="background: color-mix(in srgb, var(--accent-primary) 15%, transparent); border: 1px solid var(--accent-primary); min-height: 2.5rem; display: flex; align-items: center; justify-content: center;">${text}</div>`;
}

function tallBox(h: string): string {
  return `<div class="rounded-lg p-2 text-xs text-center font-mono" style="background: color-mix(in srgb, var(--accent-primary) 15%, transparent); border: 1px solid var(--accent-primary); height: ${h}; display: flex; align-items: center; justify-content: center;">${h}</div>`;
}

function layoutCard(title: string, classes: string, content: string): string {
  return `
    <div class="card rounded-xl overflow-hidden">
      <div class="p-5">${content}</div>
      <div class="px-5 py-3 border-t border-subtle">
        <p class="text-base font-medium">${title}</p>
        <code class="text-xs text-muted font-mono">${classes}</code>
      </div>
    </div>`;
}

const RADII: [string, string][] = [
  ['rounded-sm', 'sm'],
  ['rounded-md', 'md'],
  ['rounded-lg', 'lg'],
  ['rounded-xl', 'xl'],
  ['rounded-2xl', '2xl'],
  ['rounded-full', 'full'],
];

const SHADOWS: [string, string][] = [
  ['shadow-sm', 'Small'],
  ['shadow', 'Default'],
  ['shadow-md', 'Medium'],
  ['shadow-lg', 'Large'],
  ['shadow-xl', 'Extra Large'],
  ['shadow-inner', 'Inner'],
];

export function renderLayout(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-layout">

  ${sectionHeading('Layout & Spacing', 'layout', 'Spacing tokens, flexbox and grid utilities, and visual property references.')}

  <h3 class="text-2xl font-semibold mt-10 mb-4">Spacing Scale</h3>
  <div class="card p-6 rounded-xl">
    <div class="flex flex-col gap-3">
      ${SPACING_STEPS.map(([s, v]) => spacingRow(s, v)).join('')}
    </div>
  </div>

  <h3 class="text-2xl font-semibold mt-12 mb-4">Flexbox</h3>
  <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))">
    ${layoutCard(
      'Row',
      'flex gap-4',
      `<div class="flex gap-4">${demoBox('1')}${demoBox('2')}${demoBox('3')}</div>`
    )}
    ${layoutCard(
      'Column',
      'flex flex-col gap-3',
      `<div class="flex flex-col gap-3">${demoBox('1')}${demoBox('2')}${demoBox('3')}</div>`
    )}
    ${layoutCard(
      'Justify Between',
      'flex justify-between',
      `<div class="flex justify-between">${demoBox('Start')}${demoBox('Center')}${demoBox('End')}</div>`
    )}
    ${layoutCard(
      'Align Center',
      'flex items-center gap-4',
      `<div class="flex items-center gap-4">${tallBox('2rem')}${tallBox('4rem')}${tallBox('3rem')}</div>`
    )}
    ${layoutCard(
      'Wrap',
      'flex flex-wrap gap-2',
      `<div class="flex flex-wrap gap-2">${Array.from({ length: 8 }, (_, i) => demoBox(String(i + 1))).join('')}</div>`
    )}
    ${layoutCard(
      'Centered',
      'flex items-center justify-center',
      `<div class="flex items-center justify-center" style="min-height: 6rem;">${demoBox('Centered')}</div>`
    )}
  </div>

  <h3 class="text-2xl font-semibold mt-12 mb-4">Grid</h3>
  <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))">
    ${layoutCard(
      '2 Columns',
      'grid grid-cols-2 gap-4',
      `<div class="grid grid-cols-2 gap-4">${demoBox('1')}${demoBox('2')}${demoBox('3')}${demoBox('4')}</div>`
    )}
    ${layoutCard(
      '3 Columns',
      'grid grid-cols-3 gap-4',
      `<div class="grid grid-cols-3 gap-4">${demoBox('1')}${demoBox('2')}${demoBox('3')}${demoBox('4')}${demoBox('5')}${demoBox('6')}</div>`
    )}
    ${layoutCard(
      'Asymmetric',
      'grid gap-4 (1fr 2fr)',
      `<div class="grid gap-4" style="grid-template-columns: 1fr 2fr;">${demoBox('Sidebar')}${demoBox('Main')}</div>`
    )}
    ${layoutCard(
      'Auto-fill',
      'grid gap-3 (auto-fill, minmax)',
      `<div class="grid gap-3" style="grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));">${Array.from({ length: 6 }, (_, i) => demoBox(String(i + 1))).join('')}</div>`
    )}
  </div>

  <h3 class="text-2xl font-semibold mt-12 mb-4">Border Radius</h3>
  <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))">
    ${RADII.map(
      ([cls, label]) => `
      <div class="card p-4 rounded-xl text-center">
        <div class="${cls}" style="width: 3.5rem; height: 3.5rem; background: color-mix(in srgb, var(--accent-primary) 20%, transparent); border: 2px solid var(--accent-primary); margin: 0 auto;"></div>
        <code class="text-xs text-muted font-mono mt-3 block">.${cls}</code>
        <p class="text-xs text-secondary">${label}</p>
      </div>`
    ).join('')}
  </div>

  <h3 class="text-2xl font-semibold mt-12 mb-4">Shadows</h3>
  <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr))">
    ${SHADOWS.map(
      ([cls, label]) => `
      <div class="card p-5 rounded-xl ${cls}">
        <p class="text-base font-medium">${label}</p>
        <code class="text-xs text-muted font-mono">.${cls}</code>
      </div>`
    ).join('')}
  </div>

</div>`;
  return page;
}
