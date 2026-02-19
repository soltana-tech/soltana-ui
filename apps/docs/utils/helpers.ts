/**
 * Shared helper functions for documentation pages.
 * Extracted to avoid duplication across page renderers.
 */

/** Escape HTML special characters for safe rendering inside code blocks. */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Renders a section heading with optional description.
 */
export function sectionHeading(title: string, id: string, description?: string): string {
  return `
    <div class="pt-2 mb-8" id="${id}">
      <h2 class="text-3xl font-bold">${title}</h2>
      ${description ? `<p class="text-secondary mt-2">${description}</p>` : ''}
    </div>`;
}

/**
 * Renders a quick navigation badge list.
 */
export function quickNav(items: { label: string; href: string }[]): string {
  return `
    <div class="flex flex-wrap gap-2 mt-6 mb-4">
      ${items.map((item) => `<a href="${item.href}" class="badge badge-pill">${item.label}</a>`).join('')}
    </div>`;
}

/**
 * Builds quickNav items from a list of labels with a shared href prefix.
 * Slugifies each label (lowercase, spaces to hyphens).
 */
export function quickNavFromLabels(labels: string[], hrefPrefix: string): string {
  return quickNav(
    labels.map((label) => ({
      label,
      href: `#${hrefPrefix}${label.toLowerCase().replace(/\s+/g, '-')}`,
    }))
  );
}

/**
 * Renders a specimen block container.
 */
export function specimenBlock(title: string, content: string, className = ''): string {
  return `
    <div class="card p-6 rounded-xl mt-8 ${className}">
      <h3 class="text-lg font-semibold mb-4">${title}</h3>
      ${content}
    </div>`;
}

/**
 * Renders a specimen card with optional code footer.
 */
export function specimen(title: string, id: string, content: string, code?: string): string {
  return `
    <div class="mt-10" id="${id}">
      <h3 class="text-xl font-semibold mb-4">${title}</h3>
      <div class="card rounded-xl overflow-hidden">
        <div class="p-6">
          ${content}
        </div>
        ${code ? `<div class="border-t border-subtle p-4"><pre class="text-sm overflow-x-auto"><code>${escapeHtml(code)}</code></pre></div>` : ''}
      </div>
    </div>`;
}

/**
 * Renders a code example block.
 */
export function codeExample(code: string, language = 'html'): string {
  return `
    <div class="mt-3">
      <pre class="text-sm rounded-lg overflow-x-auto"><code class="language-${language}">${escapeHtml(code)}</code></pre>
    </div>`;
}

/**
 * Renders a decorative divider.
 */
export function ornamentDivider(): string {
  return '<hr class="border-t border-subtle my-12 opacity-30" />';
}
