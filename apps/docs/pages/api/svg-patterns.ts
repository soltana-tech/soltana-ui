/** API Reference — SVG ornament patterns. */

import { sectionHeading, codeExample, specimenBlock } from '../../utils/helpers';

export function renderApiSvgPatterns(): string {
  return `
<div class="page-api-svg-patterns">
  ${sectionHeading('SVG Patterns', 'api-svg-patterns', 'Programmatic access to ornament SVG patterns.')}

  <p class="text-secondary mt-4 mb-6">
    The CSS ornament tier uses embedded SVGs internally. These utilities expose
    the same patterns for consumers who need dynamic or runtime access.
  </p>

  ${specimenBlock(
    'patterns',
    `
    <p class="text-secondary mb-4">
      A record mapping pattern names to factory functions. Each factory accepts
      an optional color string and returns a raw SVG string.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`const patterns: Record<PatternName, (color?: string) => string>`, 'typescript')}

    <h4 class="font-semibold mt-6 mb-2">PatternName</h4>
    ${codeExample(
      `type PatternName =
  | 'greek-key'
  | 'scrollwork'
  | 'dentil'
  | 'medallion'
  | 'corner'
  | 'faceted-divider'
  | 'faceted-corner';`,
      'typescript'
    )}

    <h4 class="font-semibold mt-6 mb-2">Available Patterns</h4>
    <div class="table-container">
      <table class="table table-striped">
        <thead>
          <tr><th>Name</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>'greek-key'</code></td><td>Repeating Greek key / meander border</td></tr>
          <tr><td><code>'scrollwork'</code></td><td>Ornate scroll flourish</td></tr>
          <tr><td><code>'dentil'</code></td><td>Classical dentil molding pattern</td></tr>
          <tr><td><code>'medallion'</code></td><td>Circular medallion centerpiece</td></tr>
          <tr><td><code>'corner'</code></td><td>Corner ornament for framing</td></tr>
          <tr><td><code>'faceted-divider'</code></td><td>Geometric faceted horizontal divider</td></tr>
          <tr><td><code>'faceted-corner'</code></td><td>Geometric faceted corner accent</td></tr>
        </tbody>
      </table>
    </div>

    <h4 class="font-semibold mt-6 mb-2">Color Parameter</h4>
    <p class="text-secondary mb-4">
      Each factory accepts an optional CSS color string. All standard CSS color
      formats are supported: hex (<code>#c9a84c</code>), <code>rgb()</code>,
      <code>hsl()</code>, <code>oklch()</code>, named colors, and
      <code>currentColor</code>. When omitted, patterns default to
      <code>currentColor</code>, inheriting from the element's computed color.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Example</h4>
    ${codeExample(
      `import { patterns } from '@soltana/ornaments';

const svg = patterns['greek-key']('#c9a84c');
// Returns raw SVG string: '<svg ...>...</svg>'

const defaultSvg = patterns['scrollwork']();
// Uses currentColor (inherits from parent element)`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'toDataUri()',
    `
    <p class="text-secondary mb-4">
      URL-encodes a raw SVG string into a <code>data:image/svg+xml,...</code> URI.
      Useful for CSS <code>background-image</code> or <code>&lt;img&gt;</code> src.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`function toDataUri(svg: string): string`, 'typescript')}

    <h4 class="font-semibold mt-6 mb-2">Example</h4>
    ${codeExample(
      `import { patterns, toDataUri } from '@soltana/ornaments';

const uri = toDataUri(patterns['dentil']('#888'));
element.style.backgroundImage = \`url("\${uri}")\`;`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'toElement()',
    `
    <p class="text-secondary mb-4">
      Parses a raw SVG string into a DOM <code>SVGElement</code> via
      <code>DOMParser</code>. Throws if the SVG is invalid.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`function toElement(svg: string): SVGElement`, 'typescript')}

    <h4 class="font-semibold mt-6 mb-2">Example</h4>
    ${codeExample(
      `import { patterns, toElement } from '@soltana/ornaments';

const el = toElement(patterns['medallion']('#gold'));
document.querySelector('.hero').appendChild(el);`,
      'typescript'
    )}
  `
  )}
</div>`;
}
