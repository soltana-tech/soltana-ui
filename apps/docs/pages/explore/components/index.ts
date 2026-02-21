/** Component reference index — links to category-based reference pages. */

import { sectionHeading } from '../../../lib/helpers';

const categories = [
  {
    label: 'Actions',
    path: '#/explore/components/actions',
    desc: 'Buttons, close buttons, and floating action buttons.',
  },
  {
    label: 'Content',
    path: '#/explore/components/content',
    desc: 'Cards, badges, avatars, callouts, code, figures, images, and links.',
  },
  {
    label: 'Data Display',
    path: '#/explore/components/data-display',
    desc: 'Tables, lists, stats, timelines, ratings, description lists, and more.',
  },
  {
    label: 'Feedback',
    path: '#/explore/components/feedback',
    desc: 'Alerts, progress bars, skeletons, spinners, and result displays.',
  },
  {
    label: 'Forms',
    path: '#/explore/components/forms',
    desc: 'Inputs, toggles, segmented controls, combobox, color picker, and date picker.',
  },
  {
    label: 'Layout',
    path: '#/explore/components/layout-components',
    desc: 'App layout, carousel, hero, scroll area, collapsible, and dividers.',
  },
  {
    label: 'Navigation',
    path: '#/explore/components/navigation',
    desc: 'Navbars, breadcrumbs, tabs, pagination, steppers, and dropdowns.',
  },
  {
    label: 'Overlays',
    path: '#/explore/components/overlays',
    desc: 'Modals, drawers, alert dialogs, toasts, tooltips, popovers, context menus, and hover cards.',
  },
];

export function renderComponentReference(): HTMLElement {
  const cards = categories
    .map(
      (cat) => `
      <a href="${cat.path}" class="card card-hover rounded-xl p-5 no-underline" style="text-decoration: none; color: inherit;">
        <h3 class="text-lg font-semibold mb-1">${cat.label}</h3>
        <p class="text-sm text-secondary">${cat.desc}</p>
      </a>`
    )
    .join('');

  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-component-reference">
  ${sectionHeading('Component Reference', 'component-reference', 'CSS class documentation, HTML structure, modifiers, and usage patterns for all components.')}
  <div class="callout callout-info mb-6">
    <div class="callout-content text-sm">
      For live interactive previews, visit the <a href="#/explore">Component Gallery</a> or <a href="#/playground">Playground</a>.
    </div>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    ${cards}
  </div>
</div>`;
  return page;
}
