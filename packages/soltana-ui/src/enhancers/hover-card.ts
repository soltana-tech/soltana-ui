// ---------------------------------------------------------------------------
// Hover Card Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-hover-card] elements.
// Rich tooltip-like card with show/dismiss delays and persistent hover.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';
import { computePosition } from './utils/position.js';
import type { Placement } from './utils/position.js';

export const HOVER_CARD_SELECTOR = '[data-sol-hover-card]';

let _controller: AbortController | null = null;

/**
 * Enhance all `[data-sol-hover-card]` elements with hover-triggered
 * floating card behavior.
 *
 * Expected structure:
 * ```html
 * <div data-sol-hover-card class="hover-card">
 *   <span class="hover-card-trigger">Hover me</span>
 *   <div class="hover-card-content">Rich content</div>
 * </div>
 * ```
 */
export function initHoverCards(options?: EnhancerOptions): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  const { signal } = _controller;

  const root = options?.root ?? document;
  root
    .querySelectorAll<HTMLElement>(options?.selector ?? HOVER_CARD_SELECTOR)
    .forEach((wrapper) => {
      const triggerEl = wrapper.querySelector<HTMLElement>('.hover-card-trigger');
      const contentEl = wrapper.querySelector<HTMLElement>('.hover-card-content');
      if (!triggerEl || !contentEl) return;
      const trigger: HTMLElement = triggerEl;
      const content: HTMLElement = contentEl;

      const showDelay = Number(wrapper.getAttribute('data-hover-show-delay') ?? '200');
      const hideDelay = Number(wrapper.getAttribute('data-hover-hide-delay') ?? '300');
      const placement = (wrapper.getAttribute('data-hover-placement') ?? 'bottom') as Placement;
      let showTimer: ReturnType<typeof setTimeout> | null = null;
      let hideTimer: ReturnType<typeof setTimeout> | null = null;

      function show(): void {
        if (hideTimer) {
          clearTimeout(hideTimer);
          hideTimer = null;
        }
        showTimer = setTimeout(() => {
          const pos = computePosition({ anchor: trigger, floating: content, placement });
          content.style.top = `${String(pos.top - wrapper.getBoundingClientRect().top)}px`;
          content.style.left = `${String(pos.left - wrapper.getBoundingClientRect().left)}px`;
          content.classList.add('active');
        }, showDelay);
      }

      function hide(): void {
        if (showTimer) {
          clearTimeout(showTimer);
          showTimer = null;
        }
        hideTimer = setTimeout(() => {
          content.classList.remove('active');
        }, hideDelay);
      }

      trigger.addEventListener('mouseenter', show, { signal });
      trigger.addEventListener('mouseleave', hide, { signal });
      content.addEventListener(
        'mouseenter',
        () => {
          if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
          }
        },
        { signal }
      );
      content.addEventListener('mouseleave', hide, { signal });

      // Keyboard: show on focus, hide on blur
      trigger.addEventListener('focus', show, { signal });
      trigger.addEventListener('blur', hide, { signal });
    });

  return {
    destroy() {
      _controller?.abort();
      _controller = null;
    },
  };
}
