/**
 * HTML fixture generators for enhancer Playwright tests.
 * Each returns a self-contained HTML fragment suitable for setupSoltanaPage({ bodyHTML }).
 */

interface ModalOptions {
  id: string;
  triggerLabel?: string;
  closeLabel?: string;
  bodyContent?: string;
}

function buildModalHTML(options: ModalOptions): string {
  const { id, triggerLabel = 'Open Modal', closeLabel, bodyContent = '' } = options;
  const closeBtn = closeLabel ? `<button data-modal-close>${closeLabel}</button>` : '';
  return `
    <button data-modal-open="${id}">${triggerLabel}</button>
    <div id="${id}" data-sol-modal aria-hidden="true">
      <div class="modal-backdrop"></div>
      <div class="modal" role="dialog" aria-modal="true">
        ${closeBtn}
        ${bodyContent}
      </div>
    </div>`;
}

export function modalHTML(id = 'test-modal'): string {
  return buildModalHTML({
    id,
    closeLabel: 'Close',
    bodyContent:
      '<input type="text" placeholder="Focus target" />\n        <button>Another button</button>',
  });
}

export function multiModalHTML(): string {
  return `
    ${modalHTML('modal-a')}
    ${buildModalHTML({
      id: 'modal-b',
      triggerLabel: 'Open Modal B',
      closeLabel: 'Close B',
      bodyContent: '<a href="#">Link in B</a>',
    })}`;
}

export function modalNoFocusableHTML(id = 'no-focus-modal'): string {
  return buildModalHTML({
    id,
    triggerLabel: 'Open',
    bodyContent: '<p>No focusable elements here.</p>',
  });
}

export function tabsHTML(tabCount = 3): string {
  const tabs = Array.from({ length: tabCount }, (_, i) => {
    const selected = i === 0 ? ' aria-selected="true"' : '';
    return `<button role="tab"${selected}>Tab ${String(i + 1)}</button>`;
  }).join('\n        ');

  const panels = Array.from({ length: tabCount }, (_, i) => {
    const hidden = i > 0 ? ' hidden' : '';
    return `<div role="tabpanel"${hidden}>Panel ${String(i + 1)}</div>`;
  }).join('\n      ');

  return `
    <div data-sol-tabs id="test-tabs">
      <div role="tablist">
        ${tabs}
      </div>
      ${panels}
    </div>`;
}

export function tooltipHTML(text = 'Help text', position?: string): string {
  const posAttr = position ? ` data-tooltip-position="${position}"` : '';
  return `<button data-sol-tooltip="${text}"${posAttr} style="margin: 100px;">Hover me</button>`;
}

export function multiTooltipHTML(): string {
  return `
    <button data-sol-tooltip="First tooltip" style="margin: 100px;">First</button>
    <button data-sol-tooltip="Second tooltip" style="margin: 100px;">Second</button>`;
}

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

export function accordionHTML(itemCount = 3, exclusive = false): string {
  const exclusiveAttr = exclusive ? ' data-accordion-exclusive' : '';
  const items = Array.from({ length: itemCount }, (_, i) => {
    const active = i === 0 ? ' active' : '';
    return `
      <div class="accordion-item${active}">
        <div class="accordion-header">Section ${String(i + 1)}</div>
        <div class="accordion-body">
          <p>Content for section ${String(i + 1)}.</p>
          <button>Button in ${String(i + 1)}</button>
        </div>
      </div>`;
  }).join('');

  return `
    <div data-sol-accordion${exclusiveAttr} class="accordion" id="test-accordion">
      ${items}
    </div>`;
}

// ---------------------------------------------------------------------------
// Dropdown
// ---------------------------------------------------------------------------

