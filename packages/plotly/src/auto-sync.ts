// ---------------------------------------------------------------------------
// Plotly Auto-Sync
// ---------------------------------------------------------------------------
// Listens for soltana:change events and invokes a callback with a fresh
// Plotly template whenever the Soltana tier config changes.
// ---------------------------------------------------------------------------

import { buildTemplate, type PlotlyTemplate } from './build-template.js';

/**
 * Auto-sync: calls `callback` with a fresh Plotly template immediately,
 * then again on every `soltana:change` event. Returns a handle with
 * `destroy()` to stop listening.
 */
export function autoSync(callback: (template: PlotlyTemplate) => void): { destroy(): void } {
  callback(buildTemplate());

  const handler = () => {
    callback(buildTemplate());
  };

  document.documentElement.addEventListener('soltana:change', handler);

  return {
    destroy() {
      document.documentElement.removeEventListener('soltana:change', handler);
    },
  };
}
