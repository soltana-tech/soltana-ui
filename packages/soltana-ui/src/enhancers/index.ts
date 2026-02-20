// ---------------------------------------------------------------------------
// Soltana JS Enhancers
// ---------------------------------------------------------------------------
// Optional lightweight scripts for interactive components.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';
import { initModals } from './modal.js';
import { initTabs } from './tabs.js';
import { initTooltips } from './tooltip.js';
import { initAccordions } from './accordion.js';
import { initDropdowns } from './dropdown.js';
import { initDrawers } from './drawer.js';
import { initToasts, showToast, dismissToast } from './toast.js';
import { initCollapsibles } from './collapsible.js';
import { initComboboxes } from './combobox.js';
import { initHoverCards } from './hover-card.js';
import { initContextMenus } from './context-menu.js';
import { initCarousels } from './carousel.js';
import { initScrollAreas } from './scroll-area.js';
import { initDatePickers } from './date-picker.js';
import { initColorPickers } from './color-picker.js';
import { initTrees } from './tree.js';

// Phase 0-1 enhancers
export { initModals, initTabs, initTooltips };
export { initAccordions, initDropdowns, initDrawers, initToasts };
export { showToast, dismissToast };

// Phase 2 enhancers
export { initCollapsibles, initComboboxes, initHoverCards };
export { initContextMenus, initCarousels, initScrollAreas };

// Phase 3 enhancers
export { initDatePickers, initColorPickers, initTrees };

// Selectors
export { MODAL_SELECTOR, MODAL_OPEN_SELECTOR } from './modal.js';
export { TABS_SELECTOR } from './tabs.js';
export { TOOLTIP_SELECTOR } from './tooltip.js';
export { ACCORDION_SELECTOR } from './accordion.js';
export { DROPDOWN_SELECTOR } from './dropdown.js';
export { DRAWER_SELECTOR, DRAWER_OPEN_SELECTOR } from './drawer.js';
export { TOAST_CONTAINER_SELECTOR } from './toast.js';
export { COLLAPSIBLE_SELECTOR } from './collapsible.js';
export { COMBOBOX_SELECTOR } from './combobox.js';
export { HOVER_CARD_SELECTOR } from './hover-card.js';
export { CONTEXT_MENU_SELECTOR } from './context-menu.js';
export { CAROUSEL_SELECTOR } from './carousel.js';
export { SCROLL_AREA_SELECTOR } from './scroll-area.js';
export { DATE_PICKER_SELECTOR } from './date-picker.js';
export { COLOR_PICKER_SELECTOR } from './color-picker.js';
export { TREE_SELECTOR } from './tree.js';

// Types
export type { ToastOptions, ToastType, ToastPosition } from './toast.js';

/** Initialize all enhancers. Call after DOM content is loaded. */
export function initAll(options?: EnhancerOptions): EnhancerCleanup {
  const modals = initModals(options);
  const tabs = initTabs(options);
  const tooltips = initTooltips(options);
  const accordions = initAccordions(options);
  const dropdowns = initDropdowns(options);
  const drawers = initDrawers(options);
  const toasts = initToasts(options);
  const collapsibles = initCollapsibles(options);
  const comboboxes = initComboboxes(options);
  const hoverCards = initHoverCards(options);
  const contextMenus = initContextMenus(options);
  const carousels = initCarousels(options);
  const scrollAreas = initScrollAreas(options);
  const datePickers = initDatePickers(options);
  const colorPickers = initColorPickers(options);
  const trees = initTrees(options);

  return {
    destroy() {
      modals.destroy();
      tabs.destroy();
      tooltips.destroy();
      accordions.destroy();
      dropdowns.destroy();
      drawers.destroy();
      toasts.destroy();
      collapsibles.destroy();
      comboboxes.destroy();
      hoverCards.destroy();
      contextMenus.destroy();
      carousels.destroy();
      scrollAreas.destroy();
      datePickers.destroy();
      colorPickers.destroy();
      trees.destroy();
    },
  };
}
