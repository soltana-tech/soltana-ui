import type { EnhancerCleanup, EnhancerOptions } from '../../config/types.js';
import { trapFocus, FOCUSABLE } from './focus-trap.js';

interface OverlayConfig {
  overlaySelector: string;
  openTriggerAttr: string;
  closeTriggerAttr: string;
  bodyOpenClass: string;
  contentSelector: string;
  childElementsToActivate: string[];
  checkOverlayAsBackdrop: boolean;
  backdropSelector: string;
  setupAria?: (overlay: HTMLElement) => void;
}

export function createOverlayEnhancer(config: OverlayConfig) {
  let _controller: AbortController | null = null;
  let _openCount = 0;

  function openOverlay(overlay: HTMLElement): void {
    if (overlay.classList.contains('active')) return;
    overlay.classList.add('active');

    config.childElementsToActivate.forEach((selector) => {
      overlay.querySelector(selector)?.classList.add('active');
    });

    overlay.setAttribute('aria-hidden', 'false');
    _openCount++;
    document.body.classList.add(config.bodyOpenClass);

    requestAnimationFrame(() => {
      const content = overlay.querySelector<HTMLElement>(config.contentSelector);
      const firstFocusable = content?.querySelector<HTMLElement>(FOCUSABLE);
      (firstFocusable ?? content)?.focus();
    });
  }

  function closeOverlay(overlay: HTMLElement): void {
    overlay.classList.remove('active');

    config.childElementsToActivate.forEach((selector) => {
      overlay.querySelector(selector)?.classList.remove('active');
    });

    overlay.setAttribute('aria-hidden', 'true');
    _openCount = Math.max(0, _openCount - 1);
    if (_openCount === 0) {
      document.body.classList.remove(config.bodyOpenClass);
    }
  }

  return function init(options?: EnhancerOptions): EnhancerCleanup {
    _controller?.abort();
    _controller = new AbortController();
    _openCount = 0;
    document.body.classList.remove(config.bodyOpenClass);
    const { signal } = _controller;

    const root = options?.root ?? document;
    const openTriggerSelector = `[${config.openTriggerAttr}]`;
    const closeTriggerSelector = `[${config.closeTriggerAttr}]`;

    root
      .querySelectorAll<HTMLElement>(options?.selector ?? openTriggerSelector)
      .forEach((trigger) => {
        trigger.addEventListener(
          'click',
          () => {
            const targetId = trigger.getAttribute(config.openTriggerAttr);
            if (!targetId) return;
            const overlay = document.getElementById(targetId);
            if (overlay?.hasAttribute(config.overlaySelector.slice(1, -1))) {
              openOverlay(overlay);
            }
          },
          { signal }
        );
      });

    root.querySelectorAll<HTMLElement>(config.overlaySelector).forEach((overlay) => {
      config.setupAria?.(overlay);

      overlay.querySelectorAll<HTMLElement>(closeTriggerSelector).forEach((btn) => {
        btn.addEventListener(
          'click',
          () => {
            closeOverlay(overlay);
          },
          { signal }
        );
      });

      const backdrop =
        config.checkOverlayAsBackdrop && overlay.matches(config.backdropSelector)
          ? overlay
          : overlay.querySelector<HTMLElement>(config.backdropSelector);

      backdrop?.addEventListener(
        'click',
        (e) => {
          if (e.target === backdrop) {
            closeOverlay(overlay);
          }
        },
        { signal }
      );

      overlay.addEventListener(
        'keydown',
        (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            closeOverlay(overlay);
            return;
          }
          if (e.key === 'Tab') {
            const content = overlay.querySelector<HTMLElement>(config.contentSelector);
            if (content) trapFocus(content, e);
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
        document.body.classList.remove(config.bodyOpenClass);
      },
    };
  };
}
