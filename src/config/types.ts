// ---------------------------------------------------------------------------
// Soltana Config Types
// ---------------------------------------------------------------------------

export type Theme = 'dark' | 'light' | 'sepia' | 'auto';
export type Material = 'flat' | 'soft' | 'neu' | 'glass' | 'metallic' | 'stone';
export type Surface = 'polished' | 'frosted' | 'stained' | 'metallic';
export type Ornament = 'none' | 'baroque' | 'carved' | 'faceted' | 'gilt';

export interface SoltanaConfig {
  theme: Theme;
  material: Material;
  surface: Surface;
  ornament: Ornament;
  fonts?: boolean;
  overrides?: Record<string, string>;
}

export interface SoltanaInstance {
  getState(): SoltanaConfig;
  setTheme(theme: Theme): void;
  setMaterial(material: Material): void;
  setSurface(surface: Surface): void;
  setOrnament(ornament: Ornament): void;
  setOverrides(overrides: Record<string, string>): void;
  reset(): void;
  destroy(): void;
}

export interface EnhancerCleanup {
  destroy(): void;
}
