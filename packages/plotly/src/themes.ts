// ---------------------------------------------------------------------------
// Static Plotly Theme JSON — SSR / Build-Time
// ---------------------------------------------------------------------------
// Re-exports pre-built theme JSON from @soltana-ui/tokens for environments
// without DOM access (SSR, build-time bundling).
// ---------------------------------------------------------------------------

import dark from '../../tokens/dist/plotly/dark.json';
import light from '../../tokens/dist/plotly/light.json';
import sepia from '../../tokens/dist/plotly/sepia.json';

export { dark, light, sepia };
