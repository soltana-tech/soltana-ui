import { describe, it, expect } from 'vitest';
import { parseEnhancerFile, parseImperatives } from './extract-enhancers.js';

const ACCORDION_FIXTURE = `
import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';

export const ACCORDION_SELECTOR = '[data-sol-accordion]';

let _controller: AbortController | null = null;

/**
 * Enhance all [data-sol-accordion] elements with expand/collapse behavior,
 * keyboard navigation, and ARIA attributes.
 *
 * Expected structure:
 * \`\`\`html
 * <div data-sol-accordion>
 *   <div class="accordion-item active">
 *     <div class="accordion-header">Title</div>
 *     <div class="accordion-body">Content</div>
 *   </div>
 * </div>
 * \`\`\`
 *
 * Add \`data-accordion-exclusive\` for single-open mode.
 */
export function initAccordions(options?: EnhancerOptions): EnhancerCleanup {
  return { destroy() {} };
}
`;

const TOOLTIP_FIXTURE = `
import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';

export const TOOLTIP_SELECTOR = '[data-sol-tooltip]';

/**
 * Enhance all [data-sol-tooltip] elements with positioned tooltips.
 *
 * Attaches mouseenter/focus listeners that show a tooltip, and
 * mouseleave/blur/Escape listeners that hide it.
 */
export function initTooltips(options?: EnhancerOptions): EnhancerCleanup {
  return { destroy() {} };
}
`;

const TOAST_FIXTURE = `
import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';

export const TOAST_CONTAINER_SELECTOR = '[data-sol-toast-container]';

/**
 * Programmatically show a toast notification.
 * Creates DOM, animates in, and auto-dismisses after duration ms.
 */
export function showToast(opts: ToastOptions): HTMLElement {
  return document.createElement('div');
}

/**
 * Dismiss a specific toast element.
 */
export function dismissToast(toast: HTMLElement): void {}

/**
 * Enhance all [data-sol-toast-container] elements with ARIA attributes
 * and close button behavior on existing toasts.
 */
export function initToasts(options?: EnhancerOptions): EnhancerCleanup {
  return { destroy() {} };
}
`;

const NO_SELECTOR_FIXTURE = `
// Just some utility, not an enhancer
export function helperFn(): void {}
`;

describe('parseEnhancerFile', () => {
  it('extracts selector and init function from accordion', () => {
    const result = parseEnhancerFile('accordion', ACCORDION_FIXTURE);
    expect(result).not.toBeNull();
    expect(result!.selectorConst).toBe('ACCORDION_SELECTOR');
    expect(result!.selector).toBe('[data-sol-accordion]');
    expect(result!.initFunction).toBe('initAccordions');
    expect(result!.fileName).toBe('accordion');
  });

  it('extracts JSDoc description', () => {
    const result = parseEnhancerFile('accordion', ACCORDION_FIXTURE);
    expect(result!.description).toContain('Enhance all');
    expect(result!.description).toContain('[data-sol-accordion]');
  });

  it('extracts fenced HTML example', () => {
    const result = parseEnhancerFile('accordion', ACCORDION_FIXTURE);
    expect(result!.htmlExample).toContain('data-sol-accordion');
    expect(result!.htmlExample).toContain('accordion-header');
    expect(result!.htmlExample).toContain('accordion-body');
  });

  it('returns empty htmlExample when no fenced block', () => {
    const result = parseEnhancerFile('tooltip', TOOLTIP_FIXTURE);
    expect(result).not.toBeNull();
    expect(result!.htmlExample).toBe('');
    expect(result!.selector).toBe('[data-sol-tooltip]');
  });

  it('extracts toast enhancer with its selector', () => {
    const result = parseEnhancerFile('toast', TOAST_FIXTURE);
    expect(result).not.toBeNull();
    expect(result!.selector).toBe('[data-sol-toast-container]');
    expect(result!.initFunction).toBe('initToasts');
  });

  it('returns null for files without a selector constant', () => {
    const result = parseEnhancerFile('helper', NO_SELECTOR_FIXTURE);
    expect(result).toBeNull();
  });
});

describe('parseImperatives', () => {
  it('extracts showToast and dismissToast from toast fixture', () => {
    const imperatives = parseImperatives(TOAST_FIXTURE);
    expect(imperatives.length).toBe(2);
    expect(imperatives[0].name).toBe('showToast');
    expect(imperatives[0].description).toContain('toast notification');
    expect(imperatives[1].name).toBe('dismissToast');
  });

  it('returns empty array for file without imperative exports', () => {
    const imperatives = parseImperatives(ACCORDION_FIXTURE);
    expect(imperatives).toEqual([]);
  });
});
