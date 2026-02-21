import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initScrollAreas } from './scroll-area.js';

function createScrollArea(content: string): HTMLElement {
  const area = document.createElement('div');
  area.setAttribute('data-sol-scroll-area', '');
  area.className = 'scroll-area';
  area.style.maxHeight = '10rem';
  area.style.overflow = 'auto';

  const inner = document.createElement('div');
  inner.style.height = '50rem';
  inner.textContent = content;
  area.appendChild(inner);

  document.body.appendChild(area);
  return area;
}

describe('initScrollAreas', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initScrollAreas();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('handles multiple init calls without duplicating listeners', () => {
    const area = createScrollArea('Test content');

    initScrollAreas();
    const cleanup = initScrollAreas();

    area.dispatchEvent(new Event('scroll'));
    expect(area.classList.contains('scrolling')).toBe(true);

    cleanup.destroy();
  });

  it('sets ARIA attributes on scroll areas', () => {
    const area = createScrollArea('ARIA content');
    const cleanup = initScrollAreas();

    expect(area.getAttribute('role')).toBe('region');
    expect(area.getAttribute('tabindex')).toBe('0');
    expect(area.getAttribute('aria-label')).toBe('Scrollable content');

    cleanup.destroy();
  });

  it('preserves existing aria-label attribute', () => {
    const area = createScrollArea('Custom label');
    area.setAttribute('aria-label', 'Custom scrollable region');

    const cleanup = initScrollAreas();

    expect(area.getAttribute('aria-label')).toBe('Custom scrollable region');

    cleanup.destroy();
  });

  it('adds scrolling class on scroll and removes after timeout', () => {
    const area = createScrollArea('Scroll test');
    const cleanup = initScrollAreas();

    expect(area.classList.contains('scrolling')).toBe(false);

    area.dispatchEvent(new Event('scroll'));
    expect(area.classList.contains('scrolling')).toBe(true);

    vi.advanceTimersByTime(1200);
    expect(area.classList.contains('scrolling')).toBe(false);

    cleanup.destroy();
  });

  it('resets fade timer on repeated scroll events', () => {
    const area = createScrollArea('Repeated scroll');
    const cleanup = initScrollAreas();

    area.dispatchEvent(new Event('scroll'));
    expect(area.classList.contains('scrolling')).toBe(true);

    vi.advanceTimersByTime(600);
    area.dispatchEvent(new Event('scroll'));

    vi.advanceTimersByTime(600);
    expect(area.classList.contains('scrolling')).toBe(true);

    vi.advanceTimersByTime(600);
    expect(area.classList.contains('scrolling')).toBe(false);

    cleanup.destroy();
  });

  it('scopes queries to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const area = document.createElement('div');
    area.setAttribute('data-sol-scroll-area', '');
    root.appendChild(area);

    const cleanup = initScrollAreas({ root });

    expect(area.getAttribute('role')).toBe('region');

    cleanup.destroy();
  });

  describe('error handling', () => {
    it('handles gracefully when no elements match the scroll area selector', () => {
      expect(() => initScrollAreas()).not.toThrow();
      const cleanup = initScrollAreas();
      expect(typeof cleanup.destroy).toBe('function');
      cleanup.destroy();
    });

    it('handles gracefully when scroll area lacks content', () => {
      const area = document.createElement('div');
      area.setAttribute('data-sol-scroll-area', '');
      document.body.appendChild(area);

      expect(() => initScrollAreas()).not.toThrow();
      const cleanup = initScrollAreas();
      expect(area.getAttribute('role')).toBe('region');

      cleanup.destroy();
    });
  });
});
