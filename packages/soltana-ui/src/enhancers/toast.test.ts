// Unit tests for toast enhancer focus on ARIA correctness, event handling,
// and programmatic toast creation.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initToasts, showToast, dismissToast } from './toast.js';

function createToastContainer(position: string): HTMLElement {
  const container = document.createElement('div');
  container.className = `toast-container toast-container-${position}`;
  container.setAttribute('data-sol-toast-container', '');
  document.body.appendChild(container);
  return container;
}

function createToast(message: string): HTMLElement {
  const toast = document.createElement('div');
  toast.className = 'toast';

  const header = document.createElement('div');
  header.className = 'toast-header';

  const title = document.createElement('strong');
  title.className = 'text-sm';
  title.textContent = 'Notice';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'close close-sm';
  closeBtn.setAttribute('aria-label', 'Dismiss');

  header.appendChild(title);
  header.appendChild(closeBtn);

  const body = document.createElement('div');
  body.className = 'toast-body text-sm';
  body.textContent = message;

  toast.appendChild(header);
  toast.appendChild(body);

  return toast;
}

describe('initToasts', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllTimers();
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initToasts();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('handles multiple init calls without duplicating listeners', () => {
    const container = createToastContainer('top-right');
    const toast = createToast('Test message');
    container.appendChild(toast);

    initToasts();
    const cleanup = initToasts();

    expect(container.getAttribute('role')).toBe('status');
    expect(container.getAttribute('aria-live')).toBe('polite');

    cleanup.destroy();
  });

  it('sets ARIA attributes on toast container', () => {
    const container = createToastContainer('top-right');
    const cleanup = initToasts();

    expect(container.getAttribute('role')).toBe('status');
    expect(container.getAttribute('aria-live')).toBe('polite');

    cleanup.destroy();
  });

  it('wires up close buttons on existing toasts', () => {
    const container = createToastContainer('top-right');
    const toast = createToast('Existing toast');
    container.appendChild(toast);

    const cleanup = initToasts();

    const closeBtn = toast.querySelector<HTMLElement>('.close')!;
    closeBtn.click();

    expect(toast.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('destroy() removes default container from DOM', () => {
    const cleanup = initToasts();

    showToast({ message: 'Test toast' });

    const container = document.querySelector('[data-sol-toast-container]');
    expect(container).not.toBeNull();

    cleanup.destroy();

    expect(document.querySelector('[data-sol-toast-container]')).toBeNull();
  });

  it('scopes queries to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const container = document.createElement('div');
    container.setAttribute('data-sol-toast-container', '');
    root.appendChild(container);

    const cleanup = initToasts({ root });

    expect(container.getAttribute('role')).toBe('status');

    cleanup.destroy();
  });

  describe('error handling', () => {
    it('handles gracefully when no elements match the toast selector', () => {
      expect(() => initToasts()).not.toThrow();
      const cleanup = initToasts();
      expect(typeof cleanup.destroy).toBe('function');
      cleanup.destroy();
    });
  });
});

describe('showToast', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('creates and appends a toast element to the DOM', () => {
    const toast = showToast({ message: 'Test message' });

    expect(toast).toBeInstanceOf(HTMLElement);
    expect(toast.classList.contains('toast')).toBe(true);
    expect(toast.textContent).toContain('Test message');
    expect(document.body.contains(toast)).toBe(true);
  });

  it('creates a container if none exists', () => {
    showToast({ message: 'First toast' });

    const container = document.querySelector('[data-sol-toast-container]');
    expect(container).not.toBeNull();
    expect(container?.classList.contains('toast-container-top-right')).toBe(true);
  });

  it('uses the specified position', () => {
    showToast({ message: 'Bottom left', position: 'bottom-left' });

    const container = document.querySelector('.toast-container-bottom-left');
    expect(container).not.toBeNull();
  });

  it('applies the correct type class', () => {
    const successToast = showToast({ message: 'Success', type: 'success' });
    expect(successToast.classList.contains('toast-success')).toBe(true);

    const errorToast = showToast({ message: 'Error', type: 'error' });
    expect(errorToast.classList.contains('toast-error')).toBe(true);

    const warningToast = showToast({ message: 'Warning', type: 'warning' });
    expect(warningToast.classList.contains('toast-warning')).toBe(true);

    const infoToast = showToast({ message: 'Info', type: 'info' });
    expect(infoToast.classList.contains('toast-info')).toBe(true);
  });

  it('auto-dismisses after the specified duration', () => {
    const toast = showToast({ message: 'Auto-dismiss', duration: 3000 });

    expect(document.body.contains(toast)).toBe(true);

    vi.advanceTimersByTime(3000);
    vi.advanceTimersByTime(500);

    expect(document.body.contains(toast)).toBe(false);
  });

  it('does not auto-dismiss if duration is 0', () => {
    const toast = showToast({ message: 'No auto-dismiss', duration: 0 });

    vi.advanceTimersByTime(10000);

    expect(document.body.contains(toast)).toBe(true);
  });

  it('dismisses on close button click', () => {
    const toast = showToast({ message: 'Click to close' });

    const closeBtn = toast.querySelector<HTMLElement>('.close')!;
    closeBtn.click();

    vi.advanceTimersByTime(500);

    expect(document.body.contains(toast)).toBe(false);
  });

  it('supports multiple toasts in the same container', () => {
    const toast1 = showToast({ message: 'First' });
    const toast2 = showToast({ message: 'Second' });
    const toast3 = showToast({ message: 'Third' });

    expect(document.body.contains(toast1)).toBe(true);
    expect(document.body.contains(toast2)).toBe(true);
    expect(document.body.contains(toast3)).toBe(true);

    const container = document.querySelector('[data-sol-toast-container]');
    expect(container?.children.length).toBe(3);
  });

  it('supports toasts in different positions', () => {
    showToast({ message: 'Top right', position: 'top-right' });
    showToast({ message: 'Bottom left', position: 'bottom-left' });
    showToast({ message: 'Top center', position: 'top-center' });

    const containers = document.querySelectorAll('[data-sol-toast-container]');
    expect(containers.length).toBe(3);
  });
});

describe('dismissToast', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('removes the toast from DOM', () => {
    const toast = showToast({ message: 'Dismiss me', duration: 0 });

    expect(document.body.contains(toast)).toBe(true);

    dismissToast(toast);
    vi.advanceTimersByTime(500);

    expect(document.body.contains(toast)).toBe(false);
  });

  it('removes active class immediately', () => {
    const toast = showToast({ message: 'Remove active', duration: 0 });

    vi.advanceTimersByTime(100);
    toast.classList.add('active');

    dismissToast(toast);

    expect(toast.classList.contains('active')).toBe(false);
  });
});
