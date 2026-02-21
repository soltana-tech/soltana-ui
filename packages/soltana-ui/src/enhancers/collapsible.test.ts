// Unit tests for collapsible enhancer focus on ARIA correctness, event
// handling, and state management.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initCollapsibles } from './collapsible.js';

function createCollapsible(id: string, open = false): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.id = id;
  wrapper.setAttribute('data-sol-collapsible', '');
  if (open) {
    wrapper.setAttribute('data-collapsible-open', '');
  }
  wrapper.className = 'collapsible';

  const trigger = document.createElement('button');
  trigger.className = 'collapsible-trigger';
  trigger.textContent = 'Toggle';

  const content = document.createElement('div');
  content.className = 'collapsible-content';
  content.textContent = 'Collapsible content';

  Object.defineProperty(content, 'scrollHeight', {
    configurable: true,
    value: 200,
  });

  wrapper.appendChild(trigger);
  wrapper.appendChild(content);
  document.body.appendChild(wrapper);

  return wrapper;
}

describe('initCollapsibles', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initCollapsibles();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('handles multiple init calls without duplicating listeners', () => {
    const collapsible = createCollapsible('test-collapsible');

    initCollapsibles();
    const cleanup = initCollapsibles();

    const trigger = collapsible.querySelector<HTMLElement>('.collapsible-trigger')!;

    trigger.click();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(collapsible.hasAttribute('data-collapsible-open')).toBe(true);

    cleanup.destroy();
  });

  it('sets ARIA attributes on trigger and content', () => {
    const collapsible = createCollapsible('test-collapsible');
    const cleanup = initCollapsibles();

    const trigger = collapsible.querySelector('.collapsible-trigger')!;
    const content = collapsible.querySelector('.collapsible-content')!;

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe(content.id);
    expect(content.getAttribute('aria-hidden')).toBe('true');
    expect(content.id).toBeTruthy();

    cleanup.destroy();
  });

  it('initializes state from data-collapsible-open attribute', () => {
    const closedCollapsible = createCollapsible('closed', false);
    const openCollapsible = createCollapsible('open', true);
    const cleanup = initCollapsibles();

    const closedTrigger = closedCollapsible.querySelector('.collapsible-trigger')!;
    const closedContent = closedCollapsible.querySelector<HTMLElement>('.collapsible-content')!;
    expect(closedTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(closedContent.getAttribute('aria-hidden')).toBe('true');
    expect(closedContent.style.getPropertyValue('--collapsible-height')).toBe('0');

    const openTrigger = openCollapsible.querySelector('.collapsible-trigger')!;
    const openContent = openCollapsible.querySelector<HTMLElement>('.collapsible-content')!;
    expect(openTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(openContent.getAttribute('aria-hidden')).toBe('false');
    expect(openContent.style.getPropertyValue('--collapsible-height')).toBe('200px');

    cleanup.destroy();
  });

  it('toggles content visibility on trigger click', () => {
    const collapsible = createCollapsible('test-collapsible');
    const cleanup = initCollapsibles();

    const trigger = collapsible.querySelector<HTMLElement>('.collapsible-trigger')!;
    const content = collapsible.querySelector<HTMLElement>('.collapsible-content')!;

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(content.getAttribute('aria-hidden')).toBe('true');

    trigger.click();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(content.getAttribute('aria-hidden')).toBe('false');
    expect(collapsible.hasAttribute('data-collapsible-open')).toBe(true);
    expect(content.style.getPropertyValue('--collapsible-height')).toBe('200px');

    trigger.click();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(content.getAttribute('aria-hidden')).toBe('true');
    expect(collapsible.hasAttribute('data-collapsible-open')).toBe(false);
    expect(content.style.getPropertyValue('--collapsible-height')).toBe('0');

    cleanup.destroy();
  });

  it('supports multiple independent collapsibles', () => {
    const collapsible1 = createCollapsible('collapsible-1');
    const collapsible2 = createCollapsible('collapsible-2');
    const cleanup = initCollapsibles();

    const trigger1 = collapsible1.querySelector<HTMLElement>('.collapsible-trigger')!;
    const trigger2 = collapsible2.querySelector<HTMLElement>('.collapsible-trigger')!;

    trigger1.click();

    expect(trigger1.getAttribute('aria-expanded')).toBe('true');
    expect(trigger2.getAttribute('aria-expanded')).toBe('false');

    trigger2.click();

    expect(trigger1.getAttribute('aria-expanded')).toBe('true');
    expect(trigger2.getAttribute('aria-expanded')).toBe('true');

    cleanup.destroy();
  });

  it('supports nested collapsibles', () => {
    const outer = createCollapsible('outer');
    const outerContent = outer.querySelector<HTMLElement>('.collapsible-content')!;

    const inner = createCollapsible('inner');
    outerContent.appendChild(inner);

    const cleanup = initCollapsibles();

    const outerTrigger = outer.querySelector<HTMLElement>('.collapsible-trigger')!;
    const innerTrigger = inner.querySelector<HTMLElement>('.collapsible-trigger')!;

    outerTrigger.click();
    expect(outerTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(innerTrigger.getAttribute('aria-expanded')).toBe('false');

    innerTrigger.click();
    expect(outerTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(innerTrigger.getAttribute('aria-expanded')).toBe('true');

    cleanup.destroy();
  });

  it('scopes queries to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const collapsible = document.createElement('div');
    collapsible.setAttribute('data-sol-collapsible', '');
    const trigger = document.createElement('button');
    trigger.className = 'collapsible-trigger';
    const content = document.createElement('div');
    content.className = 'collapsible-content';
    collapsible.appendChild(trigger);
    collapsible.appendChild(content);
    root.appendChild(collapsible);

    const cleanup = initCollapsibles({ root });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe(content.id);

    cleanup.destroy();
  });

  describe('error handling', () => {
    it('handles gracefully when no elements match the collapsible selector', () => {
      expect(() => initCollapsibles()).not.toThrow();
      const cleanup = initCollapsibles();
      expect(typeof cleanup.destroy).toBe('function');
      cleanup.destroy();
    });

    it('handles gracefully when collapsible lacks trigger element', () => {
      const collapsible = document.createElement('div');
      collapsible.setAttribute('data-sol-collapsible', '');
      const content = document.createElement('div');
      content.className = 'collapsible-content';
      collapsible.appendChild(content);
      document.body.appendChild(collapsible);

      expect(() => initCollapsibles()).not.toThrow();
      const cleanup = initCollapsibles();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });

    it('handles gracefully when collapsible lacks content element', () => {
      const collapsible = document.createElement('div');
      collapsible.setAttribute('data-sol-collapsible', '');
      const trigger = document.createElement('button');
      trigger.className = 'collapsible-trigger';
      collapsible.appendChild(trigger);
      document.body.appendChild(collapsible);

      expect(() => initCollapsibles()).not.toThrow();
      const cleanup = initCollapsibles();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });
  });
});
