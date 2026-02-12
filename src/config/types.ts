// ---------------------------------------------------------------------------
// Soltana Config Types
// ---------------------------------------------------------------------------

export type Theme = 'dark' | 'light' | 'sepia';
export type Material = 'neuro' | 'glass' | 'hybrid';
export type Surface = 'polished' | 'frosted' | 'stained' | 'metallic';
export type Ornament = 'none' | 'baroque' | 'carved' | 'faceted' | 'gilt';

export interface SoltanaConfig {
  theme: Theme;
  material: Material;
  surface: Surface;
  ornament: Ornament;
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
}
