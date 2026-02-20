// ---------------------------------------------------------------------------
// Context Menu Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-context-menu] elements.
// Right-click triggered menu positioned at cursor coordinates.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';
import { computePosition } from './utils/position.js';
import { onClickAway } from './utils/click-away.js';
import { handleKeyboardNav } from './utils/keyboard-nav.js';

export const CONTEXT_MENU_SELECTOR = '[data-sol-context-menu]';

/** Singleton guard — aborted and replaced on each `init*()` call. */
let _controller: AbortController | null = null;

/**
 * Enhance all `[data-sol-context-menu]` elements with right-click
 * triggered floating menu behavior.
 *
 * Expected structure:
 * ```html
 * <div data-sol-context-menu>
 *   <div class="context-menu" role="menu">
 *     <button class="context-menu-item" role="menuitem">Cut</button>
 *     <button class="context-menu-item" role="menuitem">Copy</button>
 *   </div>
 *   <!-- Trigger area content -->
 *   <p>Right-click here</p>
 * </div>
 * ```
 */
export function initContextMenus(options?: EnhancerOptions): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  const { signal } = _controller;

  const root = options?.root ?? document;
  root
    .querySelectorAll<HTMLElement>(options?.selector ?? CONTEXT_MENU_SELECTOR)
    .forEach((wrapper) => {
      const menuEl = wrapper.querySelector<HTMLElement>('.context-menu');
      if (!menuEl) return;
      const menu: HTMLElement = menuEl;

      // ARIA setup
      if (!menu.getAttribute('role')) {
        menu.setAttribute('role', 'menu');
      }
      menu.querySelectorAll<HTMLElement>('.context-menu-item').forEach((item) => {
        if (!item.getAttribute('role')) {
          item.setAttribute('role', 'menuitem');
        }
        item.setAttribute('tabindex', '-1');
      });

      function closeMenu(): void {
        menu.classList.remove('active');
      }

      // Right-click trigger
      wrapper.addEventListener(
        'contextmenu',
        (e: MouseEvent) => {
          e.preventDefault();

          const pos = computePosition({
            anchor: { x: e.clientX, y: e.clientY },
            floating: menu,
            placement: 'right',
            gap: 0,
          });

          menu.style.top = `${String(pos.top)}px`;
          menu.style.left = `${String(pos.left)}px`;
          menu.classList.add('active');

          // Focus first item
          requestAnimationFrame(() => {
            const first = menu.querySelector<HTMLElement>('[role="menuitem"]');
            first?.focus();
          });
        },
        { signal }
      );

      // Click-away to close
      onClickAway(menu, closeMenu, signal);

      // Keyboard navigation
      menu.addEventListener(
        'keydown',
        (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            closeMenu();
            return;
          }

          handleKeyboardNav(
            {
              container: menu,
              itemSelector: '[role="menuitem"]',
              orientation: 'vertical',
              onActivate: (item) => {
                item.click();
                closeMenu();
              },
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
