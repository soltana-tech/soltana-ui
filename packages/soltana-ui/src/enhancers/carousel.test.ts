// Unit tests for carousel enhancer focus on ARIA correctness, event handling,
// keyboard navigation, autoplay, and loop behavior.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initCarousels } from './carousel.js';

function createCarousel(
  slideCount: number,
  opts?: { loop?: boolean; autoplay?: boolean; interval?: number }
): HTMLElement {
  const carousel = document.createElement('div');
  carousel.setAttribute('data-sol-carousel', '');
  carousel.className = 'carousel';

  if (opts?.loop) {
    carousel.setAttribute('data-carousel-loop', '');
  }
  if (opts?.autoplay) {
    carousel.setAttribute('data-carousel-autoplay', '');
  }
  if (opts?.interval !== undefined) {
    carousel.setAttribute('data-carousel-interval', String(opts.interval));
  }

  const track = document.createElement('div');
  track.className = 'carousel-track';

  for (let i = 0; i < slideCount; i++) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.textContent = `Slide ${String(i + 1)}`;
    track.appendChild(slide);
  }

  carousel.appendChild(track);

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.textContent = '‹';
  carousel.appendChild(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.textContent = '›';
  carousel.appendChild(nextBtn);

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  carousel.appendChild(dotsContainer);

  document.body.appendChild(carousel);
  return carousel;
}

