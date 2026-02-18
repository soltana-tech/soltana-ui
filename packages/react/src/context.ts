// ---------------------------------------------------------------------------
// @soltana-ui/react — Context
// ---------------------------------------------------------------------------

import { createContext, useContext } from 'react';
import type { SoltanaContextValue } from './types.js';

export const SoltanaContext = createContext<SoltanaContextValue | null>(null);

/**
 * Consume the Soltana context. Throws if used outside a `<SoltanaProvider>`.
 */
export function useSoltanaContext(): SoltanaContextValue {
  const ctx = useContext(SoltanaContext);
  if (!ctx) {
    throw new Error('useSoltanaContext must be used within a <SoltanaProvider>');
  }
  return ctx;
}
