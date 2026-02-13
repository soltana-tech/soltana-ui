// ---------------------------------------------------------------------------
// Soltana JS Enhancers
// ---------------------------------------------------------------------------
// Optional lightweight scripts for interactive components.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup } from '../config/types';
import { initModals } from './modal.js';
import { initTabs } from './tabs.js';
import { initTooltips } from './tooltip.js';

export { initModals, initTabs, initTooltips };

/** Initialize all enhancers. Call after DOM content is loaded. */
export function initAll(): EnhancerCleanup {
  const modals = initModals();
  const tabs = initTabs();
  const tooltips = initTooltips();

  return {
    destroy() {
      modals.destroy();
      tabs.destroy();
      tooltips.destroy();
    },
  };
}
