// ---------------------------------------------------------------------------
// Static Mermaid Theme JSON — SSR / Build-Time
// ---------------------------------------------------------------------------
// Re-exports pre-built theme JSON from @soltana-ui/tokens for environments
// without DOM access (SSR, build-time bundling).
// ---------------------------------------------------------------------------

import dark from '@soltana-ui/tokens/mermaid/dark.json';
import light from '@soltana-ui/tokens/mermaid/light.json';
import sepia from '@soltana-ui/tokens/mermaid/sepia.json';

export { dark, light, sepia };
