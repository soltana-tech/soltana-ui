// ---------------------------------------------------------------------------
// Toast Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for toast notifications.
// Provides both declarative `[data-sol-toast-container]` enhancement and
// an imperative `showToast()` API for programmatic use.
//
// Singleton lifecycle: module-level AbortController ensures only one enhancer
// instance is active at a time.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';

export const TOAST_CONTAINER_SELECTOR = '[data-sol-toast-container]';

let _controller: AbortController | null = null;
let _defaultContainer: HTMLElement | null = null;

export type ToastType = 'success' | 'warning' | 'error' | 'info';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
}

function getOrCreateContainer(position: ToastPosition): HTMLElement {
  // Try existing container with matching position
  const existing = document.querySelector<HTMLElement>(
    `.toast-container-${position}[data-sol-toast-container]`
  );
  if (existing) return existing;

  // Create default container
  if (
    _defaultContainer?.isConnected &&
    _defaultContainer.classList.contains(`toast-container-${position}`)
  ) {
    return _defaultContainer;
  }

  const container = document.createElement('div');
  container.className = `toast-container toast-container-${position}`;
  container.setAttribute('data-sol-toast-container', '');
  container.setAttribute('role', 'status');
  container.setAttribute('aria-live', 'polite');
  document.body.appendChild(container);
  _defaultContainer = container;
  return container;
}

function createToastElement(opts: ToastOptions): HTMLElement {
  const toast = document.createElement('div');
  const typeClass = opts.type ? ` toast-${opts.type}` : '';
  toast.className = `toast${typeClass}`;

  const header = document.createElement('div');
  header.className = 'toast-header';

  const title = document.createElement('strong');
  title.className = 'text-sm';
  title.textContent = opts.type ? opts.type.charAt(0).toUpperCase() + opts.type.slice(1) : 'Notice';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'close close-sm';
  closeBtn.setAttribute('aria-label', 'Dismiss');

  header.appendChild(title);
  header.appendChild(closeBtn);

  const body = document.createElement('div');
  body.className = 'toast-body text-sm';
  body.textContent = opts.message;

  toast.appendChild(header);
  toast.appendChild(body);

  return toast;
}

/**
 * Programmatically show a toast notification.
 * Creates DOM, animates in, and auto-dismisses after `duration` ms (default 5000).
 */
export function showToast(opts: ToastOptions): HTMLElement {
  const { duration = 5000, position = 'top-right' } = opts;
  const container = getOrCreateContainer(position);
  const toast = createToastElement(opts);

  container.appendChild(toast);

  // Animate in on next frame
  requestAnimationFrame(() => {
    toast.classList.add('active');
  });

  // Close button handler
  const closeBtn = toast.querySelector('.close');
  const dismiss = () => {
    toast.classList.remove('active');
    toast.addEventListener(
      'transitionend',
      () => {
        toast.remove();
      },
      { once: true }
    );
    // Fallback removal if transition doesn't fire
    setTimeout(() => {
      if (toast.isConnected) toast.remove();
    }, 500);
  };

  closeBtn?.addEventListener('click', dismiss);

  // Auto-dismiss
  if (duration > 0) {
    setTimeout(dismiss, duration);
  }

  return toast;
}

/**
 * Dismiss a specific toast element.
 */
export function dismissToast(toast: HTMLElement): void {
  toast.classList.remove('active');
  toast.addEventListener(
    'transitionend',
    () => {
      toast.remove();
    },
    { once: true }
  );
  setTimeout(() => {
    if (toast.isConnected) toast.remove();
  }, 500);
}

/**
 * Enhance all `[data-sol-toast-container]` elements with ARIA attributes
 * and close button behavior on existing toasts.
 */
export function initToasts(options?: EnhancerOptions): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  const { signal } = _controller;

  const root = options?.root ?? document;
  root
    .querySelectorAll<HTMLElement>(options?.selector ?? TOAST_CONTAINER_SELECTOR)
    .forEach((container) => {
      // ARIA setup
      if (!container.getAttribute('role')) {
        container.setAttribute('role', 'status');
      }
      if (!container.getAttribute('aria-live')) {
        container.setAttribute('aria-live', 'polite');
      }

      // Close buttons on existing toasts
      container.querySelectorAll<HTMLElement>('.toast .close').forEach((closeBtn) => {
        closeBtn.addEventListener(
          'click',
          () => {
            const toast = closeBtn.closest<HTMLElement>('.toast');
            if (toast) dismissToast(toast);
          },
          { signal }
        );
      });
    });

  return {
    destroy() {
      _controller?.abort();
      _controller = null;
      if (_defaultContainer?.isConnected) {
        _defaultContainer.remove();
      }
      _defaultContainer = null;
    },
  };
}
