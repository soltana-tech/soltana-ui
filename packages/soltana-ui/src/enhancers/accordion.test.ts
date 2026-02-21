// Unit tests for accordion enhancer focus on ARIA correctness, event handling,
// and keyboard navigation. Tier integration (theme/relief/finish interaction
// with enhancers) is verified in E2E tests (tests/enhancers/).

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initAccordions } from './accordion.js';
import { testSingletonBehavior } from './__tests__/helpers.js';

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

  it('toggles an item on header click', () => {
    const accordion = createAccordion(2);
    const cleanup = initAccordions();

    const headers = accordion.querySelectorAll<HTMLElement>('.accordion-header');
    const items = accordion.querySelectorAll('.accordion-item');

    headers[0].click();
    expect(items[0].classList.contains('active')).toBe(true);
    expect(headers[0].getAttribute('aria-expanded')).toBe('true');

    headers[0].click();
    expect(items[0].classList.contains('active')).toBe(false);
    expect(headers[0].getAttribute('aria-expanded')).toBe('false');

    cleanup.destroy();
  });

  it('exclusive mode closes other items when opening one', () => {
    const accordion = createAccordion(3, { exclusive: true, activeIndex: 0 });
    const cleanup = initAccordions();

    const headers = accordion.querySelectorAll<HTMLElement>('.accordion-header');
    const items = accordion.querySelectorAll('.accordion-item');

    expect(items[0].classList.contains('active')).toBe(true);

    headers[1].click();
    expect(items[1].classList.contains('active')).toBe(true);
    expect(items[0].classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('toggles on Enter key', () => {
    const accordion = createAccordion(2);
    const cleanup = initAccordions();

    const headers = accordion.querySelectorAll<HTMLElement>('.accordion-header');
    const items = accordion.querySelectorAll('.accordion-item');

    headers[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    );
    expect(items[0].classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('singleton: re-calling initAccordions() does not duplicate listeners', () => {
    testSingletonBehavior(
      () => initAccordions(),
      () => {
        const accordion = createAccordion(2);
        return accordion.querySelectorAll<HTMLElement>('.accordion-header')[0];
      },
      (header) => {
        header.click();
        const item = header.closest('.accordion-item')!;
        expect(item.classList.contains('active')).toBe(true);
      }
    );
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
});
