// ---------------------------------------------------------------------------
// Soltana Build Plugin Types
// ---------------------------------------------------------------------------

export interface TierConfig {
  include?: string[];
  exclude?: string[];
}

export interface SoltanaTreeshakeOptions {
  themes?: TierConfig;
  reliefs?: TierConfig;
  finishes?: TierConfig;
  ornaments?: TierConfig;
}

export interface SoltanaBuildConfig {
  tiers?: SoltanaTreeshakeOptions;
}
