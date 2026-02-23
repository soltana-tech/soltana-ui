<div align="center">

# Soltana UI

[![npm version](https://img.shields.io/npm/v/soltana-ui?color=ff79c6&logo=npm&logoColor=white&labelColor=6272a4)](https://www.npmjs.com/package/soltana-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-8be9fd?logo=opensourceinitiative&logoColor=white&labelColor=6272a4)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-bd93f9?logo=typescript&logoColor=white&labelColor=6272a4)](https://www.typescriptlang.org/)
[![CI](https://img.shields.io/github/actions/workflow/status/soltana-tech/soltana-ui/ci.yml?label=CI&logo=github&logoColor=white&color=50fa7b&labelColor=6272a4)](https://github.com/soltana-tech/soltana-ui/actions/workflows/ci.yml)

---

CSS-first design system with a 3-tier orthogonal configuration model:
**Theme** × **Relief** × **Finish**.

[Documentation](https://soltana-tech.github.io/soltana-ui/) •
[Component Gallery](https://soltana-tech.github.io/soltana-ui/#/explore) •
[Playground](https://soltana-tech.github.io/soltana-ui/#/playground) •
[npm](https://www.npmjs.com/package/soltana-ui)

---

</div>

## Features

- **3-tier orthogonal architecture** — Compose theme (color), relief
  (shadow model), and finish (surface treatment) independently
- **Per-element composition** — Apply tier configurations globally or
  per-element via utility classes
- **Runtime registration** — Register custom themes, reliefs, and finishes
  at runtime
- **16 accessible enhancers** — Modals, tabs, tooltips, accordions,
  carousels, color pickers, date pickers, and more
- **CSS-first philosophy** — All rendering stays in CSS; JS only handles
  behavior and injects runtime-computed values
- **Diagramming integration** — Theme bridge for Mermaid with automatic
  synchronization

## Installation

```bash
npm install soltana-ui
```

See the [main package README](packages/soltana-ui) for quick start guide and
usage examples.

## Packages

| Package                                   | Version                                                                                                                    | Description                                                    |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [`soltana-ui`](packages/soltana-ui)       | [![npm](https://img.shields.io/npm/v/soltana-ui?color=ff79c6)](https://www.npmjs.com/package/soltana-ui)                   | Core CSS + JS enhancers                                        |
| [`@soltana-ui/tokens`](packages/tokens)   | [![npm](https://img.shields.io/npm/v/@soltana-ui/tokens?color=ff79c6)](https://www.npmjs.com/package/@soltana-ui/tokens)   | Token compiler — outputs Mermaid themes, DTCG JSON, agent docs |
| [`@soltana-ui/react`](packages/react)     | [![npm](https://img.shields.io/npm/v/@soltana-ui/react?color=ff79c6)](https://www.npmjs.com/package/@soltana-ui/react)     | React bindings — `useSoltana()` hook, `SoltanaProvider`        |
| [`@soltana-ui/mermaid`](packages/mermaid) | [![npm](https://img.shields.io/npm/v/@soltana-ui/mermaid?color=ff79c6)](https://www.npmjs.com/package/@soltana-ui/mermaid) | Mermaid theme bridge for diagram synchronization               |

## Documentation

- **[Full Documentation](https://soltana-tech.github.io/soltana-ui/)**
- **[Component Gallery](https://soltana-tech.github.io/soltana-ui/#/explore)**
  — Live interactive previews of all components
- **[Playground](https://soltana-tech.github.io/soltana-ui/#/playground)** —
  Experiment with tier combinations
- **[Component Reference](https://soltana-tech.github.io/soltana-ui/#/reference/components)**
  — CSS class reference for all components
- **[AI Agent Reference](https://soltana-tech.github.io/soltana-ui/llms-full.txt)**
  — Machine-readable reference for AI agents

## The 3-Tier Model

| Tier       | Options                                              | Global Activation                   | Per-Element Class      |
| ---------- | ---------------------------------------------------- | ----------------------------------- | ---------------------- |
| **Theme**  | `dark`, `light`, `sepia`, `auto`                     | `<html data-theme="dark">`          | `.theme-dark`          |
| **Relief** | `flat`, `glassmorphic`, `skeuomorphic`, `neumorphic` | `<html data-relief="glassmorphic">` | `.relief-glassmorphic` |
| **Finish** | `matte`, `frosted`, `tinted`, `glossy`               | `<html data-finish="frosted">`      | `.finish-frosted`      |

```html
<!-- Global tier activation -->
<html data-theme="dark" data-relief="neumorphic" data-finish="matte">
  <!-- Per-element tier override -->
  <div class="card theme-light relief-flat finish-glossy">Mixed tier configuration</div>
</html>
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm run test

# Start docs dev server
pnpm --filter @soltana-ui/docs dev
```

## AI Agent Reference

Machine-readable reference formats are provided for AI agents:

- `.claude/reference.yaml` — YAML format for development with ~1,300 utility
  classes, component patterns, and API surface
- `/llms.txt` and `/llms-full.txt` — Served from the docs site for web-based
  agent access
- `@soltana-ui/tokens` exports `./agents/reference.yaml` for npm consumers

These files are auto-generated on build and stay in sync with the codebase.

## License

MIT License - see [LICENSE](LICENSE) file for details.
