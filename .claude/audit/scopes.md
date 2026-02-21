# Soltana UI — Audit Scopes

Project-specific audit configuration for Soltana UI. Sections
matching global scope names extend those scopes with additional
checks. Sections with new names define project-specific scopes.

## tests

### Tests file scope

- `src/**/*.test.ts`

### Tests checks

- Verify tier interaction testing: tests that combine multiple
  tier settings (theme + relief + finish) and assert
  correct cascade behavior
- Verify enhancer DOM testing: `initModals`, `initTabs`,
  `initTooltips`, `initAll` are tested against real DOM
  structures, not just mocked calls
- Verify tests cover per-element overrides via `.theme-*`,
  `.relief-*`, `.finish-*` utility classes

## logic

### Logic file scope

- `src/config/`
- `src/enhancers/`
- `src/plugins/`

### Logic checks

- Verify public API surface is minimal: only `initSoltana`,
  `setTheme`, `setRelief`, `setFinish`, `setOverrides`,
  `getState`, `reset`, and enhancer initializers should be
  exported
- Verify enhancer pattern consistency: all enhancers follow
  the same initialization, cleanup, and event-binding pattern
- Verify tier option enums are single-source-of-truth
  (not duplicated across config, types, and validation)
- Verify plugin system does not expose internal state or
  implementation details

## docs

### Docs file scope

- `apps/docs/`

### Docs checks

- Verify all public API functions are documented:
  `initSoltana`, `setTheme`, `setRelief`, `setFinish`,
  `setOverrides`, `getState`, `reset`
- Verify all config types are documented: `Theme`, `Relief`,
  `Finish`, `SoltanaConfig`
- Verify all relief options are documented: `flat`,
  `glassmorphic`, `skeuomorphic`, `neumorphic`
- Verify all finish options are documented: `matte`,
  `frosted`, `tinted`, `glossy`
- Verify all theme options are documented: `dark`, `light`,
  `sepia`, `auto`
- Verify all enhancer initializers exported from
  src/enhancers/index.ts are documented
- Verify all CSS component classes are documented: buttons,
  cards, inputs, badges, alerts, avatars, progress, switches,
  tooltips, tables, modals, skeletons
- Verify all utility classes are documented: relief overrides,
  finish overrides, neumorphic utilities
- Flag features/classes in code that lack documentation
- Flag documented features/classes that do not exist in code
- Verify examples in docs work with current API
- Verify parameter defaults in docs match code defaults
- Verify CSS class names in docs match actual class names
  in SCSS

## config

### Config file scope

- `src/config/`

### Config checks

- Assess the 3-tier parameter surface: count user-facing
  options across theme, relief, and finish tiers and evaluate
  whether each earns its existence
- Verify `SoltanaConfig` type alignment: all fields in the
  config type correspond to implemented behavior and vice
  versa
- Flag config options that do not surface in any visual or
  behavioral change
- Verify default values are sensible and documented

## architecture

### Architecture file scope

- `src/`
- `docs/`

### Architecture checks

- Verify module separation: styles, config, enhancers, and
  plugins are cleanly separated
- Verify dist/exports alignment: published package exports
  match the intended public API
- Verify no build artifacts or generated files are committed
  to source
- Verify consistent file naming conventions across similar
  modules

## focus

### Reference document

- `.claude/rules/project.md`

### Focus checks

- Verify competitive positioning claims in project.md match
  actual codebase capabilities (composable orthogonal tier
  architecture, per-element composition, etc.)
- Verify CSS-first adherence: JavaScript should only handle
  runtime config and DOM attribute toggling, not visual
  styling
- Verify the 3-tier model remains orthogonal: no tier
  implementation should depend on another tier's state
- Flag any functionality that falls outside the CSS design
  system purpose

## styles

### Styles file scope

- `src/styles/`

### Styles checks

- Verify orthogonal tier model in SCSS: `--relief-*` and
  `--finish-*` variable layers cascade independently, no
  tier stylesheet references another tier's variables directly
- Verify semantic token consumption: components consume
  semantic tokens (not raw values), enabling auto-switch on
  data attribute change
- Verify utility class alignment: `.theme-*`, `.relief-*`,
  `.finish-*` classes correctly override global config at the
  element level
- Verify additive rulesets: tier count is additive
  (t + r + f rulesets), not multiplicative — no
  combinatorial explosion of selectors
- Verify theme token parity: all themes (dark, light, sepia)
  define the same set of custom properties with no gaps
- Flag unused CSS classes or Sass variables
- Flag selector specificity issues that could cause cascade
  conflicts
- Verify consistent naming conventions across stylesheets
- Flag DRY violations: duplicated style blocks, repeated
  property sets, or copy-pasted selectors
