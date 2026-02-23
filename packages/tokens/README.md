<div align="center">

# @soltana-ui/tokens

[![npm version](https://img.shields.io/npm/v/@soltana-ui/tokens?color=ff79c6&logo=npm&logoColor=white&labelColor=6272a4)](https://www.npmjs.com/package/@soltana-ui/tokens)
[![License: MIT](https://img.shields.io/badge/License-MIT-8be9fd?logo=opensourceinitiative&logoColor=white&labelColor=6272a4)](LICENSE)

---

Design token compiler for [Soltana UI](../soltana-ui) — outputs Mermaid themes, DTCG JSON, and AI agent documentation.

[Documentation](https://soltana-tech.github.io/soltana-ui/) • [Main Package](../soltana-ui)

---

</div>

## Overview

Compiles Soltana UI's design tokens into multiple output formats optimized for different use cases:

- **Mermaid themes** (JSON) — Runtime theme bridge for diagram synchronization
- **DTCG** (JSON) — Design Tokens Community Group format for interop
- **Agent docs** (YAML) — AI agent-optimized reference with utility classes, component patterns, and API surface

This package is primarily a **build-time tool**. Consumers typically use the compiled outputs, not this package directly.

## Installation

```bash
npm install @soltana-ui/tokens
```

## Usage

### Type Definitions

```typescript
import type { ThemeName, ReliefName, FinishName } from '@soltana-ui/tokens';

const theme: ThemeName = 'dark';
const relief: ReliefName = 'glassmorphic';
const finish: FinishName = 'frosted';
```

### Compiled Outputs

The `dist/` directory contains compiled token formats:

```
dist/
├── mermaid/           # Mermaid theme JSON files
│   ├── dark.json
│   ├── light.json
│   └── sepia.json
├── dtcg/              # DTCG token JSON
│   └── tokens.json
└── agents/            # AI agent reference
    └── reference.yaml
```

Access these files from the package:

```javascript
import darkMermaid from '@soltana-ui/tokens/mermaid/dark.json';
import dtcgTokens from '@soltana-ui/tokens/dtcg/tokens.json';
```

### AI Agent Reference

The `reference.yaml` file ships with this package and provides a structured reference for AI coding agents:

```yaml
tier_system:
  themes: [dark, light, sepia, auto]
  reliefs: [flat, glassmorphic, skeuomorphic, neumorphic]
  finishes: [matte, frosted, tinted, glossy]

utility_classes:
  - .theme-dark
  - .relief-glassmorphic
  - .finish-frosted
  # ... ~1,300 utility classes

components:
  - name: Button
    classes: [.btn, .btn-primary, .btn-secondary, ...]
    # ... component patterns
```

Access via npm package:

```javascript
import { readFileSync } from 'fs';
import { resolve } from 'path';

const yamlPath = resolve('node_modules/@soltana-ui/tokens/dist/agents/reference.yaml');
const reference = readFileSync(yamlPath, 'utf-8');
```

Or fetch from the docs site:

```
https://soltana-tech.github.io/soltana-ui/llms-full.txt
```

## Building from Source

```bash
pnpm install
pnpm run build
```

This compiles `soltana-ui` CSS, extracts tokens, and generates all output formats.

## Output Formats

### Mermaid Themes

JSON theme files compatible with Mermaid's `initialize()` API:

```json
{
  "theme": "base",
  "themeVariables": {
    "primaryColor": "#d4a843",
    "primaryTextColor": "#f5f0e6",
    "primaryBorderColor": "#d4a843",
    ...
  }
}
```

Used by [`@soltana-ui/mermaid`](../mermaid) for runtime synchronization.

### DTCG Tokens

Design Tokens Community Group format for design tool interop (Figma, Style Dictionary, etc.):

```json
{
  "color": {
    "primary": {
      "$type": "color",
      "$value": "#d4a843"
    }
  }
}
```

### Agent Documentation

YAML reference optimized for AI agents, containing:

- Foundation tokens (colors, spacing, typography, shadows)
- ~1,300 utility classes with descriptions
- Component HTML patterns and modifiers
- JavaScript API surface (enhancers, registration, events)
- Tier composition recipes

## Ecosystem

| Package                             | Purpose                 |
| ----------------------------------- | ----------------------- |
| [`soltana-ui`](../soltana-ui)       | Core CSS + JS enhancers |
| [`@soltana-ui/react`](../react)     | React bindings          |
| [`@soltana-ui/mermaid`](../mermaid) | Mermaid theme bridge    |

## License

MIT License - see [LICENSE](../../LICENSE) file for details.
