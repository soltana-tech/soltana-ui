// ---------------------------------------------------------------------------
// Static ECharts Theme JSON — SSR / Build-Time
// ---------------------------------------------------------------------------
// Re-exports pre-built theme JSON from @soltana-ui/tokens for environments
// without DOM access (SSR, build-time bundling).
// ---------------------------------------------------------------------------

import dark from '../../tokens/dist/echarts/dark.json';
import light from '../../tokens/dist/echarts/light.json';
import sepia from '../../tokens/dist/echarts/sepia.json';

export { dark, light, sepia };
