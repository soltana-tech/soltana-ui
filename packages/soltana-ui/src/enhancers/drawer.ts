// ---------------------------------------------------------------------------
// Drawer Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-drawer] elements.
// Mirrors modal behavior: focus trap, Escape key, backdrop click, scroll lock.
//
// Singleton lifecycle: module-level AbortController ensures only one enhancer
// instance is active at a time.
// ---------------------------------------------------------------------------

import { createOverlayEnhancer } from './utils/create-overlay-enhancer.js';

export const DRAWER_SELECTOR = '[data-sol-drawer]';
export const DRAWER_OPEN_SELECTOR = '[data-drawer-open]';

/**
 * Enhance all `[data-sol-drawer]` elements with open/close, focus trapping,
 * Escape key, and backdrop click behavior.
 *
 * Open triggers: `[data-drawer-open="<drawer-id>"]`.
 * Close triggers: `[data-drawer-close]` inside the drawer.
 * Adds `.sol-drawer-open` to `document.body` while any drawer is open.
 */
export const initDrawers = createOverlayEnhancer({
  overlaySelector: DRAWER_SELECTOR,
  openTriggerAttr: 'data-drawer-open',
  closeTriggerAttr: 'data-drawer-close',
  bodyOpenClass: 'sol-drawer-open',
  contentSelector: '.drawer',
  childElementsToActivate: ['.drawer-backdrop', '.drawer'],
  checkOverlayAsBackdrop: false,
  backdropSelector: '.drawer-backdrop',
  setupAria: (wrapper) => {
    if (!wrapper.getAttribute('role')) {
      wrapper.querySelector('.drawer')?.setAttribute('role', 'dialog');
    }
  },
});
