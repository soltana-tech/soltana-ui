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
| Material | flat, soft, neu, glass, metallic, stone | `[data-material]` on `<html>` |
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

`DONE` · Size: **S**

`initSoltana()` calls `loadSoltanaFonts()` by default — undocumented side effect injecting a Google Fonts `<link>`. Conflicts with `next/font`, Nuxt font modules, and other framework-level font management. Font URL is hardcoded.

- Progress: Fonts now opt-in (`fonts: false` default). CDN `onerror` handler warns via console. Tests cover default no-inject, opt-in inject, and error path.

### TS-8: SVG patterns are incomplete

`DONE` · Size: **M**

`src/ornaments/patterns.ts` exports SVG string generators but had no conversion utilities for practical use.

- Progress: Added `toDataUri()` (encodeURIComponent-based data URI) and `toElement()` (DOMParser-based SVGElement) utilities. Both exported from `src/index.ts`. Tests added for round-trip encoding, element creation, and attribute preservation. Replaced emoji icons in `docs/components/SettingsPanel.ts` with inline SVGs.

---

## SCSS Architecture

### SCSS-1: Material system is fractured

`DONE` · Size: **XL** · Depends on: SCSS-2

5 material files (neumorphic, glassmorphic, neu-glass, metallic, stone) vs 3 config options (neu, glass, hybrid). Metallic and stone are standalone utility classes disconnected from `data-material`. Setting `[data-material='neu']` sets CSS variables but doesn't auto-apply component classes.

`hybrid` doesn't scale — it's a hardcoded neu+glass blend. As new materials are added, "hybrid of what?" becomes unanswerable.

**Proposed fix:** Remove `hybrid`. Promote each material to a standalone config option: neu, glass, metallic, stone, flat, soft. Wire all material files into the config system. Delete `neu-glass.scss` or decompose its effects. Components consume `--material-*` variables exclusively.

- Progress: Consolidated material system. Added shadow scale (`--material-shadow-sm`, `--material-shadow-lg`, `--material-shadow-inset-sm`, `--material-shadow-inset-lg`) to all 6 materials. Removed duplicate component classes from material files (`.glass-card`, `.glass-nav`, `.glass-button`, `.glass-input`, `.glass-overlay`, `.glass-modal`, `.neu-card`, `.neu-button`, `.neu-input`, `.neu-progress`). Removed redundant card variants (`.card-glass`, `.card--neu`, `.card--glass`). Refactored `.neu-card-layered` and `.neu-toggle` to use `--material-*` tokens. Per-element material overrides use `.material-*` classes from `_material-system.scss`.

### SCSS-2: Material vs surface overlap

`DONE` · Size: **L** · Depends on: none

Material defines bg, shadows, blur, saturation, opacity, border. Surface redefines blur, saturation, opacity, texture, overlay — largely the same properties. `neu + frosted` produces contradictory results. Developers can't reason about the interaction without reading SCSS.

- Progress: Moved blur, saturation, opacity from `--material-*` to `--surface-*` namespace. Materials own structure (bg, shadow, border). Surfaces own finish (blur, saturation, opacity, texture, overlay, sheen). Tiers are now orthogonal. Stained/metallic `--material-bg` overrides remain as documented scope for SCSS-1.

### SCSS-3: Components hardcode colors

`DONE` · Size: **L** · Depends on: SCSS-1

`.btn-gold` hardcodes `var(--gold-gradient)`. `.card-baroque` hardcodes `var(--gold-400)`. `.card-stained-glass` defines its own blur/gradient. `.checkbox-baroque`, `.radio-medallion`, `.tabs-carved` all hardcode gold. None respond to material or theme changes.

- Progress: Replaced all hardcoded material-specific variables (`--neu-shadow-dark`, `--neu-shadow-mid`, `--neu-shadow-light`, `--neu-highlight`, `--neu-bg`, `--neu-accent-glow`, `--glass-shadow`) with semantic `--material-*` tokens. Replaced raw accent references (`--gold-400`, `--gold-500`, `--bronze-400`, `rgb(212 168 67 / ...)`) with `--accent-gold`, `--accent-gold-hover`, `--accent-primary`, `--border-accent-gold`, `--border-accent-gold-strong`, and `--badge-bg` tokens. Named color variants (`.btn-gold`, `.badge-gold`) and contrast text (`--gold-900`) excluded as intentional.

