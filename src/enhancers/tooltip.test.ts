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
});
