// ---------------------------------------------------------------------------
// Drawer Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-drawer] elements.
// Mirrors modal behavior: focus trap, Escape key, backdrop click, scroll lock.
//
// Singleton lifecycle: module-level AbortController ensures only one enhancer
// instance is active at a time.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';
import { trapFocus, FOCUSABLE } from './utils/focus-trap.js';

export const DRAWER_SELECTOR = '[data-sol-drawer]';
export const DRAWER_OPEN_SELECTOR = '[data-drawer-open]';

/** Singleton guard — aborted and replaced on each `init*()` call. */
let _controller: AbortController | null = null;
let _openCount = 0;

function openDrawer(wrapper: HTMLElement): void {
  if (wrapper.classList.contains('active')) return;
  wrapper.classList.add('active');

  // Activate both backdrop and drawer within the wrapper
  wrapper.querySelector('.drawer-backdrop')?.classList.add('active');
  wrapper.querySelector('.drawer')?.classList.add('active');
  wrapper.setAttribute('aria-hidden', 'false');
  _openCount++;
  document.body.classList.add('sol-drawer-open');

  // Focus the first focusable element inside the drawer
  requestAnimationFrame(() => {
    const drawer = wrapper.querySelector<HTMLElement>('.drawer');
    const firstFocusable = drawer?.querySelector<HTMLElement>(FOCUSABLE);
    (firstFocusable ?? drawer)?.focus();
  });
}

function closeDrawer(wrapper: HTMLElement): void {
  wrapper.classList.remove('active');
  wrapper.querySelector('.drawer-backdrop')?.classList.remove('active');
  wrapper.querySelector('.drawer')?.classList.remove('active');
  wrapper.setAttribute('aria-hidden', 'true');
  _openCount = Math.max(0, _openCount - 1);
  if (_openCount === 0) {
    document.body.classList.remove('sol-drawer-open');
  }
}

/**
 * Enhance all `[data-sol-drawer]` elements with open/close, focus trapping,
 * Escape key, and backdrop click behavior.
 *
 * Open triggers: `[data-drawer-open="<drawer-id>"]`.
 * Close triggers: `[data-drawer-close]` inside the drawer.
 * Adds `.sol-drawer-open` to `document.body` while any drawer is open.
 */
export function initDrawers(options?: EnhancerOptions): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  _openCount = 0;
  document.body.classList.remove('sol-drawer-open');
  const { signal } = _controller;

  const root = options?.root ?? document;

  // Open triggers
  root
    .querySelectorAll<HTMLElement>(options?.selector ?? DRAWER_OPEN_SELECTOR)
    .forEach((trigger) => {
      trigger.addEventListener(
        'click',
        () => {
          const targetId = trigger.getAttribute('data-drawer-open');
          if (!targetId) return;
          const wrapper = document.getElementById(targetId);
          if (wrapper?.hasAttribute('data-sol-drawer')) {
            openDrawer(wrapper);
          }
        },
        { signal }
      );
    });

  // Per-drawer handlers
  root.querySelectorAll<HTMLElement>(DRAWER_SELECTOR).forEach((wrapper) => {
    // ARIA setup
    if (!wrapper.getAttribute('role')) {
      wrapper.querySelector('.drawer')?.setAttribute('role', 'dialog');
    }

    // Close buttons
    wrapper.querySelectorAll<HTMLElement>('[data-drawer-close]').forEach((btn) => {
      btn.addEventListener(
        'click',
        () => {
          closeDrawer(wrapper);
        },
        { signal }
      );
    });

    // Backdrop click
    const backdrop = wrapper.querySelector<HTMLElement>('.drawer-backdrop');
    backdrop?.addEventListener(
      'click',
      (e) => {
        if (e.target === backdrop) {
          closeDrawer(wrapper);
        }
      },
      { signal }
    );

    // Escape key and focus trapping
    wrapper.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeDrawer(wrapper);
          return;
        }
        if (e.key === 'Tab') {
          const drawer = wrapper.querySelector<HTMLElement>('.drawer');
          if (drawer) trapFocus(drawer, e);
        }
      },
      { signal }
    );
  });

  return {
    destroy() {
      _controller?.abort();
      _controller = null;
      _openCount = 0;
      document.body.classList.remove('sol-drawer-open');
    },
  };
}
