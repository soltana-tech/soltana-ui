/** API Reference — Font loading. */

import { sectionHeading, codeExample, specimenBlock } from '../../utils/helpers';

export function renderApiFonts(): string {
  return `
<div class="page-api-fonts">
  ${sectionHeading('Font Loading', 'api-fonts', "Load Soltana's typography stack at runtime.")}

  ${specimenBlock(
    'loadSoltanaFonts()',
    `
    <p class="text-secondary mb-4">
      Injects a font stylesheet <code>&lt;link&gt;</code> into <code>&lt;head&gt;</code>.
      When the URL points to <code>fonts.googleapis.com</code>, preconnect hints
      are also injected automatically. Safe to call multiple times — subsequent
      calls are no-ops.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`function loadSoltanaFonts(url?: string): void`, 'typescript')}

    <h4 class="font-semibold mt-6 mb-2">Parameters</h4>
    <div class="table-container">
      <table class="table table-striped">
        <thead>
          <tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>url</code></td>
            <td><code>string</code></td>
            <td><code>DEFAULT_FONT_URL</code></td>
            <td>Font CSS URL. Defaults to the bundled Google Fonts URL.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h4 class="font-semibold mt-6 mb-2">Example</h4>
    ${codeExample(
      `import { loadSoltanaFonts } from '@soltana/fonts';

// Use the bundled Google Fonts URL
loadSoltanaFonts();

// Or provide a custom font source
loadSoltanaFonts('https://fonts.example.com/custom.css');`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'DEFAULT_FONT_URL',
    `
    <p class="text-secondary mb-4">
      The default Google Fonts URL bundled with Soltana. Includes all weights
      needed for the design system.
    </p>

    ${codeExample(`const DEFAULT_FONT_URL: string`, 'typescript')}

    <h4 class="font-semibold mt-6 mb-2">Included Fonts</h4>
    <div class="table-container">
      <table class="table table-striped">
        <thead>
          <tr><th>Font Family</th><th>Weights</th><th>Role</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Cinzel</strong></td>
            <td>400–900</td>
            <td>Display / heading serif</td>
          </tr>
          <tr>
            <td><strong>Cinzel Decorative</strong></td>
            <td>400, 700, 900</td>
            <td>Ornamental display serif</td>
          </tr>
          <tr>
            <td><strong>Raleway</strong></td>
            <td>100–900 (+ italic 400, 500)</td>
            <td>Body / UI sans-serif</td>
          </tr>
          <tr>
            <td><strong>JetBrains Mono</strong></td>
            <td>400, 500, 600</td>
            <td>Code / monospace</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h4 class="font-semibold mt-6 mb-2">CSS Token</h4>
    <p class="text-secondary">
      Soltana respects the <code>--font-display</code> custom property for
      controlling <code>font-display</code> behavior when self-hosting fonts.
    </p>
  `
  )}
</div>`;
}
