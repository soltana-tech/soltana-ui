# Soltana UI — Audit Roadmap

Living roadmap generated from codebase audit. Items are picked off, planned, implemented, and marked done. Use `/audit` to interact with this document via Claude Code.

**Status key:** `TODO` | `IN_PROGRESS` | `DONE`
**Size key:** `S` = single file, isolated | `M` = multi-file, moderate | `L` = many files, significant | `XL` = system-wide, architectural

---

## Context

### What Soltana UI Is

A CSS-first design system built around a 4-tier configuration model:

| Tier | Options | Mechanism |
|------|---------|-----------|
| Theme | dark, light, sepia, auto | `[data-theme]` on `<html>` |
| Material | neuro, glass, hybrid (to be replaced) | `[data-material]` on `<html>` |
| Surface | polished, frosted, stained, metallic | `[data-surface]` on `<html>` |
| Ornament | none, baroque, carved, faceted, gilt | `body` class |

Classical "estate" aesthetic with gold accents, jewel tones, serif typography (Cinzel + Raleway). Ships ~139KB CSS + ~10KB JS with TypeScript enhancers for modals, tabs, and tooltips.

### Competitive Positioning

No existing CSS design system unifies neumorphic, glassmorphic, metallic, and stone materials under a single configurable architecture. The niche is real and unoccupied. The unique value is the configurable material system. The gap between architectural vision and implementation execution is the central issue.

### Strengths to Preserve

- **Token system architecture** — Sass maps generate compile-time variables and `:root` custom properties in parallel. Production-grade.
- **Typography scale** — `[font-size, line-height]` tuples that scale intelligently. Thoughtful and correct.
- **Material abstraction pattern** — `--material-*` variable layer is elegant. Components consume semantic tokens and auto-switch on `[data-material]` change.
- **Glassmorphic depth** — Most fully realized material. Jewel-toned glass, lead-line overlays, stained glass presets.
- **Accessibility foundation** — `prefers-reduced-motion`, `prefers-contrast`, `.sr-only`, `.skip-link`, focus rings. Solid base layer.
- **Metallic button mixin** — Well-parametrized with gradient, glow, shine animation. Should be extracted for reuse.

---

## TypeScript

### TS-1: Config crash after reset

`DONE` · Size: **S**

`reset()` set `state.overrides = undefined`, then `setOverrides()` spread it and threw.

- Progress: Fixed — `state.overrides = {}` in reset. Tests added.

### TS-2: matchMedia listener leak

`DONE` · Size: **S**

Every `initSoltana({ theme: 'auto' })` or `setTheme('auto')` added a new listener that was never removed.

- Progress: Fixed — `setupAutoTheme()`/`teardownAutoTheme()` with stored references. Tests added.

### TS-3: No config validation

`DONE` · Size: **S**

Invalid config values silently set bad data attributes. No console warning.

- Progress: Fixed — `warnInvalid()` helper with `console.warn` for all config setters. Tests added.

### TS-4: Enhancer memory leaks

`DONE` · Size: **M**

All `init*()` calls added event listeners with no removal. Double-calling doubled handlers.

- Progress: Fixed — AbortController pattern in all three enhancers. Each `init*()` returns `EnhancerCleanup` with `destroy()`. `initAll()` returns combined cleanup. Tests added.

### TS-5: Modal overflow stacking

`DONE` · Size: **S**

`body.overflow` set/cleared naively. Two modals open, one closed = scroll restored prematurely.

- Progress: Fixed — `_openCount` counter, only restore overflow at 0. Tests added.

### TS-6: Tooltip positioning and aria bugs

`DONE` · Size: **S**

`getBoundingClientRect()` called before paint. `aria-describedby` leaked on fast target switch.

- Progress: Fixed — `requestAnimationFrame` before measuring. Aria cleanup on target change. Tests added.

### TS-7: Font loading side effects

`TODO` · Size: **S**

`initSoltana()` calls `loadSoltanaFonts()` by default — undocumented side effect injecting a Google Fonts `<link>`. Conflicts with `next/font`, Nuxt font modules, and other framework-level font management. Font URL is hardcoded.

**Proposed fix:** Make fonts opt-in (`fonts: false` by default) or at minimum document the behavior prominently. Add error handling for CDN failures.

### TS-8: SVG patterns are incomplete

`TODO` · Size: **M**

`src/ornaments/patterns.ts` exports SVG string generators but has no tests, no usage examples, no documentation, and no integration with the rest of the system.

