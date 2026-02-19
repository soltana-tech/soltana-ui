// ---------------------------------------------------------------------------
// Static ECharts Theme JSON — SSR / Build-Time
// ---------------------------------------------------------------------------
// Re-exports pre-built theme JSON from @soltana-ui/tokens for environments
// without DOM access (SSR, build-time bundling).
// ---------------------------------------------------------------------------

import dark from '@soltana-ui/tokens/echarts/dark.json';
import light from '@soltana-ui/tokens/echarts/light.json';
import sepia from '@soltana-ui/tokens/echarts/sepia.json';

export { dark, light, sepia };
