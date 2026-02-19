// ---------------------------------------------------------------------------
// Static Plotly Theme JSON — SSR / Build-Time
// ---------------------------------------------------------------------------
// Re-exports pre-built theme JSON from @soltana-ui/tokens for environments
// without DOM access (SSR, build-time bundling).
// ---------------------------------------------------------------------------

import dark from '@soltana-ui/tokens/plotly/dark.json';
import light from '@soltana-ui/tokens/plotly/light.json';
import sepia from '@soltana-ui/tokens/plotly/sepia.json';

export { dark, light, sepia };
