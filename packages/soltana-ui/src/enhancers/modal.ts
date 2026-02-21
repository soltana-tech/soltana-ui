// ---------------------------------------------------------------------------
// Modal Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-modal] elements.
// Handles open/close triggers, focus trapping, Escape key, and backdrop click.
//
// Singleton lifecycle: module-level state (AbortController, open count)
// ensures only one enhancer instance is active at a time. Calling
// initModals() aborts any previous instance before attaching new listeners.
// This is enforced by initSoltana's generation counter.
// ---------------------------------------------------------------------------

import { createOverlayEnhancer } from './utils/create-overlay-enhancer.js';

export const MODAL_SELECTOR = '[data-sol-modal]';
export const MODAL_OPEN_SELECTOR = '[data-modal-open]';

/**
 * Enhance all `[data-sol-modal]` elements with open/close, focus trapping,
 * Escape key, and backdrop click behavior.
 *
 * Open triggers: elements with `[data-modal-open="<modal-id>"]`.
 * Close triggers: elements with `[data-modal-close]` inside the modal.
 * Adds the `.sol-modal-open` class to `document.body` while any modal is open
 * to prevent background scrolling.
 *
 * @param options - Optional scoping and selector overrides.
 * @returns Cleanup handle — call `destroy()` to remove all listeners.
 *          Re-calling `initModals()` implicitly cleans up previous listeners.
 */
export const initModals = createOverlayEnhancer({
  overlaySelector: MODAL_SELECTOR,
  openTriggerSelector: MODAL_OPEN_SELECTOR,
  openTriggerAttr: 'data-modal-open',
  closeTriggerSelector: '[data-modal-close]',
  bodyOpenClass: 'sol-modal-open',
  contentSelector: '.modal__content, .modal',
  childElementsToActivate: ['.modal'],
  checkOverlayAsBackdrop: true,
  backdropSelector: '.modal-backdrop',
});
