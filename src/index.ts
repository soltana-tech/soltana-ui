import './styles/index.scss';

// Re-export Web Components for consumers
export { SoltanaElement } from './components/base/SoltanaElement';
export { SolBadge } from './components/sol-badge';
export { SolButton } from './components/sol-button';
export { SolCard } from './components/sol-card';
export { SolDivider } from './components/sol-divider';
export { SolInput } from './components/sol-input';
export { SolModal } from './components/sol-modal';
export { SolPanel } from './components/sol-panel';
export { SolProgress } from './components/sol-progress';
export { SolTabs } from './components/sol-tabs';
export { SolTooltip } from './components/sol-tooltip';

// Re-export ornament pattern utilities
export { patterns } from './ornaments/patterns';
export type { PatternName } from './ornaments/patterns';

// Re-export configuration API
export { initSoltana } from './config';
export type { SoltanaConfig, SoltanaInstance, Theme, Material, Surface, Ornament } from './config';

export const version = '1.0.0';
