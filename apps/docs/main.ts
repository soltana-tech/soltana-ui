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
import { renderReliefs } from './pages/learn/reliefs';
import { renderFinishes } from './pages/learn/finishes';
import { renderOrnaments } from './pages/learn/ornaments';
import { renderComposition } from './pages/learn/composition';

// Pages — Explore
import { renderComponentsIndex } from './pages/explore/index';
import { renderLayout } from './pages/explore/layout';
import { renderTypography } from './pages/explore/typography';
import { renderColors } from './pages/explore/colors';

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
import type { CentralPlayground } from './components/CentralPlayground';

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

  const buttons = switcher.querySelectorAll<HTMLButtonElement>('.segmented-control__option');

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
router.register({ path: '/learn/reliefs', render: migrationShim(renderReliefs) });
router.register({ path: '/learn/finishes', render: migrationShim(renderFinishes) });
router.register({ path: '/learn/ornaments', render: migrationShim(renderOrnaments) });
router.register({ path: '/learn/composition', render: migrationShim(renderComposition) });

// Explore
router.register({ path: '/explore', render: migrationShim(renderComponentsIndex) });
router.register({ path: '/explore/layout', render: migrationShim(renderLayout) });
router.register({ path: '/explore/typography', render: migrationShim(renderTypography) });
router.register({ path: '/explore/colors', render: migrationShim(renderColors) });

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
let playgroundInstance: CentralPlayground | null = null;
router.register({
  path: '/playground',
  render: () => {
    const { element, playground } = renderPlayground();
    playgroundInstance = playground;
    return element;
  },
  onActivate: () => {
    playgroundInstance?.loadFromUrl();
  },
});

// ---- Sidebar ----
const sections: SidebarSection[] = [
  {
    label: 'Learn',
    items: [
      { label: 'Introduction', path: '/learn/introduction' },
      { label: 'Reliefs', path: '/learn/reliefs' },
      { label: 'Finishes', path: '/learn/finishes' },
      { label: 'Ornaments', path: '/learn/ornaments' },
      { label: 'Composition', path: '/learn/composition' },
    ],
  },
  {
    label: 'Explore',
    items: [
      { label: 'Components', path: '/explore' },
      { label: 'Playground', path: '/playground' },
      { label: 'Layout', path: '/explore/layout' },
      { label: 'Typography', path: '/explore/typography' },
      { label: 'Colors', path: '/explore/colors' },
    ],
  },
  {
    label: 'API Reference',
    collapsed: true,
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
