// ---------------------------------------------------------------------------
// Focus Trap Utility
// ---------------------------------------------------------------------------
// Shared focus trapping logic for modal-like containers (modals, drawers,
// alert dialogs, date picker popups).
// ---------------------------------------------------------------------------

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Trap Tab/Shift+Tab focus within a container element.
 * Call from a `keydown` handler when `e.key === 'Tab'`.
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  const focusables = Array.from(new Set(container.querySelectorAll<HTMLElement>(FOCUSABLE)));

  if (focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export { FOCUSABLE };