**Proposed fix:** Either wire patterns into the ornament system with proper tests and docs, or remove the module until it's ready.

---

## SCSS Architecture

### SCSS-1: Material system is fractured

`TODO` · Size: **XL** · Depends on: SCSS-2

5 material files (neumorphic, glassmorphic, neuro-glass, metallic, stone) vs 3 config options (neuro, glass, hybrid). Metallic and stone are standalone utility classes disconnected from `data-material`. Setting `[data-material='neuro']` sets CSS variables but doesn't auto-apply component classes.

`hybrid` doesn't scale — it's a hardcoded neuro+glass blend. As new materials are added, "hybrid of what?" becomes unanswerable.

**Proposed fix:** Remove `hybrid`. Promote each material to a standalone config option: neuro, glass, metallic, stone, flat, soft. Wire all material files into the config system. Delete `neuro-glass.scss` or decompose its effects. Components consume `--material-*` variables exclusively.

### SCSS-2: Material vs surface overlap

`DONE` · Size: **L** · Depends on: none

Material defines bg, shadows, blur, saturation, opacity, border. Surface redefines blur, saturation, opacity, texture, overlay — largely the same properties. `neuro + frosted` produces contradictory results. Developers can't reason about the interaction without reading SCSS.

- Progress: Moved blur, saturation, opacity from `--material-*` to `--surface-*` namespace. Materials own structure (bg, shadow, border). Surfaces own finish (blur, saturation, opacity, texture, overlay, sheen). Tiers are now orthogonal. Stained/metallic `--material-bg` overrides remain as documented scope for SCSS-1.

### SCSS-3: Components hardcode colors

`TODO` · Size: **L** · Depends on: SCSS-1

`.btn-gold` hardcodes `var(--gold-gradient)`. `.card-baroque` hardcodes `var(--gold-400)`. `.card-stained-glass` defines its own blur/gradient. `.checkbox-baroque`, `.radio-medallion`, `.tabs-carved` all hardcode gold. None respond to material or theme changes.

**Proposed fix:** Replace hardcoded color references with `--material-*` or `--accent-*` variables.

### SCSS-4: CSS custom property conflicts

`TODO` · Size: **M**

`--neuro-bg` and `--surface-1` identical in dark theme. Material-specific variables in `:root` with no namespace. `--gold-gradient` embeds entire gradient at `:root` level. No semantic middle layer.

**Proposed fix:** Namespace material variables. Add semantic layer between raw colors and component consumption.

### SCSS-5: Race condition in material defaults

`TODO` · Size: **S**

`:root` fallbacks in `_material-system.scss` are hardcoded colors. If JS hasn't set `[data-material]` yet, components render with hardcoded midnight blue.

**Proposed fix:** Use CSS variable fallbacks that chain to theme-aware defaults.

### SCSS-6: Z-index scale is broken

`TODO` · Size: **S**

Scale goes 0–50 but `.skip-link` hardcodes `z-index: 9999`. Modal backdrop sits at z-50, colliding with tooltips. No intermediate values.

**Proposed fix:** Semantic z-index scale: `--z-dropdown: 100`, `--z-modal: 200`, `--z-tooltip: 300`, `--z-skip-link: 9999`.

### SCSS-7: Transition durations inconsistent

`TODO` · Size: **M**

Duration tokens defined (fast: 75ms, normal: 150ms, slow: 300ms, slower: 500ms) but no component uses them. Buttons alone use 4 different hardcoded durations. Easing functions are raw `ease` not the defined cubic-bezier.

**Proposed fix:** Use defined transition tokens in all components. Add easing presets to the token system.

### SCSS-8: Naming convention inconsistent

`TODO` · Size: **M**

Single-dash everywhere (`.btn-gold`, `.card-baroque`) except card material variants use BEM double-dash (`.card--neuro`, `.card--glass`). Only BEM-style classes in the codebase.

**Proposed fix:** Standardize on one convention everywhere.

### SCSS-9: Theme variable gaps

`TODO` · Size: **S**

Sepia theme missing `--border-accent-gold-strong` which exists in dark and light themes. Silent fallback to inherited values.

**Proposed fix:** Audit all three themes for variable parity.

### SCSS-10: Color scales unused

`TODO` · Size: **M**

Gold, silver, bronze, copper, platinum have full 50–900 scales but lighter values (50, 100, 200) are unused by any component or utility class. No `.bg-gold-50` etc.

