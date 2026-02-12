/** Examples page — Full-page composition layouts demonstrating real-world usage. */

export function renderExamples(): string {
  return `
<div class="page-examples">
  <div class="section-heading">
    <h2 class="text-3xl font-bold">Examples</h2>
    <p class="text-secondary mt-2">Full-page composition examples demonstrating how atoms, molecules, and organisms work together.</p>
  </div>

  <div class="flex flex-wrap gap-2 mt-6 mb-4">
    ${['Dashboard', 'Landing Hero', 'Glass Dashboard', 'Neuro Settings', 'Email Client']
      .map(
        (s) => `
      <a href="#example-${s.toLowerCase().replace(/\s+/g, '-')}" class="badge badge-pill">${s}</a>
    `
      )
      .join('')}
  </div>

  <!-- ====== DASHBOARD ====== -->
  <div class="specimen mt-10" id="example-dashboard">
    <h3 class="text-xl font-semibold mb-4">Dashboard Layout</h3>
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
                        <div style="width: 24px; height: ${String(h)}%; background: var(--accent-primary); border-radius: var(--radius-sm); opacity: ${String((h / 100) * 0.6 + 0.4)}"></div>
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
        <div class="relative overflow-hidden" style="background: linear-gradient(135deg, var(--dracula-bg) 0%, #1a1b26 100%); min-height: 480px">
          <!-- Decorative circles -->
          <div class="absolute" style="width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(189,147,249,0.15), transparent); top: -100px; right: -100px;"></div>
          <div class="absolute" style="width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(139,233,253,0.1), transparent); bottom: -80px; left: -80px;"></div>

          <!-- Navbar -->
          <nav class="flex items-center justify-between px-8 py-4 relative z-10">
            <span class="font-bold text-lg" style="color: #f8f8f2">Soltana</span>
            <div class="flex items-center gap-6">
              ${['Features', 'Pricing', 'Docs']
                .map(
                  (item) => `
                <a href="#" onclick="return false" class="text-sm font-medium" style="color: #c0c4d8">${item}</a>
              `
                )
                .join('')}
              <button class="btn btn-primary btn-sm">Get Started</button>
            </div>
          </nav>

          <!-- Hero content -->
          <div class="text-center px-8 pt-16 pb-20 relative z-10">
            <span class="badge badge-pill mb-4" style="background: rgba(189,147,249,0.2); color: #bd93f9; border: 1px solid rgba(189,147,249,0.3)">New Release v2.0</span>
            <h1 class="font-bold mb-4" style="font-size: 3.5rem; color: #f8f8f2; line-height: 1.1">Build beautiful<br/>interfaces <span style="color: #bd93f9">faster</span></h1>
            <p class="text-lg mb-8 mx-auto" style="max-width: 520px; color: #8890a8">A complete design system with components, utilities, and patterns for modern web applications.</p>
            <div class="flex justify-center gap-4">
              <button class="btn btn-primary btn-lg">Start Building</button>
              <button class="btn btn-outline btn-lg" style="border-color: rgba(248,248,242,0.2); color: #f8f8f2">View Docs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== GLASS DASHBOARD ====== -->
  <div class="specimen mt-10" id="example-glass-dashboard">
    <h3 class="text-xl font-semibold mb-4">Glassmorphic Dashboard</h3>
    <div class="card overflow-hidden">
      <div class="specimen__preview p-0">
        <div class="relative overflow-hidden p-6" style="background: linear-gradient(135deg, #1a1b3a, #2d1b4e, #1a2a3a); min-height: 420px;">
          <!-- Decorative blobs -->
          <div class="absolute" style="width: 250px; height: 250px; border-radius: 50%; background: rgba(189,147,249,0.3); filter: blur(60px); top: -50px; left: 20%;"></div>
          <div class="absolute" style="width: 200px; height: 200px; border-radius: 50%; background: rgba(255,121,198,0.2); filter: blur(50px); bottom: -30px; right: 15%;"></div>
          <div class="absolute" style="width: 150px; height: 150px; border-radius: 50%; background: rgba(139,233,253,0.15); filter: blur(40px); top: 40%; left: 60%;"></div>

          <div class="relative z-10">
            <!-- Glass navbar -->
            <div class="glass-card flex items-center justify-between mb-6 py-3 px-5" style="border-radius: var(--radius-xl)">
              <span class="font-bold" style="color: #fff">Analytics</span>
              <div class="flex gap-2">
                <button class="glass-button px-3 py-1 text-xs" style="color: #fff">Today</button>
                <button class="glass-button px-3 py-1 text-xs" style="color: #fff; background: rgba(189,147,249,0.3)">Week</button>
                <button class="glass-button px-3 py-1 text-xs" style="color: #fff">Month</button>
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
                <div class="glass-card">
                  <div class="flex items-center gap-3 mb-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(189,147,249,0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${s.icon}</svg>
                    <span class="text-xs" style="color: rgba(255,255,255,0.6)">${s.label}</span>
                  </div>
                  <p class="text-xl font-bold" style="color: #fff">${s.value}</p>
                </div>
              `
                )
                .join('')}
            </div>

            <!-- Glass chart area -->
            <div class="glass-card" style="min-height: 120px">
              <div class="flex items-end gap-3 justify-center" style="height: 100px">
                ${[30, 55, 40, 70, 50, 85, 65, 75, 45, 90, 60, 80]
                  .map(
                    (h) => `
                  <div style="width: 28px; height: ${String(h)}%; background: linear-gradient(to top, rgba(189,147,249,0.4), rgba(189,147,249,0.8)); border-radius: var(--radius-sm);"></div>
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

  <!-- ====== NEUMORPHIC SETTINGS ====== -->
  <div class="specimen mt-10" id="example-neuro-settings">
    <h3 class="text-xl font-semibold mb-4">Neumorphic Settings Panel</h3>
    <div class="card overflow-hidden">
      <div class="specimen__preview p-0">
        <div class="p-8" style="background: var(--neuro-bg); min-height: 400px">
          <h4 class="text-xl font-semibold mb-6">Settings</h4>
          <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))">
            <div class="neuro-card">
              <h5 class="font-semibold mb-4">Appearance</h5>
              <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm">Dark Mode</span>
                  <div class="neuro-toggle active"></div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">Compact View</span>
                  <div class="neuro-toggle"></div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">Animations</span>
                  <div class="neuro-toggle active"></div>
                </div>
              </div>
            </div>
            <div class="neuro-card">
              <h5 class="font-semibold mb-4">Notifications</h5>
              <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm">Email Alerts</span>
                  <div class="neuro-toggle active"></div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">Push Notifications</span>
                  <div class="neuro-toggle"></div>
                </div>
                <div>
                  <label class="text-sm block mb-2">Notification Sound</label>
                  <input class="neuro-input w-full" value="Default" />
                </div>
              </div>
            </div>
            <div class="neuro-card">
              <h5 class="font-semibold mb-4">Profile</h5>
              <div class="flex flex-col gap-3">
                <input class="neuro-input w-full" value="John Doe" />
                <input class="neuro-input w-full" value="john@example.com" />
                <button class="neuro-button px-4 py-2 text-sm font-medium mt-2">Save Changes</button>
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
                <li class="mb-1">Updated color palette based on the Dracula theme</li>
                <li class="mb-1">New typography using Space Grotesk</li>
                <li class="mb-1">Neumorphic and glassmorphic component variants</li>
                <li class="mb-1">Expanded spacing and layout system</li>
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

</div>
`;
}
