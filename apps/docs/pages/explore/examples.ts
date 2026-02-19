/** Full-page template examples with shared sticky tier controls. */

import type { SolPreview } from '../../components/SolPreview';
import { TierControls } from '../../components/TierControls';

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

function dashboardTemplate(): string {
  return `
<div class="app-layout" style="--sidebar-width: 200px;">
  <aside class="sidebar" style="position: static; height: auto;">
    <nav class="sidebar__nav">
      <div class="sidebar__section sidebar__section--expanded">
        <button class="sidebar__section-header"><span>Dashboard</span></button>
        <ul class="sidebar__list" style="max-height: none;">
          <li><a class="sidebar__link sidebar__link--active">Overview</a></li>
          <li><a class="sidebar__link">Analytics</a></li>
          <li><a class="sidebar__link">Reports</a></li>
          <li><a class="sidebar__link">Settings</a></li>
        </ul>
      </div>
    </nav>
  </aside>
  <main style="padding: 1.5rem;">
    <h1 style="font-size: var(--text-2xl); font-weight: var(--font-bold); margin-bottom: 1.5rem;">Dashboard</h1>
    <div class="stat-group" style="margin-bottom: 1.5rem;">
      <div class="stat"><span class="stat-value">12,847</span><span class="stat-label">Users</span><span class="stat-delta positive">+12%</span></div>
      <div class="stat"><span class="stat-value">$48.2K</span><span class="stat-label">Revenue</span><span class="stat-delta positive">+8%</span></div>
      <div class="stat"><span class="stat-value">1,024</span><span class="stat-label">Orders</span><span class="stat-delta negative">-3%</span></div>
    </div>
    <div class="card" style="margin-bottom: 1.5rem;">
      <div class="card-header">Recent Orders</div>
      <table class="table">
        <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Amount</th></tr></thead>
        <tbody>
          <tr><td>#1024</td><td>Alice Johnson</td><td><span class="badge badge-success">Paid</span></td><td>$120.00</td></tr>
          <tr><td>#1023</td><td>Bob Smith</td><td><span class="badge badge-warning">Pending</span></td><td>$85.50</td></tr>
          <tr><td>#1022</td><td>Carol White</td><td><span class="badge badge-error">Failed</span></td><td>$210.00</td></tr>
        </tbody>
      </table>
    </div>
    <div style="display: flex; gap: 1rem;">
      <div class="card" style="flex: 1;"><div class="card-body"><h3 style="font-weight: var(--font-semibold); margin-bottom: 0.75rem;">Progress</h3><div class="progress" style="margin-bottom: 0.5rem;"><div class="progress-bar" style="width: 72%;"></div></div><span class="text-sm text-secondary">72% complete</span></div></div>
      <div class="card" style="flex: 1;"><div class="card-body"><h3 style="font-weight: var(--font-semibold); margin-bottom: 0.75rem;">Activity</h3><div class="timeline"><div class="timeline-item"><div class="timeline-marker"></div><div class="timeline-content">New user registered</div></div><div class="timeline-item"><div class="timeline-marker"></div><div class="timeline-content">Order #1024 completed</div></div></div></div></div>
    </div>
  </main>
</div>`;
}

function landingTemplate(): string {
  return `
<div>
  <nav class="navbar">
    <span class="navbar-brand">Soltana</span>
    <div class="navbar-nav" style="display: flex; gap: 0.5rem;">
      <a class="nav-item active">Home</a>
      <a class="nav-item">Features</a>
      <a class="nav-item">Pricing</a>
      <button class="btn btn-primary btn-sm">Get Started</button>
    </div>
  </nav>
  <div style="text-align: center; padding: 4rem 2rem;">
    <h1 style="font-size: var(--text-4xl); font-weight: var(--font-bold); margin-bottom: 1rem;">Build Beautiful Interfaces</h1>
    <p style="font-size: var(--text-lg); color: var(--text-secondary); max-width: 40rem; margin: 0 auto 2rem;">A composable design system with orthogonal themes, reliefs, and finishes.</p>
    <div style="display: flex; gap: 1rem; justify-content: center;">
      <button class="btn btn-primary">Get Started</button>
      <button class="btn btn-outline">Learn More</button>
    </div>
  </div>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; padding: 2rem; max-width: 60rem; margin: 0 auto;">
    <div class="card"><div class="card-body"><span class="badge badge-primary" style="margin-bottom: 0.75rem;">Themes</span><h3 style="font-weight: var(--font-semibold); margin-bottom: 0.5rem;">3 Color Schemes</h3><p class="text-sm text-secondary">Dark, light, and sepia themes with full token coverage.</p></div></div>
    <div class="card"><div class="card-body"><span class="badge badge-primary" style="margin-bottom: 0.75rem;">Reliefs</span><h3 style="font-weight: var(--font-semibold); margin-bottom: 0.5rem;">4 Shadow Models</h3><p class="text-sm text-secondary">Flat, glassmorphic, skeuomorphic, and neumorphic depth.</p></div></div>
    <div class="card"><div class="card-body"><span class="badge badge-primary" style="margin-bottom: 0.75rem;">Finishes</span><h3 style="font-weight: var(--font-semibold); margin-bottom: 0.5rem;">4 Surface Treatments</h3><p class="text-sm text-secondary">Matte, frosted, tinted, and glossy surface effects.</p></div></div>
  </div>
</div>`;
}

