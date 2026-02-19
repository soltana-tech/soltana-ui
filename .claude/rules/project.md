# Soltana UI — Project Context

## What Soltana UI Is

A CSS-first design system built around a 3-tier configuration model:

| Tier   | Options                                      | Mechanism                   |
| ------ | -------------------------------------------- | --------------------------- |
| Theme  | dark, light, sepia, auto\*                   | `[data-theme]` on `<html>`  |
| Relief | flat, glassmorphic, skeuomorphic, neumorphic | `[data-relief]` on `<html>` |
| Finish | matte, frosted, tinted, glossy               | `[data-finish]` on `<html>` |

\* `auto` resolves to dark or light via
`prefers-color-scheme`. It is a runtime resolver, not a static
token set — there is no `.theme-auto` utility class.

## Competitive Positioning

We are not aware of any existing CSS design system that offers
a composable, orthogonal tier architecture where shadow model
(relief), surface treatment (finish), and color scheme (theme)
are composable per-element. The unique value is the 3-axis
configuration model — not any single visual style, but the
ability to compose them.

## Strengths to Preserve

- **Token system architecture** — Sass maps generate
  compile-time variables and `:root` custom properties in
  parallel. Production-grade.
- **Typography scale** — `[font-size, line-height]` tuples
  that scale intelligently. Thoughtful and correct.
- **Orthogonal tier model** — `--relief-*` and `--finish-*`
  variable layers cascade independently. Components consume
  semantic tokens and auto-switch on data attribute change.
  Tier count is additive (t + r + f rulesets), not
  multiplicative. Channel tokens (`--shadow-color`,
  `--highlight-color`) are a valid low-level API for
  composing contextual shadows in `rgb()` expressions.
- **Per-element composition** — `.theme-*`, `.relief-*`,
  `.finish-*` utility classes override global config at any
  element. Enables mixed-tier layouts without custom CSS.
- **Accessibility foundation** — `prefers-reduced-motion`,
  `prefers-contrast`, `.sr-only`, `.skip-link`, focus rings.
  Solid base layer.
- **Recipe system** — Named presets (`corporate-clean`,
  `luxury-dark`, etc.) as curated starting points. Demonstrates
  the tier model without hardcoding combinations.
- **Decorative typography** — `--font-display` maps to
  Cinzel Decorative for ornamental headings and branding
  elements, complementing the primary `--font-serif` (Cinzel)
  and `--font-sans` (Raleway) stacks.
- **Utility classes** — General-purpose layout, spacing, and
  visual utilities (`src/styles/utilities/`) shipped as a
  convenience layer. Not part of the 3-tier model, but
  complementary. Consumers using the SCSS source can exclude
  this module by omitting `@use 'utilities'` from their entry
  point.

## Ecosystem Packages

The monorepo includes charting and framework integration
packages that extend the core design system:

| Package               | Purpose                                                        |
| --------------------- | -------------------------------------------------------------- |
| `@soltana-ui/tokens`  | Token compiler -- outputs ECharts, Plotly, mplstyle, DTCG JSON |
| `@soltana-ui/echarts` | ECharts theme bridge (runtime + static JSON)                   |
| `@soltana-ui/plotly`  | Plotly template bridge (runtime + static JSON)                 |
| `@soltana-ui/react`   | React bindings -- `useSoltana()` hook + `SoltanaProvider`      |
| `soltana-matplotlib`  | Python package -- pre-built `.mplstyle` themes                 |

These are intentional scope extensions. The charting bridges
read live CSS custom properties at runtime and map them to
library-specific theme objects, keeping visualizations in sync
with the active tier configuration.

## Issue Tracking

All project issues are tracked via GitHub Issues on the
`soltana-tech/soltana-ui` repository. Use the `/issues` skill
to interact with them.

### Issue Types

Types are tracked via GitHub's native Issue Type field
(org-level), not labels:

| Type     | Use for                                                                     |
| -------- | --------------------------------------------------------------------------- |
| Bug      | Broken behavior or incorrect output                                         |
| Feature  | New user-facing capability or functionality                                 |
| Security | Security vulnerability or hardening                                         |
| Task     | Internal, operational, or DX work that does not change user-facing behavior |

### Label Taxonomy

**Layer**: `layer: scss`, `layer: typescript`, `layer: docs`
**Triage**: `triage: invalid`, `triage: wontfix`
**Size**: `size: S`, `size: M`, `size: L`, `size: XL`
**Status**: `status: blocked`

### Issue Creation Conventions

When creating issues via `/issues create`, gather:

- **Issue type**: Bug, Feature, Security, or Task
  (set via GitHub Issue Types, not labels)
- **Layer label**: `layer: scss`, `layer: typescript`,
  `layer: docs`, or none
- **Size label**: `size: S`, `size: M`, `size: L`, `size: XL`
- **Description**
- **Proposed fix** (optional)
- **Dependencies** (optional — if provided, also add
  `status: blocked` label)

Issue body template:

```markdown
## Description

<description>

## Proposed fix

<proposed fix or "N/A">

## Dependencies

<Depends on #N, #M or "None">
```

### Priority Heuristics

When recommending the next issue via `/issues next`:

1. Exclude issues labeled `status: blocked`
2. **Type**: Bug > Security > Task > Feature
3. **Size**: `size: S` > `size: M` > `size: L` > `size: XL`
4. **Age**: lower issue number first (older issues)
