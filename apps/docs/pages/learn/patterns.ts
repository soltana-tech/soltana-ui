/** Patterns page — Organism-level compositions. */

import { sectionHeading, quickNavFromLabels } from '../../utils/helpers';

export function renderPatterns(): string {
  return `
<div class="page-patterns">
  ${sectionHeading('Patterns', 'patterns', 'Organism-level compositions combining atoms and molecules into reusable layouts.')}

  ${quickNavFromLabels(
    [
      'Navbar',
      'Sidebar',
      'Login Form',
      'Registration',
      'Contact Form',
      'Data Table',
      'Feature Section',
      'Pricing Cards',
      'Stats Grid',
    ],
    'pattern-'
  )}

  <!-- ====== NAVBAR ====== -->
  <div class="specimen mt-10" id="pattern-navbar">
    <h3 class="text-xl font-semibold mb-4">Navigation Bar</h3>
    <div class="card overflow-hidden">
      <div class="specimen__preview p-0">
        <nav class="flex items-center justify-between px-6 py-3" style="background: var(--surface-1); border-bottom: 1px solid var(--border-default)">
          <div class="flex items-center gap-6">
            <span class="font-bold text-lg">Acme Inc</span>
            <div class="nav hidden" style="display: flex">
              <button class="nav-item active">Dashboard</button>
              <button class="nav-item">Projects</button>
              <button class="nav-item">Team</button>
              <button class="nav-item">Settings</button>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="btn btn-ghost btn-sm tooltip" data-tooltip="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </button>
            <div class="avatar avatar-sm" style="background: var(--color-success); color: var(--text-inverse)">JD</div>
          </div>
        </nav>
      </div>
    </div>
  </div>

  <!-- ====== SIDEBAR ====== -->
  <div class="specimen mt-10" id="pattern-sidebar">
    <h3 class="text-xl font-semibold mb-4">Sidebar Navigation</h3>
    <div class="card overflow-hidden">
      <div class="specimen__preview p-0">
        <div class="flex" style="min-height: 360px">
          <aside class="flex flex-col p-4 gap-1" style="width: 240px; background: var(--surface-1); border-right: 1px solid var(--border-default)">
            <div class="flex items-center gap-2 px-3 py-2 mb-4">
              <div class="avatar avatar-sm">S</div>
              <span class="font-semibold text-sm">Soltana</span>
            </div>
            <p class="text-xs font-medium text-muted uppercase tracking-wider px-3 mb-1">Main</p>
            <button class="nav-item active text-left" style="text-align: left">
              <span class="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                Dashboard
              </span>
            </button>
            <button class="nav-item text-left" style="text-align: left">
              <span class="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Team
              </span>
            </button>
            <button class="nav-item text-left" style="text-align: left">
              <span class="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                Documents
              </span>
            </button>
            <p class="text-xs font-medium text-muted uppercase tracking-wider px-3 mt-4 mb-1">Settings</p>
            <button class="nav-item text-left" style="text-align: left">
              <span class="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                Preferences
              </span>
            </button>
          </aside>
          <div class="flex-1 p-6">
            <h4 class="text-lg font-semibold mb-2">Dashboard</h4>
            <p class="text-secondary text-sm">Main content area alongside the sidebar navigation.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== LOGIN FORM ====== -->
  <div class="specimen mt-10" id="pattern-login-form">
    <h3 class="text-xl font-semibold mb-4">Login Form</h3>
    <div class="card">
      <div class="specimen__preview flex justify-center">
        <div class="w-full" style="max-width: 380px">
          <div class="text-center mb-6">
            <div class="avatar avatar-lg mx-auto mb-3" style="background: var(--accent-primary)">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h4 class="text-xl font-semibold">Welcome back</h4>
            <p class="text-sm text-muted mt-1">Sign in to your account</p>
          </div>
          <form onsubmit="return false">
            <div class="input-group mb-4">
              <label class="input-label">Email</label>
              <input type="email" class="input" placeholder="user@example.com" />
            </div>
            <div class="input-group mb-4">
              <label class="input-label">Password</label>
              <input type="password" class="input" placeholder="Enter password" />
            </div>
            <div class="flex items-center justify-between mb-6">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" class="checkbox" />
                <span class="text-sm">Remember me</span>
              </label>
              <a href="#" class="text-sm text-accent" onclick="return false">Forgot password?</a>
            </div>
            <button class="btn btn-primary w-full">Sign In</button>
            <p class="text-center text-sm text-muted mt-4">
              No account? <a href="#" class="text-accent" onclick="return false">Create one</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== REGISTRATION FORM ====== -->
  <div class="specimen mt-10" id="pattern-registration">
    <h3 class="text-xl font-semibold mb-4">Registration Form</h3>
    <div class="card">
      <div class="specimen__preview flex justify-center">
        <div class="w-full" style="max-width: 480px">
          <h4 class="text-xl font-semibold mb-1">Create Account</h4>
          <p class="text-sm text-muted mb-6">Fill in the details below to get started.</p>
          <form onsubmit="return false">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="input-group">
                <label class="input-label">First Name</label>
                <input type="text" class="input" placeholder="Alice" />
              </div>
              <div class="input-group">
                <label class="input-label">Last Name</label>
                <input type="text" class="input" placeholder="Chen" />
              </div>
            </div>
            <div class="input-group mb-4">
              <label class="input-label">Email</label>
              <input type="email" class="input" placeholder="alice@example.com" />
            </div>
            <div class="input-group mb-4">
              <label class="input-label">Password</label>
              <input type="password" class="input" placeholder="Min 8 characters" />
              <span class="input-help">Use a mix of letters, numbers, and symbols.</span>
            </div>
            <div class="input-group mb-4">
              <label class="input-label">Role</label>
              <select class="select">
                <option>Developer</option>
                <option>Designer</option>
                <option>Product Manager</option>
                <option>Other</option>
              </select>
            </div>
            <label class="flex items-start gap-2 mb-6 cursor-pointer">
              <input type="checkbox" class="checkbox mt-1" />
              <span class="text-sm text-secondary">I agree to the Terms of Service and Privacy Policy.</span>
            </label>
            <button class="btn btn-primary w-full">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== CONTACT FORM ====== -->
  <div class="specimen mt-10" id="pattern-contact-form">
    <h3 class="text-xl font-semibold mb-4">Contact Form</h3>
    <div class="card">
      <div class="specimen__preview flex justify-center">
        <div class="w-full" style="max-width: 520px">
          <h4 class="text-xl font-semibold mb-1">Get in touch</h4>
          <p class="text-sm text-muted mb-6">Send a message and expect a response within 24 hours.</p>
          <form onsubmit="return false">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="input-group">
                <label class="input-label">Name</label>
                <input type="text" class="input" placeholder="Your name" />
              </div>
              <div class="input-group">
                <label class="input-label">Email</label>
                <input type="email" class="input" placeholder="you@example.com" />
              </div>
            </div>
            <div class="input-group mb-4">
              <label class="input-label">Subject</label>
              <input type="text" class="input" placeholder="How can we help?" />
            </div>
            <div class="input-group mb-6">
              <label class="input-label">Message</label>
              <textarea class="textarea" placeholder="Tell us more..." style="min-height: 120px"></textarea>
            </div>
            <button class="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== DATA TABLE ====== -->
  <div class="specimen mt-10" id="pattern-data-table">
    <h3 class="text-xl font-semibold mb-4">Data Table with Controls</h3>
    <div class="card">
      <div class="card-header flex items-center justify-between flex-wrap gap-3">
        <div>
          <span class="font-semibold">Team Members</span>
          <span class="badge badge-pill ml-2">24</span>
        </div>
        <div class="flex items-center gap-2">
          <input type="text" class="input input-sm" placeholder="Search..." style="max-width: 200px" />
          <button class="btn btn-primary btn-sm">Add Member</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th><input type="checkbox" class="checkbox" /></th>
              <th>Member</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${[
              {
                name: 'Alice Chen',
                email: 'alice@acme.io',
                role: 'Admin',
                status: 'Active',
                date: 'Jan 12, 2026',
                initials: 'AC',
                color: 'var(--accent-primary)',
              },
              {
                name: 'Bob Martin',
                email: 'bob@acme.io',
                role: 'Editor',
                status: 'Active',
                date: 'Feb 3, 2026',
                initials: 'BM',
                color: 'var(--color-info)',
              },
              {
                name: 'Carol Davis',
                email: 'carol@acme.io',
                role: 'Viewer',
                status: 'Away',
                date: 'Mar 18, 2025',
                initials: 'CD',
                color: 'var(--color-success)',
              },
              {
                name: 'Dan Lopez',
                email: 'dan@acme.io',
                role: 'Editor',
                status: 'Offline',
                date: 'Nov 5, 2025',
                initials: 'DL',
                color: 'var(--color-warning)',
              },
            ]
              .map(
                (u) => `
              <tr>
                <td><input type="checkbox" class="checkbox" /></td>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="avatar avatar-sm" style="background: ${u.color}; color: var(--text-inverse)">${u.initials}</div>
                    <span class="font-medium">${u.name}</span>
                  </div>
                </td>
                <td class="text-secondary">${u.email}</td>
                <td><span class="badge">${u.role}</span></td>
                <td><span class="badge badge-${u.status === 'Active' ? 'success' : u.status === 'Away' ? 'warning' : 'error'}">${u.status}</span></td>
                <td class="text-secondary">${u.date}</td>
                <td><button class="btn btn-ghost btn-xs">Edit</button></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
      <div class="card-footer flex items-center justify-between">
        <span class="text-sm text-muted">Showing 1-4 of 24</span>
        <div class="btn-group">
          <button class="btn btn-outline btn-xs">Prev</button>
          <button class="btn btn-outline btn-xs">1</button>
          <button class="btn btn-primary btn-xs">2</button>
          <button class="btn btn-outline btn-xs">3</button>
          <button class="btn btn-outline btn-xs">Next</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== FEATURE SECTION ====== -->
  <div class="specimen mt-10" id="pattern-feature-section">
    <h3 class="text-xl font-semibold mb-4">Feature Section</h3>
    <div class="card">
      <div class="specimen__preview">
        <div class="text-center mb-10">
          <span class="badge badge-primary badge-pill mb-3">Features</span>
          <h3 class="text-3xl font-bold mb-2">Everything you need</h3>
          <p class="text-secondary max-w-prose mx-auto">A comprehensive toolkit for building modern applications with a consistent design language.</p>
        </div>
        <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))">
          ${[
            {
              icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
              title: 'Real-time Updates',
              desc: 'Changes propagate instantly across all connected components.',
            },
            {
              icon: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
              title: 'Enterprise Security',
              desc: 'Built-in authentication, RBAC, and data encryption.',
            },
            {
              icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
              title: 'Performance First',
              desc: 'Optimized for speed with minimal runtime overhead.',
            },
            {
              icon: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
              title: 'Composable Design',
              desc: 'Mix and match components to build any interface.',
            },
            {
              icon: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
              title: 'Internationalized',
              desc: 'RTL support, translation-ready with flexible locale handling.',
            },
            {
              icon: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
              title: 'Responsive',
              desc: 'Adapts seamlessly from mobile to wide desktop screens.',
            },
          ]
            .map(
              (f) => `
            <div class="card card-hover">
              <div class="card-body">
                <div class="p-2 rounded-lg inline-flex mb-3" style="background: var(--color-info-subtle)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${f.icon}</svg>
                </div>
                <h4 class="font-semibold mb-1">${f.title}</h4>
                <p class="text-sm text-secondary">${f.desc}</p>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- ====== PRICING CARDS ====== -->
  <div class="specimen mt-10" id="pattern-pricing-cards">
    <h3 class="text-xl font-semibold mb-4">Pricing Cards</h3>
    <div class="card">
      <div class="specimen__preview">
        <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))">
          ${[
            {
              name: 'Starter',
              price: '$0',
              period: '/month',
              desc: 'For individuals getting started.',
              features: ['5 projects', '1GB storage', 'Community support', 'Basic analytics'],
              cta: 'btn-outline',
              label: 'Get Started',
            },
            {
              name: 'Pro',
              price: '$29',
              period: '/month',
              desc: 'For growing teams and businesses.',
              features: [
                'Unlimited projects',
                '50GB storage',
                'Priority support',
                'Advanced analytics',
                'Team collaboration',
                'Custom domains',
              ],
              cta: 'btn-primary',
              label: 'Start Free Trial',
              featured: true,
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              period: '',
              desc: 'For large-scale organizations.',
              features: [
                'Everything in Pro',
                'Unlimited storage',
                'Dedicated support',
                'SLA guarantee',
                'SSO / SAML',
                'Audit logs',
              ],
              cta: 'btn-outline',
              label: 'Contact Sales',
            },
          ]
            .map(
              (plan) => `
            <div class="card ${plan.featured ? 'border-accent' : ''}" style="${plan.featured ? 'border: 2px solid var(--accent-primary)' : ''}">
              <div class="card-body text-center">
                ${plan.featured ? '<span class="badge badge-primary badge-pill mb-3">Most Popular</span>' : ''}
                <h4 class="text-lg font-semibold">${plan.name}</h4>
                <div class="mt-2 mb-1">
                  <span class="text-4xl font-bold">${plan.price}</span>
                  <span class="text-muted">${plan.period}</span>
                </div>
                <p class="text-sm text-secondary mb-4">${plan.desc}</p>
                <ul class="text-sm text-left mb-6" style="list-style: none; padding: 0;">
                  ${plan.features
                    .map(
                      (f) => `<li class="flex items-center gap-2 py-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    ${f}
                  </li>`
                    )
                    .join('')}
                </ul>
                <button class="btn ${plan.cta} w-full">${plan.label}</button>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- ====== STATS GRID ====== -->
  <div class="specimen mt-10" id="pattern-stats-grid">
    <h3 class="text-xl font-semibold mb-4">Stats Grid</h3>
    <div class="card">
      <div class="specimen__preview">
        <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
          ${[
            { label: 'Total Revenue', value: '$48,290', change: '+12.5%', up: true },
            { label: 'Active Users', value: '2,847', change: '+8.2%', up: true },
            { label: 'Conversion Rate', value: '3.24%', change: '-0.8%', up: false },
            { label: 'Avg. Order Value', value: '$67.40', change: '+4.1%', up: true },
          ]
            .map(
              (stat) => `
            <div class="card">
              <div class="card-body">
                <p class="text-sm text-muted mb-1">${stat.label}</p>
                <p class="text-2xl font-bold mb-1">${stat.value}</p>
                <span class="text-sm ${stat.up ? 'text-success' : 'text-error'}">${stat.change}</span>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
  </div>

</div>
`;
}
