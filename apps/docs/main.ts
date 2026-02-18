import '@soltana/styles/index.scss';
import './docs.scss';

import { initAll } from '@soltana/enhancers/index';
import { initSoltana } from '@soltana/init';
import type { Theme } from '@soltana/config';
import { PlaygroundControls } from './components/PlaygroundControls';
import { SettingsPanel } from './components/SettingsPanel';
import { Router, migrationShim } from './components/Router';
import { Sidebar } from './components/Sidebar';
import type { SidebarSection } from './components/Sidebar';
import { Search } from './components/Search';

// Pages — Getting Started, Patterns, Examples, Gallery
import { renderGettingStarted } from './pages/getting-started';
import { renderPatterns } from './pages/patterns';
import { renderExamples } from './pages/examples';
import { renderGallery } from './pages/gallery';

// Pages — Components (decomposed)
import { renderComponentsIndex } from './pages/components/index';
import { renderButtons } from './pages/components/buttons';
import { renderInputs } from './pages/components/inputs';
import { renderCards } from './pages/components/cards';
import { renderBadges } from './pages/components/badges';
import { renderAlerts } from './pages/components/alerts';
import { renderAvatars } from './pages/components/avatars';
import { renderProgress } from './pages/components/progress';
import { renderToggles } from './pages/components/toggles';
import { renderTooltips } from './pages/components/tooltips';
import { renderTables } from './pages/components/tables';
import { renderModals } from './pages/components/modals';
import { renderSkeletons } from './pages/components/skeletons';
import { renderReliefDemo } from './pages/components/relief-demo';

// Pages — Design System (decomposed)
import { renderDesignSystemIndex } from './pages/design-system/index';
import { renderRecipes } from './pages/design-system/recipes';
import { renderColors } from './pages/design-system/colors';
import { renderTypography } from './pages/design-system/typography';
import { renderReliefs } from './pages/design-system/reliefs';
import { renderFinishes } from './pages/design-system/finishes';
import { renderOrnaments } from './pages/design-system/ornaments';
import { renderComposition } from './pages/design-system/composition';
import { renderSpacing } from './pages/design-system/spacing';

// Pages — API Reference (decomposed)
import { renderApiIndex } from './pages/api/index';
import { renderApiInit } from './pages/api/init';
import { renderApiState } from './pages/api/state';
import { renderApiRecipes } from './pages/api/recipes';
import { renderApiRegistration } from './pages/api/registration';
import { renderApiEnhancers } from './pages/api/enhancers';
import { renderApiSvgPatterns } from './pages/api/svg-patterns';
import { renderApiFonts } from './pages/api/fonts';
import { renderApiOverrides } from './pages/api/overrides';

const soltana = initSoltana({
  theme: 'dark',
  relief: 'neu',
  finish: 'matte',
  ornament: 'none',
});

new SettingsPanel(soltana);

// ---- Theme switcher ----
function bindThemeSwitcher(): void {
  const switcher = document.getElementById('theme-switcher');
  if (!switcher) return;

  const buttons = switcher.querySelectorAll<HTMLButtonElement>('.theme-btn');

  const updateActiveState = (): void => {
    const currentTheme = soltana.getState().theme;
    buttons.forEach((btn) => {
      const theme = btn.dataset.themeSet;
      btn.classList.toggle('active', theme === currentTheme);
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.themeSet as Theme | undefined;
      if (theme) {
        soltana.setTheme(theme);
        updateActiveState();
      }
    });
  });

  updateActiveState();
}

bindThemeSwitcher();

// ---- Router ----
const router = new Router('docs-content');
const playground = new PlaygroundControls();

// Top-level pages (migration shim wraps string → HTMLElement)
router.register({ path: '/getting-started', render: migrationShim(renderGettingStarted) });
router.register({ path: '/patterns', render: migrationShim(renderPatterns) });
router.register({ path: '/examples', render: migrationShim(renderExamples) });
router.register({ path: '/gallery', render: migrationShim(renderGallery) });

// Components — index + individual pages
router.register({ path: '/components', render: migrationShim(renderComponentsIndex) });
router.register({ path: '/components/buttons', render: migrationShim(renderButtons) });
router.register({ path: '/components/inputs', render: migrationShim(renderInputs) });
router.register({ path: '/components/cards', render: migrationShim(renderCards) });
router.register({ path: '/components/badges', render: migrationShim(renderBadges) });
router.register({ path: '/components/alerts', render: migrationShim(renderAlerts) });
router.register({ path: '/components/avatars', render: migrationShim(renderAvatars) });
router.register({ path: '/components/progress', render: migrationShim(renderProgress) });
router.register({ path: '/components/toggles', render: migrationShim(renderToggles) });
router.register({ path: '/components/tooltips', render: migrationShim(renderTooltips) });
router.register({ path: '/components/tables', render: migrationShim(renderTables) });
router.register({ path: '/components/modals', render: migrationShim(renderModals) });
router.register({ path: '/components/skeletons', render: migrationShim(renderSkeletons) });
router.register({ path: '/components/relief-demo', render: migrationShim(renderReliefDemo) });

