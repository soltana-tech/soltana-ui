# Soltana UI — Project Context

## What Soltana UI Is

A CSS-first design system built around a 4-tier configuration model:

| Tier | Options | Mechanism |
|------|---------|-----------|
| Theme | dark, light, sepia, auto* | `[data-theme]` on `<html>` |
| Relief | flat, soft, lifted, neu, sharp, hewn | `[data-relief]` on `<html>` |
| Finish | matte, translucent, frosted, tinted, glossy | `[data-finish]` on `<html>` |
| Ornament | none, gilt, baroque, beveled, faceted | `[data-ornament]` on `<html>` |

\* `auto` resolves to dark or light via `prefers-color-scheme`. It is a runtime resolver, not a static token set — there is no `.theme-auto` utility class.

Classical "estate" aesthetic with gold accents, jewel tones, serif typography (Cinzel + Raleway). Ships ~139KB CSS + ~10KB JS with TypeScript enhancers for modals, tabs, and tooltips.

## Competitive Positioning

No existing CSS design system offers a composable, orthogonal tier architecture where shadow model (relief), surface treatment (finish), decoration (ornament), and color scheme (theme) are independently configurable per-element. The niche is real and unoccupied. The unique value is the 4-axis configuration model — not any single visual style, but the ability to compose them.

## Strengths to Preserve

- **Token system architecture** — Sass maps generate compile-time variables and `:root` custom properties in parallel. Production-grade.
- **Typography scale** — `[font-size, line-height]` tuples that scale intelligently. Thoughtful and correct.
- **Orthogonal tier model** — `--relief-*` and `--finish-*` variable layers cascade independently. Components consume semantic tokens and auto-switch on data attribute change. Tier count is additive (t + r + f + o rulesets), not multiplicative.
- **Per-element composition** — `.theme-*`, `.relief-*`, `.finish-*`, `.ornament-*` utility classes override global config at any element. Enables mixed-tier layouts without custom CSS.
- **Accessibility foundation** — `prefers-reduced-motion`, `prefers-contrast`, `.sr-only`, `.skip-link`, focus rings. Solid base layer.
- **Recipe system** — Named presets (`corporate-clean`, `luxury-dark`, etc.) as curated starting points. Demonstrates the tier model without hardcoding combinations.

## Issue Tracking

All project issues are tracked via GitHub Issues on the `soltana-tech/soltana-ui` repository. Use the `/issues` skill to interact with them. Reference issues in commits with `#N` and auto-close with `Fixes #N`.

### Label Taxonomy

**Layer**: `layer: scss`, `layer: typescript`, `layer: docs`
**Type**: `type: bug`, `type: feature`, `type: security`
**Triage**: `triage: invalid`, `triage: wontfix`
**Size**: `size: S`, `size: M`, `size: L`, `size: XL`
**Status**: `status: blocked`
