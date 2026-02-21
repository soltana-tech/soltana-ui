---
name: new-token-format
description: Scaffold a new token output format with matching test file in @soltana-ui/tokens
---

# New Token Format

Scaffold a new output format for the `@soltana-ui/tokens` compiler.

## Arguments

- `name` (required): The format name, e.g. `highcharts`, `chartjs`, `d3`

## Process

1. **Read existing formats for patterns.** Read at least two of these files to
   understand the conventions:
   - `packages/tokens/src/formats/echarts.ts`
   - `packages/tokens/src/formats/mermaid.ts`
   - `packages/tokens/src/formats/echarts.test.ts`
   - `packages/tokens/src/formats/mermaid.test.ts`
   - `packages/tokens/src/build.ts` (to see wiring)
   - `packages/tokens/src/types.ts` (for `ThemeTokens`, `FoundationTokens`)

2. **Read the target library's theme/config API.** Use context7 or web search
   to understand what shape the output object needs to be.

3. **Create the format file** at `packages/tokens/src/formats/<name>.ts`:
   - Export a `build<Name>Theme(theme, foundation)` function
   - Import `buildPalette` from `../resolve.js` for the 6-color palette
   - Import `withAlpha` from `@soltana-ui/chart-shared` if opacity is needed
   - Map Soltana tokens to the target library's theme structure
   - Use the same header comment pattern as existing formats

4. **Create the test file** at `packages/tokens/src/formats/<name>.test.ts`:
   - Import from `../__fixtures__/tokens.js` for test data
   - Test palette length, background color, text color, font family at minimum
   - Follow the same `describe`/`it` structure as existing test files

5. **Wire into build.ts**:
   - Add import for the new format function
   - Add output block in the theme loop (follow the pattern of existing blocks)
   - Ensure the output directory is created with `ensureDir`

6. **Verify**:
   - `pnpm --filter @soltana-ui/tokens test` — tests pass
   - `pnpm --filter @soltana-ui/tokens build` — format files are generated
   - `pnpm --filter @soltana-ui/tokens type-check` — no type errors
