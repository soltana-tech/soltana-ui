/** Design System — Per-Element Composition page. */

import { sectionHeading, specimenBlock, codeExample } from '../../lib/helpers';

export function renderComposition(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-composition">

  ${sectionHeading('Per-Element Composition', 'composition', 'All three tiers — theme, relief, finish — can be independently overridden on any element via utility classes.')}

  ${specimenBlock(
    'Tier Override Classes',
    `
    <p class="text-sm text-secondary mb-4">Each tier provides utility classes that override the global config on a per-element basis. CSS custom properties set directly on an element always override inherited values from ancestors.</p>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="card p-4">
        <span class="tag mb-2">Theme</span>
        <div class="space-y-1 mt-2">
          <code class="text-sm">.theme-dark</code><br>
          <code class="text-sm">.theme-light</code><br>
          <code class="text-sm">.theme-sepia</code>
        </div>
      </div>
      <div class="card p-4">
        <span class="tag mb-2">Relief</span>
        <div class="space-y-1 mt-2">
          <code class="text-sm">.relief-flat</code><br>
          <code class="text-sm">.relief-glassmorphic</code><br>
          <code class="text-sm">.relief-skeuomorphic</code><br>
          <code class="text-sm">.relief-neumorphic</code>
        </div>
      </div>
      <div class="card p-4">
        <span class="tag mb-2">Finish</span>
        <div class="space-y-1 mt-2">
          <code class="text-sm">.finish-matte</code><br>
          <code class="text-sm">.finish-frosted</code><br>
          <code class="text-sm">.finish-tinted</code><br>
          <code class="text-sm">.finish-glossy</code>
        </div>
      </div>
    </div>
  `
  )}

  <h3 class="text-xl font-semibold mt-8 mb-4">Composition in Action</h3>
  <p class="text-sm text-secondary mb-6">Each card below overrides multiple tiers independently, regardless of the global config.</p>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="theme-light relief-skeuomorphic finish-frosted card p-5 rounded-xl">
      <span class="tag mb-2">Light + Skeuomorphic + Frosted</span>
      <p class="text-sm text-secondary mt-2">Overrides theme to light, relief to skeuomorphic, and finish to frosted — independent of global config.</p>
      <button class="btn btn-sm mt-3">Button</button>
    </div>
    <div class="theme-sepia relief-neumorphic card p-5 rounded-xl">
      <span class="tag mb-2">Sepia + Neumorphic</span>
      <p class="text-sm text-secondary mt-2">Warm parchment theme with neumorphic depth.</p>
      <button class="btn btn-sm mt-3">Button</button>
    </div>
    <div class="theme-dark bg-mesh rounded-xl">
      <div class="relief-glassmorphic finish-glossy card p-5 rounded-xl">
        <span class="tag mb-2">Dark + Glassmorphic + Glossy</span>
        <p class="text-sm text-secondary mt-2">All three tiers overridden on a single element.</p>
        <button class="btn btn-sm mt-3">Button</button>
      </div>
    </div>
  </div>

  ${specimenBlock(
    'Usage',
    `
    <p class="text-sm text-secondary mb-4">Add utility classes to any element to override inherited tier values:</p>
    ${codeExample('<!-- Global config: dark theme, neumorphic relief, matte finish -->\n\n<!-- Override theme on a section -->\n<section class="theme-light">\n  <p>Light tokens apply here, even inside a dark page.</p>\n\n  <!-- Further override relief -->\n  <div class="card relief-skeuomorphic p-6">\n    Skeuomorphic relief, light theme inherited from parent.\n  </div>\n</section>\n\n<!-- Override all three tiers on one element -->\n<div class="theme-sepia relief-glassmorphic finish-frosted card p-6">\n  Fully composed: sepia + glassmorphic + frosted.\n</div>', 'html')}
  `
  )}

  ${specimenBlock(
    'Custom Tier Registration',
    `
    <p class="text-sm text-secondary mb-4">When you register a custom tier at runtime, Soltana auto-generates both a <code>data-*</code> attribute selector and a utility class. For example:</p>
    ${codeExample("// Register a custom relief\nsoltana.registerRelief('dramatic', { tokens: { ... } });\n\n// Both selectors are now active:\n//   [data-relief='dramatic']  — for global config\n//   .relief-dramatic          — for per-element overrides", 'typescript')}
    <p class="text-sm text-secondary mt-4">The same applies to all tiers: <code>registerTheme('ocean', ...)</code> generates <code>.theme-ocean</code> and <code>registerFinish('neon', ...)</code> generates <code>.finish-neon</code>.</p>
  `
  )}

  ${specimenBlock(
    'How It Works',
    `
    <p class="text-sm text-secondary mb-4">CSS custom properties set directly on an element always override values inherited from ancestors. The innermost class wins:</p>
    ${codeExample('<!-- Stacking depth: innermost wins -->\n<html data-theme="dark">           <!-- dark tokens -->\n  <div class="theme-light">        <!-- light tokens -->\n    <div class="theme-dark">       <!-- dark tokens again -->\n      Content uses dark theme.\n    </div>\n  </div>\n</html>', 'html')}
    <p class="text-sm text-secondary mt-4">Tier combination count is linear (t + r + f rulesets), not multiplicative. No combination-specific CSS is generated — each tier cascades independently via custom properties.</p>
  `
  )}

  ${specimenBlock(
    'Utility Class Reference',
    `
    <p class="text-sm text-secondary mb-4">For a complete listing of all utility classes (layout, spacing, typography, and visual utilities), see the auto-generated reference at <code>.claude/agents/reference.yaml</code> or the SCSS source in <code>src/styles/utilities/</code>.</p>
  `
  )}

</div>`;
  return page;
}
