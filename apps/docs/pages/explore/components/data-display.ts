/** Data display component reference — tables, lists, accordions, stats, timelines, and more. */

import { sectionHeading, specimen, quickNavFromLabels, sectionDivider } from '../../../lib/helpers';

function classTable(rows: [string, string][]): string {
  return `
    <div class="table-responsive mb-4">
      <table class="table table-compact">
        <thead><tr><th>Class</th><th>Description</th></tr></thead>
        <tbody>${rows.map(([cls, desc]) => `<tr><td><code>${cls}</code></td><td>${desc}</td></tr>`).join('')}</tbody>
      </table>
    </div>`;
}

export function renderDataDisplayRef(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-data-display-ref">

  ${sectionHeading('Data Display', 'data-display', 'Tables, lists, accordions, stats, timelines, keyboard keys, description lists, ratings, empty states, results, tree views, and steppers.')}

  ${quickNavFromLabels(
    [
      'Tables',
      'Lists',
      'Accordions',
      'Stats',
      'Timelines',
      'Keyboard Keys',
      'Description Lists',
      'Ratings',
      'Empty States',
      'Results',
      'Tree View',
      'Steppers',
    ],
    ''
  )}

  ${sectionDivider()}

  <!-- Tables -->

  ${sectionHeading('Tables', 'tables', 'Responsive data tables with variant modifiers.')}

  ${classTable([
    ['.table', 'Base table styling'],
    ['.table-bordered', 'Adds cell borders'],
    ['.table-compact', 'Reduces cell padding'],
    ['.table-fixed', 'Fixed table layout'],
    ['.table-inlay', 'Inset table style'],
    ['.table-relaxed', 'Increases cell padding'],
    ['.table-responsive', 'Horizontal scroll wrapper'],
    ['tr.active', 'Highlights the active row'],
  ])}

  ${specimen(
    'Default Table',
    'tables-default',
    `
    <div class="table-responsive">
      <table class="table">
        <thead><tr><th>Name</th><th>Role</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Alice</td><td>Admin</td><td>Active</td></tr>
          <tr class="active"><td>Bob</td><td>Editor</td><td>Active</td></tr>
          <tr><td>Carol</td><td>Viewer</td><td>Inactive</td></tr>
        </tbody>
      </table>
    </div>`,
    `<div class="table-responsive">
  <table class="table">
    <thead><tr><th>Name</th><th>Role</th><th>Status</th></tr></thead>
    <tbody>
      <tr><td>Alice</td><td>Admin</td><td>Active</td></tr>
      <tr class="active"><td>Bob</td><td>Editor</td><td>Active</td></tr>
    </tbody>
  </table>
</div>`
  )}

  ${specimen(
    'Bordered & Compact',
    'tables-bordered-compact',
    `
    <div class="table-responsive">
      <table class="table table-bordered table-compact">
        <thead><tr><th>Property</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td>Font</td><td>Raleway</td></tr>
          <tr><td>Weight</td><td>400</td></tr>
        </tbody>
      </table>
    </div>`,
    `<table class="table table-bordered table-compact">
  <thead><tr><th>Property</th><th>Value</th></tr></thead>
  <tbody>
    <tr><td>Font</td><td>Raleway</td></tr>
    <tr><td>Weight</td><td>400</td></tr>
  </tbody>
</table>`
  )}

  ${sectionDivider()}

  <!-- Lists -->

  ${sectionHeading('Lists', 'lists', 'Styled list containers with item-level modifiers.')}

  ${classTable([
    ['.list', 'Base list container'],
    ['.list-bordered', 'Adds borders between items'],
    ['.list-hover', 'Hover highlight on items'],
    ['.list-flush', 'Removes outer padding and border radius'],
    ['.list-item', 'Individual list entry'],
  ])}

  ${specimen(
    'Bordered List with Hover',
    'lists-bordered-hover',
    `
    <div class="list list-bordered list-hover">
      <div class="list-item">Dashboard</div>
      <div class="list-item">Settings</div>
      <div class="list-item">Profile</div>
    </div>`,
    `<div class="list list-bordered list-hover">
  <div class="list-item">Dashboard</div>
  <div class="list-item">Settings</div>
  <div class="list-item">Profile</div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Accordions -->

  ${sectionHeading('Accordions', 'accordions', 'Collapsible content sections with optional JS enhancement.')}

  ${classTable([
    ['.accordion', 'Base accordion container'],
    ['.accordion-flush', 'Removes outer borders and border radius'],
    ['.accordion-item', 'Individual collapsible section'],
    ['.accordion-header', 'Clickable section header'],
    ['.accordion-body', 'Collapsible content area'],
    ['.accordion-item.active', 'Expanded state'],
    ['data-sol-accordion', 'Enables JS enhancer (initAccordions)'],
  ])}

  ${specimen(
    'Accordion',
    'accordions-default',
    `
    <div data-sol-accordion class="accordion">
      <div class="accordion-item active">
        <div class="accordion-header">Getting Started</div>
        <div class="accordion-body">Install the package and add the CSS import to your entry file.</div>
      </div>
      <div class="accordion-item">
        <div class="accordion-header">Configuration</div>
        <div class="accordion-body">Set data attributes on the root element to activate tiers.</div>
      </div>
      <div class="accordion-item">
        <div class="accordion-header">Customization</div>
        <div class="accordion-body">Use registerTheme() to inject custom token sets at runtime.</div>
      </div>
    </div>`,
    `<div data-sol-accordion class="accordion">
  <div class="accordion-item active">
    <div class="accordion-header">Getting Started</div>
    <div class="accordion-body">Install the package and add the CSS import.</div>
  </div>
  <div class="accordion-item">
    <div class="accordion-header">Configuration</div>
    <div class="accordion-body">Set data attributes on the root element.</div>
  </div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Stats -->

  ${sectionHeading('Stats', 'stats', 'Metric display cards with labels, values, and delta indicators.')}

  ${classTable([
    ['.stat-group', 'Flex container for stat cards'],
    ['.stat', 'Individual stat card'],
    ['.stat-label', 'Metric label text'],
    ['.stat-value', 'Primary numeric value'],
    ['.stat-delta', 'Change indicator'],
    ['.stat-delta.positive', 'Positive change styling'],
    ['.stat-delta.negative', 'Negative change styling'],
  ])}

  ${specimen(
    'Stat Group',
    'stats-default',
    `
    <div class="stat-group">
      <div class="stat">
        <div class="stat-label">Revenue</div>
        <div class="stat-value">$45.2k</div>
        <div class="stat-delta positive">+12.5%</div>
      </div>
      <div class="stat">
        <div class="stat-label">Users</div>
        <div class="stat-value">1,204</div>
        <div class="stat-delta positive">+3.2%</div>
      </div>
      <div class="stat">
        <div class="stat-label">Bounce Rate</div>
        <div class="stat-value">34.1%</div>
        <div class="stat-delta negative">-2.4%</div>
      </div>
    </div>`,
    `<div class="stat-group">
  <div class="stat">
    <div class="stat-label">Revenue</div>
    <div class="stat-value">$45.2k</div>
    <div class="stat-delta positive">+12.5%</div>
  </div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Timelines -->

  ${sectionHeading('Timelines', 'timelines', 'Vertical event sequences with markers and content blocks.')}

  ${classTable([
    ['.timeline', 'Base timeline container'],
    ['.timeline-item', 'Individual event entry'],
    ['.timeline-marker', 'Dot/icon marker on the timeline axis'],
    ['.timeline-content', 'Event description area'],
  ])}

  ${specimen(
    'Timeline',
    'timelines-default',
    `
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">Project kickoff and initial planning phase.</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">Design system architecture finalized.</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">First public release published to npm.</div>
      </div>
    </div>`,
    `<div class="timeline">
  <div class="timeline-item">
    <div class="timeline-marker"></div>
    <div class="timeline-content">Event description</div>
  </div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Keyboard Keys -->

  ${sectionHeading('Keyboard Keys', 'keyboard-keys', 'Inline keyboard key indicators with size variants.')}

  ${classTable([
    ['.kbd', 'Base keyboard key styling'],
    ['.kbd-sm', 'Small key variant'],
    ['.kbd-lg', 'Large key variant'],
  ])}

  ${specimen(
    'Keyboard Keys',
    'keyboard-keys-default',
    `
    <div class="flex flex-wrap items-center gap-3">
      <span class="kbd kbd-sm">Esc</span>
      <span class="kbd">Ctrl</span> + <span class="kbd">C</span>
      <span class="kbd kbd-lg">Enter</span>
      <span class="kbd">Shift</span> + <span class="kbd">Tab</span>
    </div>`,
    `<span class="kbd kbd-sm">Esc</span>
<span class="kbd">Ctrl</span> + <span class="kbd">C</span>
<span class="kbd kbd-lg">Enter</span>`
  )}

  ${sectionDivider()}

  <!-- Description Lists -->

  ${sectionHeading('Description Lists', 'description-lists', 'Term-definition pairs in horizontal or stacked layout.')}

  ${classTable([
    ['.dl', 'Base description list styling'],
    ['.dl-horizontal', 'Side-by-side term/definition layout'],
    ['.dl-stacked', 'Vertically stacked layout'],
  ])}

  ${specimen(
    'Horizontal Description List',
    'description-lists-horizontal',
    `
    <dl class="dl dl-horizontal">
      <dt>Framework</dt>
      <dd>Soltana UI</dd>
      <dt>Version</dt>
      <dd>1.0.0</dd>
      <dt>License</dt>
      <dd>MIT</dd>
    </dl>`,
    `<dl class="dl dl-horizontal">
  <dt>Framework</dt>
  <dd>Soltana UI</dd>
  <dt>Version</dt>
  <dd>1.0.0</dd>
</dl>`
  )}

  ${specimen(
    'Stacked Description List',
    'description-lists-stacked',
    `
    <dl class="dl dl-stacked">
      <dt>Theme</dt>
      <dd>Color scheme applied via data-theme attribute.</dd>
      <dt>Relief</dt>
      <dd>Shadow model controlling depth and elevation.</dd>
    </dl>`,
    `<dl class="dl dl-stacked">
  <dt>Theme</dt>
  <dd>Color scheme applied via data-theme attribute.</dd>
</dl>`
  )}

  ${sectionDivider()}

  <!-- Ratings -->

  ${sectionHeading('Ratings', 'ratings', 'Star-based rating indicators with size variants and half-star support.')}

  ${classTable([
    ['.rating', 'Base rating container'],
    ['.rating-sm', 'Small size variant'],
    ['.rating-lg', 'Large size variant'],
    ['.rating-star', 'Individual star element'],
    ['.rating-star.filled', 'Filled star state'],
    ['.rating-star.half', 'Half-filled star state'],
  ])}

  ${specimen(
    'Rating Sizes',
    'ratings-sizes',
    `
    <div class="flex flex-col gap-4">
      <div class="rating rating-sm">
        <span class="rating-star filled"></span>
        <span class="rating-star filled"></span>
        <span class="rating-star filled"></span>
        <span class="rating-star half"></span>
        <span class="rating-star"></span>
      </div>
      <div class="rating">
        <span class="rating-star filled"></span>
        <span class="rating-star filled"></span>
        <span class="rating-star filled"></span>
        <span class="rating-star filled"></span>
        <span class="rating-star"></span>
      </div>
      <div class="rating rating-lg">
        <span class="rating-star filled"></span>
        <span class="rating-star filled"></span>
        <span class="rating-star filled"></span>
        <span class="rating-star filled"></span>
        <span class="rating-star filled"></span>
      </div>
    </div>`,
    `<div class="rating">
  <span class="rating-star filled"></span>
  <span class="rating-star filled"></span>
  <span class="rating-star half"></span>
  <span class="rating-star"></span>
</div>`
  )}

  ${sectionDivider()}

  <!-- Empty States -->

  ${sectionHeading('Empty States', 'empty-states', 'Placeholder displays for empty content areas with optional call-to-action.')}

  ${classTable([
    ['.empty-state', 'Base empty state container'],
    ['.empty-state-icon', 'Optional icon area'],
    ['.empty-state-heading', 'Primary heading text'],
    ['.empty-state-description', 'Supporting description'],
    ['.empty-state-action', 'Call-to-action button area'],
  ])}

  ${specimen(
    'Empty State',
    'empty-states-default',
    `
    <div class="empty-state">
      <div class="empty-state-heading">No results found</div>
      <div class="empty-state-description">Try adjusting your search criteria or clearing active filters.</div>
      <div class="empty-state-action"><button class="btn btn-primary btn-sm">Clear Filters</button></div>
    </div>`,
    `<div class="empty-state">
  <div class="empty-state-heading">No results found</div>
  <div class="empty-state-description">Try adjusting your search.</div>
  <div class="empty-state-action">
    <button class="btn btn-primary btn-sm">Clear Filters</button>
  </div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Results -->

  ${sectionHeading('Results', 'results', 'Outcome displays for success and error states.')}

  ${classTable([
    ['.result', 'Base result container'],
    ['.result-success', 'Success variant'],
    ['.result-error', 'Error variant'],
    ['.result-icon', 'Icon area'],
    ['.result-title', 'Primary outcome title'],
    ['.result-subtitle', 'Supporting description'],
    ['.result-actions', 'Action buttons area'],
  ])}

  ${specimen(
    'Success Result',
    'results-success',
    `
    <div class="result result-success">
      <div class="result-title">Payment Successful</div>
      <div class="result-subtitle">Your transaction has been processed. A confirmation email is on its way.</div>
      <div class="result-actions"><button class="btn btn-primary btn-sm">View Receipt</button></div>
    </div>`,
    `<div class="result result-success">
  <div class="result-title">Payment Successful</div>
  <div class="result-subtitle">Your transaction has been processed.</div>
  <div class="result-actions">
    <button class="btn btn-primary btn-sm">View Receipt</button>
  </div>
</div>`
  )}

  ${specimen(
    'Error Result',
    'results-error',
    `
    <div class="result result-error">
      <div class="result-title">Submission Failed</div>
      <div class="result-subtitle">An unexpected error occurred. Please try again later.</div>
      <div class="result-actions"><button class="btn btn-outline btn-sm">Retry</button></div>
    </div>`,
    `<div class="result result-error">
  <div class="result-title">Submission Failed</div>
  <div class="result-subtitle">An unexpected error occurred.</div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Tree View -->

  ${sectionHeading('Tree View', 'tree-view', 'Hierarchical tree structure with expandable branches and JS enhancement.')}

  ${classTable([
    ['.tree', 'Base tree container'],
    ['.tree-node', 'Individual tree node'],
    ['.tree-branch', 'Node with children (expandable)'],
    ['.tree-leaf', 'Terminal node (no children)'],
    ['.tree-indent', 'Indentation modifier'],
    ['.tree-node-content', 'Node label and toggle wrapper'],
    ['.tree-toggle', 'Expand/collapse button'],
    ['.tree-children', 'Nested child container'],
    ['data-sol-tree', 'Enables JS enhancer (initTrees)'],
  ])}

  ${specimen(
    'Tree View',
    'tree-view-default',
    `
    <div data-sol-tree class="tree" role="tree">
      <div class="tree-node tree-branch" role="treeitem">
        <div class="tree-node-content">
          <button class="tree-toggle"></button>
          <span>src</span>
        </div>
        <div class="tree-children">
          <div class="tree-node tree-branch" role="treeitem">
            <div class="tree-node-content">
              <button class="tree-toggle"></button>
              <span>components</span>
            </div>
            <div class="tree-children">
              <div class="tree-node tree-leaf" role="treeitem">
                <div class="tree-node-content"><span>Button.tsx</span></div>
              </div>
              <div class="tree-node tree-leaf" role="treeitem">
                <div class="tree-node-content"><span>Card.tsx</span></div>
              </div>
            </div>
          </div>
          <div class="tree-node tree-leaf" role="treeitem">
            <div class="tree-node-content"><span>index.ts</span></div>
          </div>
        </div>
      </div>
    </div>`,
    `<div data-sol-tree class="tree" role="tree">
  <div class="tree-node tree-branch" role="treeitem">
    <div class="tree-node-content">
      <button class="tree-toggle"></button>
      <span>Folder</span>
    </div>
    <div class="tree-children">
      <div class="tree-node tree-leaf" role="treeitem">
        <div class="tree-node-content"><span>File</span></div>
      </div>
    </div>
  </div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Steppers -->

  ${sectionHeading('Steppers', 'steppers', 'Multi-step progress indicators in horizontal or vertical layout.')}

  ${classTable([
    ['.stepper', 'Base horizontal stepper container'],
    ['.stepper-vertical', 'Vertical layout variant'],
    ['.step', 'Individual step element'],
    ['.step-indicator', 'Step number or icon circle'],
    ['.step-content', 'Step label text'],
    ['.step-connector', 'Line connecting adjacent steps'],
    ['.step.active', 'Currently active step'],
    ['.step.completed', 'Completed step'],
  ])}

  ${specimen(
    'Horizontal Stepper',
    'steppers-horizontal',
    `
    <div class="stepper">
      <div class="step completed"><div class="step-indicator">1</div><div class="step-content">Account</div></div>
      <div class="step-connector"></div>
      <div class="step active"><div class="step-indicator">2</div><div class="step-content">Details</div></div>
      <div class="step-connector"></div>
      <div class="step"><div class="step-indicator">3</div><div class="step-content">Confirm</div></div>
    </div>`,
    `<div class="stepper">
  <div class="step completed">
    <div class="step-indicator">1</div>
    <div class="step-content">Account</div>
  </div>
  <div class="step-connector"></div>
  <div class="step active">
    <div class="step-indicator">2</div>
    <div class="step-content">Details</div>
  </div>
</div>`
  )}

  ${specimen(
    'Vertical Stepper',
    'steppers-vertical',
    `
    <div class="stepper stepper-vertical">
      <div class="step completed"><div class="step-indicator">1</div><div class="step-content">Create account</div></div>
      <div class="step-connector"></div>
      <div class="step completed"><div class="step-indicator">2</div><div class="step-content">Verify email</div></div>
      <div class="step-connector"></div>
      <div class="step active"><div class="step-indicator">3</div><div class="step-content">Set up profile</div></div>
      <div class="step-connector"></div>
      <div class="step"><div class="step-indicator">4</div><div class="step-content">Complete onboarding</div></div>
    </div>`,
    `<div class="stepper stepper-vertical">
  <div class="step completed">
    <div class="step-indicator">1</div>
    <div class="step-content">Create account</div>
  </div>
  <div class="step-connector"></div>
  <div class="step active">
    <div class="step-indicator">3</div>
    <div class="step-content">Set up profile</div>
  </div>
</div>`
  )}

</div>`;
  return page;
}
