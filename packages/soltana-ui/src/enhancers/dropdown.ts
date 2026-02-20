// ---------------------------------------------------------------------------
// Dropdown Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-dropdown] elements.
// Handles toggle, click-away close, keyboard navigation, and ARIA.
//
// Singleton lifecycle: module-level AbortController ensures only one enhancer
// instance is active at a time.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';
import { onClickAway } from './utils/click-away.js';
import { handleKeyboardNav } from './utils/keyboard-nav.js';

export const DROPDOWN_SELECTOR = '[data-sol-dropdown]';

/** Singleton guard — aborted and replaced on each `init*()` call. */
let _controller: AbortController | null = null;

function openDropdown(toggle: HTMLElement, menu: HTMLElement): void {
  menu.classList.add('active');
  toggle.setAttribute('aria-expanded', 'true');

  // Ensure focus is within the dropdown for keyboard handling
  // (WebKit does not focus buttons on click by default)
  toggle.focus();

  // Move focus to first menu item
  requestAnimationFrame(() => {
    const firstItem = menu.querySelector<HTMLElement>('[role="menuitem"]');
    firstItem?.focus();
  });
}

function closeDropdown(toggle: HTMLElement, menu: HTMLElement): void {
  menu.classList.remove('active');
  toggle.setAttribute('aria-expanded', 'false');
}

/**
 * Enhance all `[data-sol-dropdown]` elements with toggle, click-away,
 * keyboard navigation, and ARIA behavior.
 *
 * Expected structure:
 * ```html
 * <div data-sol-dropdown class="dropdown">
 *   <button class="dropdown-toggle">Options</button>
 *   <div class="dropdown-menu" role="menu">
 *     <button class="dropdown-item" role="menuitem">Edit</button>
 *   </div>
 * </div>
 * ```
 */
export function initDropdowns(options?: EnhancerOptions): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  const { signal } = _controller;

  const root = options?.root ?? document;
  root.querySelectorAll<HTMLElement>(options?.selector ?? DROPDOWN_SELECTOR).forEach((dropdown) => {
    const toggle = dropdown.querySelector<HTMLElement>('.dropdown-toggle');
    const menu = dropdown.querySelector<HTMLElement>('.dropdown-menu');
    if (!toggle || !menu) return;

    // ARIA setup
    toggle.setAttribute('aria-haspopup', 'menu');
    toggle.setAttribute('aria-expanded', 'false');

    if (!menu.getAttribute('role')) {
      menu.setAttribute('role', 'menu');
    }

    menu.querySelectorAll<HTMLElement>('.dropdown-item').forEach((item) => {
      if (!item.getAttribute('role')) {
        item.setAttribute('role', 'menuitem');
      }
      item.setAttribute('tabindex', '-1');
    });

    // Toggle on click
    toggle.addEventListener(
      'click',
      () => {
        const isOpen = menu.classList.contains('active');
        if (isOpen) {
          closeDropdown(toggle, menu);
        } else {
          openDropdown(toggle, menu);
        }
      },
      { signal }
    );

    // Click-away to close
    onClickAway(
      dropdown,
      () => {
        if (menu.classList.contains('active')) {
          closeDropdown(toggle, menu);
        }
      },
      signal
    );

    // Keyboard navigation
    dropdown.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        const isOpen = menu.classList.contains('active');

        if (e.key === 'Escape' && isOpen) {
          e.preventDefault();
          closeDropdown(toggle, menu);
          requestAnimationFrame(() => {
            toggle.focus();
          });
          return;
        }

        if (e.key === 'Tab' && isOpen) {
          closeDropdown(toggle, menu);
          return;
        }

        // Open on ArrowDown from toggle
        if (
          (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') &&
          document.activeElement === toggle &&
          !isOpen
        ) {
          e.preventDefault();
          openDropdown(toggle, menu);
          return;
        }

        if (isOpen) {
          handleKeyboardNav(
            {
              container: menu,
              itemSelector: '[role="menuitem"]',
              orientation: 'vertical',
              onActivate: (item) => {
                item.click();
                closeDropdown(toggle, menu);
                toggle.focus();
              },
            },
            e
          );
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
