---
name: new-component
description: Scaffold a new SCSS component with test fixture and visual regression coverage
---

# New Component

Scaffold a new component in the Soltana UI design system, following established
patterns for SCSS structure, test fixtures, and visual regression coverage.

## Arguments

- `name` (required): Component name in kebab-case, e.g. `slider`, `progress-bar`

## Process

1. **Study existing components for patterns.** Read at least two of these to
   understand the conventions:
   - `packages/soltana-ui/src/styles/components/_badges.scss` (simple)
   - `packages/soltana-ui/src/styles/components/_cards.scss` (complex)
   - `packages/soltana-ui/src/styles/components/_index.scss` (barrel)

   Key patterns to follow:
   - File named `_<name>.scss` with leading underscore
   - Header comment block with component name and description
   - `@use '../base/register' as *` and `@use '../base/transitions' as *`
   - Use `var(--*)` design tokens, never hardcoded values
   - Use `--relief-*` variables for automatic relief switching
   - Use `@include transition-interactive()` for interactive states
   - Support semantic color variants via `@each` loops when applicable

2. **Create the SCSS file** at
   `packages/soltana-ui/src/styles/components/_<name>.scss`.

3. **Register in the barrel file.** Add `@use '<name>'` to
   `packages/soltana-ui/src/styles/components/_index.scss`,
   maintaining alphabetical order.

4. **Add a test fixture.** If the component needs visual regression coverage,
   add HTML markup to the appropriate fixture file in `tests/fixtures/`.
   Reference `tests/fixtures/soltana-page.ts` to understand how page
   fixtures compose component markup.

5. **Check for enhancer needs.** If the component requires JavaScript
   behavior (keyboard navigation, focus management, ARIA updates),
   create an enhancer at `packages/soltana-ui/src/enhancers/<name>.ts`
   following the pattern of existing enhancers (e.g., `tooltip.ts`,
   `modal.ts`). Register it in `packages/soltana-ui/src/enhancers/index.ts`.

6. **Verify**:
   - `pnpm --filter soltana-ui build` — builds without errors
   - `pnpm --filter soltana-ui test` — unit tests pass
   - `pnpm test:e2e:visual` — visual regression (update snapshots if needed)

7. **Update agent reference.** Run `pnpm --filter @soltana-ui/tokens build`
   to regenerate `reference.yaml` with the new component's patterns.
