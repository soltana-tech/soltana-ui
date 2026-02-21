/** Navigation component reference page — navs, navbar, breadcrumbs, tabs, pagination, dropdowns. */

import { sectionHeading, specimen, quickNavFromLabels, sectionDivider } from '../../../lib/helpers';

export function renderNavigationRef(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-navigation-ref">

  ${sectionHeading('Navigation', 'navigation', 'Navs, navbars, breadcrumbs, tabs, pagination, and dropdown components.')}

  ${quickNavFromLabels(['Nav', 'Navbar', 'Breadcrumbs', 'Tabs', 'Pagination', 'Dropdowns'], 'nav-')}

  ${sectionDivider()}

  <!-- Nav -->
  ${sectionHeading('Nav', 'nav-nav', 'Inline horizontal navigation links.')}

  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr><th>Class</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.nav</code></td><td>Container for navigation items</td></tr>
        <tr><td><code>.nav-item</code></td><td>Individual navigation link</td></tr>
        <tr><td><code>.nav-item.active</code></td><td>Marks the current/active item</td></tr>
      </tbody>
    </table>
  </div>

  ${specimen(
    'Nav',
    'nav-nav-specimen',
    `
    <nav class="nav">
      <a class="nav-item active" href="#">Home</a>
      <a class="nav-item" href="#">About</a>
      <a class="nav-item" href="#">Contact</a>
    </nav>
  `,
    `<nav class="nav">
  <a class="nav-item active" href="#">Home</a>
  <a class="nav-item" href="#">About</a>
  <a class="nav-item" href="#">Contact</a>
</nav>`
  )}

  ${sectionDivider()}

  <!-- Navbar -->
  ${sectionHeading('Navbar', 'nav-navbar', 'Full-width navigation bar with brand, links, and responsive toggler.')}

  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr><th>Class</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.navbar</code></td><td>Top-level navbar container</td></tr>
        <tr><td><code>.navbar-fixed</code></td><td>Fixed positioning at the top of the viewport</td></tr>
        <tr><td><code>.navbar-sticky</code></td><td>Sticky positioning (scrolls then sticks)</td></tr>
        <tr><td><code>.navbar-brand</code></td><td>Brand/logo area</td></tr>
        <tr><td><code>.navbar-nav</code></td><td>Container for nav items within the navbar</td></tr>
        <tr><td><code>.navbar-toggler</code></td><td>Hamburger toggle button for responsive collapse</td></tr>
        <tr><td><code>.navbar-collapse</code></td><td>Collapsible section that hides on small screens</td></tr>
      </tbody>
    </table>
  </div>

  ${specimen(
    'Navbar',
    'nav-navbar-specimen',
    `
    <nav class="navbar">
      <a class="navbar-brand" href="#">Brand</a>
      <div class="navbar-nav">
        <a class="nav-item active" href="#">Home</a>
        <a class="nav-item" href="#">Features</a>
      </div>
    </nav>
  `,
    `<nav class="navbar">
  <a class="navbar-brand" href="#">Brand</a>
  <div class="navbar-nav">
    <a class="nav-item active" href="#">Home</a>
    <a class="nav-item" href="#">Features</a>
  </div>
</nav>`
  )}

  ${sectionDivider()}

  <!-- Breadcrumbs -->
  ${sectionHeading('Breadcrumbs', 'nav-breadcrumbs', 'Hierarchical path indicators for wayfinding.')}

  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr><th>Class</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.breadcrumb</code></td><td>Breadcrumb container</td></tr>
        <tr><td><code>.breadcrumb-item</code></td><td>Individual breadcrumb segment</td></tr>
        <tr><td><code>.breadcrumb-item.active</code></td><td>Current page (non-interactive)</td></tr>
      </tbody>
    </table>
  </div>

  ${specimen(
    'Breadcrumbs',
    'nav-breadcrumbs-specimen',
    `
    <nav class="breadcrumb">
      <a class="breadcrumb-item" href="#">Home</a>
      <a class="breadcrumb-item" href="#">Products</a>
      <span class="breadcrumb-item active">Current Page</span>
    </nav>
  `,
    `<nav class="breadcrumb">
  <a class="breadcrumb-item" href="#">Home</a>
  <a class="breadcrumb-item" href="#">Products</a>
  <span class="breadcrumb-item active">Current Page</span>
</nav>`
  )}

  ${sectionDivider()}

  <!-- Tabs -->
  ${sectionHeading('Tabs', 'nav-tabs', 'Tabbed navigation for switching between content panels.')}

  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr><th>Class</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.tabs</code></td><td>Tab bar container</td></tr>
        <tr><td><code>.tab</code></td><td>Individual tab button</td></tr>
        <tr><td><code>.tabs-beveled</code></td><td>Modifier for beveled tab style</td></tr>
        <tr><td><code>.tab.active</code></td><td>Currently selected tab</td></tr>
        <tr><td><code>.tab[disabled]</code></td><td>Disabled tab (non-interactive)</td></tr>
      </tbody>
    </table>
  </div>

  <p class="text-sm text-secondary mt-4 mb-2">
    <strong>JS enhancer:</strong> Add <code>data-sol-tabs</code> to the container and call <code>initTabs()</code> for automatic panel switching and keyboard navigation.
  </p>

  ${specimen(
    'Tabs',
    'nav-tabs-specimen',
    `
    <div class="tabs">
      <button class="tab active">Overview</button>
      <button class="tab">Features</button>
      <button class="tab" disabled>Disabled</button>
    </div>
  `,
    `<div class="tabs">
  <button class="tab active">Overview</button>
  <button class="tab">Features</button>
  <button class="tab" disabled>Disabled</button>
</div>`
  )}

  ${sectionDivider()}

  <!-- Pagination -->
  ${sectionHeading('Pagination', 'nav-pagination', 'Page navigation controls with size variants.')}

  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr><th>Class</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.pagination</code></td><td>Pagination container</td></tr>
        <tr><td><code>.pagination-sm</code></td><td>Small size variant</td></tr>
        <tr><td><code>.pagination-lg</code></td><td>Large size variant</td></tr>
        <tr><td><code>.page-item</code></td><td>Wrapper for each page element</td></tr>
        <tr><td><code>.page-link</code></td><td>Clickable page link inside a page item</td></tr>
        <tr><td><code>.page-item.active</code></td><td>Currently selected page</td></tr>
        <tr><td><code>.page-item.disabled</code></td><td>Disabled page control</td></tr>
      </tbody>
    </table>
  </div>

  ${specimen(
    'Pagination',
    'nav-pagination-specimen',
    `
    <nav class="pagination">
      <span class="page-item disabled"><span class="page-link">&laquo;</span></span>
      <span class="page-item"><a class="page-link" href="#">1</a></span>
      <span class="page-item active"><a class="page-link" href="#">2</a></span>
      <span class="page-item"><a class="page-link" href="#">3</a></span>
      <span class="page-item"><a class="page-link" href="#">&raquo;</a></span>
    </nav>
  `,
    `<nav class="pagination">
  <span class="page-item disabled"><span class="page-link">&laquo;</span></span>
  <span class="page-item"><a class="page-link" href="#">1</a></span>
  <span class="page-item active"><a class="page-link" href="#">2</a></span>
  <span class="page-item"><a class="page-link" href="#">3</a></span>
  <span class="page-item"><a class="page-link" href="#">&raquo;</a></span>
</nav>`
  )}

  ${sectionDivider()}

  <!-- Dropdowns -->
  ${sectionHeading('Dropdowns', 'nav-dropdowns', 'Toggle-able menus for contextual actions.')}

  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr><th>Class</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.dropdown</code></td><td>Dropdown container (positions the menu below the toggle)</td></tr>
        <tr><td><code>.dropdown-end</code></td><td>Modifier to align the menu to the end (right) edge</td></tr>
        <tr><td><code>.dropdown-toggle</code></td><td>Element that triggers the menu</td></tr>
        <tr><td><code>.dropdown-menu</code></td><td>The menu panel</td></tr>
        <tr><td><code>.dropdown-item</code></td><td>Individual menu action</td></tr>
        <tr><td><code>.dropdown-header</code></td><td>Non-interactive section heading inside the menu</td></tr>
        <tr><td><code>.dropdown-divider</code></td><td>Horizontal rule between menu sections</td></tr>
      </tbody>
    </table>
  </div>

  <p class="text-sm text-secondary mt-4 mb-2">
    <strong>JS enhancer:</strong> Add <code>data-sol-dropdown</code> to the container and call <code>initDropdowns()</code> for click-to-toggle, outside-click-to-close, and keyboard support.
  </p>

  ${specimen(
    'Dropdown',
    'nav-dropdowns-specimen',
    `
    <div data-sol-dropdown class="dropdown">
      <button class="btn btn-outline dropdown-toggle">Options</button>
      <div class="dropdown-menu">
        <div class="dropdown-header">Actions</div>
        <a class="dropdown-item" href="#">Edit</a>
        <a class="dropdown-item" href="#">Duplicate</a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href="#">Delete</a>
      </div>
    </div>
  `,
    `<div data-sol-dropdown class="dropdown">
  <button class="btn btn-outline dropdown-toggle">Options</button>
  <div class="dropdown-menu">
    <div class="dropdown-header">Actions</div>
    <a class="dropdown-item" href="#">Edit</a>
    <a class="dropdown-item" href="#">Duplicate</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item" href="#">Delete</a>
  </div>
</div>`
  )}

</div>`;
  return page;
}
