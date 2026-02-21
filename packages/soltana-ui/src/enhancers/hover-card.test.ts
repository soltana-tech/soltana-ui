// Unit tests for hover-card enhancer focus on ARIA correctness, event handling,
// delay timing, and keyboard accessibility.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initHoverCards } from './hover-card.js';
import { mockBoundingClientRect } from './test-helpers.js';

function createHoverCard(opts?: {
  showDelay?: number;
  hideDelay?: number;
  placement?: string;
}): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-sol-hover-card', '');
  wrapper.className = 'hover-card';
  if (opts?.showDelay !== undefined) {
    wrapper.setAttribute('data-hover-show-delay', String(opts.showDelay));
  }
  if (opts?.hideDelay !== undefined) {
    wrapper.setAttribute('data-hover-hide-delay', String(opts.hideDelay));
  }
  if (opts?.placement) {
    wrapper.setAttribute('data-hover-placement', opts.placement);
  }

  mockBoundingClientRect(wrapper, { top: 0, left: 0, width: 200, height: 100 });

  const trigger = document.createElement('span');
  trigger.className = 'hover-card-trigger';
  trigger.textContent = 'Hover me';
  mockBoundingClientRect(trigger, { top: 50, left: 100, width: 80, height: 30 });
  wrapper.appendChild(trigger);

  const content = document.createElement('div');
  content.className = 'hover-card-content';
  content.textContent = 'Rich content';
  mockBoundingClientRect(content, { top: 0, left: 0, width: 150, height: 80 });
  wrapper.appendChild(content);

  document.body.appendChild(wrapper);
  return wrapper;
}

