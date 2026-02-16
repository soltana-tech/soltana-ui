import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initTooltips } from './tooltip';

describe('initTooltips', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('creates tooltip on mouseenter', () => {
    const trigger = document.createElement('button');
    trigger.setAttribute('data-sol-tooltip', 'Help text');
    document.body.appendChild(trigger);

    initTooltips();
    trigger.dispatchEvent(new MouseEvent('mouseenter'));

    const tooltip = document.querySelector('.tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toBe('Help text');
  });

  it('sets aria-describedby on trigger', () => {
    const trigger = document.createElement('button');
    trigger.setAttribute('data-sol-tooltip', 'Accessible tooltip');
    document.body.appendChild(trigger);

    initTooltips();
    trigger.dispatchEvent(new MouseEvent('mouseenter'));

    expect(trigger.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('hides tooltip on mouseleave', () => {
    const trigger = document.createElement('button');
    trigger.setAttribute('data-sol-tooltip', 'Bye');
    document.body.appendChild(trigger);

    initTooltips();
    trigger.dispatchEvent(new MouseEvent('mouseenter'));

    const tooltip = document.querySelector<HTMLElement>('.tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.style.opacity).toBe('1');

    trigger.dispatchEvent(new MouseEvent('mouseleave'));
    expect(tooltip?.style.opacity).toBe('0');
  });

  it('cleans up aria-describedby on target switch', () => {
    const triggerA = document.createElement('button');
    triggerA.setAttribute('data-sol-tooltip', 'Tooltip A');
    document.body.appendChild(triggerA);

    const triggerB = document.createElement('button');
    triggerB.setAttribute('data-sol-tooltip', 'Tooltip B');
    document.body.appendChild(triggerB);

    initTooltips();

    // Hover A
    triggerA.dispatchEvent(new MouseEvent('mouseenter'));
    expect(triggerA.getAttribute('aria-describedby')).toBeTruthy();

    // Hover B without leaving A first
    triggerB.dispatchEvent(new MouseEvent('mouseenter'));
    expect(triggerB.getAttribute('aria-describedby')).toBeTruthy();

    // A should have been cleaned up
    expect(triggerA.getAttribute('aria-describedby')).toBeNull();
  });

  it('double initTooltips does not duplicate handlers', () => {
    const trigger = document.createElement('button');
    trigger.setAttribute('data-sol-tooltip', 'Once');
    document.body.appendChild(trigger);

    initTooltips();
    initTooltips(); // second call should replace, not duplicate

    trigger.dispatchEvent(new MouseEvent('mouseenter'));

    const tooltips = document.querySelectorAll('.tooltip');
    expect(tooltips.length).toBe(1);
  });

  it('shows tooltip on focus', () => {
    const trigger = document.createElement('button');
    trigger.setAttribute('data-sol-tooltip', 'Focus tip');
    document.body.appendChild(trigger);

    initTooltips();
    trigger.dispatchEvent(new FocusEvent('focus'));

    const tooltip = document.querySelector('.tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toBe('Focus tip');
    expect(trigger.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('hides tooltip on blur', () => {
    const trigger = document.createElement('button');
    trigger.setAttribute('data-sol-tooltip', 'Blur tip');
    document.body.appendChild(trigger);

    initTooltips();
    trigger.dispatchEvent(new FocusEvent('focus'));

    const tooltip = document.querySelector<HTMLElement>('.tooltip');
    expect(tooltip?.style.opacity).toBe('1');

    trigger.dispatchEvent(new FocusEvent('blur'));
    expect(tooltip?.style.opacity).toBe('0');
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
  });

  it('hides tooltip on Escape key', () => {
    const trigger = document.createElement('button');
    trigger.setAttribute('data-sol-tooltip', 'Escape tip');
    document.body.appendChild(trigger);

    initTooltips();
    trigger.dispatchEvent(new MouseEvent('mouseenter'));

    const tooltip = document.querySelector<HTMLElement>('.tooltip');
    expect(tooltip?.style.opacity).toBe('1');

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(tooltip?.style.opacity).toBe('0');
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
  });

  it.each([
    ['top', '162px', '420px'],
    ['bottom', '248px', '420px'],
    ['left', '205px', '312px'],
    ['right', '205px', '528px'],
  ])(
    'positions tooltip at correct coordinates for position="%s"',
    (position, expectedTop, expectedLeft) => {
      vi.useFakeTimers();

      const trigger = document.createElement('button');
      trigger.setAttribute('data-sol-tooltip', 'Positioned');
      trigger.setAttribute('data-tooltip-position', position);
      document.body.appendChild(trigger);

      trigger.getBoundingClientRect = () => ({
        top: 200,
        bottom: 240,
        left: 400,
        right: 520,
        width: 120,
        height: 40,
        x: 400,
        y: 200,
        toJSON: () => ({}),
      });

      initTooltips();
      trigger.dispatchEvent(new MouseEvent('mouseenter'));

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tooltip = document.querySelector<HTMLElement>('.tooltip')!;
      tooltip.getBoundingClientRect = () => ({
        top: 0,
        bottom: 30,
        left: 0,
        right: 80,
        width: 80,
        height: 30,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      vi.runAllTimers();

      expect(tooltip.style.top).toBe(expectedTop);
      expect(tooltip.style.left).toBe(expectedLeft);
      vi.useRealTimers();
    }
  );

  it('defaults to top positioning when data-tooltip-position is absent', () => {
    vi.useFakeTimers();

    const trigger = document.createElement('button');
    trigger.setAttribute('data-sol-tooltip', 'Default pos');
    document.body.appendChild(trigger);

    trigger.getBoundingClientRect = () => ({
      top: 200,
      bottom: 240,
      left: 400,
      right: 520,
      width: 120,
      height: 40,
      x: 400,
      y: 200,
      toJSON: () => ({}),
    });

    initTooltips();
    trigger.dispatchEvent(new MouseEvent('mouseenter'));

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tooltip = document.querySelector<HTMLElement>('.tooltip')!;
    tooltip.getBoundingClientRect = () => ({
      top: 0,
      bottom: 30,
      left: 0,
      right: 80,
      width: 80,
      height: 30,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    vi.runAllTimers();

    expect(tooltip.style.top).toBe('162px');
    expect(tooltip.style.left).toBe('420px');
    vi.useRealTimers();
  });

  it('destroy removes tooltip and listeners', () => {
    const trigger = document.createElement('button');
    trigger.setAttribute('data-sol-tooltip', 'Gone');
    document.body.appendChild(trigger);

    const cleanup = initTooltips();
    trigger.dispatchEvent(new MouseEvent('mouseenter'));

    const tooltip = document.querySelector<HTMLElement>('.tooltip');
    expect(tooltip).toBeTruthy();

    cleanup.destroy();

    // Tooltip element should be removed
    expect(document.querySelector('.tooltip')).toBeNull();

    // Hovering should not create a new tooltip since listeners are gone
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    expect(document.querySelector('.tooltip')).toBeNull();
  });
});
