// Unit tests for accordion enhancer focus on ARIA correctness, event handling,
// and keyboard navigation.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initAccordions } from './accordion.js';

function createAccordion(
  itemCount: number,
  opts?: { exclusive?: boolean; activeIndex?: number }
): HTMLElement {
  const accordion = document.createElement('div');
  accordion.setAttribute('data-sol-accordion', '');
  if (opts?.exclusive) accordion.setAttribute('data-accordion-exclusive', '');

  for (let i = 0; i < itemCount; i++) {
    const item = document.createElement('div');
    item.className = 'accordion-item';
    if (i === (opts?.activeIndex ?? -1)) item.classList.add('active');

    const header = document.createElement('div');
    header.className = 'accordion-header';
    header.textContent = `Header ${String(i)}`;

    const body = document.createElement('div');
    body.className = 'accordion-body';
    body.textContent = `Body ${String(i)}`;

    item.appendChild(header);
    item.appendChild(body);
    accordion.appendChild(item);
  }

  document.body.appendChild(accordion);
  return accordion;
}

describe('initAccordions', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initAccordions();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('handles multiple init calls without duplicating listeners', () => {
    const accordion = createAccordion(2);

    initAccordions();
    const cleanup = initAccordions();

    const headers = accordion.querySelectorAll<HTMLElement>('.accordion-header');
    const items = accordion.querySelectorAll('.accordion-item');

    headers[0].click();

    expect(items[0].classList.contains('active')).toBe(true);
    expect(headers[0].getAttribute('aria-expanded')).toBe('true');

    cleanup.destroy();
  });

  it('sets ARIA attributes on headers and bodies', () => {
    const accordion = createAccordion(2);
    const cleanup = initAccordions();

    const headers = accordion.querySelectorAll('.accordion-header');
    const bodies = accordion.querySelectorAll('.accordion-body');

    headers.forEach((header) => {
      expect(header.getAttribute('role')).toBe('button');
      expect(header.getAttribute('tabindex')).toBe('0');
      expect(header.getAttribute('aria-controls')).toBeTruthy();
    });

    bodies.forEach((body) => {
      expect(body.getAttribute('role')).toBe('region');
      expect(body.getAttribute('aria-labelledby')).toBeTruthy();
    });

    cleanup.destroy();
  });

  it('initializes state from .active class', () => {
    const accordion = createAccordion(3, { activeIndex: 1 });
    const cleanup = initAccordions();

    const headers = accordion.querySelectorAll('.accordion-header');
    const bodies = accordion.querySelectorAll<HTMLElement>('.accordion-body');

    expect(headers[0].getAttribute('aria-expanded')).toBe('false');
    expect(bodies[0].hidden).toBe(true);

    expect(headers[1].getAttribute('aria-expanded')).toBe('true');
    expect(bodies[1].hidden).toBe(false);

    expect(headers[2].getAttribute('aria-expanded')).toBe('false');
    expect(bodies[2].hidden).toBe(true);

    cleanup.destroy();
  });

  it('scopes queries to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const accordion = document.createElement('div');
    accordion.setAttribute('data-sol-accordion', '');
    const item = document.createElement('div');
    item.className = 'accordion-item';
    const header = document.createElement('div');
    header.className = 'accordion-header';
    const body = document.createElement('div');
    body.className = 'accordion-body';
    item.appendChild(header);
    item.appendChild(body);
    accordion.appendChild(item);
    root.appendChild(accordion);

    const cleanup = initAccordions({ root });

    expect(header.getAttribute('role')).toBe('button');

    cleanup.destroy();
  });

  describe('error handling', () => {
    it('handles gracefully when no elements match the accordion selector', () => {
      expect(() => initAccordions()).not.toThrow();
      const cleanup = initAccordions();
      expect(typeof cleanup.destroy).toBe('function');
      cleanup.destroy();
    });

    it('handles gracefully when accordion items lack trigger elements', () => {
      const accordion = document.createElement('div');
      accordion.setAttribute('data-sol-accordion', '');
      const item = document.createElement('div');
      item.className = 'accordion-item';
      const body = document.createElement('div');
      body.className = 'accordion-body';
      item.appendChild(body);
      accordion.appendChild(item);
      document.body.appendChild(accordion);

      expect(() => initAccordions()).not.toThrow();
      const cleanup = initAccordions();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });

    it('handles gracefully when accordion items lack content elements', () => {
      const accordion = document.createElement('div');
      accordion.setAttribute('data-sol-accordion', '');
      const item = document.createElement('div');
      item.className = 'accordion-item';
      const header = document.createElement('div');
      header.className = 'accordion-header';
      item.appendChild(header);
      accordion.appendChild(item);
      document.body.appendChild(accordion);

      expect(() => initAccordions()).not.toThrow();
      const cleanup = initAccordions();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });
  });
});
