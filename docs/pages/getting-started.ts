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
        <span class="tag">dark</span>
        <span class="tag">light</span>
        <span class="tag">sepia</span>
        <span class="tag">auto</span>
      </div>
      ${codeExample("soltana.setTheme('dark')", 'javascript')}
    </div>
    <div class="tier-demo" style="border-left: 4px solid var(--accent-primary);">
      <span class="tier-number" style="color: var(--accent-primary);">2</span>
      <h4 class="font-semibold text-lg">Relief</h4>
      <p class="text-sm text-secondary">Transforms how every component renders: shadows, blur, transparency.</p>
      <div class="flex flex-wrap gap-2 mt-2">
        <span class="tag">flat</span>
        <span class="tag">soft</span>
        <span class="tag">lifted</span>
        <span class="tag">neu</span>
        <span class="tag">sharp</span>
        <span class="tag">hewn</span>
      </div>
      ${codeExample("soltana.setRelief('neu')", 'javascript')}
    </div>
    <div class="tier-demo" style="border-left: 4px solid var(--accent-primary);">
      <span class="tier-number" style="color: var(--accent-primary);">3</span>
      <h4 class="font-semibold text-lg">Finish</h4>
      <p class="text-sm text-secondary">Texture and finish applied on top of the relief.</p>
      <div class="flex flex-wrap gap-2 mt-2">
        <span class="tag">matte</span>
        <span class="tag">translucent</span>
        <span class="tag">frosted</span>
        <span class="tag">tinted</span>
        <span class="tag">glossy</span>
      </div>
      ${codeExample("soltana.setFinish('matte')", 'javascript')}
    </div>
    <div class="tier-demo" style="border-left: 4px solid var(--accent-primary);">
      <span class="tier-number" style="color: var(--accent-primary);">4</span>
      <h4 class="font-semibold text-lg">Ornament</h4>
      <p class="text-sm text-secondary">Decorative structural accents layered onto elements.</p>
      <div class="flex flex-wrap gap-2 mt-2">
        <span class="tag">none</span>
        <span class="tag">gilt</span>
        <span class="tag">baroque</span>
        <span class="tag">beveled</span>
        <span class="tag">faceted</span>
      </div>
      ${codeExample("soltana.setOrnament('gilt')", 'javascript')}
    </div>
  </div>

  ${specimenBlock(
    'Config is the Single Source of Truth',
    `
    <p class="text-sm text-secondary mb-4">Define defaults once in your config. All components automatically inherit them. Use override classes only for per-element exceptions:</p>
    ${codeExample("// Initialize with your defaults\nconst soltana = initSoltana({\n  theme: 'dark',\n  relief: 'neu',\n  finish: 'matte',\n  ornament: 'none',\n});\n\n// All components now use these defaults\n// No data attributes needed!", 'javascript')}
    ${codeExample('<!-- Components use global config -->\n<button class="btn btn-primary">Uses Global Relief</button>\n<div class="card p-6">Uses Global Relief</div>\n\n<!-- Override specific elements when needed -->\n<button class="btn relief-lifted">Lifted Override</button>\n<div class="card finish-frosted p-6">Frosted Override</div>', 'html')}
  `
  )}

  ${ornamentDivider()}

  ${sectionHeading('Installation', 'installation', 'Add Soltana to your project via npm or CDN.')}

  ${specimenBlock(
    'npm / yarn',
    `
    ${codeExample('# npm\nnpm install soltana-ui\n\n# yarn\nyarn add soltana-ui\n\n# pnpm\npnpm add soltana-ui', 'bash')}
    <p class="text-sm text-secondary mt-4">Then import in your JavaScript/TypeScript:</p>
    ${codeExample("// Import styles\nimport 'soltana-ui/css';\n\n// Import and initialize\nimport { initSoltana } from 'soltana-ui';\n\nconst soltana = initSoltana({\n  theme: 'dark',\n  relief: 'neu',\n  finish: 'matte',\n  ornament: 'none',\n});", 'javascript')}
  `
  )}

  ${specimenBlock(
    'CDN',
    `
    <p class="text-sm text-secondary mb-4">For quick prototyping or static sites:</p>
    ${codeExample('<!-- CSS only -->\n<link rel="stylesheet" href="https://unpkg.com/soltana-ui/dist/soltana-ui.css">\n\n<!-- With JavaScript -->\n<script type="module">\n  import { initSoltana } from "https://unpkg.com/soltana-ui";\n  const soltana = initSoltana({ theme: "dark", relief: "neu" });\n</script>', 'html')}
  `
  )}

  ${ornamentDivider()}

  ${sectionHeading('Quick Start', 'quick-start', 'Get up and running in minutes.')}

  ${specimenBlock(
    'Basic HTML Template',
    `
    ${codeExample('<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Soltana App</title>\n  <link rel="stylesheet" href="https://unpkg.com/soltana-ui/dist/soltana-ui.css">\n</head>\n<body>\n  <div class="container mx-auto p-8">\n    <h1 class="text-4xl font-serif mb-4">Welcome</h1>\n    <p class="text-secondary mb-6">Your elegant application starts here.</p>\n    <div class="flex gap-3">\n      <button class="btn btn-primary">Get Started</button>\n      <button class="btn btn-secondary">Learn More</button>\n    </div>\n  </div>\n\n  <script type="module">\n    import { initSoltana } from "https://unpkg.com/soltana-ui";\n    const soltana = initSoltana({\n      theme: "dark",\n      relief: "neu",\n      finish: "matte",\n      ornament: "none",\n    });\n  </script>\n</body>\n</html>', 'html')}
  `
  )}

  ${ornamentDivider()}

  ${sectionHeading('Configuration', 'configuration', 'Customize Soltana to match your brand.')}

  ${specimenBlock(
    'soltana.config.js',
    `
    <p class="text-sm text-secondary mb-4">Create a configuration file in your project:</p>
    ${codeExample("// soltana.config.js\nexport default {\n  // Base presets (required)\n  theme: 'dark',        // 'light' | 'dark' | 'sepia' | 'auto'\n  relief: 'neu',   // 'flat' | 'soft' | 'lifted' | 'neu' | 'sharp' | 'hewn'\n  finish: 'matte',  // 'matte' | 'translucent' | 'frosted' | 'tinted' | 'glossy'\n  ornament: 'none',     // 'none' | 'gilt' | 'baroque' | 'beveled' | 'faceted'\n  fonts: true,          // opt-in: injects Google Fonts <link> into <head>\n  \n  // Variable overrides (optional)\n  overrides: {\n    '--accent-primary': '#ff6b6b',\n    '--gold-400': '#e8c547',\n    '--surface-bg': '#0a0a12',\n  },\n};", 'javascript')}
    <p class="text-sm text-secondary mt-4">Then initialize with your config:</p>
    ${codeExample("import config from './soltana.config.js';\nimport { initSoltana } from 'soltana-ui';\n\nconst soltana = initSoltana(config);", 'javascript')}
  `
  )}

  ${specimenBlock(
    'Runtime API',
    `
    <p class="text-sm text-secondary mb-4">Change tiers at runtime for user preferences or dynamic theming:</p>
    ${codeExample("// Get current state\nconsole.log(soltana.getState());\n// { theme: 'dark', relief: 'neu', finish: 'matte', ornament: 'none' }\n\n// Change individual tiers\nsoltana.setTheme('light');\nsoltana.setRelief('lifted');\nsoltana.setFinish('frosted');\nsoltana.setOrnament('baroque');\n\n// Apply custom variable overrides\nsoltana.setOverrides({\n  '--accent-primary': '#your-brand-color',\n});\n\n// Reset to defaults\nsoltana.reset();", 'javascript')}
  `
  )}

  ${specimenBlock(
    'CSS Custom Properties',
    `
    <p class="text-sm text-secondary mb-4">Override any design token using CSS custom properties:</p>
    ${codeExample(':root {\n  --accent-primary: #your-brand-color;\n  --accent-gold: #your-gold-tone;\n  --font-serif: "Your Serif Font", serif;\n  --font-sans: "Your Sans Font", sans-serif;\n}', 'css')}
  `
  )}

  ${ornamentDivider()}

  ${sectionHeading('Custom Tiers', 'custom-tiers', 'Define your own themes, reliefs, and finishes by implementing the CSS token contract for each tier.')}

  ${specimenBlock(
    'How It Works',
    `
    <p class="text-sm text-secondary mb-4">Each tier is driven by CSS custom properties set on <code>[data-{tier}]</code> attribute selectors. To add a custom option, define the required tokens in your CSS and pass the name to the config or setter methods. TypeScript provides autocomplete for built-in values while accepting any string.</p>
    ${codeExample("// Custom values work alongside built-in ones\nconst soltana = initSoltana({\n  theme: 'midnight',  // your custom theme\n  relief: 'neu',      // built-in\n  finish: 'brushed',  // your custom finish\n  ornament: 'none',\n});\n\n// Setters accept custom values too\nsoltana.setTheme('neon');", 'javascript')}
  `
  )}

  ${specimenBlock(
    'Custom Theme',
    `
    <p class="text-sm text-secondary mb-4">Themes require ~47 tokens across surface, text, border, accent, semantic, state, channel, and component groups. Start from an existing theme file and override the values.</p>
    ${codeExample('[data-theme="midnight"] {\n  /* Surface */\n  --surface-bg: #0a0a1a;\n  --surface-1: #12122a;\n  --surface-2: #1a1a3a;\n  --surface-3: #22224a;\n  --surface-4: #2a2a5a;\n  --surface-overlay: rgb(0 0 20 / 60%);\n\n  /* Text */\n  --text-primary: #e8e8ff;\n  --text-secondary: #b0b0d0;\n  --text-tertiary: #8080a0;\n  --text-muted: #606080;\n  --text-inverse: #0a0a1a;\n\n  /* Accent, border, state, channel, component tokens... */\n  /* See src/styles/themes/_dark.scss for the full list */\n}', 'css')}
  `
  )}

  ${specimenBlock(
    'Custom Relief',
    `
    <p class="text-sm text-secondary mb-4">Reliefs set 8 tokens controlling depth, shadows, and borders. These consume channel tokens (<code>--shadow-color</code>, <code>--highlight-color</code>) from the active theme.</p>
    ${codeExample('[data-relief="glass"] {\n  --relief-bg: rgb(255 255 255 / 5%);\n  --relief-shadow-sm: 0 1px 2px rgb(var(--shadow-color) / 8%);\n  --relief-shadow: 0 4px 12px rgb(var(--shadow-color) / 12%);\n  --relief-shadow-lg: 0 8px 32px rgb(var(--shadow-color) / 18%);\n  --relief-shadow-inset-sm: inset 0 1px 1px rgb(var(--highlight-color) / 6%);\n  --relief-shadow-inset: inset 0 2px 4px rgb(var(--highlight-color) / 10%);\n  --relief-shadow-inset-lg: inset 0 4px 8px rgb(var(--highlight-color) / 14%);\n  --relief-border: 1px solid rgb(255 255 255 / 8%);\n}', 'css')}
  `
  )}

  ${specimenBlock(
    'Custom Finish',
    `
    <p class="text-sm text-secondary mb-4">Finishes control 6 tokens for backdrop filters, overlays, and sheen effects.</p>
    ${codeExample('[data-finish="brushed"] {\n  --finish-blur: 0px;\n  --finish-saturation: 100%;\n  --finish-opacity: 1;\n  --finish-texture-opacity: 0.08;\n  --finish-overlay: linear-gradient(135deg, transparent 40%, rgb(255 255 255 / 3%) 100%);\n  --finish-sheen: none;\n}', 'css')}
  `
  )}

  ${specimenBlock(
    'Custom Ornament',
    `
    <p class="text-sm text-secondary mb-4">Ornaments use the same token contract as other tiers. Set <code>--ornament-*</code> tokens on a <code>[data-ornament]</code> selector — base element classes (<code>.frame</code>, <code>.corner</code>, <code>.edge</code>, <code>.divider</code>, <code>.medallion</code>) consume them via <code>var()</code>. Unused tokens default to inert values (<code>none</code>, <code>0</code>, <code>transparent</code>).</p>
    ${codeExample('/* A simple custom ornament — borders + shadows only (~8 tokens) */\n[data-ornament="royal"] {\n  --ornament-frame-border: 3px double var(--ornament-color);\n  --ornament-frame-shadow: 0 0 0 2px var(--ornament-color-dark), 0 0 16px var(--border-accent-gold);\n  --ornament-frame-inner-display: block;\n  --ornament-frame-inner-inset: 4px;\n  --ornament-frame-inner-border: 1px solid var(--ornament-color);\n  --ornament-frame-inner-opacity: 0.6;\n  --ornament-corner-display: block;\n  --ornament-corner-radius: 50%;\n  --ornament-corner-border: 2px solid var(--ornament-color);\n  --ornament-edge-border: 2px double var(--ornament-color);\n  --ornament-medallion-border: 3px solid var(--ornament-color);\n  --ornament-medallion-shadow: 0 0 12px var(--border-accent-gold);\n  --ornament-box-shadow: var(--relief-shadow), 0 0 0 2px var(--ornament-color);\n}', 'css')}
    <p class="text-sm text-secondary mt-4">Then activate it like any built-in ornament:</p>
    ${codeExample("soltana.setOrnament('royal');", 'javascript')}
  `
  )}

  ${specimenBlock(
    'Custom Recipes',
    `
    <p class="text-sm text-secondary mb-4">Register named presets that combine your custom tiers with built-in ones.</p>
    ${codeExample("soltana.registerRecipe('my-brand', {\n  name: 'My Brand',\n  description: 'Dark midnight theme with glass relief.',\n  theme: 'midnight',\n  relief: 'glass',\n  finish: 'brushed',\n  ornament: 'gilt',\n});\n\nsoltana.applyRecipe('my-brand');", 'javascript')}
  `
  )}

</div>
`;
}
