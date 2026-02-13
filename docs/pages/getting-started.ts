/** Getting Started page — 4-tier system overview, installation, configuration. */

import {
  codeExample,
  ornamentDivider,
  quickNav,
  sectionHeading,
  specimenBlock,
} from '../utils/helpers';

export function renderGettingStarted(): string {
  return `
<div class="page-getting-started">

  ${sectionHeading('The 4-Tier System', 'four-tier', 'Soltana layers four independent dimensions of visual design. Each tier can be changed independently, creating hundreds of unique combinations.')}

  ${quickNav([
    { label: '4-Tier System', href: '#four-tier' },
    { label: 'Installation', href: '#installation' },
    { label: 'Quick Start', href: '#quick-start' },
    { label: 'Configuration', href: '#configuration' },
  ])}

  <div class="grid gap-6 mt-8" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))">
    <div class="tier-demo" style="border-left: 4px solid var(--accent-primary);">
      <span class="tier-number" style="color: var(--accent-primary);">1</span>
      <h4 class="font-semibold text-lg">Theme</h4>
      <p class="text-sm text-secondary">The foundational color palette and tone.</p>
      <div class="flex flex-wrap gap-2 mt-2">
        <span class="tag tag-gold">dark</span>
        <span class="tag">light</span>
        <span class="tag">sepia</span>
      </div>
      ${codeExample("soltana.setTheme('dark')", 'javascript')}
    </div>
    <div class="tier-demo" style="border-left: 4px solid var(--gold-400);">
      <span class="tier-number" style="color: var(--gold-400);">2</span>
      <h4 class="font-semibold text-lg">Material</h4>
      <p class="text-sm text-secondary">Transforms how every component renders: shadows, blur, transparency.</p>
      <div class="flex flex-wrap gap-2 mt-2">
        <span class="tag">flat</span>
        <span class="tag">soft</span>
        <span class="tag tag-gold">neu</span>
        <span class="tag">glass</span>
        <span class="tag">metallic</span>
        <span class="tag">stone</span>
      </div>
      ${codeExample("soltana.setMaterial('neu')", 'javascript')}
    </div>
    <div class="tier-demo" style="border-left: 4px solid var(--jewel-sapphire, #3b82f6);">
      <span class="tier-number" style="color: var(--jewel-sapphire, #3b82f6);">3</span>
      <h4 class="font-semibold text-lg">Surface</h4>
      <p class="text-sm text-secondary">Texture and finish applied on top of the material.</p>
      <div class="flex flex-wrap gap-2 mt-2">
        <span class="tag tag-sapphire">polished</span>
        <span class="tag">frosted</span>
        <span class="tag">stained</span>
        <span class="tag">metallic</span>
      </div>
      ${codeExample("soltana.setSurface('polished')", 'javascript')}
    </div>
    <div class="tier-demo" style="border-left: 4px solid var(--jewel-emerald, #10b981);">
      <span class="tier-number" style="color: var(--jewel-emerald, #10b981);">4</span>
      <h4 class="font-semibold text-lg">Ornament</h4>
      <p class="text-sm text-secondary">Decorative structural accents layered onto elements.</p>
      <div class="flex flex-wrap gap-2 mt-2">
        <span class="tag tag-emerald">none</span>
        <span class="tag">baroque</span>
        <span class="tag">carved</span>
        <span class="tag">faceted</span>
        <span class="tag">gilt</span>
      </div>
      ${codeExample("soltana.setOrnament('gilt')", 'javascript')}
    </div>
  </div>

  ${specimenBlock(
    'Config is the Single Source of Truth',
    `
    <p class="text-sm text-secondary mb-4">Define defaults once in your config. All components automatically inherit them. Use override classes only for per-element exceptions:</p>
    ${codeExample("// Initialize with your defaults\nconst soltana = initSoltana({\n  theme: 'dark',\n  material: 'neu',\n  surface: 'polished',\n  ornament: 'none',\n});\n\n// All components now use these defaults\n// No data attributes needed!", 'javascript')}
    ${codeExample('<!-- Components use global config -->\n<button class="btn btn-primary">Uses Global Material</button>\n<div class="card p-6">Uses Global Material</div>\n\n<!-- Override specific elements when needed -->\n<button class="btn material-glass">Glass Override</button>\n<div class="card surface-frosted p-6">Frosted Override</div>', 'html')}
  `
  )}

  ${ornamentDivider()}

  ${sectionHeading('Installation', 'installation', 'Add Soltana to your project via npm or CDN.')}

  ${specimenBlock(
    'npm / yarn',
    `
    ${codeExample('# npm\nnpm install soltana-ui\n\n# yarn\nyarn add soltana-ui\n\n# pnpm\npnpm add soltana-ui', 'bash')}
    <p class="text-sm text-secondary mt-4">Then import in your JavaScript/TypeScript:</p>
    ${codeExample("// Import styles\nimport 'soltana-ui/css';\n\n// Import and initialize\nimport { initSoltana } from 'soltana-ui';\n\nconst soltana = initSoltana({\n  theme: 'dark',\n  material: 'neu',\n  surface: 'polished',\n  ornament: 'none',\n});", 'javascript')}
  `
  )}

  ${specimenBlock(
    'CDN',
    `
    <p class="text-sm text-secondary mb-4">For quick prototyping or static sites:</p>
    ${codeExample('<!-- CSS only -->\n<link rel="stylesheet" href="https://unpkg.com/soltana-ui/dist/soltana-ui.css">\n\n<!-- With JavaScript -->\n<script type="module">\n  import { initSoltana } from "https://unpkg.com/soltana-ui";\n  const soltana = initSoltana({ theme: "dark", material: "neu" });\n</script>', 'html')}
  `
  )}

  ${ornamentDivider()}

  ${sectionHeading('Quick Start', 'quick-start', 'Get up and running in minutes.')}

  ${specimenBlock(
    'Basic HTML Template',
    `
    ${codeExample('<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Soltana App</title>\n  <link rel="stylesheet" href="https://unpkg.com/soltana-ui/dist/soltana-ui.css">\n</head>\n<body>\n  <div class="container mx-auto p-8">\n    <h1 class="text-4xl font-serif mb-4">Welcome</h1>\n    <p class="text-secondary mb-6">Your elegant application starts here.</p>\n    <div class="flex gap-3">\n      <button class="btn btn-primary">Get Started</button>\n      <button class="btn btn-secondary">Learn More</button>\n    </div>\n  </div>\n\n  <script type="module">\n    import { initSoltana } from "https://unpkg.com/soltana-ui";\n    const soltana = initSoltana({\n      theme: "dark",\n      material: "neu",\n      surface: "polished",\n      ornament: "none",\n    });\n  </script>\n</body>\n</html>', 'html')}
  `
  )}

  ${ornamentDivider()}

  ${sectionHeading('Configuration', 'configuration', 'Customize Soltana to match your brand.')}

  ${specimenBlock(
    'soltana.config.js',
    `
    <p class="text-sm text-secondary mb-4">Create a configuration file in your project:</p>
    ${codeExample("// soltana.config.js\nexport default {\n  // Base presets (required)\n  theme: 'dark',        // 'light' | 'dark' | 'sepia'\n  material: 'neu',   // 'flat' | 'soft' | 'neu' | 'glass' | 'metallic' | 'stone'\n  surface: 'polished',  // 'polished' | 'frosted' | 'stained' | 'metallic'\n  ornament: 'none',     // 'none' | 'baroque' | 'carved' | 'faceted' | 'gilt'\n  fonts: true,          // opt-in: injects Google Fonts <link> into <head>\n  \n  // Variable overrides (optional)\n  overrides: {\n    '--accent-primary': '#ff6b6b',\n    '--gold-400': '#e8c547',\n    '--surface-bg': '#0a0a12',\n  },\n};", 'javascript')}
    <p class="text-sm text-secondary mt-4">Then initialize with your config:</p>
    ${codeExample("import config from './soltana.config.js';\nimport { initSoltana } from 'soltana-ui';\n\nconst soltana = initSoltana(config);", 'javascript')}
  `
  )}

  ${specimenBlock(
    'Runtime API',
    `
    <p class="text-sm text-secondary mb-4">Change tiers at runtime for user preferences or dynamic theming:</p>
    ${codeExample("// Get current state\nconsole.log(soltana.getState());\n// { theme: 'dark', material: 'neu', surface: 'polished', ornament: 'none' }\n\n// Change individual tiers\nsoltana.setTheme('light');\nsoltana.setMaterial('glass');\nsoltana.setSurface('frosted');\nsoltana.setOrnament('baroque');\n\n// Apply custom variable overrides\nsoltana.setOverrides({\n  '--accent-primary': '#your-brand-color',\n});\n\n// Reset to defaults\nsoltana.reset();", 'javascript')}
  `
  )}

  ${specimenBlock(
    'CSS Custom Properties',
    `
    <p class="text-sm text-secondary mb-4">Override any design token using CSS custom properties:</p>
    ${codeExample(':root {\n  --accent-primary: #your-brand-color;\n  --accent-gold: #your-gold-tone;\n  --font-serif: "Your Serif Font", serif;\n  --font-sans: "Your Sans Font", sans-serif;\n}', 'css')}
  `
  )}

</div>
`;
}