export function dropdownHTML(): string {
  return `
    <div data-sol-dropdown class="dropdown" id="test-dropdown">
      <button class="btn dropdown-toggle">Options</button>
      <div class="dropdown-menu" role="menu">
        <button class="dropdown-item" role="menuitem">Edit</button>
        <button class="dropdown-item" role="menuitem">Duplicate</button>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" role="menuitem">Delete</button>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Drawer
// ---------------------------------------------------------------------------

export function drawerHTML(id = 'test-drawer'): string {
  return `
    <button data-drawer-open="${id}">Open Drawer</button>
    <div id="${id}" data-sol-drawer aria-hidden="true">
      <div class="drawer-backdrop"></div>
      <div class="drawer drawer-end" role="dialog" aria-label="Test drawer">
        <div class="drawer-header">
          <h4>Drawer Title</h4>
          <button data-drawer-close>Close</button>
        </div>
        <div class="drawer-body">
          <input type="text" placeholder="Focus target" />
          <button>Another button</button>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------

export function toastContainerHTML(): string {
  return `
    <div data-sol-toast-container class="toast-container toast-container-top-right">
      <div class="toast toast-success active" style="position: static; opacity: 1;">
        <div class="toast-header">
          <strong class="text-sm">Success</strong>
          <button class="close close-sm"></button>
        </div>
        <div class="toast-body text-sm">Changes saved successfully.</div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Collapsible
// ---------------------------------------------------------------------------

export function collapsibleHTML(): string {
  return `
    <div data-sol-collapsible class="collapsible collapsible-bordered" id="test-collapsible">
      <button class="collapsible-trigger">Toggle Content</button>
      <div class="collapsible-content">
        <p>Collapsible content here.</p>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Combobox
// ---------------------------------------------------------------------------

export function comboboxHTML(): string {
  return `
    <div data-sol-combobox class="combobox" id="test-combobox">
      <input class="combobox-input input" placeholder="Search..." role="combobox" aria-expanded="false" />
      <div class="combobox-listbox" role="listbox">
        <div class="combobox-option" role="option" data-sol-combobox-option>React</div>
        <div class="combobox-option" role="option" data-sol-combobox-option>Vue</div>
        <div class="combobox-option" role="option" data-sol-combobox-option>Angular</div>
        <div class="combobox-option" role="option" data-sol-combobox-option>Svelte</div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Hover Card
// ---------------------------------------------------------------------------

export function hoverCardHTML(): string {
  return `
    <div data-sol-hover-card class="hover-card" id="test-hover-card">
      <button class="hover-card-trigger">Hover me</button>
      <div class="hover-card-content">
        <p>Hover card content with details.</p>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Context Menu
// ---------------------------------------------------------------------------

export function contextMenuHTML(): string {
  return `
    <div data-sol-context-menu id="test-context-menu">
      <div class="context-menu-area" style="width: 300px; height: 200px; background: var(--surface-1);">
        Right-click here
      </div>
      <div class="context-menu" role="menu">
        <button class="context-menu-item" role="menuitem">Cut</button>
        <button class="context-menu-item" role="menuitem">Copy</button>
        <button class="context-menu-item" role="menuitem">Paste</button>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Carousel
// ---------------------------------------------------------------------------

export function carouselHTML(slideCount = 3): string {
  const slides = Array.from(
    { length: slideCount },
    (_, i) =>
      `<div class="carousel-slide" style="background: var(--surface-3); height: 120px; display: flex; align-items: center; justify-content: center;">Slide ${String(i + 1)}</div>`
  ).join('\n          ');

  return `
    <div data-sol-carousel class="carousel" id="test-carousel" style="max-width: 400px;">
      <div class="carousel-track">
        ${slides}
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Scroll Area
// ---------------------------------------------------------------------------

export function scrollAreaHTML(): string {
  return `
    <div data-sol-scroll-area class="scroll-area" id="test-scroll-area" style="max-height: 120px; max-width: 300px;">
      <div style="padding: 1rem;">
        <p>Line 1</p><p>Line 2</p><p>Line 3</p><p>Line 4</p>
        <p>Line 5</p><p>Line 6</p><p>Line 7</p><p>Line 8</p>
        <p>Line 9</p><p>Line 10</p>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Date Picker
// ---------------------------------------------------------------------------

export function datePickerHTML(): string {
  return `
    <div data-sol-date-picker class="date-picker" id="test-date-picker" style="max-width: 300px;">
      <input class="date-picker-input input" placeholder="Pick a date" />
    </div>`;
}

// ---------------------------------------------------------------------------
// Color Picker
// ---------------------------------------------------------------------------

export function colorPickerHTML(): string {
  return `
    <div data-sol-color-picker class="color-picker" id="test-color-picker">
      <button class="color-picker-trigger" style="background: #d4a843;"></button>
      <div class="color-picker-popup">
        <div class="color-picker-area"></div>
        <div class="color-picker-hue"></div>
        <input class="color-picker-input input" value="#d4a843" />
        <div class="color-picker-swatches" data-swatches='["#d4a843","#a855f7","#3b82f6"]'></div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Tree
// ---------------------------------------------------------------------------

export function treeHTML(): string {
  return `
    <div data-sol-tree class="tree" id="test-tree" role="tree">
      <div class="tree-node tree-branch" role="treeitem" aria-expanded="true">
        <div class="tree-node-content">
          <span class="tree-toggle"></span>
          <span>Root</span>
        </div>
        <div class="tree-children" role="group">
          <div class="tree-node tree-leaf" role="treeitem">
            <div class="tree-node-content"><span>Child 1</span></div>
          </div>
          <div class="tree-node tree-branch" role="treeitem" aria-expanded="false">
            <div class="tree-node-content">
              <span class="tree-toggle"></span>
              <span>Child 2</span>
            </div>
            <div class="tree-children" role="group">
              <div class="tree-node tree-leaf" role="treeitem">
                <div class="tree-node-content"><span>Grandchild</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}
