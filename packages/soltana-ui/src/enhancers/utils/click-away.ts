// ---------------------------------------------------------------------------
// Click-Away Utility
// ---------------------------------------------------------------------------
// Detects clicks outside a target element. Used by dropdowns, comboboxes,
// context menus, hover cards, and picker popups.
// ---------------------------------------------------------------------------

/**
 * Register a callback that fires when a click occurs outside `element`.
 * Uses the provided `AbortSignal` for cleanup — no manual teardown needed.
 *
 * @internal
 */
export function onClickAway(element: HTMLElement, callback: () => void, signal: AbortSignal): void {
  document.addEventListener(
    'mousedown',
    (e: Event) => {
      if (!element.contains(e.target as Node)) {
        callback();
      }
    },
    { signal }
  );
}