**Proposed fix:** Generate utility classes for color scales, or remove unused stops.

### SCSS-11: No responsive design

`TODO` · Size: **L**

Breakpoints defined but only used by `.container`. No responsive variants, no fluid typography with `clamp()`, no breakpoint-aware grid. H1 is 3rem on every viewport.

**Proposed fix:** Generate responsive variants for key utilities. Add fluid typography.

### SCSS-12: Accessibility gaps

`TODO` · Size: **M**

Focus mechanisms inconsistent (outline on buttons, box-shadow on inputs). `--text-muted` ~4.2:1 contrast (below AA 4.5:1). `--text-tertiary` ~3.8:1. Disabled states use only `opacity: 0.5`. No color-blind accommodations.

**Proposed fix:** Standardize focus ring. Increase muted/tertiary contrast to AA. Use more than opacity for disabled states.

### SCSS-13: CSS bloat

`TODO` · Size: **M**

Marble textures use 4-8 radial gradients per variant (~20KB). Stained glass presets define 8 potentially unused combos. Ornamental styles generate selectors even when ornaments disabled. Gradients repeat same direction with no shared mixin.

**Proposed fix:** Shared gradient mixin. Conditional ornament generation. Audit unused presets.

---

## Aesthetic Range

### AES-1: Expand material options

`TODO` · Size: **XL** · Depends on: SCSS-1, SCSS-2

All current materials are visually assertive. No flat or near-flat option for clean professional layouts.

**Proposed fix:** Add `flat` (minimal shadow, no blur, crisp edges) and `soft` (very slight shadow, gentle depth). Wire metallic and stone files into config. Final spectrum: flat → soft → neuro → glass → metallic → stone.

### AES-2: Expand surface options

`TODO` · Size: **L**

Polished is closest to neutral but the rest are all strong treatments. No calm option.

**Proposed fix:** Add `matte` (zero sheen, solid color) and `paper`/`linen` (subtle texture at low opacity).

### AES-3: Expand ornament options

`TODO` · Size: **M** · Depends on: ORN-1

All ornaments are decorative. No middle ground between "none" and "gold filigree."

**Proposed fix:** Add `subtle` (thin accent line or gentle shadow) and `minimal` (barely-there border treatment).

### AES-4: Neutral palette option

`TODO` · Size: **M**

Palette locked to gold/jewel tones. No cool grays, warm neutrals, or monochrome option without overriding most colors.

**Proposed fix:** Expose a neutral accent scale alongside gold. Let developers set `--accent-primary` to any hue without fighting jewel-tone defaults.

---

## Ornamentation

### ORN-1: Pseudo-element collision (fatal)

`TODO` · Size: **XL**

Ornaments apply globally via `body.ornament-baroque` using `::before`/`::after` on every component. Component variants use those same pseudo-elements. `.btn-baroque` corners destroyed by higher-specificity global ornament rule. CSS only provides two pseudo-elements per element.

### ORN-2: All-or-nothing global application

`TODO` · Size: **XL** · Depends on: ORN-1

`body.ornament-baroque` applies to every component simultaneously. No way to have a baroque card next to a plain card. `.ornament-none` uses `display: none !important` killing all pseudo-element styling.

### ORN-3: Redundant competing definitions

`TODO` · Size: **L** · Depends on: ORN-1

Baroque defined in 3 places (`_material-system.scss`, `_buttons.scss`, `_ornamental.scss`) with no shared code. Each implements "baroque" differently. Combining them produces visual breakage.

### Proposed fix for ORN-1, ORN-2, ORN-3 (combined)

**One source of truth.** Single set of ornament definitions consumed everywhere.

**Opt-in, not global.** Config still sets a default ornament, but application is per-element via `.ornamented` class, not blanket `body` class.

- `.ornamented` — applies the config default
- `.ornamented-baroque` — forces baroque regardless of config
- `.ornamented-carved` — forces carved regardless of config
- etc.

**No pseudo-element conflicts.** Use `box-shadow` + `outline`/`outline-offset`/`border-image` instead of `::before`/`::after`. Refactor conflicting components.

---

## Combinatorial Complexity

### COMB-1: Recipe book

`TODO` · Size: **M** · Depends on: AES-1

Named presets of proven tier combinations as starting points:

- "Corporate Clean" — light, flat, matte, none
- "Luxury Dark" — dark, neuro, polished, gilt
- "Frosted Modern" — dark, glass, frosted, subtle
- "Classic Warm" — sepia, soft, paper, carved