function profileTemplate(): string {
  return `
<div style="max-width: 40rem; margin: 2rem auto; padding: 0 1.5rem;">
  <div class="card" style="margin-bottom: 1.5rem;">
    <div class="card-body" style="text-align: center; padding: 2rem;">
      <div class="avatar avatar-xl" style="margin: 0 auto 1rem;">JD</div>
      <h2 style="font-size: var(--text-xl); font-weight: var(--font-bold);">Jane Doe</h2>
      <p class="text-sm text-secondary">Senior Product Designer</p>
      <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 1rem;">
        <span class="tag">Design Systems</span>
        <span class="tag">CSS</span>
        <span class="tag">Accessibility</span>
      </div>
      <div style="display: flex; gap: 0.75rem; justify-content: center; margin-top: 1.5rem;">
        <button class="btn btn-primary btn-sm">Follow</button>
        <button class="btn btn-secondary btn-sm">Message</button>
      </div>
    </div>
  </div>
  <div class="stat-group" style="margin-bottom: 1.5rem;">
    <div class="stat"><span class="stat-value">248</span><span class="stat-label">Projects</span></div>
    <div class="stat"><span class="stat-value">1.2K</span><span class="stat-label">Followers</span></div>
    <div class="stat"><span class="stat-value">89</span><span class="stat-label">Following</span></div>
  </div>
  <div class="card">
    <div class="card-header">Activity</div>
    <div class="card-body">
      <div class="timeline">
        <div class="timeline-item"><div class="timeline-marker"></div><div class="timeline-content"><strong>Published article</strong><p class="text-sm text-secondary">Design tokens at scale</p></div></div>
        <div class="timeline-item"><div class="timeline-marker"></div><div class="timeline-content"><strong>Completed project</strong><p class="text-sm text-secondary">Soltana UI v1.0 launch</p></div></div>
        <div class="timeline-item"><div class="timeline-marker"></div><div class="timeline-content"><strong>Joined team</strong><p class="text-sm text-secondary">Design Systems team</p></div></div>
      </div>
    </div>
  </div>
</div>`;
}

function pricingTemplate(): string {
  return `
<div style="padding: 3rem 2rem; text-align: center;">
  <h1 style="font-size: var(--text-3xl); font-weight: var(--font-bold); margin-bottom: 0.5rem;">Pricing</h1>
  <p style="color: var(--text-secondary); margin-bottom: 2rem;">Choose the plan that fits your needs.</p>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 56rem; margin: 0 auto;">
    <div class="card"><div class="card-body" style="padding: 2rem;">
      <span class="badge" style="margin-bottom: 1rem;">Starter</span>
      <div style="font-size: var(--text-4xl); font-weight: var(--font-bold); margin-bottom: 0.5rem;">$9</div>
      <p class="text-sm text-secondary" style="margin-bottom: 1.5rem;">per month</p>
      <ul style="list-style: none; padding: 0; text-align: left; margin-bottom: 1.5rem; font-size: var(--text-sm); color: var(--text-secondary);"><li style="padding: 0.375rem 0;">5 Projects</li><li style="padding: 0.375rem 0;">Basic themes</li><li style="padding: 0.375rem 0;">Community support</li></ul>
      <button class="btn btn-outline" style="width: 100%;">Select</button>
    </div></div>
    <div class="card" style="border-color: var(--accent-primary);"><div class="card-body" style="padding: 2rem;">
      <span class="badge badge-primary" style="margin-bottom: 1rem;">Pro</span>
      <div style="font-size: var(--text-4xl); font-weight: var(--font-bold); margin-bottom: 0.5rem;">$29</div>
      <p class="text-sm text-secondary" style="margin-bottom: 1.5rem;">per month</p>
      <ul style="list-style: none; padding: 0; text-align: left; margin-bottom: 1.5rem; font-size: var(--text-sm); color: var(--text-secondary);"><li style="padding: 0.375rem 0;">Unlimited projects</li><li style="padding: 0.375rem 0;">All tiers</li><li style="padding: 0.375rem 0;">Priority support</li></ul>
      <button class="btn btn-primary" style="width: 100%;">Select</button>
    </div></div>
    <div class="card"><div class="card-body" style="padding: 2rem;">
      <span class="badge" style="margin-bottom: 1rem;">Enterprise</span>
      <div style="font-size: var(--text-4xl); font-weight: var(--font-bold); margin-bottom: 0.5rem;">$99</div>
      <p class="text-sm text-secondary" style="margin-bottom: 1.5rem;">per month</p>
      <ul style="list-style: none; padding: 0; text-align: left; margin-bottom: 1.5rem; font-size: var(--text-sm); color: var(--text-secondary);"><li style="padding: 0.375rem 0;">Everything in Pro</li><li style="padding: 0.375rem 0;">Custom themes</li><li style="padding: 0.375rem 0;">Dedicated support</li></ul>
      <button class="btn btn-outline" style="width: 100%;">Contact Us</button>
    </div></div>
  </div>
</div>`;
}

