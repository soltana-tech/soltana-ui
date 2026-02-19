/** Design System — Per-Element Composition page. */

import { sectionHeading, specimenBlock, codeExample } from '../../utils/helpers';

export function renderComposition(): string {
  return `
<div class="page-composition">

  ${sectionHeading('Per-Element Composition', 'composition', 'All four tiers — theme, relief, finish, ornament — can be independently overridden on any element via utility classes.')}

  ${specimenBlock(
    'Tier Override Classes',
    `
    <p class="text-sm text-secondary mb-4">Each tier provides utility classes that override the global config on a per-element basis. CSS custom properties set directly on an element always override inherited values from ancestors.</p>
    <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
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
      <div class="card p-4">
        <span class="tag mb-2">Ornament</span>
        <div class="space-y-1 mt-2">
          <code class="text-sm">.ornament-baroque</code><br>
          <code class="text-sm">.ornament-beveled</code><br>
          <code class="text-sm">.ornament-faceted</code><br>
          <code class="text-sm">.ornament-gilt</code>
        </div>
      </div>
    </div>
  `
  )}

  <h3 class="text-xl font-semibold mt-8 mb-4">Composition in Action</h3>
  <p class="text-sm text-secondary mb-6">Each card below overrides multiple tiers independently, regardless of the global config.</p>

  <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
    <div class="theme-light relief-skeuomorphic finish-frosted card p-5 rounded-xl">
      <span class="tag mb-2">Light + Skeuomorphic + Frosted</span>
      <p class="text-sm text-secondary mt-2">Overrides theme to light, relief to skeuomorphic, and finish to frosted — independent of global config.</p>
      <button class="btn btn-sm mt-3">Button</button>
    </div>
    <div class="theme-sepia relief-neumorphic ornament-gilt card p-5 rounded-xl">
      <span class="tag mb-2">Sepia + Neumorphic + Gilt</span>
      <p class="text-sm text-secondary mt-2">Warm parchment theme with neumorphic depth and gold leaf ornament.</p>
      <button class="btn btn-sm mt-3">Button</button>
    </div>
    <div class="theme-dark relief-glassmorphic finish-glossy ornament-beveled card p-5 rounded-xl">
      <span class="tag mb-2">Dark + Glassmorphic + Glossy + Beveled</span>
      <p class="text-sm text-secondary mt-2">All four tiers overridden on a single element.</p>
      <button class="btn btn-sm mt-3">Button</button>
    </div>
  </div>

  ${specimenBlock(
    'Usage',
    `
    <p class="text-sm text-secondary mb-4">Add utility classes to any element to override inherited tier values:</p>
    ${codeExample('<!-- Global config: dark theme, neumorphic relief, matte finish -->\n\n<!-- Override theme on a section -->\n<section class="theme-light">\n  <p>Light tokens apply here, even inside a dark page.</p>\n\n  <!-- Further override relief + ornament -->\n  <div class="card relief-skeuomorphic ornament-gilt p-6">\n    Skeuomorphic relief with gilt ornament, light theme inherited from parent.\n  </div>\n</section>\n\n<!-- Override all four tiers on one element -->\n<div class="theme-sepia relief-glassmorphic finish-frosted ornament-beveled card p-6">\n  Fully composed: sepia + glassmorphic + frosted + beveled.\n</div>', 'html')}
  `
  )}

  ${specimenBlock(
    'How It Works',
    `
    <p class="text-sm text-secondary mb-4">CSS custom properties set directly on an element always override values inherited from ancestors. The innermost class wins:</p>
    ${codeExample('<!-- Stacking depth: innermost wins -->\n<html data-theme="dark">           <!-- dark tokens -->\n  <div class="theme-light">        <!-- light tokens -->\n    <div class="theme-dark">       <!-- dark tokens again -->\n      Content uses dark theme.\n    </div>\n  </div>\n</html>', 'html')}
    <p class="text-sm text-secondary mt-4">Tier combination count is linear (t + r + f + o rulesets), not multiplicative. No combination-specific CSS is generated — each tier cascades independently via custom properties.</p>
  `
  )}

</div>`;
}