// Design System — index + individual pages
router.register({ path: '/design-system', render: migrationShim(renderDesignSystemIndex) });
router.register({ path: '/design-system/recipes', render: migrationShim(renderRecipes) });
router.register({ path: '/design-system/colors', render: migrationShim(renderColors) });
router.register({ path: '/design-system/typography', render: migrationShim(renderTypography) });
router.register({ path: '/design-system/reliefs', render: migrationShim(renderReliefs) });
router.register({ path: '/design-system/finishes', render: migrationShim(renderFinishes) });
router.register({ path: '/design-system/ornaments', render: migrationShim(renderOrnaments) });
router.register({ path: '/design-system/composition', render: migrationShim(renderComposition) });
router.register({ path: '/design-system/spacing', render: migrationShim(renderSpacing) });

// API Reference — index + individual pages
router.register({ path: '/api', render: migrationShim(renderApiIndex) });
router.register({ path: '/api/init', render: migrationShim(renderApiInit) });
router.register({ path: '/api/state', render: migrationShim(renderApiState) });
router.register({ path: '/api/recipes', render: migrationShim(renderApiRecipes) });
router.register({ path: '/api/registration', render: migrationShim(renderApiRegistration) });
router.register({ path: '/api/enhancers', render: migrationShim(renderApiEnhancers) });
router.register({ path: '/api/svg-patterns', render: migrationShim(renderApiSvgPatterns) });
router.register({ path: '/api/fonts', render: migrationShim(renderApiFonts) });
router.register({ path: '/api/overrides', render: migrationShim(renderApiOverrides) });

// ---- Sidebar ----
const sections: SidebarSection[] = [
  {
    label: 'Getting Started',
    items: [{ label: 'Introduction', path: '/getting-started' }],
  },
  {
    label: 'Design System',
    items: [
      { label: 'Overview', path: '/design-system' },
      { label: 'Recipes', path: '/design-system/recipes' },
      { label: 'Colors', path: '/design-system/colors' },
      { label: 'Typography', path: '/design-system/typography' },
      { label: 'Reliefs', path: '/design-system/reliefs' },
      { label: 'Finishes', path: '/design-system/finishes' },
      { label: 'Ornaments', path: '/design-system/ornaments' },
      { label: 'Composition', path: '/design-system/composition' },
      { label: 'Spacing', path: '/design-system/spacing' },
    ],
  },
  {
    label: 'Components',
    items: [
      { label: 'Overview', path: '/components' },
      { label: 'Buttons', path: '/components/buttons' },
      { label: 'Inputs', path: '/components/inputs' },
      { label: 'Cards', path: '/components/cards' },
      { label: 'Badges & Tags', path: '/components/badges' },
      { label: 'Alerts', path: '/components/alerts' },
      { label: 'Avatars', path: '/components/avatars' },
      { label: 'Progress', path: '/components/progress' },
      { label: 'Toggles', path: '/components/toggles' },
      { label: 'Tooltips', path: '/components/tooltips' },
      { label: 'Tables', path: '/components/tables' },
      { label: 'Modals', path: '/components/modals' },
      { label: 'Skeletons', path: '/components/skeletons' },
      { label: 'Relief Demo', path: '/components/relief-demo' },
    ],
  },
  {
    label: 'API Reference',
    items: [
      { label: 'Overview', path: '/api' },
      { label: 'Initialization', path: '/api/init' },
      { label: 'State', path: '/api/state' },
      { label: 'Recipes', path: '/api/recipes' },
      { label: 'Tier Registration', path: '/api/registration' },
      { label: 'Enhancers', path: '/api/enhancers' },
      { label: 'SVG Patterns', path: '/api/svg-patterns' },
      { label: 'Font Loading', path: '/api/fonts' },
      { label: 'Overrides', path: '/api/overrides' },
    ],
  },
  {
    label: 'Patterns',
    items: [{ label: 'All Patterns', path: '/patterns' }],
  },
  {
    label: 'Examples',
    items: [{ label: 'All Examples', path: '/examples' }],
  },
  {
    label: 'Gallery',
    items: [{ label: 'Recipe Showcase', path: '/gallery' }],
  },
];

const sidebar = new Sidebar(router, sections);
new Search(router, sections);

router.onAfterNavigate((path) => {
  sidebar.updateActiveLink(path);
});

// ---- Post-render hooks ----
router.onAfterNavigate(() => {
  playground.bindAll();
  initAll();

  // Swatch copy-to-clipboard
  document.querySelectorAll<HTMLElement>('.swatch').forEach((swatch) => {
    swatch.style.cursor = 'pointer';
    swatch.addEventListener('click', () => {
      const varName = swatch.dataset.copy ?? '';
      void navigator.clipboard.writeText(varName).then(() => {
        const name = swatch.querySelector('.swatch__name');
        if (name) {
          const orig = name.textContent;
          name.textContent = 'Copied!';
          setTimeout(() => {
            name.textContent = orig;
          }, 1200);
        }
      });
    });
  });

  // Smooth scroll for anchor links (skip router hash links)
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash.length < 2 || hash.startsWith('#/')) return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

router.start();
