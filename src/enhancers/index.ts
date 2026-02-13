// ---------------------------------------------------------------------------
// Soltana JS Enhancers
// ---------------------------------------------------------------------------
// Optional lightweight scripts for interactive components.
// ---------------------------------------------------------------------------

import { initModals } from './modal.js';
import { initTabs } from './tabs.js';
import { initTooltips } from './tooltip.js';

export { initModals, initTabs, initTooltips };

/** Initialize all enhancers. Call after DOM content is loaded. */
export function initAll(): void {
  initModals();
  initTabs();
  initTooltips();
}
