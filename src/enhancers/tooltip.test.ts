import { describe, it, expect, beforeEach } from 'vitest';
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
