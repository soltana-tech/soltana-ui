/** Getting Started page — hero, 3-tier overview, and installation. */

import { codeExample, sectionDivider, sectionHeading, specimenBlock } from '../../lib/helpers';

export function renderGettingStarted(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-getting-started">

  <div class="text-center py-8 mb-8">
    <h1 class="font-serif font-extrabold mb-4" style="font-size: clamp(2.5rem, 5vw, 4rem); background: linear-gradient(135deg, var(--accent-decorative), var(--accent-primary), var(--text-primary)); background-clip: text; color: transparent;">Soltana UI</h1>
    <p class="text-lg text-secondary max-w-2xl mx-auto mb-8" style="line-height: 1.6;">
      A CSS-first design system built on three independent tiers &mdash;
      Theme, Relief, and Finish &mdash; that compose orthogonally.
    </p>
    <div class="flex flex-wrap justify-center gap-3 mb-10">
      <a href="#/playground" class="btn btn-primary">Try the Playground</a>
      <a href="#/explore" class="btn btn-secondary">Explore Components</a>
    </div>
  </div>

  ${sectionHeading('The 3-Tier System', 'three-tier', 'Three independent axes of visual design. Change any tier without affecting the others.')}

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
    <div class="card p-5 rounded-xl flex flex-col gap-2" style="border-left: 4px solid var(--accent-primary);">
      <span class="text-3xl font-black" style="color: var(--accent-primary); line-height: 1;">1</span>
      <h4 class="font-semibold text-lg">Theme</h4>
      <p class="text-sm text-secondary">Color palette and tone for every surface, text, and accent token.</p>
      <div class="flex flex-wrap gap-2 mt-2">
        <span class="tag">dark</span>
        <span class="tag">light</span>
        <span class="tag">sepia</span>
        <span class="tag">auto</span>
      </div>
    </div>
    <div class="card p-5 rounded-xl flex flex-col gap-2" style="border-left: 4px solid var(--accent-primary);">
      <span class="text-3xl font-black" style="color: var(--accent-primary); line-height: 1;">2</span>
      <h4 class="font-semibold text-lg">Relief</h4>
      <p class="text-sm text-secondary">Shadow model controlling depth, blur, and border treatment.</p>
      <div class="flex flex-wrap gap-2 mt-2">
        <span class="tag">flat</span>
        <span class="tag">glassmorphic</span>
        <span class="tag">skeuomorphic</span>
        <span class="tag">neumorphic</span>
      </div>
    </div>
    <div class="card p-5 rounded-xl flex flex-col gap-2" style="border-left: 4px solid var(--accent-primary);">
      <span class="text-3xl font-black" style="color: var(--accent-primary); line-height: 1;">3</span>
      <h4 class="font-semibold text-lg">Finish</h4>
      <p class="text-sm text-secondary">Surface treatment layered on top: backdrop blur, sheen, and overlays.</p>
      <div class="flex flex-wrap gap-2 mt-2">
        <span class="tag">matte</span>
        <span class="tag">frosted</span>
        <span class="tag">tinted</span>
        <span class="tag">glossy</span>
      </div>
    </div>
  </div>

  <p class="text-base text-secondary mt-6">
    4 theme options (3 visual themes + auto resolver) &times; 4 reliefs &times; 4 finishes = <strong>48 unique combinations</strong> (auto resolves to dark or light at runtime), all from one CSS file.
    <a href="#/explore/examples" class="font-medium" style="color: var(--accent-primary);">See them in action &rarr;</a>
  </p>

  ${sectionDivider()}

  ${sectionHeading('Installation', 'installation', 'Add Soltana to your project.')}

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    ${specimenBlock('npm / pnpm / yarn', codeExample('npm install soltana-ui', 'bash'))}
    ${specimenBlock(
      'CDN',
      codeExample(
        '<link rel="stylesheet" href="https://unpkg.com/soltana-ui/dist/soltana-ui.css">',
        'html'
      )
    )}
  </div>

  ${specimenBlock(
    'Initialize',
    `
    ${codeExample("import 'soltana-ui/css';\nimport { initSoltana, loadSoltanaFonts } from 'soltana-ui';\n\nloadSoltanaFonts();\n\nconst soltana = initSoltana({\n  theme: 'dark',\n  relief: 'neumorphic',\n  finish: 'matte',\n});", 'javascript')}
  `
  )}

  ${sectionDivider()}

  ${sectionHeading('How It Works', 'how-it-works', 'Components consume semantic tokens that switch automatically when tiers change.')}

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
    <div class="card p-5 rounded-xl">
      <h4 class="font-semibold text-lg mb-2">Global Config</h4>
      <p class="text-sm text-secondary">Set tiers once. All components inherit automatically via CSS custom properties on <code>&lt;html&gt;</code>.</p>
    </div>
    <div class="card p-5 rounded-xl">
      <h4 class="font-semibold text-lg mb-2">Per-Element Overrides</h4>
      <p class="text-sm text-secondary">Use utility classes like <code>.relief-flat</code> or <code>.theme-light</code> to override any element without affecting the rest of the page.</p>
    </div>
    <div class="card p-5 rounded-xl">
      <h4 class="font-semibold text-lg mb-2">Runtime API</h4>
      <p class="text-sm text-secondary">Switch tiers at runtime with <code>setTheme()</code>, <code>setRelief()</code>, <code>setFinish()</code>, <code>setOverrides()</code>, <code>reset()</code>, <code>destroy()</code>, and <a href="#/api/core" style="color: var(--accent-primary);">more</a>.</p>
    </div>
  </div>

  ${sectionDivider()}

  ${sectionHeading('Next Steps', 'next-steps')}

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
    <a href="#/learn/themes" class="card card-hover p-5 rounded-xl" style="text-decoration: none;">
      <h4 class="font-semibold text-lg">Themes</h4>
      <p class="text-sm text-secondary mt-1">Deep dive into color schemes</p>
    </a>
    <a href="#/learn/reliefs" class="card card-hover p-5 rounded-xl" style="text-decoration: none;">
      <h4 class="font-semibold text-lg">Reliefs</h4>
      <p class="text-sm text-secondary mt-1">Shadow models explained</p>
    </a>
    <a href="#/learn/finishes" class="card card-hover p-5 rounded-xl" style="text-decoration: none;">
      <h4 class="font-semibold text-lg">Finishes</h4>
      <p class="text-sm text-secondary mt-1">Surface treatments guide</p>
    </a>
    <a href="#/api/core" class="card card-hover p-5 rounded-xl" style="text-decoration: none;">
      <h4 class="font-semibold text-lg">API Reference</h4>
      <p class="text-sm text-secondary mt-1">Full JavaScript API docs</p>
    </a>
  </div>

</div>
`;
  return page;
}