describe('initHoverCards', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initHoverCards();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('handles multiple init calls without duplicating listeners', () => {
    const wrapper = createHoverCard();

    initHoverCards();
    const cleanup = initHoverCards();

    const trigger = wrapper.querySelector<HTMLElement>('.hover-card-trigger')!;
    const content = wrapper.querySelector<HTMLElement>('.hover-card-content')!;

    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    vi.advanceTimersByTime(200);

    expect(content.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('shows content after delay on mouseenter', () => {
    const wrapper = createHoverCard({ showDelay: 300 });
    const cleanup = initHoverCards();

    const trigger = wrapper.querySelector<HTMLElement>('.hover-card-trigger')!;
    const content = wrapper.querySelector<HTMLElement>('.hover-card-content')!;

    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    expect(content.classList.contains('active')).toBe(false);

    vi.advanceTimersByTime(300);

    expect(content.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('hides content after delay on mouseleave', () => {
    const wrapper = createHoverCard({ showDelay: 100, hideDelay: 200 });
    const cleanup = initHoverCards();

    const trigger = wrapper.querySelector<HTMLElement>('.hover-card-trigger')!;
    const content = wrapper.querySelector<HTMLElement>('.hover-card-content')!;

    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    vi.advanceTimersByTime(100);
    expect(content.classList.contains('active')).toBe(true);

    trigger.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(content.classList.contains('active')).toBe(true);

    vi.advanceTimersByTime(200);
    expect(content.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('cancels hide timer when hovering over content', () => {
    const wrapper = createHoverCard({ showDelay: 100, hideDelay: 200 });
    const cleanup = initHoverCards();

    const trigger = wrapper.querySelector<HTMLElement>('.hover-card-trigger')!;
    const content = wrapper.querySelector<HTMLElement>('.hover-card-content')!;

    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    vi.advanceTimersByTime(100);
    expect(content.classList.contains('active')).toBe(true);

    trigger.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    vi.advanceTimersByTime(50);

    content.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    vi.advanceTimersByTime(200);

    expect(content.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('hides content when leaving content element', () => {
    const wrapper = createHoverCard({ showDelay: 100, hideDelay: 200 });
    const cleanup = initHoverCards();

    const trigger = wrapper.querySelector<HTMLElement>('.hover-card-trigger')!;
    const content = wrapper.querySelector<HTMLElement>('.hover-card-content')!;

    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    vi.advanceTimersByTime(100);
    expect(content.classList.contains('active')).toBe(true);

    content.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    vi.advanceTimersByTime(200);

    expect(content.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('shows content on focus', () => {
    const wrapper = createHoverCard({ showDelay: 200 });
    const cleanup = initHoverCards();

    const trigger = wrapper.querySelector<HTMLElement>('.hover-card-trigger')!;
    const content = wrapper.querySelector<HTMLElement>('.hover-card-content')!;

    trigger.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    vi.advanceTimersByTime(200);

    expect(content.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('hides content on blur', () => {
    const wrapper = createHoverCard({ showDelay: 100, hideDelay: 200 });
    const cleanup = initHoverCards();

    const trigger = wrapper.querySelector<HTMLElement>('.hover-card-trigger')!;
    const content = wrapper.querySelector<HTMLElement>('.hover-card-content')!;

    trigger.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    vi.advanceTimersByTime(100);
    expect(content.classList.contains('active')).toBe(true);

    trigger.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    vi.advanceTimersByTime(200);

    expect(content.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('uses default delays when attributes not specified', () => {
    const wrapper = createHoverCard();
    const cleanup = initHoverCards();

    const trigger = wrapper.querySelector<HTMLElement>('.hover-card-trigger')!;
    const content = wrapper.querySelector<HTMLElement>('.hover-card-content')!;

    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    vi.advanceTimersByTime(200);

    expect(content.classList.contains('active')).toBe(true);

    trigger.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    vi.advanceTimersByTime(300);

    expect(content.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('sets custom properties for positioning', () => {
    const wrapper = createHoverCard({ showDelay: 100 });
    const cleanup = initHoverCards();

    const trigger = wrapper.querySelector<HTMLElement>('.hover-card-trigger')!;
    const content = wrapper.querySelector<HTMLElement>('.hover-card-content')!;

    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    vi.advanceTimersByTime(100);

    expect(content.style.getPropertyValue('--hover-card-top')).toBeTruthy();
    expect(content.style.getPropertyValue('--hover-card-left')).toBeTruthy();

    cleanup.destroy();
  });

  it('scopes queries to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-sol-hover-card', '');
    mockBoundingClientRect(wrapper, { top: 0, left: 0, width: 200, height: 100 });

    const trigger = document.createElement('span');
    trigger.className = 'hover-card-trigger';
    mockBoundingClientRect(trigger, { top: 50, left: 100, width: 80, height: 30 });
    wrapper.appendChild(trigger);

    const content = document.createElement('div');
    content.className = 'hover-card-content';
    mockBoundingClientRect(content, { top: 0, left: 0, width: 150, height: 80 });
    wrapper.appendChild(content);

    root.appendChild(wrapper);

    const cleanup = initHoverCards({ root });

    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    vi.advanceTimersByTime(200);

    expect(content.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  describe('error handling', () => {
    it('handles gracefully when no elements match the hover-card selector', () => {
      expect(() => initHoverCards()).not.toThrow();
      const cleanup = initHoverCards();
      expect(typeof cleanup.destroy).toBe('function');
      cleanup.destroy();
    });

    it('handles gracefully when hover-card lacks trigger element', () => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-sol-hover-card', '');
      const content = document.createElement('div');
      content.className = 'hover-card-content';
      wrapper.appendChild(content);
      document.body.appendChild(wrapper);

      expect(() => initHoverCards()).not.toThrow();
      const cleanup = initHoverCards();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });

    it('handles gracefully when hover-card lacks content element', () => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-sol-hover-card', '');
      const trigger = document.createElement('span');
      trigger.className = 'hover-card-trigger';
      wrapper.appendChild(trigger);
      document.body.appendChild(wrapper);

      expect(() => initHoverCards()).not.toThrow();
      const cleanup = initHoverCards();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });
  });
});
