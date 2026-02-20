// ---------------------------------------------------------------------------
// Accordion Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-accordion] elements.
// Handles expand/collapse, exclusive mode, keyboard navigation, and ARIA.
//
// Singleton lifecycle: module-level AbortController ensures only one enhancer
// instance is active at a time.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';
import { handleKeyboardNav } from './utils/keyboard-nav.js';

export const ACCORDION_SELECTOR = '[data-sol-accordion]';

/** Singleton guard — aborted and replaced on each `init*()` call. */
let _controller: AbortController | null = null;

function toggleItem(item: HTMLElement, open: boolean): void {
  item.classList.toggle('active', open);
  const header = item.querySelector<HTMLElement>('.accordion-header');
  const body = item.querySelector<HTMLElement>('.accordion-body');

  header?.setAttribute('aria-expanded', String(open));

  if (body) {
    if (open) {
      body.style.setProperty('--accordion-height', `${String(body.scrollHeight)}px`);
      body.hidden = false;
    } else {
      body.style.setProperty('--accordion-height', '0');
      body.addEventListener(
        'transitionend',
        () => {
          body.hidden = true;
        },
        { once: true }
      );
    }
  }
}

/**
 * Enhance all `[data-sol-accordion]` elements with expand/collapse behavior,
 * keyboard navigation, and ARIA attributes.
 *
 * Expected structure:
 * ```html
 * <div data-sol-accordion>
 *   <div class="accordion-item active">
 *     <div class="accordion-header">Title</div>
 *     <div class="accordion-body">Content</div>
 *   </div>
 * </div>
 * ```
 *
 * Add `data-accordion-exclusive` for single-open mode.
 */
export function initAccordions(options?: EnhancerOptions): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  const { signal } = _controller;

  const root = options?.root ?? document;
  root
    .querySelectorAll<HTMLElement>(options?.selector ?? ACCORDION_SELECTOR)
    .forEach((accordion) => {
      const exclusive = accordion.hasAttribute('data-accordion-exclusive');
      const items = accordion.querySelectorAll<HTMLElement>('.accordion-item');
      const headers: HTMLElement[] = [];

      items.forEach((item, index) => {
        const header = item.querySelector<HTMLElement>('.accordion-header');
        const body = item.querySelector<HTMLElement>('.accordion-body');
        if (!header || !body) return;

        // Generate ARIA ids
        const baseId = accordion.id || `sol-accordion-${Math.random().toString(36).slice(2, 7)}`;
        const headerId = `${baseId}-header-${String(index)}`;
        const panelId = `${baseId}-panel-${String(index)}`;

        header.id = headerId;
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-controls', panelId);

        body.id = panelId;
        body.setAttribute('role', 'region');
        body.setAttribute('aria-labelledby', headerId);

        // Initialize state from .active class
        const isOpen = item.classList.contains('active');
        header.setAttribute('aria-expanded', String(isOpen));
        if (!isOpen) {
          body.style.setProperty('--accordion-height', '0');
          body.hidden = true;
        } else {
          body.style.setProperty('--accordion-height', `${String(body.scrollHeight)}px`);
        }

        headers.push(header);

        // Click handler
        header.addEventListener(
          'click',
          () => {
            const willOpen = !item.classList.contains('active');

            if (exclusive && willOpen) {
              items.forEach((other) => {
                if (other !== item && other.classList.contains('active')) {
                  toggleItem(other, false);
                }
              });
            }

            toggleItem(item, willOpen);
          },
          { signal }
        );

        // Enter/Space to toggle
        header.addEventListener(
          'keydown',
          (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              header.click();
            }
          },
          { signal }
        );
      });

      // Arrow key navigation between headers
      accordion.addEventListener(
        'keydown',
        (e: KeyboardEvent) => {
          handleKeyboardNav(
            {
              container: accordion,
              itemSelector: '.accordion-header',
              orientation: 'vertical',
            },
            e
          );
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
