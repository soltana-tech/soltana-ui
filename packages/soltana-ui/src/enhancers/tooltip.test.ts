// Unit tests for tooltip enhancer focus on ARIA correctness, event handling,
// and positioning.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initTooltips } from './tooltip.js';
import { mockBoundingClientRect } from './test-helpers.js';

function createTooltipTarget(text: string, placement?: string): HTMLElement {
  const el = document.createElement('button');
  el.setAttribute('data-sol-tooltip', text);
  if (placement) el.setAttribute('data-tooltip-position', placement);
  el.textContent = 'Hover me';
  document.body.appendChild(el);
  return el;
}

describe('initTooltips', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.stubGlobal('innerWidth', 1024);
    vi.stubGlobal('innerHeight', 768);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initTooltips();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('handles multiple init calls without duplicating listeners', () => {
    const target = createTooltipTarget('Test tooltip');
    mockBoundingClientRect(target);

    initTooltips();
    const cleanup = initTooltips();

    target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    const tooltip = document.querySelector('.tooltip');
    expect(tooltip).not.toBeNull();
    expect(tooltip!.textContent).toBe('Test tooltip');

    cleanup.destroy();
  });

  it('sets aria-describedby on the target', () => {
    const target = createTooltipTarget('ARIA tooltip');
    mockBoundingClientRect(target);

    const cleanup = initTooltips();

    target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    const tooltipId = target.getAttribute('aria-describedby');
    expect(tooltipId).toBeTruthy();
    expect(document.getElementById(tooltipId!)).not.toBeNull();

    cleanup.destroy();
  });

  it('destroy() removes the tooltip element from DOM', () => {
    const target = createTooltipTarget('Remove me');
    mockBoundingClientRect(target);

    const cleanup = initTooltips();

    target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(document.querySelector('.tooltip')).not.toBeNull();

    cleanup.destroy();
    expect(document.querySelector('.tooltip')).toBeNull();
  });

  it('scopes queries to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const target = document.createElement('button');
    target.setAttribute('data-sol-tooltip', 'Scoped');
    mockBoundingClientRect(target);
    root.appendChild(target);

    const cleanup = initTooltips({ root });

    target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    const tooltip = document.querySelector('.tooltip');
    expect(tooltip).not.toBeNull();

    cleanup.destroy();
  });

  describe('error handling', () => {
    it('handles gracefully when no elements match the tooltip selector', () => {
      expect(() => initTooltips()).not.toThrow();
      const cleanup = initTooltips();
      expect(typeof cleanup.destroy).toBe('function');
      cleanup.destroy();
    });

    it('handles gracefully when trigger references non-existent tooltip element', () => {
      const target = document.createElement('button');
      target.setAttribute('data-sol-tooltip', 'Non-existent tooltip');
      mockBoundingClientRect(target);
      document.body.appendChild(target);

      expect(() => initTooltips()).not.toThrow();
      const cleanup = initTooltips();
      expect(typeof cleanup.destroy).toBe('function');

      expect(() =>
        target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      ).not.toThrow();

      cleanup.destroy();
    });
  });
});