// ---------------------------------------------------------------------------
// Template registry
// ---------------------------------------------------------------------------

const TEMPLATES: { id: string; label: string; render: () => string }[] = [
  { id: 'dashboard', label: 'Dashboard', render: dashboardTemplate },
  { id: 'landing', label: 'Landing Page', render: landingTemplate },
  { id: 'profile', label: 'Profile', render: profileTemplate },
  { id: 'pricing', label: 'Pricing', render: pricingTemplate },
];

// ---------------------------------------------------------------------------
// Page renderer
// ---------------------------------------------------------------------------

function readTierFromRoot(tier: string): string | null {
  return document.documentElement.getAttribute(`data-${tier}`);
}

export function renderExamples(): HTMLElement {
  const page = document.createElement('div');
  page.className = 'page-examples';

  // Header
  const header = document.createElement('div');
  header.innerHTML = `
    <div class="pt-2 mb-8" id="examples">
      <h2 class="text-4xl font-bold">Examples</h2>
      <p class="text-lg text-secondary mt-3">
        Full-page templates rendered with Soltana components.
        Use the tier controls to see every template adapt in real time.
      </p>
    </div>
  `;
  page.appendChild(header);

  // Layout: stacked previews on left, sticky sidebar on right
  const layout = document.createElement('div');
  layout.className = 'examples__layout';

  const previewColumn = document.createElement('div');
  previewColumn.className = 'examples__previews';

  const sidebar = document.createElement('div');
  sidebar.className = 'examples__sidebar';

  layout.appendChild(previewColumn);
  layout.appendChild(sidebar);
  page.appendChild(layout);

  // Initial tier state from the document root
  const state = {
    theme: readTierFromRoot('theme'),
    relief: readTierFromRoot('relief'),
    finish: readTierFromRoot('finish'),
  };

  // Create all template previews stacked vertically
  const previews: SolPreview[] = [];

  for (const tpl of TEMPLATES) {
    const section = document.createElement('div');
    section.className = 'examples__section';

    const label = document.createElement('h3');
    label.className = 'text-2xl font-semibold mb-3';
    label.textContent = tpl.label;

    const preview = document.createElement('sol-preview') as SolPreview;
    if (state.theme) preview.setAttribute('theme', state.theme);
    if (state.relief) preview.setAttribute('relief', state.relief);
    if (state.finish) preview.setAttribute('finish', state.finish);
    preview.content = tpl.render();

    previews.push(preview);
    section.appendChild(label);
    section.appendChild(preview);
    previewColumn.appendChild(section);
  }

  // Tier controls (sticky sidebar) — changes apply to all previews
  const tierControls = new TierControls(state, (next) => {
    for (const p of previews) {
      p.setTier('theme', next.theme);
      p.setTier('relief', next.relief);
      p.setTier('finish', next.finish);
    }
  });
  sidebar.appendChild(tierControls.getElement());

  // Scoped styles
  const style = document.createElement('style');
  style.textContent = `
    .examples__layout {
      display: grid;
      grid-template-columns: 1fr 18rem;
      gap: 1.5rem;
      align-items: start;
    }
    .examples__sidebar {
      position: sticky;
      top: 5rem;
    }
    .examples__previews {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }
    .examples__section sol-preview iframe {
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      width: 100%;
      overflow: hidden;
    }
    @media (width <= 768px) {
      .examples__layout {
        grid-template-columns: 1fr;
      }
      .examples__sidebar {
        position: static;
      }
    }
  `;
  page.appendChild(style);

  return page;
}
