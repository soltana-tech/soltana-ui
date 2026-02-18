// ---------------------------------------------------------------------------
// Tooltip Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-tooltip] elements.
// Creates and positions tooltips on hover/focus.
//
// Singleton lifecycle: module-level state (AbortController, tooltip element,
// active target) ensures only one enhancer instance is active at a time.
// Calling initTooltips() aborts any previous instance before attaching new
// listeners. This is enforced by initSoltana's generation counter.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';

export const TOOLTIP_SELECTOR = '[data-sol-tooltip]';

let _controller: AbortController | null = null;
let tooltipEl: HTMLElement | null = null;
let activeTarget: HTMLElement | null = null;

function getOrCreateTooltip(): HTMLElement {
  if (tooltipEl?.isConnected) return tooltipEl;
  tooltipEl = document.createElement('div');
  tooltipEl.className = 'tooltip';
  tooltipEl.setAttribute('role', 'tooltip');
  document.body.appendChild(tooltipEl);
  return tooltipEl;
}

function showTooltip(target: HTMLElement): void {
  const text = target.getAttribute('data-sol-tooltip');
  if (!text) return;

  // Clean up previous target's aria-describedby if switching targets
  if (activeTarget && activeTarget !== target) {
    activeTarget.removeAttribute('aria-describedby');
  }

  const tip = getOrCreateTooltip();
  tip.textContent = text;
  tip.classList.add('active');
  activeTarget = target;

  // Generate a stable ID for ARIA
  if (!tip.id) {
    tip.id = `sol-tooltip-${Math.random().toString(36).slice(2, 7)}`;
  }
  target.setAttribute('aria-describedby', tip.id);

  // Defer positioning to next frame so the browser has painted the tooltip
  requestAnimationFrame(() => {
    positionTooltip(target, tip);
  });
}

function hideTooltip(): void {
  if (tooltipEl) {
    tooltipEl.classList.remove('active');
  }
  if (activeTarget) {
    activeTarget.removeAttribute('aria-describedby');
    activeTarget = null;
  }
}

function positionTooltip(target: HTMLElement, tip: HTMLElement): void {
  const position = target.getAttribute('data-tooltip-position') ?? 'top';
  const rect = target.getBoundingClientRect();
  const tipRect = tip.getBoundingClientRect();
  const gap = 8;

  let top = 0;
  let left = 0;

  switch (position) {
    case 'bottom':
      top = rect.bottom + gap;
      left = rect.left + rect.width / 2 - tipRect.width / 2;
      break;
    case 'left':
      top = rect.top + rect.height / 2 - tipRect.height / 2;
      left = rect.left - tipRect.width - gap;
      break;
    case 'right':
      top = rect.top + rect.height / 2 - tipRect.height / 2;
      left = rect.right + gap;
      break;
    case 'top':
    default:
      top = rect.top - tipRect.height - gap;
      left = rect.left + rect.width / 2 - tipRect.width / 2;
      break;
  }

  // Clamp to viewport
  left = Math.max(4, Math.min(left, window.innerWidth - tipRect.width - 4));
  top = Math.max(4, Math.min(top, window.innerHeight - tipRect.height - 4));

  tip.style.top = `${String(top)}px`;
  tip.style.left = `${String(left)}px`;
}

/**
 * Enhance all `[data-sol-tooltip]` elements with positioned tooltips.
 *
 * Attaches mouseenter/focus listeners that show a tooltip, and
 * mouseleave/blur/Escape listeners that hide it. Creates a single shared
 * tooltip element appended to `document.body`.
 *
 * @param options - Optional scoping and selector overrides.
 * @returns Cleanup handle — call `destroy()` to remove all listeners and the
 *          tooltip element. Re-calling `initTooltips()` implicitly cleans up
 *          previous listeners.
 */
export function initTooltips(options?: EnhancerOptions): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  const { signal } = _controller;

  const root = options?.root ?? document;
  root.querySelectorAll<HTMLElement>(options?.selector ?? TOOLTIP_SELECTOR).forEach((target) => {
    target.addEventListener(
      'mouseenter',
      () => {
        showTooltip(target);
      },
      { signal }
    );
    target.addEventListener(
      'focus',
      () => {
        showTooltip(target);
      },
      { signal }
    );
    target.addEventListener('mouseleave', hideTooltip, { signal });
    target.addEventListener('blur', hideTooltip, { signal });
    target.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') hideTooltip();
      },
      { signal }
    );
  });

  return {
    destroy() {
      _controller?.abort();
      _controller = null;
      if (tooltipEl?.isConnected) {
        tooltipEl.remove();
      }
      tooltipEl = null;
      if (activeTarget) {
        activeTarget.removeAttribute('aria-describedby');
        activeTarget = null;
      }
    },
  };
}
