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
