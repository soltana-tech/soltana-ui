// ---------------------------------------------------------------------------
// @soltana-ui/react — useSoltana Hook
// ---------------------------------------------------------------------------
// Standalone hook: initializes Soltana on mount, destroys on unmount,
// keeps reactive state in sync via the soltana:change event.
// ---------------------------------------------------------------------------

import { useState, useEffect, useRef } from 'react';
import { initSoltana } from 'soltana-ui';
import type { SoltanaConfig, SoltanaInitOptions, SoltanaInstance } from 'soltana-ui';
import type { SoltanaContextValue } from './types.js';

const DEFAULT_CONFIG: SoltanaConfig = {
  theme: 'auto',
  relief: 'neumorphic',
  finish: 'matte',
  ornament: 'none',
  overrides: {},
};

export function useSoltana(
  config?: Partial<SoltanaConfig & SoltanaInitOptions>
): SoltanaContextValue {
  const configRef = useRef(config);
  const instanceRef = useRef<SoltanaInstance | null>(null);
  const [state, setState] = useState<SoltanaConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const instance = initSoltana(configRef.current);
    instanceRef.current = instance;
    setState(instance.getState());

    const handler = () => {
      setState(instance.getState());
    };

    document.documentElement.addEventListener('soltana:change', handler);

    return () => {
      document.documentElement.removeEventListener('soltana:change', handler);
      instance.destroy();
      instanceRef.current = null;
    };
  }, []);

  return { config: state, instance: instanceRef.current };
}
