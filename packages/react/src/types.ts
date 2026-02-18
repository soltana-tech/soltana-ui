// ---------------------------------------------------------------------------
// @soltana-ui/react — Types
// ---------------------------------------------------------------------------

import type { ReactNode } from 'react';
import type { SoltanaConfig, SoltanaInitOptions, SoltanaInstance } from 'soltana-ui';

export interface SoltanaContextValue {
  /** Reactive config state — updates on every `soltana:change` event. */
  config: SoltanaConfig;
  /** The Soltana instance. `null` during SSR / before mount. */
  instance: SoltanaInstance | null;
}

export interface SoltanaProviderProps {
  config?: Partial<SoltanaConfig & SoltanaInitOptions>;
  children: ReactNode;
}
