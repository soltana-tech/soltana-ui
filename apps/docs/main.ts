import '@soltana/styles/index.scss';
import './docs.scss';

import { initAll } from '@soltana/enhancers/index';
import { initSoltana } from '@soltana/init';
import type { Theme } from '@soltana/config';
import { PlaygroundControls } from './components/PlaygroundControls';
import { Router, migrationShim } from './components/Router';
import { Sidebar } from './components/Sidebar';
import type { SidebarSection } from './components/Sidebar';
import { Search } from './components/Search';

// Side-effect: populate component registry before playground reads it
import './lib/playground-entries';

// Pages — Learn
import { renderGettingStarted } from './pages/learn/introduction';
import { renderDesignSystemIndex } from './pages/learn/overview';
import { renderRecipes } from './pages/learn/recipes';
import { renderColors } from './pages/learn/colors';
import { renderTypography } from './pages/learn/typography';
import { renderReliefs } from './pages/learn/reliefs';
import { renderFinishes } from './pages/learn/finishes';
import { renderOrnaments } from './pages/learn/ornaments';
import { renderComposition } from './pages/learn/composition';
import { renderSpacing } from './pages/learn/spacing';
import { renderPatterns } from './pages/learn/patterns';
import { renderExamples } from './pages/learn/examples';
import { renderGallery } from './pages/learn/gallery';
import { renderReliefDemo } from './pages/learn/relief-demo';

// Pages — Explore
import { renderComponentsIndex } from './pages/explore/index';
import { renderButtons } from './pages/explore/buttons';
import { renderInputs } from './pages/explore/inputs';
import { renderCards } from './pages/explore/cards';
import { renderBadges } from './pages/explore/badges';
import { renderAlerts } from './pages/explore/alerts';
import { renderAvatars } from './pages/explore/avatars';
import { renderProgress } from './pages/explore/progress';
import { renderToggles } from './pages/explore/toggles';
import { renderTooltips } from './pages/explore/tooltips';
import { renderTables } from './pages/explore/tables';
import { renderModals } from './pages/explore/modals';
import { renderSkeletons } from './pages/explore/skeletons';

// Pages — API Reference
import { renderApiIndex } from './pages/api/index';
import { renderApiInit } from './pages/api/init';
import { renderApiState } from './pages/api/state';
import { renderApiRecipes } from './pages/api/recipes';
import { renderApiRegistration } from './pages/api/registration';
import { renderApiEnhancers } from './pages/api/enhancers';
import { renderApiSvgPatterns } from './pages/api/svg-patterns';
import { renderApiFonts } from './pages/api/fonts';
import { renderApiOverrides } from './pages/api/overrides';

// Pages — Playground
import { renderPlayground } from './pages/playground';

const soltana = initSoltana({
  theme: 'dark',
  relief: 'neu',
  finish: 'matte',
  ornament: 'none',
});

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

router.setDefaultPath('/learn/introduction');

// Learn
router.register({ path: '/learn/introduction', render: migrationShim(renderGettingStarted) });
router.register({ path: '/learn/overview', render: migrationShim(renderDesignSystemIndex) });
router.register({ path: '/learn/recipes', render: migrationShim(renderRecipes) });
router.register({ path: '/learn/colors', render: migrationShim(renderColors) });
router.register({ path: '/learn/typography', render: migrationShim(renderTypography) });
router.register({ path: '/learn/reliefs', render: migrationShim(renderReliefs) });
router.register({ path: '/learn/finishes', render: migrationShim(renderFinishes) });
router.register({ path: '/learn/ornaments', render: migrationShim(renderOrnaments) });
router.register({ path: '/learn/composition', render: migrationShim(renderComposition) });
router.register({ path: '/learn/spacing', render: migrationShim(renderSpacing) });
router.register({ path: '/learn/patterns', render: migrationShim(renderPatterns) });
router.register({ path: '/learn/examples', render: migrationShim(renderExamples) });
router.register({ path: '/learn/gallery', render: migrationShim(renderGallery) });
router.register({ path: '/learn/relief-demo', render: migrationShim(renderReliefDemo) });

