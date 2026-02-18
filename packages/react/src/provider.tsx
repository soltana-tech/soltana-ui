// ---------------------------------------------------------------------------
// @soltana-ui/react — SoltanaProvider
// ---------------------------------------------------------------------------

import { SoltanaContext } from './context.js';
import { useSoltana } from './use-soltana.js';
import type { SoltanaProviderProps } from './types.js';

export function SoltanaProvider({ config, children }: SoltanaProviderProps) {
  const value = useSoltana(config);
  return <SoltanaContext.Provider value={value}>{children}</SoltanaContext.Provider>;
}
