// Unit tests for tooltip enhancer focus on ARIA correctness, event handling,
// and positioning. Tier integration (theme/relief/finish interaction with
// enhancers) is verified in E2E tests (tests/enhancers/).

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initTooltips } from './tooltip.js';
import { testSingletonBehavior } from './__tests__/helpers.js';

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

  it('creates a tooltip element on mouseenter', () => {
    const target = createTooltipTarget('Hello tooltip');
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 140,
      left: 200,
      right: 300,
      width: 100,
      height: 40,
      x: 200,
      y: 100,
      toJSON: () => ({}),
    });

    const cleanup = initTooltips();

    target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    const tooltip = document.querySelector('.tooltip');
    expect(tooltip).not.toBeNull();
    expect(tooltip!.textContent).toBe('Hello tooltip');
    expect(tooltip!.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('shows tooltip on focus and hides on blur', () => {
    const target = createTooltipTarget('Focus tooltip');
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 140,
      left: 200,
      right: 300,
      width: 100,
      height: 40,
      x: 200,
      y: 100,
      toJSON: () => ({}),
    });

    const cleanup = initTooltips();

    target.dispatchEvent(new FocusEvent('focus', { bubbles: true }));

    const tooltip = document.querySelector('.tooltip');
    expect(tooltip).not.toBeNull();
    expect(tooltip!.classList.contains('active')).toBe(true);

    target.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    expect(tooltip!.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('hides tooltip on Escape key', () => {
    const target = createTooltipTarget('Escape tooltip');
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 140,
      left: 200,
      right: 300,
      width: 100,
      height: 40,
      x: 200,
      y: 100,
      toJSON: () => ({}),
    });

    const cleanup = initTooltips();

    target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    const tooltip = document.querySelector('.tooltip')!;
    expect(tooltip.classList.contains('active')).toBe(true);

    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(tooltip.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('sets aria-describedby on the target', () => {
    const target = createTooltipTarget('ARIA tooltip');
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 140,
      left: 200,
      right: 300,
      width: 100,
      height: 40,
      x: 200,
      y: 100,
      toJSON: () => ({}),
    });

    const cleanup = initTooltips();

    target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    const tooltipId = target.getAttribute('aria-describedby');
    expect(tooltipId).toBeTruthy();
    expect(document.getElementById(tooltipId!)).not.toBeNull();

    cleanup.destroy();
  });

  it('singleton: re-calling initTooltips() does not duplicate listeners', () => {
    testSingletonBehavior(
      () => initTooltips(),
      () => {
        const target = createTooltipTarget('Singleton test');
        vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
          top: 100,
          bottom: 140,
          left: 200,
          right: 300,
          width: 100,
          height: 40,
          x: 200,
          y: 100,
          toJSON: () => ({}),
        });
        return target;
      },
      (target) => {
        target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        const tooltip = document.querySelector('.tooltip');
        expect(tooltip).not.toBeNull();
        expect(tooltip!.classList.contains('active')).toBe(true);
      }
    );
  });

  it('destroy() removes the tooltip element from DOM', () => {
    const target = createTooltipTarget('Remove me');
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 140,
      left: 200,
      right: 300,
      width: 100,
      height: 40,
      x: 200,
      y: 100,
      toJSON: () => ({}),
    });

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
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 140,
      left: 200,
      right: 300,
      width: 100,
      height: 40,
      x: 200,
      y: 100,
      toJSON: () => ({}),
    });
    root.appendChild(target);

    const cleanup = initTooltips({ root });

    target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    const tooltip = document.querySelector('.tooltip');
    expect(tooltip).not.toBeNull();

    cleanup.destroy();
  });
});
