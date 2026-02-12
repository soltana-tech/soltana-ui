import '../src/styles/index.scss';
import './docs.scss';

import { PlaygroundControls } from './components/PlaygroundControls';
import { TabRouter } from './components/TabRouter';
import { ThemeManager } from './components/ThemeManager';
import { renderComponents } from './pages/components';
import { renderExamples } from './pages/examples';
import { renderFoundation } from './pages/foundation';
import { renderPatterns } from './pages/patterns';
import { renderUtilities } from './pages/utilities';

// Initialize theme manager
new ThemeManager();

// Initialize tab router
const router = new TabRouter('docs-content');
const playground = new PlaygroundControls();

router.register('foundation', renderFoundation);
router.register('utilities', renderUtilities);
router.register('components', renderComponents);
router.register('patterns', renderPatterns);
router.register('examples', renderExamples);

// Re-bind playground controls after each page render
router.onAfterRender(() => {
  playground.bindAll();

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
