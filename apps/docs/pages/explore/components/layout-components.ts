/** Layout components reference — app layout, carousel, dividers, hero, page footer, scroll area, and collapsible. */

import {
  sectionHeading,
  specimen,
  codeExample,
  quickNavFromLabels,
  sectionDivider,
} from '../../../lib/helpers';

function classTable(rows: [string, string][]): string {
  return `
    <div class="table-responsive">
      <table class="table">
        <thead><tr><th>Class</th><th>Description</th></tr></thead>
        <tbody>
          ${rows.map(([cls, desc]) => `<tr><td><code>${cls}</code></td><td>${desc}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

export function renderLayoutComponentsRef(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-layout-components-ref">

  ${sectionHeading('Layout Components', 'layout-components', 'Structural components for page composition, navigation shells, scrollable regions, and collapsible sections.')}

  ${quickNavFromLabels(
    ['App Layout', 'Carousel', 'Dividers', 'Hero', 'Page Footer', 'Scroll Area', 'Collapsible'],
    'layout-'
  )}

  ${sectionDivider()}

  <!-- App Layout -->

  ${sectionHeading('App Layout', 'layout-app-layout', 'Top-level shell combining sidebar navigation with a header and content area.')}

  ${classTable([
    ['.app-layout', 'Root layout container with sidebar + content columns'],
    ['.app-header', 'Sticky top header bar'],
    ['.sidebar', 'Side navigation panel'],
    ['.sidebar__nav', 'Navigation wrapper inside the sidebar'],
    ['.sidebar__link', 'Navigation link item'],
    ['.sidebar__link--active', 'Active state for the current link'],
    ['.sidebar__list', 'Grouped list of links'],
    ['.sidebar__section-header', 'Collapsible section heading'],
    ['.sidebar__section--expanded', 'Expanded state for a sidebar section'],
    ['.sidebar__chevron', 'Rotate indicator for collapsible sections'],
    ['.page-footer', 'Footer area below the main content'],
  ])}

  ${specimen(
    'App Layout',
    'layout-app-layout-specimen',
    `
    <div class="app-layout" style="min-height: 16rem; border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden;">
      <div class="sidebar" style="min-width: 10rem;">
        <nav class="sidebar__nav">
          <a class="sidebar__link sidebar__link--active" href="#">Dashboard</a>
          <a class="sidebar__link" href="#">Settings</a>
        </nav>
      </div>
      <div style="flex: 1;">
        <div class="app-header">Header</div>
        <div class="p-4 text-secondary">Content area</div>
      </div>
    </div>
  `,
    `<div class="app-layout">
  <div class="sidebar">
    <nav class="sidebar__nav">
      <a class="sidebar__link sidebar__link--active" href="#">Dashboard</a>
      <a class="sidebar__link" href="#">Settings</a>
    </nav>
  </div>
  <div>
    <div class="app-header">Header</div>
    <div>Content area</div>
  </div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Carousel -->

  ${sectionHeading('Carousel', 'layout-carousel', 'Slide-based content rotator with optional autoplay and dot navigation.')}

  ${classTable([
    ['.carousel', 'Root carousel container'],
    ['.carousel-track', 'Flex track holding all slides'],
    ['.carousel-slide', 'Individual slide'],
    ['.carousel-prev', 'Previous slide button'],
    ['.carousel-next', 'Next slide button'],
    ['.carousel-dots', 'Dot indicator container'],
    ['.carousel-dot', 'Individual dot indicator'],
    ['.carousel-dot.active', 'Active dot state'],
  ])}

  <div class="mt-6 mb-4">
    <h4 class="text-lg font-semibold mb-2">JS Enhancer</h4>
    <p class="text-sm text-secondary mb-2">Add <code>data-sol-carousel</code> and call <code>initCarousels()</code> to enable keyboard navigation, autoplay, and dot sync.</p>
    ${codeExample(
      `import { initCarousels } from 'soltana-ui';
initCarousels();`,
      'typescript'
    )}
  </div>

  <div class="mt-4 mb-4">
    <h4 class="text-lg font-semibold mb-2">Data Attributes</h4>
    ${classTable([
      ['data-carousel-autoplay', 'Enable automatic slide advancement'],
      ['data-carousel-interval', 'Autoplay interval in milliseconds'],
      ['data-carousel-loop', 'Loop back to the first slide after the last'],
    ])}
  </div>

  ${specimen(
    'Carousel',
    'layout-carousel-specimen',
    `
    <div data-sol-carousel class="carousel" style="max-width: 28rem;">
      <div class="carousel-track">
        <div class="carousel-slide">
          <div class="card p-6 text-center">Slide 1</div>
        </div>
        <div class="carousel-slide">
          <div class="card p-6 text-center">Slide 2</div>
        </div>
      </div>
      <button class="carousel-prev">&lsaquo;</button>
      <button class="carousel-next">&rsaquo;</button>
      <div class="carousel-dots"></div>
    </div>
  `,
    `<div data-sol-carousel class="carousel">
  <div class="carousel-track">
    <div class="carousel-slide">Slide 1</div>
    <div class="carousel-slide">Slide 2</div>
  </div>
  <button class="carousel-prev">&lsaquo;</button>
  <button class="carousel-next">&rsaquo;</button>
  <div class="carousel-dots"></div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Dividers -->

  ${sectionHeading('Dividers', 'layout-dividers', 'Horizontal rules and labeled separators for visual content breaks.')}

  ${classTable([
    ['.separator', 'Standard horizontal divider'],
    ['.separator-thick', 'Thicker variant'],
    ['.separator-vertical', 'Vertical divider for inline layouts'],
    ['.separator-label', 'Labeled divider with centered text'],
  ])}

  ${specimen(
    'Dividers',
    'layout-dividers-specimen',
    `
    <div class="flex flex-col gap-6">
      <hr class="separator" />
      <hr class="separator separator-thick" />
      <div class="separator-label">OR</div>
    </div>
  `,
    `<hr class="separator" />
<hr class="separator separator-thick" />
<div class="separator-label">OR</div>`
  )}

  ${sectionDivider()}

  <!-- Hero -->

  ${sectionHeading('Hero', 'layout-hero', 'Full-width banner sections for landing pages and feature introductions.')}

  ${classTable([
    ['.hero', 'Standard hero section'],
    ['.hero-full', 'Full-viewport-height hero'],
    ['.hero-sm', 'Compact hero with reduced padding'],
    ['.hero-lg', 'Tall hero with extra padding'],
    ['.hero-title', 'Primary heading inside the hero'],
    ['.hero-subtitle', 'Supporting text below the title'],
    ['.hero-actions', 'Button group area'],
  ])}

  ${specimen(
    'Hero',
    'layout-hero-specimen',
    `
    <div class="hero" style="border-radius: var(--radius-lg); overflow: hidden;">
      <h1 class="hero-title">Build Beautiful Interfaces</h1>
      <p class="hero-subtitle">A CSS-first design system.</p>
      <div class="hero-actions">
        <button class="btn btn-primary">Get Started</button>
      </div>
    </div>
  `,
    `<div class="hero">
  <h1 class="hero-title">Build Beautiful Interfaces</h1>
  <p class="hero-subtitle">A CSS-first design system.</p>
  <div class="hero-actions">
    <button class="btn btn-primary">Get Started</button>
  </div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Page Footer -->

  ${sectionHeading('Page Footer', 'layout-page-footer', 'Bottom-of-page footer with links and copyright text.')}

  ${classTable([['.page-footer', 'Footer container with muted styling and top border']])}

  ${specimen(
    'Page Footer',
    'layout-page-footer-specimen',
    `
    <div class="page-footer" style="position: static;">
      <div class="flex flex-wrap gap-4">
        <a class="link-muted" href="#">About</a>
        <a class="link-muted" href="#">Privacy</a>
      </div>
      <div class="text-muted">&copy; 2026 Company. All rights reserved.</div>
    </div>
  `,
    `<div class="page-footer">
  <div class="flex flex-wrap gap-4">
    <a class="link-muted" href="#">About</a>
    <a class="link-muted" href="#">Privacy</a>
  </div>
  <div class="text-muted">&copy; 2026 Company. All rights reserved.</div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Scroll Area -->

  ${sectionHeading('Scroll Area', 'layout-scroll-area', 'Constrained scrollable regions with styled scrollbars.')}

  ${classTable([
    ['.scroll-area', 'Scrollable container with styled scrollbars'],
    ['.scroll-area-sm', 'Narrower scrollbar variant'],
    ['.scroll-area-hidden', 'Hidden scrollbar (scroll still functional)'],
  ])}

  <div class="mt-6 mb-4">
    <h4 class="text-lg font-semibold mb-2">JS Enhancer</h4>
    <p class="text-sm text-secondary mb-2">Add <code>data-sol-scroll-area</code> and call <code>initScrollAreas()</code> to enable scroll-position CSS custom properties.</p>
    ${codeExample(
      `import { initScrollAreas } from 'soltana-ui';
initScrollAreas();`,
      'typescript'
    )}
  </div>

  ${specimen(
    'Scroll Area',
    'layout-scroll-area-specimen',
    `
    <div data-sol-scroll-area class="scroll-area" style="max-height: 10rem;">
      ${Array.from({ length: 12 }, (_, i) => `<p class="py-2 border-b border-subtle">Scrollable item ${String(i + 1)}</p>`).join('')}
    </div>
  `,
    `<div data-sol-scroll-area class="scroll-area" style="max-height: 20rem;">
  Scrollable content here
</div>`
  )}

  ${sectionDivider()}

  <!-- Collapsible -->

  ${sectionHeading('Collapsible', 'layout-collapsible', 'Toggle-driven disclosure widget for hiding and revealing content.')}

  ${classTable([
    ['.collapsible', 'Root collapsible container'],
    ['.collapsible-bordered', 'Bordered variant with card-like appearance'],
    ['.collapsible-trigger', 'Clickable toggle button'],
    ['.collapsible-content', 'Content region that expands and collapses'],
  ])}

  <div class="mt-6 mb-4">
    <h4 class="text-lg font-semibold mb-2">JS Enhancer</h4>
    <p class="text-sm text-secondary mb-2">Add <code>data-sol-collapsible</code> and call <code>initCollapsibles()</code> to enable toggle behavior and ARIA attributes.</p>
    ${codeExample(
      `import { initCollapsibles } from 'soltana-ui';
initCollapsibles();`,
      'typescript'
    )}
  </div>

  ${specimen(
    'Collapsible',
    'layout-collapsible-specimen',
    `
    <div data-sol-collapsible class="collapsible collapsible-bordered">
      <button class="collapsible-trigger">Toggle</button>
      <div class="collapsible-content">
        <div class="p-4">Hidden content here</div>
      </div>
    </div>
  `,
    `<div data-sol-collapsible class="collapsible collapsible-bordered">
  <button class="collapsible-trigger">Toggle</button>
  <div class="collapsible-content">Hidden content here</div>
</div>`
  )}

</div>`;
  return page;
}
