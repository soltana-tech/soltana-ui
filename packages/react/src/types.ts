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
  /**
   * Initial tier configuration and init options. Read once on mount —
   * subsequent changes to the object reference are not observed. To change
   * tiers after init, use the `instance` methods from context.
   */
  config?: Partial<SoltanaConfig & SoltanaInitOptions>;
  children: ReactNode;
}
