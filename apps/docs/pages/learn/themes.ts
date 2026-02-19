/** Design System — Themes page with isolated iframe previews. */

import type { SolPreview } from '../../components/SolPreview';

interface ThemeInfo {
  name: string;
  className: string;
  description: string;
}

const THEMES: ThemeInfo[] = [
  {
    name: 'Dark',
    className: 'dark',
    description: 'Deep navy surfaces with warm ivory text and gold accents. The default theme.',
  },
  {
    name: 'Light',
    className: 'light',
    description: 'Cool marble surfaces with blue-gray undertones and slate accents.',
  },
  {
    name: 'Sepia',
    className: 'sepia',
    description: 'Warm champagne surfaces with espresso text and brown accents.',
  },
];

function themePreviewContent(): string {
  return `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div>
        <h2 style="font-size: var(--text-2xl); font-weight: var(--font-bold); margin-bottom: 0.5rem;">Heading</h2>
        <p style="color: var(--text-secondary);">Body text demonstrating the theme's text hierarchy and surface colors.</p>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <button class="btn btn-primary">Primary</button>
        <button class="btn btn-secondary">Secondary</button>
        <button class="btn btn-ghost">Ghost</button>
        <button class="btn btn-outline">Outline</button>
        <button class="btn btn-danger">Danger</button>
        <button class="btn btn-success">Success</button>
      </div>
      <div class="card">
        <div class="card-header">Card Header</div>
        <div class="card-body">
          <p style="margin-bottom: 0.75rem;">Card body with nested components.</p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span class="badge badge-primary">Primary</span>
            <span class="badge badge-success">Success</span>
            <span class="badge badge-warning">Warning</span>
            <span class="badge badge-error">Error</span>
            <span class="tag">Tag</span>
          </div>
        </div>
      </div>
      <div style="display: flex; gap: 1rem;">
        <input class="input" type="text" placeholder="Text input" style="flex: 1;" />
        <button class="toggle active" style="flex-shrink: 0;"></button>
      </div>
      <div class="alert alert-info">Informational alert message.</div>
      <nav class="nav">
        <a class="nav-item active">Home</a>
        <a class="nav-item">About</a>
        <a class="nav-item">Contact</a>
      </nav>
    </div>`;
}

export function renderThemes(): HTMLElement {
  const page = document.createElement('div');
  page.className = 'page-themes';

  // Header
  const header = document.createElement('div');
  header.innerHTML = `
    <div class="pt-2 mb-8" id="themes">
      <h2 class="text-4xl font-bold">Themes</h2>
      <p class="text-lg text-secondary mt-3">Color schemes that define the visual identity of every surface, text, and accent token. Each preview below is fully isolated so you can see the true theme appearance.</p>
    </div>
  `;
  page.appendChild(header);

  // Theme previews — each in an isolated <sol-preview> iframe
  const grid = document.createElement('div');
  grid.className = 'flex flex-col gap-8 mt-6';

  for (const theme of THEMES) {
    const section = document.createElement('div');

    const label = document.createElement('div');
    label.className = 'flex items-center gap-3 mb-3';
    label.innerHTML = `
      <h3 class="text-2xl font-semibold">${theme.name}</h3>
      <code class="text-sm text-muted font-mono">.theme-${theme.className}</code>
    `;

    const desc = document.createElement('p');
    desc.className = 'text-base text-secondary mb-4';
    desc.textContent = theme.description;

    const preview = document.createElement('sol-preview') as SolPreview;
    preview.setAttribute('theme', theme.className);
    preview.content = themePreviewContent();

    section.appendChild(label);
    section.appendChild(desc);
    section.appendChild(preview);
    grid.appendChild(section);
  }

  page.appendChild(grid);

  // Auto theme section
  const autoSection = document.createElement('div');
  autoSection.className = 'card p-6 rounded-xl mt-10';
  autoSection.innerHTML = `
    <h3 class="text-xl font-semibold mb-4">Auto Theme</h3>
    <p class="text-secondary mb-4">
      The <code>'auto'</code> theme resolves to <code>'dark'</code> or
      <code>'light'</code> based on the user's <code>prefers-color-scheme</code>
      media query. It is a runtime resolver, not a static token set.
    </p>
    <div class="mt-3">
      <pre class="text-sm rounded-lg overflow-x-auto"><code class="language-typescript">const soltana = initSoltana({ theme: 'auto' });</code></pre>
    </div>
  `;
  page.appendChild(autoSection);

  // Override classes section
  const overrideSection = document.createElement('div');
  overrideSection.className = 'card p-6 rounded-xl mt-8';
  overrideSection.innerHTML = `
    <h3 class="text-xl font-semibold mb-4">Per-Element Overrides</h3>
    <p class="text-secondary">
      Apply <code>.theme-*</code> utility classes to override the global theme
      on any element. The element and its descendants receive the alternate
      color scheme. See <a href="#/api/config" style="color: var(--accent-primary);">Configuration</a> for runtime registration of custom themes.
    </p>
  `;
  page.appendChild(overrideSection);

  // Iframe styles
  const style = document.createElement('style');
  style.textContent = `
    .page-themes sol-preview iframe {
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      width: 100%;
      overflow: hidden;
    }
  `;
  page.appendChild(style);

  return page;
}
