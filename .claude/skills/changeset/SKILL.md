---
name: changeset
description: Create a changeset scoped to packages affected by current changes
---

# Changeset

Create a properly scoped changeset for the current branch's changes.

## Context

This monorepo uses [Changesets](https://github.com/changesets/changesets) for
versioning and release notes. Key config from `.changeset/config.json`:

- **Fixed**: `soltana-ui` and `@soltana-ui/tokens` version together
- **Linked**: `@soltana-ui/echarts`, `@soltana-ui/plotly`, `@soltana-ui/react`
  share version ranges
- **Ignored**: `@soltana-ui/docs` (not published)

## Process

1. **Identify changed packages.** Run `git diff main --name-only` and map
   file paths to packages:

   | Path prefix              | Package                    |
   | ------------------------ | -------------------------- |
   | `packages/soltana-ui/`   | `soltana-ui`               |
   | `packages/tokens/`       | `@soltana-ui/tokens`       |
   | `packages/echarts/`      | `@soltana-ui/echarts`      |
   | `packages/plotly/`       | `@soltana-ui/plotly`       |
   | `packages/mermaid/`      | `@soltana-ui/mermaid`      |
   | `packages/react/`        | `@soltana-ui/react`        |
   | `packages/chart-shared/` | `@soltana-ui/chart-shared` |

2. **Determine bump type** based on the nature of changes:
   - `patch`: Bug fixes, internal refactors, dependency updates
   - `minor`: New features, new token formats, new utility classes
   - `major`: Breaking API changes, removed tokens, renamed exports

3. **Account for fixed/linked groups.** If `soltana-ui` is changed,
   `@soltana-ui/tokens` must also be included (and vice versa) since
   they are in the `fixed` group.

4. **Write the changeset.** Create a file at `.changeset/<slug>.md`:

   ```markdown
   ---
   '<package-1>': <bump-type>
   '<package-2>': <bump-type>
   ---

   <One-line summary of the change from the user's perspective.>
   ```

   The slug should be a short kebab-case descriptor (e.g., `add-highcharts-format`).

5. **Verify.** Run `pnpm changeset status` to confirm the changeset is valid.
