// ---------------------------------------------------------------------------
// @soltana-ui/react — Enhancer Hooks
// ---------------------------------------------------------------------------
// One hook per enhancer. Each initializes on mount and destroys on unmount.
// ---------------------------------------------------------------------------

import { useEffect, useRef } from 'react';
import type { EnhancerCleanup, EnhancerOptions } from 'soltana-ui';
import {
  initAccordions,
  initDropdowns,
  initDrawers,
  initToasts,
  initCollapsibles,
  initComboboxes,
  initHoverCards,
  initContextMenus,
  initCarousels,
  initScrollAreas,
  initDatePickers,
  initColorPickers,
  initTrees,
} from 'soltana-ui';

function useEnhancer(
  init: (options?: EnhancerOptions) => EnhancerCleanup,
  options?: EnhancerOptions
): void {
  const ref = useRef<EnhancerCleanup | null>(null);
  useEffect(() => {
    ref.current = init(options);
    return () => {
      ref.current?.destroy();
      ref.current = null;
    };
  }, []);
}

export function useAccordions(options?: EnhancerOptions): void {
  useEnhancer(initAccordions, options);
}

export function useDropdowns(options?: EnhancerOptions): void {
  useEnhancer(initDropdowns, options);
}

export function useDrawers(options?: EnhancerOptions): void {
  useEnhancer(initDrawers, options);
}

export function useToasts(options?: EnhancerOptions): void {
  useEnhancer(initToasts, options);
}

export function useCollapsibles(options?: EnhancerOptions): void {
  useEnhancer(initCollapsibles, options);
}

export function useComboboxes(options?: EnhancerOptions): void {
  useEnhancer(initComboboxes, options);
}

export function useHoverCards(options?: EnhancerOptions): void {
  useEnhancer(initHoverCards, options);
}

export function useContextMenus(options?: EnhancerOptions): void {
  useEnhancer(initContextMenus, options);
}

export function useCarousels(options?: EnhancerOptions): void {
  useEnhancer(initCarousels, options);
}

export function useScrollAreas(options?: EnhancerOptions): void {
  useEnhancer(initScrollAreas, options);
}

export function useDatePickers(options?: EnhancerOptions): void {
  useEnhancer(initDatePickers, options);
}

export function useColorPickers(options?: EnhancerOptions): void {
  useEnhancer(initColorPickers, options);
}

export function useTrees(options?: EnhancerOptions): void {
  useEnhancer(initTrees, options);
}
