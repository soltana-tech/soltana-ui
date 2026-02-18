// ---------------------------------------------------------------------------
// Soltana JS Enhancers
// ---------------------------------------------------------------------------
// Optional lightweight scripts for interactive components.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';
import { initModals } from './modal.js';
import { initTabs } from './tabs.js';
import { initTooltips } from './tooltip.js';

export { initModals, initTabs, initTooltips };
export { MODAL_SELECTOR, MODAL_OPEN_SELECTOR } from './modal.js';
export { TABS_SELECTOR } from './tabs.js';
export { TOOLTIP_SELECTOR } from './tooltip.js';

/** Initialize all enhancers. Call after DOM content is loaded. */
export function initAll(options?: EnhancerOptions): EnhancerCleanup {
  const modals = initModals(options);
  const tabs = initTabs(options);
  const tooltips = initTooltips(options);

  return {
    destroy() {
      modals.destroy();
      tabs.destroy();
      tooltips.destroy();
    },
  };
}
