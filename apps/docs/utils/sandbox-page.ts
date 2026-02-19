import { Sandbox } from '../components/Sandbox';
import type { TierName } from '@soltana/config';
import type { SandboxState } from '../lib/sandbox-state';

interface SandboxPageOptions {
  title: string;
  id: string;
  description: string;
  sandboxes: SandboxSection[];
}

interface SandboxSection {
  label: string;
  id: string;
  renderPreview: (state: SandboxState) => string;
  tiers?: TierName[];
}

/**
 * Build a standard component page with one or more Sandbox sections.
 * Returns an HTMLElement suitable for the Router.
 */
export function buildSandboxPage(options: SandboxPageOptions): HTMLElement {
  const page = document.createElement('div');
  page.className = `page-${options.id}`;

  // Page header
  const header = document.createElement('div');
  header.innerHTML = `
    <div class="section-heading" id="${options.id}">
      <h2 class="text-3xl font-bold">${options.title}</h2>
      <p class="text-secondary mt-2">${options.description}</p>
    </div>
    <div class="section-divider"></div>
  `;
  page.appendChild(header);

  // Sandbox sections
  for (const section of options.sandboxes) {
    const wrapper = document.createElement('div');
    wrapper.className = 'mt-8';

    const sectionHeader = document.createElement('h3');
    sectionHeader.className = 'text-xl font-semibold mb-4';
    sectionHeader.id = section.id;
    sectionHeader.textContent = section.label;
    wrapper.appendChild(sectionHeader);

    const sandbox = new Sandbox({
      id: section.id,
      renderPreview: section.renderPreview,
      tiers: section.tiers,
    });
    wrapper.appendChild(sandbox.getElement());

    page.appendChild(wrapper);
  }

  return page;
}

/**
 * Build a simple page from HTML string with optional Sandbox wrappers.
 * For pages that mix static content with sandboxed demos.
 */
export function buildHtmlPage(id: string, html: string): HTMLElement {
  const page = document.createElement('div');
  page.className = `page-${id}`;
  page.innerHTML = html;
  return page;
}
