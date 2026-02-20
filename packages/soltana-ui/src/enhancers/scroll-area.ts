// ---------------------------------------------------------------------------
// Scroll Area Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-scroll-area] elements.
// Adds custom overlay scrollbar behavior for browsers that support it.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';

export const SCROLL_AREA_SELECTOR = '[data-sol-scroll-area]';

let _controller: AbortController | null = null;

/**
 * Enhance all `[data-sol-scroll-area]` elements with auto-hiding
 * scrollbar visibility on scroll.
 *
 * Expected structure:
 * ```html
 * <div data-sol-scroll-area class="scroll-area" style="max-height: 20rem;">
 *   <!-- Scrollable content -->
 * </div>
 * ```
 */
export function initScrollAreas(options?: EnhancerOptions): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  const { signal } = _controller;

  const root = options?.root ?? document;
  root.querySelectorAll<HTMLElement>(options?.selector ?? SCROLL_AREA_SELECTOR).forEach((area) => {
    let fadeTimer: ReturnType<typeof setTimeout> | null = null;

    // Show scrollbar on scroll, fade after idle
    area.addEventListener(
      'scroll',
      () => {
        area.classList.add('scrolling');
        if (fadeTimer) clearTimeout(fadeTimer);
        fadeTimer = setTimeout(() => {
          area.classList.remove('scrolling');
        }, 1200);
      },
      { signal, passive: true }
    );

    // Ensure overflow is set
    if (!area.style.overflow) {
      area.style.overflow = 'auto';
    }

    area.setAttribute('tabindex', '0');
    area.setAttribute('role', 'region');
    if (!area.getAttribute('aria-label')) {
      area.setAttribute('aria-label', 'Scrollable content');
    }
  });

  return {
    destroy() {
      _controller?.abort();
      _controller = null;
    },
  };
}
