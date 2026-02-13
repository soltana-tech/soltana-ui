import './styles/index.scss';

// Configuration runtime
export { initSoltana } from './config/index.js';
export type {
  SoltanaConfig,
  SoltanaInstance,
  EnhancerCleanup,
  Theme,
  Material,
  Surface,
  Ornament,
} from './config/types.js';

// Font loading
export { loadSoltanaFonts } from './fonts/index.js';

// JS enhancers for interactive components
export { initModals, initTabs, initTooltips, initAll } from './enhancers/index.js';

// SVG ornament pattern utilities
export { patterns, toDataUri, toElement } from './ornaments/patterns.js';
export type { PatternName } from './ornaments/patterns.js';

export const version = '1.0.0';
