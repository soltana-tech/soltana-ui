import '../src/styles/index.scss';
import './docs.scss';

// Initialize enhancers for interactive components (modals, tabs, tooltips)
import { initAll } from '../src/enhancers/index';

import { initSoltana, type Theme } from '../src/config';
import { PlaygroundControls } from './components/PlaygroundControls';
import { SettingsPanel } from './components/SettingsPanel';
import { TabRouter } from './components/TabRouter';
import { renderComponents } from './pages/components';
import { renderDesignSystem } from './pages/design-system';
import { renderExamples } from './pages/examples';
import { renderGettingStarted } from './pages/getting-started';
import { renderPatterns } from './pages/patterns';

// Initialize design system with config
const soltana = initSoltana({
  theme: 'dark',
  relief: 'neu',
  finish: 'polished',
  ornament: 'none',
});

// Initialize settings panel with soltana instance
new SettingsPanel(soltana);

// Bind the standalone theme switcher in the header
function bindThemeSwitcher(): void {
  const switcher = document.getElementById('theme-switcher');
  if (!switcher) return;

  const buttons = switcher.querySelectorAll<HTMLButtonElement>('.theme-btn');

  // Update active state based on current theme
  const updateActiveState = (): void => {
    const currentTheme = soltana.getState().theme;
    buttons.forEach((btn) => {
      const theme = btn.dataset.themeSet;
      btn.classList.toggle('active', theme === currentTheme);
    });
  };

  // Bind click handlers
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.themeSet as Theme | undefined;
      if (theme) {
        soltana.setTheme(theme);
        updateActiveState();
      }
    });
  });

  // Set initial state
  updateActiveState();
}

bindThemeSwitcher();

// Initialize tab router
const router = new TabRouter('docs-content');
const playground = new PlaygroundControls();

router.register('getting-started', renderGettingStarted);
router.register('design-system', renderDesignSystem);
router.register('components', renderComponents);
router.register('patterns', renderPatterns);
router.register('examples', renderExamples);

// Re-bind playground controls and enhancers after each page render
router.onAfterRender(() => {
  playground.bindAll();
  initAll();

  // Bind swatch copy-to-clipboard
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

  // Smooth scroll for anchor links
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

router.start();
