/** Examples page — Full-page composition layouts demonstrating real-world usage. */

import { sectionHeading, quickNavFromLabels } from '../utils/helpers';

export function renderExamples(): string {
  return `
<div class="page-examples">
  ${sectionHeading('Examples', 'examples', 'Composition examples demonstrating the design system in context. All examples respond to theme and settings changes.')}

  ${quickNavFromLabels(
    [
      'Dashboard',
      'Landing Hero',
      'Analytics',
      'Settings Panel',
      'Email Client',
      'Marketing Landing',
      'Metrics Dashboard',
    ],
    'example-'
  )}

  <!-- ====== DASHBOARD ====== -->
  <div class="specimen mt-10" id="example-dashboard">
    <h3 class="text-xl font-semibold mb-4">Dashboard Layout</h3>
    <p class="text-sm text-muted mb-4">This example responds to the Relief, Finish, and Ornament settings. Try changing them!</p>
    <div class="card overflow-hidden">
      <div class="specimen__preview p-0">
        <div class="flex" style="min-height: 520px">
          <!-- Sidebar -->
          <aside class="flex flex-col p-3 gap-1 shrink-0" style="width: 200px; background: var(--surface-1); border-right: 1px solid var(--border-default)">
            <div class="flex items-center gap-2 px-2 py-2 mb-3">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="var(--accent-primary)"/><path d="M8 22V10l8 6-8 6z" fill="white"/><path d="M16 22V10l8 6-8 6z" fill="white" opacity="0.6"/></svg>
              <span class="font-semibold text-sm">Dashboard</span>
            </div>
            ${['Overview', 'Analytics', 'Customers', 'Products', 'Orders']
              .map(
                (item, i) => `
              <button class="nav-item ${i === 0 ? 'active' : ''}" style="text-align: left; font-size: var(--text-sm);">${item}</button>
            `
              )
              .join('')}
            <div class="mt-auto pt-4 border-t" style="border-color: var(--border-subtle)">
              <button class="nav-item" style="text-align: left; font-size: var(--text-sm);">Settings</button>
            </div>
          </aside>

          <!-- Main content -->
          <div class="flex-1 overflow-auto">
            <!-- Top bar -->
            <div class="flex items-center justify-between px-6 py-3" style="border-bottom: 1px solid var(--border-default)">
              <h4 class="font-semibold">Overview</h4>
              <div class="flex items-center gap-3">
                <input type="text" class="input input-sm" placeholder="Search..." style="max-width: 180px" />
                <div class="avatar avatar-sm">JD</div>
              </div>
            </div>

            <div class="p-6">
              <!-- Stats row -->
              <div class="grid gap-4 mb-6" style="grid-template-columns: repeat(4, 1fr)">
                ${[
                  { label: 'Revenue', value: '$24.5k', badge: '+12%', color: 'success' },
                  { label: 'Orders', value: '1,247', badge: '+8%', color: 'success' },
                  { label: 'Visitors', value: '18.3k', badge: '-3%', color: 'error' },
                  { label: 'Conversion', value: '2.4%', badge: '+1.2%', color: 'success' },
                ]
                  .map(
                    (s) => `
                  <div class="card">
                    <div class="card-body p-4">
                      <p class="text-xs text-muted mb-1">${s.label}</p>
                      <div class="flex items-end justify-between">
                        <span class="text-xl font-bold">${s.value}</span>
                        <span class="badge badge-${s.color} text-xs">${s.badge}</span>
                      </div>
                    </div>
                  </div>
                `
                  )
                  .join('')}
              </div>

              <!-- Chart placeholder + Recent orders -->
              <div class="grid gap-6" style="grid-template-columns: 2fr 1fr">
                <div class="card">
                  <div class="card-header">Revenue Overview</div>
                  <div class="card-body flex items-center justify-center" style="min-height: 200px">
                    <div class="flex items-end gap-2" style="height: 160px">
                      ${[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88]
                        .map(
                          (h) => `
                        <div style="width: 24px; height: ${String(h)}%; background: linear-gradient(to top, var(--accent-primary), var(--accent-secondary)); border-radius: var(--radius-sm); opacity: ${String((h / 100) * 0.6 + 0.4)}"></div>
                      `
                        )
                        .join('')}
                    </div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-header">Recent Orders</div>
                  <div class="card-body p-0">
                    ${[
                      { id: '#1234', amount: '$89.00', status: 'Completed' },
                      { id: '#1233', amount: '$142.50', status: 'Processing' },
                      { id: '#1232', amount: '$55.00', status: 'Completed' },
                      { id: '#1231', amount: '$210.00', status: 'Pending' },
                    ]
                      .map(
                        (o) => `
                      <div class="flex items-center justify-between px-4 py-3" style="border-bottom: 1px solid var(--border-subtle)">
                        <div>
                          <p class="text-sm font-medium">${o.id}</p>
                          <p class="text-xs text-muted">${o.amount}</p>
                        </div>
                        <span class="badge badge-${o.status === 'Completed' ? 'success' : o.status === 'Processing' ? 'info' : 'warning'} text-xs">${o.status}</span>
                      </div>
                    `
                      )
                      .join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== LANDING HERO ====== -->
  <div class="specimen mt-10" id="example-landing-hero">
    <h3 class="text-xl font-semibold mb-4">Landing Page Hero</h3>
    <div class="card overflow-hidden">
      <div class="specimen__preview p-0">
        <div class="relative overflow-hidden" style="background: var(--surface-bg); min-height: 520px">
          <!-- Atmospheric gradient blobs -->
          <div class="absolute" style="width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, var(--color-info-subtle), transparent); top: -150px; right: -100px;"></div>
          <div class="absolute" style="width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, var(--color-info-subtle), transparent); bottom: -120px; left: -80px;"></div>
          <div class="absolute" style="width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, var(--color-success-subtle), transparent); top: 40%; left: 50%;"></div>

          <!-- Glass navbar -->
          <nav class="flex items-center justify-between px-8 py-4 relative z-10" style="backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-subtle)">
            <span class="font-serif text-xl font-semibold">Soltana</span>
            <div class="flex items-center gap-6">
              ${['Features', 'Pricing', 'Docs']
                .map(
                  (item) => `
                <a href="#" onclick="return false" class="text-sm font-medium tracking-refined text-secondary">${item}</a>
              `
                )
                .join('')}
              <button class="btn btn-primary btn-sm">Get Started</button>
            </div>
          </nav>

          <!-- Hero content -->
          <div class="text-center px-8 pt-20 pb-24 relative z-10">
            <span class="overline mb-4 inline-block" style="color: var(--accent-secondary)">New Release v2.0</span>
            <h1 class="font-serif mb-6" style="font-size: 4rem; line-height: 1.05; font-weight: 600;">Build beautiful<br/>interfaces <span style="background: linear-gradient(135deg, var(--accent-secondary), var(--accent-primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">effortlessly</span></h1>
            <p class="text-lg mb-10 mx-auto text-secondary" style="max-width: 520px; letter-spacing: 0.02em;">A complete design system with flat, soft, lifted, neumorphic, sharp, and hewn reliefs for prestigious web applications.</p>
            <div class="flex justify-center gap-4">
              <button class="btn btn-primary btn-lg">Start Building</button>
              <button class="btn btn-outline btn-lg">View Docs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== ANALYTICS ====== -->
  <div class="specimen mt-10" id="example-analytics">
    <h3 class="text-xl font-semibold mb-4">Analytics Dashboard</h3>
    <div class="card overflow-hidden">
      <div class="specimen__preview p-0">
        <div class="relative overflow-hidden p-6" style="background: var(--surface-bg); min-height: 420px;">
          <!-- Decorative blobs -->
          <div class="absolute" style="width: 250px; height: 250px; border-radius: 50%; background: var(--color-info-subtle); filter: blur(60px); top: -50px; left: 20%;"></div>
          <div class="absolute" style="width: 200px; height: 200px; border-radius: 50%; background: var(--color-success-subtle); filter: blur(50px); bottom: -30px; right: 15%;"></div>
          <div class="absolute" style="width: 150px; height: 150px; border-radius: 50%; background: var(--color-warning-subtle); filter: blur(40px); top: 40%; left: 60%;"></div>

          <div class="relative z-10">
            <!-- Glass navbar -->
            <div class="card flex items-center justify-between mb-6 py-3 px-5" style="border-radius: var(--radius-xl)">
              <span class="font-serif font-semibold">Analytics</span>
              <div class="flex gap-2">
                <button class="btn btn-ghost btn-xs">Today</button>
                <button class="btn btn-primary btn-xs">Week</button>
                <button class="btn btn-ghost btn-xs">Month</button>
              </div>
            </div>

            <!-- Glass stat cards -->
            <div class="grid gap-4 mb-6" style="grid-template-columns: repeat(3, 1fr)">
              ${[
                {
                  label: 'Total Users',
                  value: '12,847',
                  icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
                },
                {
                  label: 'Revenue',
                  value: '$84.2k',
                  icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
                },
                {
                  label: 'Growth',
                  value: '+24.5%',
                  icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
                },
              ]
                .map(
                  (s) => `
                <div class="card p-5" style="border-radius: var(--radius-xl)">
                  <div class="flex items-center gap-3 mb-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${s.icon}</svg>
                    <span class="text-xs text-muted">${s.label}</span>
                  </div>
                  <p class="text-xl font-bold">${s.value}</p>
                </div>
              `
                )
                .join('')}
            </div>

            <!-- Glass chart area -->
            <div class="card" style="min-height: 120px; border-radius: var(--radius-xl); padding: 1.25rem">
              <div class="flex items-end gap-3 justify-center" style="height: 100px">
                ${[30, 55, 40, 70, 50, 85, 65, 75, 45, 90, 60, 80]
                  .map(
                    (h) => `
                  <div style="width: 28px; height: ${String(h)}%; background: linear-gradient(to top, var(--accent-primary), var(--accent-secondary)); border-radius: var(--radius-sm);"></div>
                `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== SETTINGS PANEL ====== -->
  <div class="specimen mt-10" id="example-settings-panel">
    <h3 class="text-xl font-semibold mb-4">Settings Panel</h3>
    <div class="card overflow-hidden">
      <div class="specimen__preview p-0">
        <div class="p-8" style="background: var(--neu-bg); min-height: 400px">
          <h4 class="font-serif text-2xl font-semibold mb-6">Settings</h4>
          <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))">
            <div class="neu-elevated" style="padding: 1.5rem">
              <h5 class="font-semibold mb-4">Appearance</h5>
              <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm">Dark Mode</span>
                  <div class="neu-toggle active"></div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">Compact View</span>
                  <div class="neu-toggle"></div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">Animations</span>
                  <div class="neu-toggle active"></div>
                </div>
              </div>
            </div>
            <div class="neu-elevated" style="padding: 1.5rem">
              <h5 class="font-semibold mb-4">Notifications</h5>
              <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm">Email Alerts</span>
                  <div class="neu-toggle active"></div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">Push Notifications</span>
                  <div class="neu-toggle"></div>
                </div>
                <div>
                  <label class="text-sm block mb-2">Notification Sound</label>
                  <input class="input relief-neu w-full" value="Default" />
                </div>
              </div>
            </div>
            <div class="neu-elevated" style="padding: 1.5rem">
              <h5 class="font-semibold mb-4">Profile</h5>
              <div class="flex flex-col gap-3">
                <input class="input relief-neu w-full" value="John Doe" />
                <input class="input relief-neu w-full" value="john@example.com" />
                <button class="btn relief-neu px-4 py-2 text-sm font-medium mt-2">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== EMAIL CLIENT ====== -->
  <div class="specimen mt-10" id="example-email-client">
    <h3 class="text-xl font-semibold mb-4">Email Client Layout</h3>
    <p class="text-sm text-muted mb-4">This example also responds to Relief, Finish, and Ornament settings.</p>
    <div class="card overflow-hidden">
      <div class="specimen__preview p-0">
        <div class="flex" style="min-height: 440px">
          <!-- Email list -->
          <div class="shrink-0 overflow-auto" style="width: 340px; border-right: 1px solid var(--border-default)">
            <div class="px-4 py-3" style="border-bottom: 1px solid var(--border-default)">
              <input type="text" class="input input-sm" placeholder="Search mail..." />
            </div>
            ${[
              {
                from: 'Design Team',
                subject: 'Updated brand guidelines',
                preview: 'Hi team, the new brand guidelines are ready for review...',
                time: '10:32 AM',
                unread: true,
              },
              {
                from: 'Alice Chen',
                subject: 'Sprint planning notes',
                preview: "Here are the action items from today's planning session...",
                time: '9:15 AM',
                unread: true,
              },
              {
                from: 'CI Pipeline',
                subject: 'Build #847 passed',
                preview: 'All tests passed. Deployment to staging complete.',
                time: 'Yesterday',
                unread: false,
              },
              {
                from: 'Bob Martin',
                subject: 'Re: API review',
                preview: "Looks good to me. I'd suggest adding rate limiting...",
                time: 'Yesterday',
                unread: false,
              },
              {
                from: 'HR Department',
                subject: 'Q1 Review Schedule',
                preview: 'Performance reviews will begin next week...',
                time: 'Mon',
                unread: false,
              },
            ]
              .map(
                (email, i) => `
              <div class="px-4 py-3 cursor-pointer transition" style="border-bottom: 1px solid var(--border-subtle); ${i === 0 ? 'background: var(--state-active)' : ''}" >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm ${email.unread ? 'font-semibold' : 'font-medium text-secondary'}">${email.from}</span>
                  <span class="text-xs text-muted">${email.time}</span>
                </div>
                <p class="text-sm ${email.unread ? 'font-medium' : 'text-secondary'} mb-1">${email.subject}</p>
                <p class="text-xs text-muted truncate">${email.preview}</p>
              </div>
            `
              )
              .join('')}
          </div>

          <!-- Email content -->
          <div class="flex-1 overflow-auto">
            <div class="px-6 py-4" style="border-bottom: 1px solid var(--border-default)">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-lg font-semibold">Updated brand guidelines</h4>
                <div class="flex gap-2">
                  <button class="btn btn-ghost btn-sm">Reply</button>
                  <button class="btn btn-ghost btn-sm">Forward</button>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="avatar avatar-sm" style="background: var(--dracula-cyan); color: var(--dracula-bg)">DT</div>
                <div>
                  <span class="text-sm font-medium">Design Team</span>
                  <span class="text-xs text-muted ml-2">&lt;design@acme.io&gt;</span>
                </div>
              </div>
            </div>
            <div class="px-6 py-4 max-w-prose">
              <p class="mb-4 text-secondary">Hi team,</p>
              <p class="mb-4 text-secondary">The new brand guidelines are ready for review. Key changes include:</p>
              <ul class="mb-4 text-secondary" style="list-style: disc; padding-left: 1.5rem">
                <li class="mb-1">Deeper atmospheric dark palette</li>
                <li class="mb-1">Serif/sans dual typography with Cormorant Garamond</li>
                <li class="mb-1">Six relief variants: flat, soft, lifted, neumorphic, sharp, and hewn</li>
                <li class="mb-1">Gradient background utilities and refined spacing</li>
              </ul>
              <p class="mb-4 text-secondary">Review the attached design system documentation and share feedback by Friday.</p>
              <p class="text-secondary">Best regards,<br/>Design Team</p>

              <div class="mt-6 p-3 rounded-lg flex items-center gap-3" style="background: var(--surface-2)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                <div>
                  <p class="text-sm font-medium">brand-guidelines-v2.pdf</p>
                  <p class="text-xs text-muted">2.4 MB</p>
                </div>
                <button class="btn btn-ghost btn-xs ml-auto">Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== MARKETING LANDING ====== -->
  <div class="specimen mt-10" id="example-marketing-landing">
    <h3 class="text-xl font-semibold mb-4 font-serif">Marketing Landing</h3>
    <p class="text-sm text-muted mb-4">A landing page with feature highlights and call-to-action sections.</p>
    <div class="card overflow-hidden">
      <div class="specimen__preview p-0">
        <div class="relative overflow-hidden" style="background: var(--surface-bg); min-height: 600px">
          <!-- Gold atmospheric glow -->
          <div class="absolute" style="width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, var(--color-success-subtle), transparent 60%); top: -200px; right: -100px;"></div>
          <div class="absolute" style="width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, var(--color-info-subtle), transparent 60%); bottom: -150px; left: -100px;"></div>

          <div class="relative z-10 px-8 py-12">
            <div class="text-center mb-16">
              <p class="overline mb-6" style="color: var(--accent-gold)">Soltana Design System</p>
              <h1 class="font-serif mb-6" style="font-size: 4.5rem; line-height: 1.05; font-weight: 700; letter-spacing: 0.08em; background: linear-gradient(135deg, var(--gold-300), var(--gold-500)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                Prestige in<br/>Every Pixel
              </h1>
              <p class="text-lg mx-auto mb-10 text-secondary" style="max-width: 480px; letter-spacing: 0.02em;">
                A refined design system merging classical elegance with modern depth.
              </p>
              <div class="flex gap-4 justify-center">
                <button class="btn btn-gold btn-lg">Explore</button>
                <button class="btn btn-outline btn-lg">Documentation</button>
              </div>
            </div>

            <div class="ornament-divider-scrollwork mb-12"></div>

            <div class="grid gap-6" style="grid-template-columns: repeat(3, 1fr); max-width: 900px; margin: 0 auto;">
              ${[
                {
                  title: 'Polished Stone',
                  desc: 'Multi-layer shadows create tactile, three-dimensional surfaces.',
                  icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
                },
                {
                  title: 'Crystal Glass',
                  desc: 'Frosted translucency with tinted borders and warm inner glow.',
                  icon: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
                },
                {
                  title: 'Classical Ornament',
                  desc: 'Scrollwork and patterns inspired by estate architecture.',
                  icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
                },
              ]
                .map(
                  (f) => `
                <div class="card" style="padding: 1.5rem; border-radius: var(--radius-xl);">
                  <svg class="mb-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${f.icon}</svg>
                  <h4 class="font-semibold text-base mb-2 font-serif">${f.title}</h4>
                  <p class="text-sm text-secondary">${f.desc}</p>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== METRICS DASHBOARD ====== -->
  <div class="specimen mt-10" id="example-metrics-dashboard">
    <h3 class="text-xl font-semibold mb-4 font-serif">Metrics Dashboard</h3>
    <p class="text-sm text-muted mb-4">A dashboard with KPI cards and trend visualization.</p>
    <div class="card overflow-hidden">
      <div class="specimen__preview p-0">
        <div class="relative overflow-hidden" style="background: var(--surface-bg); min-height: 500px">
          <div class="absolute" style="width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, var(--color-success-subtle), transparent); top: -100px; left: 10%;"></div>

          <div class="relative z-10 p-6">
            <div class="card mb-6" style="padding: 1rem 1.5rem; border-radius: var(--radius-xl)">
              <div class="flex items-center justify-between">
                <div>
                  <p class="overline" style="color: var(--accent-gold)">Overview</p>
                  <h3 class="font-serif text-2xl font-bold">Estate Analytics</h3>
                </div>
                <div class="flex gap-2">
                  <button class="btn btn-ghost btn-xs">7D</button>
                  <button class="btn btn-outline btn-xs">30D</button>
                  <button class="btn btn-ghost btn-xs">90D</button>
                </div>
              </div>
            </div>

            <div class="grid gap-4 mb-6" style="grid-template-columns: repeat(4, 1fr)">
              ${[
                { label: 'Revenue', value: '$148.2k', change: '+18.3%', up: true },
                { label: 'Users', value: '24,847', change: '+12.7%', up: true },
                { label: 'Conversion', value: '4.28%', change: '+0.6%', up: true },
                { label: 'Churn', value: '1.2%', change: '-0.3%', up: false },
              ]
                .map(
                  (s) => `
                <div class="card" style="padding: 1rem 1.25rem; border-radius: var(--radius-xl);">
                  <p class="text-xs mb-1" style="color: var(--accent-gold)">${s.label}</p>
                  <p class="text-xl font-bold mb-1">${s.value}</p>
                  <span class="text-xs" style="color: ${s.up ? 'var(--color-success)' : 'var(--color-error)'}">${s.change}</span>
                </div>
              `
                )
                .join('')}
            </div>

            <div class="card" style="padding: 1.5rem; border-radius: var(--radius-xl);">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-semibold font-serif">Revenue Trend</h4>
              </div>
              <div class="flex items-end gap-2 justify-center" style="height: 140px">
                ${[35, 55, 42, 68, 52, 78, 62, 82, 58, 90, 72, 85]
                  .map(
                    (h, i) => `
                  <div style="display: flex; flex-direction: column; gap: 2px; align-items: center; flex: 1;">
                    <div style="width: 100%; height: ${String(h)}%; max-width: 32px; background: linear-gradient(to top, var(--accent-primary), var(--accent-gold)); border-radius: var(--radius-sm);"></div>
                    <span class="text-xs text-muted" style="font-size: 0.6rem">${['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
`;
}
