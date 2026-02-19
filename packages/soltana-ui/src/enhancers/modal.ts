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

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';

export const MODAL_SELECTOR = '[data-sol-modal]';
export const MODAL_OPEN_SELECTOR = '[data-modal-open]';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let _controller: AbortController | null = null;
let _openCount = 0;

function openModal(modal: HTMLElement): void {
  modal.classList.add('active');
  modal.querySelector('.modal')?.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  _openCount++;
  document.body.classList.add('sol-modal-open');

  // Focus the first focusable element inside the modal content
  requestAnimationFrame(() => {
    const content = modal.querySelector<HTMLElement>('.modal__content, .modal');
    const firstFocusable = content?.querySelector<HTMLElement>(FOCUSABLE);
    (firstFocusable ?? content)?.focus();
  });
}

function closeModal(modal: HTMLElement): void {
  modal.classList.remove('active');
  modal.querySelector('.modal')?.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  _openCount = Math.max(0, _openCount - 1);
  if (_openCount === 0) {
    document.body.classList.remove('sol-modal-open');
  }
}

function trapFocus(modal: HTMLElement, e: KeyboardEvent): void {
  const content = modal.querySelector<HTMLElement>('.modal__content, .modal');
  if (!content) return;

  const focusables = Array.from(content.querySelectorAll<HTMLElement>(FOCUSABLE));
  // Include focusable slotted children
  const allFocusable = [
    ...focusables,
    ...Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE)),
  ].filter((el, i, arr) => arr.indexOf(el) === i);

  if (allFocusable.length === 0) return;

  const first = allFocusable[0];
  const last = allFocusable[allFocusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

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
export function initModals(options?: EnhancerOptions): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  _openCount = 0;
  document.body.classList.remove('sol-modal-open');
  const { signal } = _controller;

  const root = options?.root ?? document;

  // Open triggers
  root
    .querySelectorAll<HTMLElement>(options?.selector ?? MODAL_OPEN_SELECTOR)
    .forEach((trigger) => {
      trigger.addEventListener(
        'click',
        () => {
          const targetId = trigger.getAttribute('data-modal-open');
          if (!targetId) return;
          const modal = document.getElementById(targetId);
          if (modal?.hasAttribute('data-sol-modal')) {
            openModal(modal);
          }
        },
        { signal }
      );
    });

  // Close triggers and keyboard handling per modal
  root.querySelectorAll<HTMLElement>(MODAL_SELECTOR).forEach((modal) => {
    // Close buttons inside modal
    modal.querySelectorAll<HTMLElement>('[data-modal-close]').forEach((btn) => {
      btn.addEventListener(
        'click',
        () => {
          closeModal(modal);
        },
        { signal }
      );
    });

    // Backdrop click — the [data-sol-modal] element is typically the backdrop
    // itself, but fall back to a child query for nested structures.
    const backdrop = modal.matches('.modal-backdrop')
      ? modal
      : modal.querySelector<HTMLElement>('.modal-backdrop');
    backdrop?.addEventListener(
      'click',
      (e) => {
        if (e.target === backdrop) {
          closeModal(modal);
        }
      },
      { signal }
    );

    // Escape key and focus trapping
    modal.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeModal(modal);
          return;
        }
        if (e.key === 'Tab') {
          trapFocus(modal, e);
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
      document.body.classList.remove('sol-modal-open');
    },
  };
}
