// ---------------------------------------------------------------------------
// Collapsible Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-collapsible] elements.
// Simpler single-panel version of the accordion enhancer.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';

export const COLLAPSIBLE_SELECTOR = '[data-sol-collapsible]';

/** Singleton guard — aborted and replaced on each `init*()` call. */
let _controller: AbortController | null = null;

/**
 * Enhance all `[data-sol-collapsible]` elements with expand/collapse behavior.
 *
 * Expected structure:
 * ```html
 * <div data-sol-collapsible class="collapsible">
 *   <button class="collapsible-trigger">Toggle</button>
 *   <div class="collapsible-content">Content</div>
 * </div>
 * ```
 */
export function initCollapsibles(options?: EnhancerOptions): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  const { signal } = _controller;

  const root = options?.root ?? document;
  root
    .querySelectorAll<HTMLElement>(options?.selector ?? COLLAPSIBLE_SELECTOR)
    .forEach((wrapper) => {
      const trigger = wrapper.querySelector<HTMLElement>('.collapsible-trigger');
      const content = wrapper.querySelector<HTMLElement>('.collapsible-content');
      if (!trigger || !content) return;

      // Initialize state
      const isOpen = wrapper.hasAttribute('data-collapsible-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
      content.setAttribute('aria-hidden', String(!isOpen));

      if (!isOpen) {
        content.style.setProperty('--collapsible-height', '0');
      } else {
        content.style.setProperty('--collapsible-height', `${String(content.scrollHeight)}px`);
      }

      // ARIA ids
      if (!content.id) {
        content.id = `sol-collapsible-${Math.random().toString(36).slice(2, 7)}`;
      }
      trigger.setAttribute('aria-controls', content.id);

      trigger.addEventListener(
        'click',
        () => {
          const expanded = trigger.getAttribute('aria-expanded') === 'true';
          const willOpen = !expanded;

          trigger.setAttribute('aria-expanded', String(willOpen));
          content.setAttribute('aria-hidden', String(!willOpen));

          if (willOpen) {
            content.style.setProperty('--collapsible-height', `${String(content.scrollHeight)}px`);
            wrapper.setAttribute('data-collapsible-open', '');
          } else {
            content.style.setProperty('--collapsible-height', '0');
            wrapper.removeAttribute('data-collapsible-open');
          }
        },
        { signal }
      );
    });

  return {
    destroy() {
      _controller?.abort();
      _controller = null;
    },
  };
}
