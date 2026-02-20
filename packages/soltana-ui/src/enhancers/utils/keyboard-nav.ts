// ---------------------------------------------------------------------------
// Keyboard Navigation Utility
// ---------------------------------------------------------------------------
// Shared arrow-key navigation for lists of items (dropdowns, comboboxes,
// context menus, tree views).
// ---------------------------------------------------------------------------

/** @internal */
export interface KeyboardNavOptions {
  /** Container element holding the navigable items. */
  container: HTMLElement;
  /** CSS selector for individual navigable items within the container. */
  itemSelector: string;
  /** Navigation direction supported by the component. */
  orientation: 'vertical' | 'horizontal' | 'both';
  /** Wrap from last item to first (and vice versa). Defaults to true. */
  wrap?: boolean;
  /** Callback invoked when an item is activated (Enter/Space). */
  onActivate?: (item: HTMLElement) => void;
}

/**
 * Handle a keydown event for arrow-key navigation within a list of items.
 * Manages `aria-activedescendant`-style focus by calling `focus()` on
 * the target item. Returns true if the event was handled.
 *
 * @internal
 */
export function handleKeyboardNav(options: KeyboardNavOptions, event: KeyboardEvent): boolean {
  const { container, itemSelector, orientation, wrap = true, onActivate } = options;
  const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));

  if (items.length === 0) return false;

  const current = items.indexOf(document.activeElement as HTMLElement);
  let next = current;

  const isVertical = orientation === 'vertical' || orientation === 'both';
  const isHorizontal = orientation === 'horizontal' || orientation === 'both';

  switch (event.key) {
    case 'ArrowDown':
      if (!isVertical) return false;
      event.preventDefault();
      next = current + 1;
      break;
    case 'ArrowUp':
      if (!isVertical) return false;
      event.preventDefault();
      next = current - 1;
      break;
    case 'ArrowRight':
      if (!isHorizontal) return false;
      event.preventDefault();
      next = current + 1;
      break;
    case 'ArrowLeft':
      if (!isHorizontal) return false;
      event.preventDefault();
      next = current - 1;
      break;
    case 'Home':
      event.preventDefault();
      next = 0;
      break;
    case 'End':
      event.preventDefault();
      next = items.length - 1;
      break;
    case 'Enter':
    case ' ':
      if (current >= 0 && onActivate) {
        event.preventDefault();
        onActivate(items[current]);
      }
      return current >= 0;
    default:
      return false;
  }

  if (wrap) {
    next = (next + items.length) % items.length;
  } else {
    next = Math.max(0, Math.min(next, items.length - 1));
  }

  items[next]?.focus();
  return true;
}
