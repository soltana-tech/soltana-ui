// ---------------------------------------------------------------------------
// Modal Enhancer
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-modal] elements.
// Handles open/close triggers, focus trapping, Escape key, and backdrop click.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup } from '../config/types';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let _controller: AbortController | null = null;
let _openCount = 0;

function openModal(modal: HTMLElement): void {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  _openCount++;
  document.body.style.overflow = 'hidden';

  // Focus the first focusable element inside the modal content
  requestAnimationFrame(() => {
    const content = modal.querySelector<HTMLElement>('.modal__content, .modal');
    const firstFocusable = content?.querySelector<HTMLElement>(FOCUSABLE);
    (firstFocusable ?? content)?.focus();
  });
}

function closeModal(modal: HTMLElement): void {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  _openCount = Math.max(0, _openCount - 1);
  if (_openCount === 0) {
    document.body.style.overflow = '';
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
 * Enhance all [data-sol-modal] elements on the page.
 * Open triggers: elements with [data-modal-open="<modal-id>"]
 * Close triggers: elements with [data-modal-close] inside the modal
 *
 * Returns a cleanup object. Calling destroy() removes all listeners.
 * Re-calling initModals() automatically cleans up previous listeners.
 */
export function initModals(): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  _openCount = 0;
  document.body.style.overflow = '';
  const { signal } = _controller;

  // Open triggers
  document.querySelectorAll<HTMLElement>('[data-modal-open]').forEach((trigger) => {
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
  document.querySelectorAll<HTMLElement>('[data-sol-modal]').forEach((modal) => {
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

    // Backdrop click
    const backdrop = modal.querySelector<HTMLElement>('.modal-backdrop');
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
      document.body.style.overflow = '';
    },
  };
}