Recipes don't replace config — they're starting points. Docs should showcase each with screenshots.

### COMB-2: Visual regression testing

`TODO` · Size: **L**

Render every component in every theme x material x surface combination. Capture screenshots. Compare against baselines. Tools: Playwright + Percy/Chromatic/BackstopJS.

### COMB-3: Accessibility scoring per combination

`TODO` · Size: **L** · Depends on: COMB-2

Run axe-core against each theme x material combination automatically. Flag contrast failures, missing focus indicators. Every combination should meet WCAG AA.

### COMB-4: Cross-browser visual testing

`TODO` · Size: **M** · Depends on: COMB-2

Backdrop-filter and advanced gradients render differently. Automated screenshots in Chrome, Firefox, Safari.

---

## Missing Components

### COMP-1: Standard missing components

`TODO` · Size: **XL**

Breadcrumbs, pagination, accordion/collapse, dropdown/menu, spinner/loader, stepper/timeline, list styles, alert dismiss, form validation states, tooltip position variants.

### COMP-2: Missing utility classes

`TODO` · Size: **L**

No aspect-ratio (except golden ratio), animation, filter, transform utilities. Width/height don't use full spacing scale. No overflow-x/y utilities.

---

## Developer Experience

### DX-1: First-time setup unclear

`TODO` · Size: **M**

CSS import separate from JS with no guidance. Silent failure — components render unstyled. 6 package export paths with no guidance on which to use.

**Proposed fix:** Document required imports clearly. Consider single-import setup.

### DX-2: Material vs surface confusing

`TODO` · Size: **M** · Depends on: SCSS-2

Both control visual appearance. Both modify blur and opacity. Contradictory configs silently allowed. Mental model needs clarification.

### DX-3: No class discoverability

`TODO` · Size: **M**

Package exports TypeScript types for config but not for CSS classes. No way to discover `.card-baroque` without reading source.

**Proposed fix:** Export a class registry or TypeScript const map of available classes per component.

### DX-4: Enhancers fail silently

`TODO` · Size: **S**

Using `[data-sol-modal]` without `initModals()` produces non-functional element. No warning.

**Proposed fix:** Log a warning when `[data-sol-*]` element exists but enhancer hasn't been initialized.

### DX-5: No framework integration

`TODO` · Size: **XL**

No React hooks, Vue composables, or Svelte stores. Hydration mismatches in SSR frameworks.

### DX-6: npm package incomplete

`TODO` · Size: **M**

No README ships with package. Version mismatch. Export subpaths point to main bundle. Config template missing. No CHANGELOG.

---

## Documentation & Playground

### DOC-1: No material comparison view

`TODO` · Size: **M**

Can't see the same component in neuro vs glass vs metallic side by side. Settings panel changes everything globally.

### DOC-2: No live code editor

`TODO` · Size: **L**

See rendered components but can't type HTML and see it styled. No CodePen-like sandbox.

### DOC-3: No variant matrix

`TODO` · Size: **M**

No view showing all permutations of a component (button in 6 variants x 5 sizes x all materials).

### DOC-4: No configuration export

`TODO` · Size: **M**

Changing settings doesn't update URL. Refreshing loses state. No way to share config or generate a config file.

### DOC-5: No CSS variable inspector

`TODO` · Size: **M**

No way to see which `--material-*`, `--surface-*`, `--accent-*` variables are active without DevTools.

### DOC-6: No accessibility playground

`TODO` · Size: **M**

No toggle for high contrast, reduced motion, or focus indicator visibility.

### DOC-7: No responsive preview

`TODO` · Size: **M**

No viewport resizer. No way to preview mobile/tablet reflow.

### DOC-8: Navigation is limiting

`TODO` · Size: **M**

5 tabs + in-page quick-nav. No persistent sidebar. Finding a component takes 3+ clicks.

**Proposed fix:** Persistent sidebar listing all components. Search bar.

### DOC-9: Onboarding gaps

`TODO` · Size: **M**

No hero/value proposition. No visual walkthrough. No "build your first component" tutorial. Settings panel hidden behind gear icon. No "next steps" after Getting Started.

### DOC-10: Missing documentation sections

`TODO` · Size: **L**

No accessibility guide, responsive guide, color system deep-dive, typography guide, animation/motion guide, customization deep-dive, troubleshooting/FAQ.
