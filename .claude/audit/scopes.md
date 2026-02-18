# Soltana UI — Audit Scopes

Project-specific audit configuration for Soltana UI. Sections matching global scope names extend those scopes with additional checks. Sections with new names define project-specific scopes.

## tests

### File scope
- `src/**/*.test.ts`

### Checks
- Verify tier interaction testing: tests that combine multiple tier settings (theme + relief + finish + ornament) and assert correct cascade behavior
- Verify enhancer DOM testing: `initModals`, `initTabs`, `initTooltips`, `initAll` are tested against real DOM structures, not just mocked calls
- Verify recipe preset tests validate that named presets produce the expected combination of data attributes
- Verify tests cover per-element overrides via `.theme-*`, `.relief-*`, `.finish-*`, `.ornament-*` utility classes

## logic

### File scope
- `src/config/`
- `src/enhancers/`
- `src/ornaments/`
- `src/plugins/`

### Checks
- Verify public API surface is minimal: only `initSoltana`, `setTheme`, `setRelief`, `setFinish`, `setOrnament`, `setOverrides`, `getState`, `reset`, and enhancer initializers should be exported
- Verify enhancer pattern consistency: all enhancers follow the same initialization, cleanup, and event-binding pattern
- Verify tier option enums are single-source-of-truth (not duplicated across config, types, and validation)
- Verify plugin system does not expose internal state or implementation details

## docs

### File scope
- `docs/`

### Checks
- Verify all public API functions are documented: `initSoltana`, `setTheme`, `setRelief`, `setFinish`, `setOrnament`, `setOverrides`, `getState`, `reset`
- Verify all config types are documented: `Theme`, `Relief`, `Finish`, `Ornament`, `SoltanaConfig`
- Verify all relief options are documented: `flat`, `soft`, `lifted`, `neu`, `sharp`, `hewn`
- Verify all finish options are documented: `matte`, `translucent`, `frosted`, `tinted`, `glossy`
- Verify all ornament options are documented: `none`, `gilt`, `baroque`, `beveled`, `faceted`
- Verify all theme options are documented: `dark`, `light`, `sepia`, `auto`
- Verify all enhancers are documented: `initModals`, `initTabs`, `initTooltips`, `initAll`
- Verify all CSS component classes are documented: buttons, cards, inputs, badges, alerts, avatars, progress, switches, tooltips, tables, modals, skeletons
- Verify all utility classes are documented: relief overrides, finish overrides, neumorphic utilities, ornamental frames/dividers/corners
- Flag features/classes in code that lack documentation
- Flag documented features/classes that do not exist in code
- Verify examples in docs work with current API
- Verify parameter defaults in docs match code defaults
- Verify CSS class names in docs match actual class names in SCSS

## config

### File scope
- `src/config/`

### Checks
- Assess the 4-tier parameter surface: count user-facing options across theme, relief, finish, and ornament tiers and evaluate whether each earns its existence
- Verify `SoltanaConfig` type alignment: all fields in the config type correspond to implemented behavior and vice versa
- Verify recipe presets (`corporate-clean`, `luxury-dark`, etc.) only reference valid tier combinations
- Flag config options that do not surface in any visual or behavioral change
- Verify default values are sensible and documented

## architecture

### File scope
- `src/`
- `docs/`

### Checks
- Verify module separation: styles, config, enhancers, ornaments, and plugins are cleanly separated
- Verify dist/exports alignment: published package exports match the intended public API
- Verify no build artifacts or generated files are committed to source
- Verify consistent file naming conventions across similar modules

## focus

### Reference document
- `.claude/rules/project.md`

### Checks
- Verify competitive positioning claims in project.md match actual codebase capabilities (composable orthogonal tier architecture, per-element composition, etc.)
- Verify CSS-first adherence: JavaScript should only handle runtime config and DOM attribute toggling, not visual styling
- Verify the 4-tier model remains orthogonal: no tier implementation should depend on another tier's state
- Flag any functionality that falls outside the CSS design system purpose
- Verify recipe system serves as curated starting points without hardcoding combinations

## styles

### File scope
- `src/styles/`

### Checks
- Verify orthogonal tier model in SCSS: `--relief-*` and `--finish-*` variable layers cascade independently, no tier stylesheet references another tier's variables directly
- Verify semantic token consumption: components consume semantic tokens (not raw values), enabling auto-switch on data attribute change
- Verify utility class alignment: `.theme-*`, `.relief-*`, `.finish-*`, `.ornament-*` classes correctly override global config at the element level
- Verify additive rulesets: tier count is additive (t + r + f + o rulesets), not multiplicative — no combinatorial explosion of selectors
- Verify theme token parity: all themes (dark, light, sepia) define the same set of custom properties with no gaps
- Flag unused CSS classes or Sass variables
- Flag selector specificity issues that could cause cascade conflicts
- Verify consistent naming conventions across stylesheets
- Flag DRY violations: duplicated style blocks, repeated property sets, or copy-pasted selectors
