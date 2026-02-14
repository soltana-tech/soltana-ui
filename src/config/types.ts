// ---------------------------------------------------------------------------
// Soltana Config Types
// ---------------------------------------------------------------------------

export type Theme = 'dark' | 'light' | 'sepia' | 'auto';
export type Relief = 'flat' | 'soft' | 'neu' | 'glass' | 'metallic' | 'stone';
export type Finish = 'polished' | 'frosted' | 'stained' | 'metallic';
export type Ornament = 'none' | 'baroque' | 'carved' | 'faceted' | 'gilt';

export interface SoltanaConfig {
  theme: Theme;
  relief: Relief;
  finish: Finish;
  ornament: Ornament;
  fonts?: boolean;
  enhancers?: boolean;
  overrides?: Record<string, string>;
}

export interface SoltanaInstance {
  getState(): SoltanaConfig;
  setTheme(theme: Theme): void;
  setRelief(relief: Relief): void;
  setFinish(finish: Finish): void;
  setOrnament(ornament: Ornament): void;
  setOverrides(overrides: Record<string, string>): void;
  reinit(): void;
  reset(): void;
  destroy(): void;
}

export interface EnhancerCleanup {
  destroy(): void;
}
