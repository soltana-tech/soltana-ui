/** API Reference — Plugins: PostCSS tree-shake plugin for production builds. */

import {
  sectionHeading,
  codeExample,
  specimenBlock,
  quickNav,
  sectionDivider,
} from '../../lib/helpers';

export function renderApiPlugins(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-api-plugins">
  ${sectionHeading('PostCSS Plugin', 'api-plugins', 'Build-time plugin for optimizing Soltana output.')}

  ${quickNav([{ label: 'PostCSS Tree-Shake', href: '#postcss-treeshake' }])}

  ${sectionDivider()}

  <div id="postcss-treeshake">
    <h3 class="text-2xl font-bold mb-6">postcss-soltana-treeshake</h3>

    <p class="text-secondary mt-4 mb-6">
      A PostCSS plugin that strips CSS rules for unused built-in tier values
      from the compiled output. Only explicitly excluded built-in values are
      removed — custom tier values and non-tier selectors are never touched.
    </p>

    ${specimenBlock(
      'Installation',
      `
      <p class="text-secondary mb-4">
        The plugin ships as part of the <code>soltana-ui</code> package:
      </p>
      ${codeExample(`import soltanaTreeshake from 'soltana-ui/plugins';`, 'typescript')}
    `
    )}

    ${specimenBlock(
      'Options',
      `
      ${codeExample(
        `interface SoltanaTreeshakeOptions {
  themes?: TierConfig;
  reliefs?: TierConfig;
  finishes?: TierConfig;
}

interface TierConfig {
  include?: string[];  // Keep only these built-in values
  exclude?: string[];  // Remove these built-in values
}`,
        'typescript'
      )}

      <p class="text-secondary mt-4">
        For each tier, specify either <code>include</code> (allowlist) or
        <code>exclude</code> (blocklist). If both are provided, <code>exclude</code>
        is ignored.
      </p>
    `
    )}

    ${specimenBlock(
      'postcss.config.js',
      `
      ${codeExample(
        `import soltanaTreeshake from 'soltana-ui/plugins';

export default {
  plugins: [
    soltanaTreeshake({
      themes: { include: ['dark', 'light'] },
      reliefs: { exclude: ['glassmorphic'] },
    }),
  ],
};`,
        'javascript'
      )}

      <p class="text-secondary mt-4">
        This configuration keeps only <code>dark</code> and <code>light</code>
        theme rules, removes <code>glassmorphic</code> relief rules, and
        leaves all finishes intact.
      </p>
    `
    )}
  </div>
</div>`;
  return page;
}
