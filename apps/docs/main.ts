import '@soltana/styles/index.scss';
import './docs.scss';
import './components/SolPreview';

import { initSoltana, initAll } from 'soltana-ui';
import type { Theme } from 'soltana-ui';
import { PlaygroundControls } from './components/PlaygroundControls';
import { Router } from './components/Router';
import { Sidebar } from './components/Sidebar';
import type { SidebarSection } from './components/Sidebar';
import { Search } from './components/Search';

// Side-effect: populate component registry before playground reads it
import './lib/playground-entries';
import { SIDEBAR_ICONS } from './lib/sidebar-icons';

// Pages — Learn
import { renderGettingStarted } from './pages/learn/introduction';
import { renderThemes } from './pages/learn/themes';
import { renderReliefs } from './pages/learn/reliefs';
import { renderFinishes } from './pages/learn/finishes';
import { renderComposition } from './pages/learn/composition';

// Pages — Explore
import { renderComponentsIndex } from './pages/explore/index';
import { renderLayout } from './pages/explore/layout';
import { renderTypography } from './pages/explore/typography';
import { renderColors } from './pages/explore/colors';
import { renderExamples } from './pages/explore/examples';

// Pages — Component Reference
import { renderComponentReference } from './pages/explore/components/index';
import { renderActionsRef } from './pages/explore/components/actions';
import { renderContentRef } from './pages/explore/components/content';
import { renderDataDisplayRef } from './pages/explore/components/data-display';
import { renderFeedbackRef } from './pages/explore/components/feedback';
import { renderFormsRef } from './pages/explore/components/forms';
import { renderLayoutComponentsRef } from './pages/explore/components/layout-components';
import { renderNavigationRef } from './pages/explore/components/navigation';
import { renderOverlaysRef } from './pages/explore/components/overlays';

// Pages — API Reference
import { renderApiCore } from './pages/api/core';
import { renderApiConfig } from './pages/api/config';
import { renderApiBehavior } from './pages/api/behavior';
import { renderApiPlugins } from './pages/api/plugins';

// Pages — Playground
import { renderPlayground } from './pages/playground';
import type { CentralPlayground } from './components/CentralPlayground';

const soltana = initSoltana({
  theme: 'dark',
  relief: 'neumorphic',
  finish: 'matte',
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
router.register({ path: '/learn/introduction', render: renderGettingStarted });
router.register({ path: '/learn/themes', render: renderThemes });
router.register({ path: '/learn/reliefs', render: renderReliefs });
router.register({ path: '/learn/finishes', render: renderFinishes });
router.register({ path: '/learn/composition', render: renderComposition });

// Explore
router.register({ path: '/explore', render: renderComponentsIndex });
router.register({ path: '/explore/layout', render: renderLayout });
router.register({ path: '/explore/typography', render: renderTypography });
router.register({ path: '/explore/colors', render: renderColors });
router.register({ path: '/explore/examples', render: renderExamples });

// Component Reference
router.register({ path: '/explore/components', render: renderComponentReference });
router.register({ path: '/explore/components/actions', render: renderActionsRef });
router.register({ path: '/explore/components/content', render: renderContentRef });
router.register({ path: '/explore/components/data-display', render: renderDataDisplayRef });
router.register({ path: '/explore/components/feedback', render: renderFeedbackRef });
router.register({ path: '/explore/components/forms', render: renderFormsRef });
router.register({
  path: '/explore/components/layout-components',
  render: renderLayoutComponentsRef,
});
router.register({ path: '/explore/components/navigation', render: renderNavigationRef });
router.register({ path: '/explore/components/overlays', render: renderOverlaysRef });

// API Reference
router.register({ path: '/api/core', render: renderApiCore });
router.register({ path: '/api/config', render: renderApiConfig });
router.register({ path: '/api/behavior', render: renderApiBehavior });
router.register({ path: '/api/plugins', render: renderApiPlugins });

// Playground
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
const I = SIDEBAR_ICONS;
const sections: SidebarSection[] = [
  {
    label: 'Learn',
    items: [
      { label: 'Introduction', path: '/learn/introduction', icon: I['/learn/introduction'] },
      { label: 'Themes', path: '/learn/themes', icon: I['/learn/themes'] },
      { label: 'Reliefs', path: '/learn/reliefs', icon: I['/learn/reliefs'] },
      { label: 'Finishes', path: '/learn/finishes', icon: I['/learn/finishes'] },
      { label: 'Composition', path: '/learn/composition', icon: I['/learn/composition'] },
    ],
  },
  {
    label: 'Explore',
    items: [
      { label: 'Components', path: '/explore', icon: I['/explore'] },
      { label: 'Component Ref.', path: '/explore/components', icon: I['/explore/components'] },
      { label: 'Playground', path: '/playground', icon: I['/playground'] },
      { label: 'Layout', path: '/explore/layout', icon: I['/explore/layout'] },
      { label: 'Typography', path: '/explore/typography', icon: I['/explore/typography'] },
      { label: 'Colors', path: '/explore/colors', icon: I['/explore/colors'] },
      { label: 'Examples', path: '/explore/examples', icon: I['/explore/examples'] },
    ],
  },
  {
    label: 'API Reference',
    items: [
      { label: 'Core API', path: '/api/core', icon: I['/api/core'] },
      { label: 'Configuration', path: '/api/config', icon: I['/api/config'] },
      { label: 'Behavior', path: '/api/behavior', icon: I['/api/behavior'] },
      { label: 'PostCSS Plugin', path: '/api/plugins', icon: I['/api/plugins'] },
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