### SCSS-4: Themes are coupled to materials

`DONE` · Size: **XL** · Depends on: SCSS-1, SCSS-2

Theme files (`_dark.scss`, `_light.scss`, `_sepia.scss`) defined ~18 material-specific variables (`--neu-bg`, `--neu-shadow-dark`, `--glass-bg`, `--glass-border`, `--metallic-shadow`, `--stone-highlight`, etc.). Themes had knowledge of every material — adding a material required editing every theme file.

- Progress: Themes now define 3 channel tokens (`--shadow-color`, `--highlight-color`, `--accent-glow`) instead of per-material primitives. `_material-system.scss` owns all material primitives (`--neu-*`, `--glass-*`, `--metallic-*`, `--stone-*`) and derives them from channel tokens, with per-theme `[data-theme]` overrides for materials that need unique color bases. Removed `--neu-*` references from `_ornamental.scss` (replaced with `--shadow-color`/`--highlight-color` expressions). Replaced `--neu-accent-glow` with `--accent-glow` in ornament selectors. Added section headers (SEMANTIC TOKENS, CHANNEL TOKENS, COMPONENT TOKENS) to all theme files.

### SCSS-5: Race condition in material defaults

`DONE` · Size: **S**

`:root` fallbacks in `_material-system.scss` were hardcoded colors. Components rendered with midnight blue before JS set `[data-material]`.

- Progress: Replaced hardcoded color fallbacks with chained theme-aware variables (`var(--surface-2)`, `var(--glass-shadow)`, etc.).

### SCSS-6: Z-index scale is broken

`DONE` · Size: **S**

Scale goes 0–50 but `.skip-link` hardcodes `z-index: 9999`. Modal backdrop sits at z-50, colliding with tooltips. No intermediate values.

**Proposed fix:** Semantic z-index scale: `--z-dropdown: 100`, `--z-modal: 200`, `--z-tooltip: 300`, `--z-skip-link: 9999`.

- Progress: Added semantic entries to `$z-indices` map, generated `--z-*` custom properties in `:root`, replaced hardcoded values in skip-link, modal backdrop, CSS tooltip, and JS tooltip enhancer.

### SCSS-7: Transition durations inconsistent

`DONE` · Size: **M**

Duration tokens were defined but unused. Components hardcoded durations and used raw `ease` instead of cubic-bezier tokens.

- Progress: Added easing token map (`$easings`) with `--easing-in`, `--easing-out`, `--easing-in-out` custom properties. Replaced all hardcoded durations and easing values across 11 component/material files with `var(--transition-*)` and `var(--easing-*)` tokens.

### SCSS-8: Naming convention inconsistent

`TODO` · Size: **M**

Single-dash everywhere (`.btn-gold`, `.card-baroque`) except card material variants use BEM double-dash (`.card--neu`, `.card--glass`). Only BEM-style classes in the codebase.

**Proposed fix:** Standardize on one convention everywhere.

### SCSS-9: Theme variable gaps

`DONE` · Size: **S**

Sepia theme was missing `--border-accent-gold-strong` and `--border-accent-gold`. Light and sepia themes were missing `--neu-accent-glow`.

- Progress: Added missing variables to sepia (`--border-accent-gold`, `--border-accent-gold-strong`) and both sepia/light (`--neu-accent-glow`).

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

### SCSS-14: Per-element tier composition

`TODO` · Size: **L** · Depends on: SCSS-4, ORN-1

All 4 tiers should be independently overridable at any element via utility classes or data attributes. Currently `.material-*` and `.surface-*` classes partially work, but full composition — e.g., `<div class="card material-glass surface-frosted ornamented-gilt">` overriding a global `data-material='neu'` — has gaps and is untested.

The tier combination count is linear (t + m + s + o rulesets), not multiplicative (t × m × s × o), because CSS custom properties cascade independently. No combination-specific CSS needs to be generated.

**Proposed fix:**

1. Validate that `.material-*`, `.surface-*`, `[data-theme]`, and ornament classes all work at any DOM depth, not just on `<html>` or `body`.
2. Ensure stacking works: a `.material-glass` child inside a `[data-material='neu']` parent receives glass treatment, not neu.
3. Add `.theme-dark`, `.theme-light`, `.theme-sepia` utility classes as aliases for `[data-theme]` overrides on arbitrary elements (themes define many tokens; a class is more ergonomic than a data attribute for per-element use).
4. Document the composition model and test representative combinations.

