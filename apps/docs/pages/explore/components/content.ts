/** Content component reference — cards, badges, avatars, callouts, code, figures, images, and links. */

import { sectionHeading, specimen, quickNavFromLabels, sectionDivider } from '../../../lib/helpers';

const NAV_LABELS = [
  'Cards',
  'Badges & Tags',
  'Avatars',
  'Callouts & Blockquotes',
  'Code',
  'Figures',
  'Images',
  'Links',
];

function classTable(rows: [string, string][]): string {
  return `
    <div class="table-responsive">
      <table class="table table-sm">
        <thead><tr><th>Class</th><th>Description</th></tr></thead>
        <tbody>
          ${rows.map(([cls, desc]) => `<tr><td><code>${cls}</code></td><td>${desc}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

export function renderContentRef(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-content-ref">

  ${sectionHeading('Content', 'content', 'Cards, badges, avatars, callouts, code blocks, figures, images, and links.')}
  ${quickNavFromLabels(NAV_LABELS, 'content-')}

  ${sectionDivider()}

  <!-- Cards -->
  <h3 class="text-2xl font-semibold mt-10 mb-2" id="content-cards">Cards</h3>
  <p class="text-secondary mb-4">Surface containers with optional header, body, and footer regions. Tier-aware — shadow and surface treatment adapt to the active relief and finish.</p>

  ${classTable([
    ['.card', 'Base card container with surface color and border'],
    ['.card-hover', 'Adds hover elevation and transition'],
    ['.card-beveled', 'Beveled edge treatment'],
    ['.card-flat', 'Removes shadow and border for a flat appearance'],
    ['.card-image', 'Full-bleed image card variant'],
    ['.card-header', 'Card header region'],
    ['.card-body', 'Card body / main content region'],
    ['.card-footer', 'Card footer region'],
  ])}

  ${specimen(
    'Card with header, body, and footer',
    'content-cards-specimen',
    `
    <div class="card card-hover" style="max-width: 320px;">
      <div class="card-header">Card Header</div>
      <div class="card-body">Card content goes here.</div>
      <div class="card-footer">
        <button class="btn btn-primary btn-sm">Action</button>
      </div>
    </div>
  `,
    `<div class="card card-hover">
  <div class="card-header">Card Header</div>
  <div class="card-body">Card content goes here.</div>
  <div class="card-footer">
    <button class="btn btn-primary btn-sm">Action</button>
  </div>
</div>`
  )}

  ${sectionDivider()}

  <!-- Badges & Tags -->
  <h3 class="text-2xl font-semibold mt-10 mb-2" id="content-badges-&-tags">Badges & Tags</h3>
  <p class="text-secondary mb-4">Inline status indicators, labels, and categorization tokens.</p>

  ${classTable([
    ['.badge', 'Base badge'],
    ['.badge-primary', 'Primary accent color'],
    ['.badge-success', 'Success / positive state'],
    ['.badge-warning', 'Warning / caution state'],
    ['.badge-error', 'Error / danger state'],
    ['.badge-info', 'Informational state'],
    ['.badge-pill', 'Fully rounded pill shape'],
    ['.tag', 'Neutral content tag'],
    ['.chip', 'Base chip (interactive tag)'],
    ['.chip-success', 'Success chip variant'],
    ['.chip-warning', 'Warning chip variant'],
    ['.chip-error', 'Error chip variant'],
    ['.chip-info', 'Info chip variant'],
  ])}

  ${specimen(
    'Badges, tags, and chips',
    'content-badges-specimen',
    `
    <div class="flex flex-wrap gap-3 items-center">
      <span class="badge badge-primary">Primary</span>
      <span class="badge badge-pill badge-success">Success</span>
      <span class="badge badge-warning">Warning</span>
      <span class="badge badge-error">Error</span>
      <span class="badge badge-info">Info</span>
      <span class="tag">Tag</span>
      <span class="chip">Chip</span>
      <span class="chip chip-success">Success</span>
    </div>
  `,
    `<span class="badge badge-primary">Primary</span>
<span class="badge badge-pill badge-success">Success</span>
<span class="tag">Tag</span>
<span class="chip">Chip</span>`
  )}

  ${sectionDivider()}

  <!-- Avatars -->
  <h3 class="text-2xl font-semibold mt-10 mb-2" id="content-avatars">Avatars</h3>
  <p class="text-secondary mb-4">Circular identity placeholders in multiple sizes with optional cameo and group layouts.</p>

  ${classTable([
    ['.avatar', 'Base avatar (default medium size)'],
    ['.avatar-sm', 'Small avatar'],
    ['.avatar-lg', 'Large avatar'],
    ['.avatar-xl', 'Extra-large avatar'],
    ['.avatar-cameo', 'Cameo variant with accent border'],
    ['.avatar-group', 'Overlapping group container for multiple avatars'],
  ])}

  ${specimen(
    'Avatar sizes',
    'content-avatars-specimen',
    `
    <div class="flex items-center gap-4">
      <div class="avatar avatar-sm">SM</div>
      <div class="avatar">MD</div>
      <div class="avatar avatar-lg">LG</div>
      <div class="avatar avatar-xl">XL</div>
    </div>
  `,
    `<div class="avatar avatar-sm">SM</div>
<div class="avatar">MD</div>
<div class="avatar avatar-lg">LG</div>
<div class="avatar avatar-xl">XL</div>`
  )}

  ${sectionDivider()}

  <!-- Callouts & Blockquotes -->
  <h3 class="text-2xl font-semibold mt-10 mb-2" id="content-callouts-&-blockquotes">Callouts & Blockquotes</h3>
  <p class="text-secondary mb-4">Highlighted content blocks for emphasis, warnings, and attributed quotations.</p>

  ${classTable([
    ['.callout', 'Base callout container'],
    ['.callout-info', 'Informational callout'],
    ['.callout-warning', 'Warning callout'],
    ['.callout-success', 'Success callout'],
    ['.callout-important', 'Important / critical callout'],
    ['.callout-note', 'Note callout'],
    ['.callout-tip', 'Tip callout'],
    ['.callout-title', 'Callout title element'],
    ['.callout-content', 'Callout body content'],
    ['.blockquote', 'Styled blockquote'],
    ['.blockquote-footer', 'Attribution line for blockquote'],
  ])}

  ${specimen(
    'Callout',
    'content-callouts-specimen',
    `
    <div class="callout callout-info">
      <div class="callout-title">Note</div>
      <div class="callout-content">Informational callout content.</div>
    </div>
    <div class="callout callout-warning mt-4">
      <div class="callout-title">Warning</div>
      <div class="callout-content">Proceed with caution.</div>
    </div>
  `,
    `<div class="callout callout-info">
  <div class="callout-title">Note</div>
  <div class="callout-content">Informational callout content.</div>
</div>`
  )}

  ${specimen(
    'Blockquote',
    'content-blockquote-specimen',
    `
    <blockquote class="blockquote">
      Quote text here.
      <footer class="blockquote-footer">Attribution</footer>
    </blockquote>
  `,
    `<blockquote class="blockquote">
  Quote text here.
  <footer class="blockquote-footer">Attribution</footer>
</blockquote>`
  )}

  ${sectionDivider()}

  <!-- Code -->
  <h3 class="text-2xl font-semibold mt-10 mb-2" id="content-code">Code</h3>
  <p class="text-secondary mb-4">Inline code tokens and multi-line code blocks with optional line numbering.</p>

  ${classTable([
    ['.code', 'Inline code span'],
    ['.code-block', 'Block-level code container'],
    ['.code-block-numbered', 'Code block with line numbers'],
    ['.code-block-sm', 'Compact code block'],
    ['.code-line', 'Individual line within a code block'],
  ])}

  ${specimen(
    'Inline and block code',
    'content-code-specimen',
    `
    <p class="mb-4">Use the <span class="code">inline code</span> class for tokens in running text.</p>
    <div class="code-block"><code>const greeting = "Hello, Soltana";\nconsole.log(greeting);</code></div>
  `,
    `<span class="code">inline code</span>
<div class="code-block"><code>block code</code></div>`
  )}

  ${sectionDivider()}

  <!-- Figures -->
  <h3 class="text-2xl font-semibold mt-10 mb-2" id="content-figures">Figures</h3>
  <p class="text-secondary mb-4">Captioned media containers for images and visual content.</p>

  ${classTable([
    ['.figure', 'Base figure wrapper'],
    ['.figure-card', 'Figure with card-style surface'],
    ['.figure-img', 'Figure image element'],
    ['.figure-caption', 'Caption below the figure'],
    ['.figure-caption-center', 'Center-aligned caption'],
  ])}

  ${specimen(
    'Figure with caption',
    'content-figures-specimen',
    `
    <figure class="figure" style="max-width: 320px;">
      <div class="figure-img" style="width:100%;height:120px;background:var(--accent-primary);border-radius:var(--radius-md);"></div>
      <figcaption class="figure-caption">Caption text</figcaption>
    </figure>
  `,
    `<figure class="figure">
  <div class="figure-img" style="width:100%;height:120px;background:var(--accent-primary);border-radius:var(--radius-md);"></div>
  <figcaption class="figure-caption">Caption text</figcaption>
</figure>`
  )}

  ${sectionDivider()}

  <!-- Images -->
  <h3 class="text-2xl font-semibold mt-10 mb-2" id="content-images">Images</h3>
  <p class="text-secondary mb-4">Shape and aspect-ratio treatments for image elements.</p>

  ${classTable([
    ['.img-thumbnail', 'Bordered thumbnail with padding'],
    ['.img-rounded', 'Rounded corners'],
    ['.img-circle', 'Circular crop'],
    ['.aspect-ratio', 'Base aspect-ratio container'],
    ['.aspect-ratio-photo', '4:3 photo aspect ratio'],
    ['.aspect-ratio-square', '1:1 square aspect ratio'],
    ['.aspect-ratio-video', '16:9 video aspect ratio'],
  ])}

  ${specimen(
    'Image shapes',
    'content-images-specimen',
    `
    <div class="flex flex-wrap gap-4 items-center">
      <div class="img-thumbnail" style="width:100px;height:72px;background:var(--accent-primary);"></div>
      <div class="img-rounded" style="width:100px;height:72px;background:var(--accent-decorative);"></div>
      <div class="img-circle" style="width:72px;height:72px;background:var(--accent-primary);"></div>
    </div>
  `,
    `<div class="img-thumbnail" style="width:100px;height:72px;background:var(--accent-primary);"></div>
<div class="img-rounded" style="width:100px;height:72px;background:var(--accent-decorative);"></div>
<div class="img-circle" style="width:72px;height:72px;background:var(--accent-primary);"></div>`
  )}

  ${sectionDivider()}

  <!-- Links -->
  <h3 class="text-2xl font-semibold mt-10 mb-2" id="content-links">Links</h3>
  <p class="text-secondary mb-4">Styled anchor variants for accent, muted, and plain text links.</p>

  ${classTable([
    ['.link', 'Accent-colored link with underline on hover'],
    ['.link-muted', 'Subdued link using muted text color'],
    ['.link-plain', 'Unstyled link inheriting parent text color'],
  ])}

  ${specimen(
    'Link variants',
    'content-links-specimen',
    `
    <div class="flex flex-wrap gap-6 items-center">
      <a class="link" href="javascript:void(0)">Accent link</a>
      <a class="link-muted" href="javascript:void(0)">Muted link</a>
      <a class="link-plain" href="javascript:void(0)">Plain link</a>
    </div>
  `,
    `<a class="link" href="javascript:void(0)">Accent link</a>
<a class="link-muted" href="javascript:void(0)">Muted link</a>
<a class="link-plain" href="javascript:void(0)">Plain link</a>`
  )}

</div>`;
  return page;
}
