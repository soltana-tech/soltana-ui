// ---------------------------------------------------------------------------
// Positioning Utility
// ---------------------------------------------------------------------------
// Shared positioning logic for floating elements (tooltips, combobox dropdowns,
// context menus, hover cards, date/color picker popups).
// ---------------------------------------------------------------------------

export type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface PositionOptions {
  /** Anchor element or fixed coordinates (e.g. for context menus). */
  anchor: HTMLElement | { x: number; y: number };
  /** Floating element to position. */
  floating: HTMLElement;
  /** Preferred placement relative to the anchor. */
  placement: Placement;
  /** Gap between anchor and floating element in pixels. */
  gap?: number;
  /** Minimum distance from viewport edges in pixels. */
  viewportPadding?: number;
  /** Auto-flip to opposite side when clipped by viewport. */
  flip?: boolean;
}

export interface PositionResult {
  top: number;
  left: number;
}

const OPPOSITE: Record<Placement, Placement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

function getAnchorRect(
  anchor: PositionOptions['anchor']
):
  | DOMRect
  | { top: number; bottom: number; left: number; right: number; width: number; height: number } {
  if (anchor instanceof HTMLElement) {
    return anchor.getBoundingClientRect();
  }
  return { top: anchor.y, bottom: anchor.y, left: anchor.x, right: anchor.x, width: 0, height: 0 };
}

function computeForPlacement(
  rect: ReturnType<typeof getAnchorRect>,
  floatingRect: DOMRect,
  placement: Placement,
  gap: number
): PositionResult {
  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      top = rect.top - floatingRect.height - gap;
      left = rect.left + rect.width / 2 - floatingRect.width / 2;
      break;
    case 'bottom':
      top = rect.bottom + gap;
      left = rect.left + rect.width / 2 - floatingRect.width / 2;
      break;
    case 'left':
      top = rect.top + rect.height / 2 - floatingRect.height / 2;
      left = rect.left - floatingRect.width - gap;
      break;
    case 'right':
      top = rect.top + rect.height / 2 - floatingRect.height / 2;
      left = rect.right + gap;
      break;
  }

  return { top, left };
}

function isClipped(
  pos: PositionResult,
  floatingRect: DOMRect,
  placement: Placement,
  padding: number
): boolean {
  switch (placement) {
    case 'top':
      return pos.top < padding;
    case 'bottom':
      return pos.top + floatingRect.height > window.innerHeight - padding;
    case 'left':
      return pos.left < padding;
    case 'right':
      return pos.left + floatingRect.width > window.innerWidth - padding;
  }
}

/**
 * Compute absolute position for a floating element relative to an anchor.
 * Supports viewport clamping and optional flip when the preferred placement
 * would be clipped.
 *
 * @internal
 */
export function computePosition(options: PositionOptions): PositionResult {
  const { anchor, floating, placement, gap = 8, viewportPadding = 4, flip = true } = options;

  const anchorRect = getAnchorRect(anchor);
  const floatingRect = floating.getBoundingClientRect();

  let pos = computeForPlacement(anchorRect, floatingRect, placement, gap);

  // Flip to opposite side if clipped
  if (flip && isClipped(pos, floatingRect, placement, viewportPadding)) {
    const flipped = computeForPlacement(anchorRect, floatingRect, OPPOSITE[placement], gap);
    if (!isClipped(flipped, floatingRect, OPPOSITE[placement], viewportPadding)) {
      pos = flipped;
    }
  }

  // Clamp to viewport
  pos.left = Math.max(
    viewportPadding,
    Math.min(pos.left, window.innerWidth - floatingRect.width - viewportPadding)
  );
  pos.top = Math.max(
    viewportPadding,
    Math.min(pos.top, window.innerHeight - floatingRect.height - viewportPadding)
  );

  return pos;
}
