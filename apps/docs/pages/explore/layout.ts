/** Layout utilities and spacing system reference page — visual specimens. */

import { sectionHeading } from '../../lib/helpers';

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

  <h3 class="text-2xl font-semibold mt-12 mb-4">Visual Utilities</h3>
  <p class="text-sm text-secondary mb-6">Classes from <code>_visual.scss</code> for backgrounds, opacity, animations, cursors, and interaction control.</p>

  <h4 class="text-lg font-semibold mt-6 mb-3">Background Colors</h4>
  <p class="text-sm text-secondary mb-4">Semantic background utilities mapped to design tokens.</p>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr><th>Class</th><th>Maps to</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.bg-surface</code></td><td><code>var(--surface-bg)</code></td></tr>
        <tr><td><code>.bg-surface-1</code> … <code>.bg-surface-4</code></td><td><code>var(--surface-1)</code> … <code>var(--surface-4)</code></td></tr>
        <tr><td><code>.bg-accent</code></td><td><code>var(--accent-primary)</code></td></tr>
        <tr><td><code>.bg-accent-secondary</code></td><td><code>var(--accent-secondary)</code></td></tr>
        <tr><td><code>.bg-success</code>, <code>.bg-success-subtle</code></td><td><code>var(--color-success)</code>, <code>var(--color-success-subtle)</code></td></tr>
        <tr><td><code>.bg-warning</code>, <code>.bg-warning-subtle</code></td><td><code>var(--color-warning)</code>, <code>var(--color-warning-subtle)</code></td></tr>
        <tr><td><code>.bg-error</code>, <code>.bg-error-subtle</code></td><td><code>var(--color-error)</code>, <code>var(--color-error-subtle)</code></td></tr>
        <tr><td><code>.bg-info</code>, <code>.bg-info-subtle</code></td><td><code>var(--color-info)</code>, <code>var(--color-info-subtle)</code></td></tr>
        <tr><td><code>.bg-gradient-accent</code></td><td>Diagonal gradient from <code>--accent-primary</code> to <code>--accent-secondary</code></td></tr>
        <tr><td><code>.bg-mesh</code></td><td>Multi-stop radial gradient mesh background</td></tr>
        <tr><td><code>.bg-fixed</code></td><td><code>background-attachment: fixed</code></td></tr>
      </tbody>
    </table>
  </div>

  <h4 class="text-lg font-semibold mt-6 mb-3">Opacity</h4>
  <p class="text-sm text-secondary mb-4">Fine-grained opacity steps from 0 to 100.</p>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr><th>Class</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.opacity-0</code></td><td>0</td></tr>
        <tr><td><code>.opacity-5</code>, <code>.opacity-10</code>, <code>.opacity-20</code>, <code>.opacity-25</code></td><td>0.05 – 0.25</td></tr>
        <tr><td><code>.opacity-30</code> … <code>.opacity-75</code></td><td>0.30 – 0.75</td></tr>
        <tr><td><code>.opacity-80</code>, <code>.opacity-90</code>, <code>.opacity-95</code>, <code>.opacity-100</code></td><td>0.80 – 1</td></tr>
      </tbody>
    </table>
  </div>

  <h4 class="text-lg font-semibold mt-6 mb-3">Animations</h4>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr><th>Class</th><th>Effect</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.animate-spin</code></td><td>Continuous 360&deg; rotation (1s linear)</td></tr>
        <tr><td><code>.animate-ping</code></td><td>Scale-up fade-out pulse</td></tr>
        <tr><td><code>.animate-pulse</code></td><td>Opacity pulse (2s ease)</td></tr>
        <tr><td><code>.animate-bounce</code></td><td>Vertical bounce</td></tr>
        <tr><td><code>.animate-none</code></td><td>Removes animation</td></tr>
      </tbody>
    </table>
  </div>

  <h4 class="text-lg font-semibold mt-6 mb-3">Cursor</h4>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr><th>Class</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.cursor-pointer</code></td><td><code>pointer</code></td></tr>
        <tr><td><code>.cursor-default</code></td><td><code>default</code></td></tr>
        <tr><td><code>.cursor-not-allowed</code></td><td><code>not-allowed</code></td></tr>
        <tr><td><code>.cursor-grab</code></td><td><code>grab</code></td></tr>
      </tbody>
    </table>
  </div>

  <h4 class="text-lg font-semibold mt-6 mb-3">Pointer Events, User Select &amp; Visibility</h4>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr><th>Class</th><th>Effect</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.pointer-events-none</code> / <code>.pointer-events-auto</code></td><td>Toggle pointer events</td></tr>
        <tr><td><code>.select-none</code> / <code>.select-text</code> / <code>.select-all</code></td><td>User select behavior</td></tr>
        <tr><td><code>.visible</code> / <code>.invisible</code> / <code>.hidden</code></td><td>Visibility and display control</td></tr>
      </tbody>
    </table>
  </div>

  <h3 class="text-2xl font-semibold mt-12 mb-4">Display Utilities</h3>
  <p class="text-sm text-secondary mb-6">Control element display mode from <code>_layouts.scss</code>.</p>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr><th>Class</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.block</code></td><td>display: block</td></tr>
        <tr><td><code>.inline-block</code></td><td>display: inline-block</td></tr>
        <tr><td><code>.inline</code></td><td>display: inline</td></tr>
        <tr><td><code>.flex</code></td><td>display: flex</td></tr>
        <tr><td><code>.inline-flex</code></td><td>display: inline-flex</td></tr>
        <tr><td><code>.grid</code></td><td>display: grid</td></tr>
        <tr><td><code>.inline-grid</code></td><td>display: inline-grid</td></tr>
        <tr><td><code>.hidden</code></td><td>display: none</td></tr>
        <tr><td><code>.contents</code></td><td>display: contents (element replaced by children)</td></tr>
      </tbody>
    </table>
  </div>

  <h3 class="text-2xl font-semibold mt-12 mb-4">Positioning Utilities</h3>
  <p class="text-sm text-secondary mb-6">Position mode and placement helpers from <code>_layouts.scss</code>.</p>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr><th>Class</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.relative</code></td><td>position: relative</td></tr>
        <tr><td><code>.absolute</code></td><td>position: absolute</td></tr>
        <tr><td><code>.fixed</code></td><td>position: fixed</td></tr>
        <tr><td><code>.sticky</code></td><td>position: sticky</td></tr>
        <tr><td><code>.static</code></td><td>position: static</td></tr>
        <tr><td><code>.inset-0</code></td><td>inset: 0 (top, right, bottom, left all 0)</td></tr>
        <tr><td><code>.top-0</code>, <code>.right-0</code>, <code>.bottom-0</code>, <code>.left-0</code></td><td>Individual edge positioning to 0</td></tr>
      </tbody>
    </table>
  </div>

  <h3 class="text-2xl font-semibold mt-12 mb-4">Sizing Utilities</h3>
  <p class="text-sm text-secondary mb-6">Width and height utilities from <code>_sizing.scss</code>.</p>

  <h4 class="text-lg font-semibold mt-6 mb-3">Fractional &amp; Keyword Widths</h4>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr><th>Class</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.w-1\\/2</code></td><td>50%</td></tr>
        <tr><td><code>.w-1\\/3</code>, <code>.w-2\\/3</code></td><td>33.333%, 66.667%</td></tr>
        <tr><td><code>.w-1\\/4</code>, <code>.w-3\\/4</code></td><td>25%, 75%</td></tr>
        <tr><td><code>.w-full</code></td><td>100%</td></tr>
        <tr><td><code>.w-screen</code></td><td>100vw</td></tr>
        <tr><td><code>.w-min</code> / <code>.w-max</code> / <code>.w-fit</code></td><td>min-content / max-content / fit-content</td></tr>
      </tbody>
    </table>
  </div>

  <h4 class="text-lg font-semibold mt-6 mb-3">Height</h4>
  <p class="text-sm text-secondary mb-4">Fractional heights mirror widths (<code>.h-1\\/2</code>, <code>.h-full</code>, etc.) plus <code>.h-screen</code> (100vh). Fixed-size heights use the spacing scale: <code>.h-0</code> through <code>.h-64</code>.</p>

  <h4 class="text-lg font-semibold mt-6 mb-3">Min-Height &amp; Max-Width</h4>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr><th>Class</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.min-h-0</code> / <code>.min-h-full</code> / <code>.min-h-screen</code></td><td>0 / 100% / 100vh</td></tr>
        <tr><td><code>.max-w-xs</code> … <code>.max-w-7xl</code></td><td>20rem – 80rem</td></tr>
        <tr><td><code>.max-w-full</code></td><td>100%</td></tr>
      </tbody>
    </table>
  </div>

  <h4 class="text-lg font-semibold mt-6 mb-3">Fixed Sizes (Spacing Scale)</h4>
  <p class="text-sm text-secondary mb-4">Both <code>.w-{step}</code> and <code>.h-{step}</code> are generated for every spacing token (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64).</p>

  <h3 class="text-2xl font-semibold mt-12 mb-4">Responsive Utilities</h3>
  <p class="text-sm text-secondary mb-6">Breakpoint-prefixed layout utilities from <code>_responsive.scss</code>. Prefix any supported class with a breakpoint name to apply it at that width and above.</p>

  <h4 class="text-lg font-semibold mt-6 mb-3">Breakpoints</h4>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr><th>Prefix</th><th>Min-width</th></tr>
      </thead>
      <tbody>
        <tr><td><code>sm:</code></td><td>640px</td></tr>
        <tr><td><code>md:</code></td><td>768px</td></tr>
        <tr><td><code>lg:</code></td><td>1024px</td></tr>
        <tr><td><code>xl:</code></td><td>1280px</td></tr>
        <tr><td><code>2xl:</code></td><td>1536px</td></tr>
      </tbody>
    </table>
  </div>

  <h4 class="text-lg font-semibold mt-6 mb-3">Available Responsive Classes</h4>
  <p class="text-sm text-secondary mb-4">The following utility groups are generated at each breakpoint:</p>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr><th>Category</th><th>Example</th></tr>
      </thead>
      <tbody>
        <tr><td>Display</td><td><code>.md\\:flex</code>, <code>.lg\\:hidden</code>, <code>.sm\\:block</code></td></tr>
        <tr><td>Flex direction &amp; wrap</td><td><code>.md\\:flex-col</code>, <code>.lg\\:flex-wrap</code></td></tr>
        <tr><td>Flex sizing</td><td><code>.md\\:flex-1</code>, <code>.lg\\:flex-none</code></td></tr>
        <tr><td>Alignment</td><td><code>.md\\:items-center</code>, <code>.lg\\:justify-between</code></td></tr>
        <tr><td>Grid</td><td><code>.md\\:grid-cols-2</code>, <code>.lg\\:grid-cols-4</code></td></tr>
        <tr><td>Position</td><td><code>.md\\:relative</code>, <code>.lg\\:sticky</code></td></tr>
        <tr><td>Overflow</td><td><code>.md\\:overflow-hidden</code></td></tr>
        <tr><td>Gap, padding, margin</td><td><code>.md\\:gap-4</code>, <code>.lg\\:p-6</code>, <code>.xl\\:m-8</code></td></tr>
        <tr><td>Auto margins</td><td><code>.md\\:mx-auto</code></td></tr>
        <tr><td>Width fractions &amp; max-widths</td><td><code>.md\\:w-1\\/2</code>, <code>.lg\\:max-w-xl</code></td></tr>
        <tr><td>Text alignment</td><td><code>.md\\:text-center</code></td></tr>
        <tr><td>Visibility</td><td><code>.md\\:visible</code>, <code>.lg\\:hidden</code></td></tr>
        <tr><td>Order</td><td><code>.md\\:order-1</code>, <code>.lg\\:order-last</code></td></tr>
      </tbody>
    </table>
  </div>
  <p class="text-sm text-secondary mt-4">Visual and tier classes are intentionally excluded from responsive prefixes — responsive concerns are limited to the layout sphere.</p>

  <h3 class="text-2xl font-semibold mt-12 mb-4">See Also</h3>
  <p class="text-sm text-secondary mb-4">
    For tier override utilities (<code>.theme-*</code>, <code>.relief-*</code>, <code>.finish-*</code>), see:
  </p>
  <ul class="text-secondary" style="padding-left: 1.5rem; list-style: disc;">
    <li><a href="/learn/themes" class="link">Themes</a> — <code>.theme-*</code> utility classes for per-element theme overrides</li>
    <li><a href="/learn/reliefs" class="link">Reliefs</a> — <code>.relief-*</code> utility classes for per-element shadow model overrides</li>
    <li><a href="/learn/finishes" class="link">Finishes</a> — <code>.finish-*</code> utility classes for per-element surface treatment overrides</li>
  </ul>

</div>`;
  return page;
}