### SCSS-15: Extensibility architecture

`TODO` · Size: **L** · Depends on: SCSS-4, SCSS-14

No mechanism for users to add their own theme, material, surface, or ornament without modifying core files. The system should define a clear contract for each tier (which CSS custom properties a custom material must set, etc.) and the TypeScript layer should accept user-defined tier values.

**Proposed fix:**

1. Document the CSS contract per tier:
   - Custom theme: must define `--surface-*`, `--text-*`, `--border-*`, `--accent-*`, `--shadow-*`, `--highlight-*` tokens.
   - Custom material: must define `--material-bg`, `--material-shadow-*`, `--material-border`.
   - Custom surface: must define `--surface-blur`, `--surface-saturation`, `--surface-opacity`, etc.
   - Custom ornament: must define decoration via `box-shadow`/`outline`/`border-image` (no `::before`/`::after` to avoid conflicts per ORN-1).
2. TypeScript types accept user-defined values. Replace strict string literal unions with extensible types (e.g., `BuiltinMaterial | (string & {})`) or a registration API.
3. `warnInvalid()` becomes a registry check rather than a hardcoded array — builtins are pre-registered, user values are registered via config or `registerMaterial()` / `registerTheme()` etc.

---

## Aesthetic Range

### AES-1: Expand material options

`TODO` · Size: **XL** · Depends on: SCSS-4

`flat` and `soft` materials already exist (added in SCSS-1). Metallic and stone are wired into config. The remaining gap is that adding *new* materials still requires editing every theme file to define material-specific shadow/highlight variables. After SCSS-4 decouples themes from materials, new materials can be added by defining a single `[data-material]` / `.material-*` ruleset that derives from generic tokens.

**Proposed fix:** After SCSS-4, validate that the generic token contract is sufficient for new materials. Add any additional materials identified in user research. Ensure new materials work across all themes without theme-specific variable definitions.

### AES-2: Expand surface options

`TODO` · Size: **L** · Depends on: SCSS-4

Polished is closest to neutral but the rest are all strong treatments. No calm option.

**Proposed fix:** Add `matte` (zero sheen, solid color) and `paper`/`linen` (subtle texture at low opacity). After SCSS-4, new surfaces define `--surface-*` tokens only — no theme knowledge needed.

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

`TODO` · Size: **M** · Depends on: AES-1, SCSS-14

Named presets of proven tier combinations as starting points:

- "Corporate Clean" — light, flat, matte, none
- "Luxury Dark" — dark, neu, polished, gilt
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

`DONE` · Size: **M**

CSS import separate from JS with no guidance. Silent failure — components render unstyled. 6 package export paths with no guidance on which to use.

- Progress: Removed redundant `./enhancers` and `./config` subpath exports from `package.json`. `initSoltana()` is now the single entry point — it handles both config and enhancer initialization. Remaining documentation gaps (onboarding guide, import examples) tracked by DOC-9/DOC-10.

### DX-2: Material vs surface confusing

`TODO` · Size: **M** · Depends on: SCSS-2

Both control visual appearance. Both modify blur and opacity. Contradictory configs silently allowed. Mental model needs clarification.

### DX-3: No class discoverability

`TODO` · Size: **M** · Depends on: SCSS-14, SCSS-15

Package exports TypeScript types for config but not for CSS classes. No way to discover `.card-baroque` without reading source. Becomes more critical with per-element composition (SCSS-14) and extensibility (SCSS-15) — developers need to know which `.material-*`, `.surface-*`, and `.ornamented-*` utility classes are available and what custom values have been registered.

**Proposed fix:** Export a class registry or TypeScript const map of available classes per tier and component. Include both builtin and user-registered values.

### DX-4: Enhancers fail silently

`DONE` · Size: **S**

Using `[data-sol-modal]` without `initModals()` produces non-functional element. No warning.

- Progress: `initSoltana()` now auto-initializes all enhancers by default (`enhancers: true`). Opt out with `enhancers: false`. Added `reinit()` for dynamically added `[data-sol-*]` elements. Enhancer cleanup folded into `destroy()` and `reset()`.

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

Can't see the same component in neu vs glass vs metallic side by side. Settings panel changes everything globally.

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