describe('initCarousels', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initCarousels();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('handles multiple init calls without duplicating listeners', () => {
    const carousel = createCarousel(3);

    initCarousels();
    const cleanup = initCarousels();

    const nextBtn = carousel.querySelector<HTMLElement>('.carousel-next')!;
    const track = carousel.querySelector<HTMLElement>('.carousel-track')!;

    nextBtn.click();

    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-100%');

    cleanup.destroy();
  });

  it('sets ARIA attributes on carousel and slides', () => {
    const carousel = createCarousel(3);
    const cleanup = initCarousels();

    expect(carousel.getAttribute('role')).toBe('region');
    expect(carousel.getAttribute('aria-roledescription')).toBe('carousel');

    const slides = carousel.querySelectorAll('.carousel-slide');
    slides.forEach((slide, i) => {
      expect(slide.getAttribute('role')).toBe('group');
      expect(slide.getAttribute('aria-roledescription')).toBe('slide');
      expect(slide.getAttribute('aria-label')).toBe(
        `Slide ${String(i + 1)} of ${String(slides.length)}`
      );
    });

    cleanup.destroy();
  });

  it('generates indicator dots for each slide', () => {
    const carousel = createCarousel(4);
    const cleanup = initCarousels();

    const dots = carousel.querySelectorAll('.carousel-dot');

    expect(dots.length).toBe(4);

    dots.forEach((dot, i) => {
      expect(dot.getAttribute('aria-label')).toBe(`Go to slide ${String(i + 1)}`);
    });

    cleanup.destroy();
  });

  it('activates first dot initially', () => {
    const carousel = createCarousel(3);
    const cleanup = initCarousels();

    const dots = carousel.querySelectorAll<HTMLElement>('.carousel-dot');

    expect(dots[0].classList.contains('active')).toBe(true);
    expect(dots[1].classList.contains('active')).toBe(false);
    expect(dots[2].classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('navigates to next slide on next button click', () => {
    const carousel = createCarousel(3);
    const cleanup = initCarousels();

    const nextBtn = carousel.querySelector<HTMLElement>('.carousel-next')!;
    const track = carousel.querySelector<HTMLElement>('.carousel-track')!;
    const dots = carousel.querySelectorAll<HTMLElement>('.carousel-dot');

    nextBtn.click();

    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-100%');
    expect(dots[0].classList.contains('active')).toBe(false);
    expect(dots[1].classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('navigates to previous slide on prev button click', () => {
    const carousel = createCarousel(3);
    const cleanup = initCarousels();

    const nextBtn = carousel.querySelector<HTMLElement>('.carousel-next')!;
    const prevBtn = carousel.querySelector<HTMLElement>('.carousel-prev')!;
    const track = carousel.querySelector<HTMLElement>('.carousel-track')!;

    nextBtn.click();
    nextBtn.click();
    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-200%');

    prevBtn.click();
    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-100%');

    cleanup.destroy();
  });

  it('navigates to specific slide on dot click', () => {
    const carousel = createCarousel(4);
    const cleanup = initCarousels();

    const track = carousel.querySelector<HTMLElement>('.carousel-track')!;
    const dots = carousel.querySelectorAll<HTMLElement>('.carousel-dot');

    dots[2].click();

    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-200%');
    expect(dots[2].classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('disables prev button at first slide when not looping', () => {
    const carousel = createCarousel(3);
    const cleanup = initCarousels();

    const prevBtn = carousel.querySelector<HTMLElement>('.carousel-prev')!;
    const nextBtn = carousel.querySelector<HTMLElement>('.carousel-next')!;

    expect(prevBtn.hasAttribute('disabled')).toBe(true);
    expect(nextBtn.hasAttribute('disabled')).toBe(false);

    cleanup.destroy();
  });

  it('disables next button at last slide when not looping', () => {
    const carousel = createCarousel(3);
    const cleanup = initCarousels();

    const nextBtn = carousel.querySelector<HTMLElement>('.carousel-next')!;
    const prevBtn = carousel.querySelector<HTMLElement>('.carousel-prev')!;

    nextBtn.click();
    nextBtn.click();

    expect(nextBtn.hasAttribute('disabled')).toBe(true);
    expect(prevBtn.hasAttribute('disabled')).toBe(false);

    cleanup.destroy();
  });

  it('wraps around to first slide when looping enabled', () => {
    const carousel = createCarousel(3, { loop: true });
    const cleanup = initCarousels();

    const nextBtn = carousel.querySelector<HTMLElement>('.carousel-next')!;
    const track = carousel.querySelector<HTMLElement>('.carousel-track')!;
    const dots = carousel.querySelectorAll<HTMLElement>('.carousel-dot');

    nextBtn.click();
    nextBtn.click();
    nextBtn.click();

    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-0%');
    expect(dots[0].classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('wraps around to last slide when looping enabled and going backwards', () => {
    const carousel = createCarousel(3, { loop: true });
    const cleanup = initCarousels();

    const prevBtn = carousel.querySelector<HTMLElement>('.carousel-prev')!;
    const track = carousel.querySelector<HTMLElement>('.carousel-track')!;
    const dots = carousel.querySelectorAll<HTMLElement>('.carousel-dot');

    prevBtn.click();

    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-200%');
    expect(dots[2].classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('does not disable buttons when looping enabled', () => {
    const carousel = createCarousel(3, { loop: true });
    const cleanup = initCarousels();

    const prevBtn = carousel.querySelector<HTMLElement>('.carousel-prev')!;
    const nextBtn = carousel.querySelector<HTMLElement>('.carousel-next')!;

    expect(prevBtn.hasAttribute('disabled')).toBe(false);
    expect(nextBtn.hasAttribute('disabled')).toBe(false);

    nextBtn.click();
    nextBtn.click();

    expect(prevBtn.hasAttribute('disabled')).toBe(false);
    expect(nextBtn.hasAttribute('disabled')).toBe(false);

    cleanup.destroy();
  });

  it('navigates with ArrowRight key', () => {
    const carousel = createCarousel(3);
    const cleanup = initCarousels();

    const track = carousel.querySelector<HTMLElement>('.carousel-track')!;

    carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-100%');

    cleanup.destroy();
  });

  it('navigates with ArrowLeft key', () => {
    const carousel = createCarousel(3);
    const cleanup = initCarousels();

    const track = carousel.querySelector<HTMLElement>('.carousel-track')!;

    carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-200%');

    carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-100%');

    cleanup.destroy();
  });

  it('autoplays when enabled', () => {
    const carousel = createCarousel(3, { autoplay: true, interval: 1000 });
    const cleanup = initCarousels();

    const track = carousel.querySelector<HTMLElement>('.carousel-track')!;

    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-0%');

    vi.advanceTimersByTime(1000);
    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-100%');

    vi.advanceTimersByTime(1000);
    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-200%');

    cleanup.destroy();
  });

  it('pauses autoplay on mouseenter', () => {
    const carousel = createCarousel(3, { autoplay: true, interval: 1000 });
    const cleanup = initCarousels();

    const track = carousel.querySelector<HTMLElement>('.carousel-track')!;

    vi.advanceTimersByTime(1000);
    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-100%');

    carousel.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    vi.advanceTimersByTime(2000);
    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-100%');

    cleanup.destroy();
  });

  it('resumes autoplay on mouseleave', () => {
    const carousel = createCarousel(3, { autoplay: true, interval: 1000 });
    const cleanup = initCarousels();

    const track = carousel.querySelector<HTMLElement>('.carousel-track')!;

    carousel.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    vi.advanceTimersByTime(2000);
    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-0%');

    carousel.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    vi.advanceTimersByTime(1000);
    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-100%');

    cleanup.destroy();
  });

  it('clears autoplay timers on destroy', () => {
    const carousel = createCarousel(3, { autoplay: true, interval: 1000 });
    const cleanup = initCarousels();

    const track = carousel.querySelector<HTMLElement>('.carousel-track')!;

    cleanup.destroy();

    vi.advanceTimersByTime(5000);
    expect(track.style.getPropertyValue('--carousel-offset')).toBe('-0%');
  });

  it('scopes queries to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const carousel = document.createElement('div');
    carousel.setAttribute('data-sol-carousel', '');
    const track = document.createElement('div');
    track.className = 'carousel-track';
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    track.appendChild(slide);
    carousel.appendChild(track);
    root.appendChild(carousel);

    const cleanup = initCarousels({ root });

    expect(carousel.getAttribute('role')).toBe('region');

    cleanup.destroy();
  });

  describe('error handling', () => {
    it('handles gracefully when no elements match the carousel selector', () => {
      expect(() => initCarousels()).not.toThrow();
      const cleanup = initCarousels();
      expect(typeof cleanup.destroy).toBe('function');
      cleanup.destroy();
    });

    it('handles gracefully when carousel lacks track element', () => {
      const carousel = document.createElement('div');
      carousel.setAttribute('data-sol-carousel', '');
      const prevBtn = document.createElement('button');
      prevBtn.className = 'carousel-prev';
      carousel.appendChild(prevBtn);
      document.body.appendChild(carousel);

      expect(() => initCarousels()).not.toThrow();
      const cleanup = initCarousels();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });

    it('handles gracefully when carousel has no slides', () => {
      const carousel = document.createElement('div');
      carousel.setAttribute('data-sol-carousel', '');
      const track = document.createElement('div');
      track.className = 'carousel-track';
      carousel.appendChild(track);
      document.body.appendChild(carousel);

      expect(() => initCarousels()).not.toThrow();
      const cleanup = initCarousels();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });

    it('handles gracefully when carousel lacks prev/next buttons', () => {
      const carousel = document.createElement('div');
      carousel.setAttribute('data-sol-carousel', '');
      const track = document.createElement('div');
      track.className = 'carousel-track';
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      track.appendChild(slide);
      carousel.appendChild(track);
      document.body.appendChild(carousel);

      expect(() => initCarousels()).not.toThrow();
      const cleanup = initCarousels();
      expect(typeof cleanup.destroy).toBe('function');

      carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

      cleanup.destroy();
    });

    it('handles gracefully when carousel lacks dots container', () => {
      const carousel = document.createElement('div');
      carousel.setAttribute('data-sol-carousel', '');
      const track = document.createElement('div');
      track.className = 'carousel-track';
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      track.appendChild(slide);
      carousel.appendChild(track);
      const prevBtn = document.createElement('button');
      prevBtn.className = 'carousel-prev';
      const nextBtn = document.createElement('button');
      nextBtn.className = 'carousel-next';
      carousel.appendChild(prevBtn);
      carousel.appendChild(nextBtn);
      document.body.appendChild(carousel);

      expect(() => initCarousels()).not.toThrow();
      const cleanup = initCarousels();
      expect(typeof cleanup.destroy).toBe('function');

      nextBtn.click();

      cleanup.destroy();
    });
  });
});
