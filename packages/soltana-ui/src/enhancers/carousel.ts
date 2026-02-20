// ---------------------------------------------------------------------------
// Carousel Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-carousel] elements.
// Horizontal sliding carousel with optional autoplay and loop.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';

export const CAROUSEL_SELECTOR = '[data-sol-carousel]';

let _controller: AbortController | null = null;

/**
 * Enhance all `[data-sol-carousel]` elements with slide navigation,
 * keyboard controls, autoplay, and indicator dots.
 *
 * Expected structure:
 * ```html
 * <div data-sol-carousel class="carousel"
 *      data-carousel-autoplay data-carousel-interval="5000" data-carousel-loop>
 *   <div class="carousel-track">
 *     <div class="carousel-slide">Slide 1</div>
 *     <div class="carousel-slide">Slide 2</div>
 *   </div>
 *   <button class="carousel-prev" aria-label="Previous slide">&lsaquo;</button>
 *   <button class="carousel-next" aria-label="Next slide">&rsaquo;</button>
 *   <div class="carousel-dots"></div>
 * </div>
 * ```
 */
export function initCarousels(options?: EnhancerOptions): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  const { signal } = _controller;
  const autoplayTimers: ReturnType<typeof setInterval>[] = [];

  const root = options?.root ?? document;
  root.querySelectorAll<HTMLElement>(options?.selector ?? CAROUSEL_SELECTOR).forEach((carousel) => {
    const trackEl = carousel.querySelector<HTMLElement>('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll<HTMLElement>('.carousel-slide'));
    const prevBtn = carousel.querySelector<HTMLElement>('.carousel-prev');
    const nextBtn = carousel.querySelector<HTMLElement>('.carousel-next');
    const dotsContainer = carousel.querySelector<HTMLElement>('.carousel-dots');

    if (!trackEl || slides.length === 0) return;
    const track: HTMLElement = trackEl;

    const loop = carousel.hasAttribute('data-carousel-loop');
    const autoplay = carousel.hasAttribute('data-carousel-autoplay');
    const interval = Number(carousel.getAttribute('data-carousel-interval') ?? '5000');
    let current = 0;

    // ARIA
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-roledescription', 'carousel');
    slides.forEach((slide, i) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `Slide ${String(i + 1)} of ${String(slides.length)}`);
    });

    // Generate dots
    const dots: HTMLElement[] = [];
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = i === 0 ? 'carousel-dot active' : 'carousel-dot';
        dot.setAttribute('aria-label', `Go to slide ${String(i + 1)}`);
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
    }

    function goTo(index: number): void {
      if (loop) {
        current = (index + slides.length) % slides.length;
      } else {
        current = Math.max(0, Math.min(index, slides.length - 1));
      }

      track.style.transform = `translateX(-${String(current * 100)}%)`;

      // Update dots
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));

      // Disable buttons at boundaries (non-loop)
      if (!loop) {
        prevBtn?.toggleAttribute('disabled', current === 0);
        nextBtn?.toggleAttribute('disabled', current === slides.length - 1);
      }
    }

    // Initial state
    goTo(0);

    prevBtn?.addEventListener(
      'click',
      () => {
        goTo(current - 1);
      },
      { signal }
    );
    nextBtn?.addEventListener(
      'click',
      () => {
        goTo(current + 1);
      },
      { signal }
    );

    dots.forEach((dot, i) => {
      dot.addEventListener(
        'click',
        () => {
          goTo(i);
        },
        { signal }
      );
    });

    // Keyboard
    carousel.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goTo(current - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          goTo(current + 1);
        }
      },
      { signal }
    );

    // Autoplay
    if (autoplay) {
      const timer = setInterval(() => {
        goTo(current + 1);
      }, interval);
      autoplayTimers.push(timer);

      // Pause on hover
      carousel.addEventListener(
        'mouseenter',
        () => {
          clearInterval(timer);
        },
        { signal }
      );
      carousel.addEventListener(
        'mouseleave',
        () => {
          const newTimer = setInterval(() => {
            goTo(current + 1);
          }, interval);
          autoplayTimers.push(newTimer);
        },
        { signal }
      );
    }
  });

  return {
    destroy() {
      _controller?.abort();
      _controller = null;
      autoplayTimers.forEach(clearInterval);
    },
  };
}
