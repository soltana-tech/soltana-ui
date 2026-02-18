// ---------------------------------------------------------------------------
// ECharts Auto-Sync
// ---------------------------------------------------------------------------
// Listens for soltana:change events and re-registers the ECharts theme
// whenever the Soltana tier config changes.
// ---------------------------------------------------------------------------

import { buildTheme } from './build-theme.js';

interface EChartsLike {
  registerTheme(name: string, theme: object): void;
}

/**
 * Register a Soltana theme with ECharts using dependency injection.
 *
 * @param echarts - An object with a `registerTheme` method (the echarts module)
 * @param name - Theme name to register under (default: `'soltana'`)
 */
export function registerSoltanaTheme(echarts: EChartsLike, name = 'soltana'): void {
  echarts.registerTheme(name, buildTheme());
}

/**
 * Auto-sync: registers a Soltana theme immediately, then re-registers on
 * every `soltana:change` event. Returns a handle with `destroy()` to stop.
 *
 * @param echarts - An object with a `registerTheme` method (the echarts module)
 * @param name - Theme name to register under (default: `'soltana'`)
 */
export function autoSync(echarts: EChartsLike, name = 'soltana'): { destroy(): void } {
  registerSoltanaTheme(echarts, name);

  const handler = () => {
    echarts.registerTheme(name, buildTheme());
  };

  document.documentElement.addEventListener('soltana:change', handler);

  return {
    destroy() {
      document.documentElement.removeEventListener('soltana:change', handler);
    },
  };
}