// Explore
router.register({ path: '/explore', render: migrationShim(renderComponentsIndex) });
router.register({ path: '/explore/buttons', render: migrationShim(renderButtons) });
router.register({ path: '/explore/inputs', render: migrationShim(renderInputs) });
router.register({ path: '/explore/cards', render: migrationShim(renderCards) });
router.register({ path: '/explore/badges', render: migrationShim(renderBadges) });
router.register({ path: '/explore/alerts', render: migrationShim(renderAlerts) });
router.register({ path: '/explore/avatars', render: migrationShim(renderAvatars) });
router.register({ path: '/explore/progress', render: migrationShim(renderProgress) });
router.register({ path: '/explore/toggles', render: migrationShim(renderToggles) });
router.register({ path: '/explore/tooltips', render: migrationShim(renderTooltips) });
router.register({ path: '/explore/tables', render: migrationShim(renderTables) });
router.register({ path: '/explore/modals', render: migrationShim(renderModals) });
router.register({ path: '/explore/skeletons', render: migrationShim(renderSkeletons) });

// API Reference
router.register({ path: '/api', render: migrationShim(renderApiIndex) });
router.register({ path: '/api/init', render: migrationShim(renderApiInit) });
router.register({ path: '/api/state', render: migrationShim(renderApiState) });
router.register({ path: '/api/recipes', render: migrationShim(renderApiRecipes) });
router.register({ path: '/api/registration', render: migrationShim(renderApiRegistration) });
router.register({ path: '/api/enhancers', render: migrationShim(renderApiEnhancers) });
router.register({ path: '/api/svg-patterns', render: migrationShim(renderApiSvgPatterns) });
router.register({ path: '/api/fonts', render: migrationShim(renderApiFonts) });
router.register({ path: '/api/overrides', render: migrationShim(renderApiOverrides) });

// Playground (returns HTMLElement directly — no migrationShim)
router.register({ path: '/playground', render: renderPlayground });

// ---- Sidebar ----
const sections: SidebarSection[] = [
  {
    label: 'Learn',
    items: [
      { label: 'Introduction', path: '/learn/introduction' },
      { label: 'Overview', path: '/learn/overview' },
      { label: 'Recipes', path: '/learn/recipes' },
      { label: 'Colors', path: '/learn/colors' },
      { label: 'Typography', path: '/learn/typography' },
      { label: 'Reliefs', path: '/learn/reliefs' },
      { label: 'Finishes', path: '/learn/finishes' },
      { label: 'Ornaments', path: '/learn/ornaments' },
      { label: 'Composition', path: '/learn/composition' },
      { label: 'Spacing', path: '/learn/spacing' },
      { label: 'Patterns', path: '/learn/patterns' },
      { label: 'Examples', path: '/learn/examples' },
      { label: 'Gallery', path: '/learn/gallery' },
      { label: 'Relief Demo', path: '/learn/relief-demo' },
    ],
  },
  {
    label: 'Explore',
    items: [
      { label: 'Overview', path: '/explore' },
      { label: 'Buttons', path: '/explore/buttons' },
      { label: 'Inputs', path: '/explore/inputs' },
      { label: 'Cards', path: '/explore/cards' },
      { label: 'Badges & Tags', path: '/explore/badges' },
      { label: 'Alerts', path: '/explore/alerts' },
      { label: 'Avatars', path: '/explore/avatars' },
      { label: 'Progress', path: '/explore/progress' },
      { label: 'Toggles', path: '/explore/toggles' },
      { label: 'Tooltips', path: '/explore/tooltips' },
      { label: 'Tables', path: '/explore/tables' },
      { label: 'Modals', path: '/explore/modals' },
      { label: 'Skeletons', path: '/explore/skeletons' },
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
    label: 'Playground',
    items: [{ label: 'Interactive Sandbox', path: '/playground' }],
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
