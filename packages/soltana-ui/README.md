<div align="center">

# soltana-ui

[![npm version](https://img.shields.io/npm/v/soltana-ui?color=ff79c6&logo=npm&logoColor=white&labelColor=6272a4)](https://www.npmjs.com/package/soltana-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-8be9fd?logo=opensourceinitiative&logoColor=white&labelColor=6272a4)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-bd93f9?logo=typescript&logoColor=white&labelColor=6272a4)](https://www.typescriptlang.org/)

---

CSS-first design system with a 3-tier orthogonal configuration model: **Theme** × **Relief** × **Finish**.

[Documentation](https://soltana-tech.github.io/soltana-ui/) • [Component Gallery](https://soltana-tech.github.io/soltana-ui/#/explore) • [Playground](https://soltana-tech.github.io/soltana-ui/#/playground)

---

</div>

## Features

- **3-tier orthogonal architecture** — Compose theme (color), relief (shadow model), and finish (surface treatment) independently
- **Per-element composition** — Apply tier configurations globally or per-element via utility classes
- **Runtime registration** — Register custom themes, reliefs, and finishes at runtime
- **16 accessible enhancers** — Modals, tabs, tooltips, accordions, carousels, color pickers, date pickers, and more
- **CSS-first philosophy** — All rendering stays in CSS; JS only handles behavior and injects runtime-computed values

## Installation

```bash
npm install soltana-ui
```

## Quick Start

### HTML + CDN

```html
<!DOCTYPE html>
<html data-theme="dark" data-relief="glassmorphic" data-finish="frosted">
  <head>
    <link rel="stylesheet" href="https://unpkg.com/soltana-ui/dist/soltana-ui.css" />
  </head>
  <body>
    <button class="btn btn-primary">Hello Soltana</button>
    <script type="module">
      import { loadSoltanaFonts } from 'https://unpkg.com/soltana-ui';
      loadSoltanaFonts();
    </script>
  </body>
</html>
```

### Import CSS + JS

```typescript
import 'soltana-ui/css';
import { loadSoltanaFonts, initModals, initTooltips } from 'soltana-ui';

loadSoltanaFonts();
initModals();
initTooltips();
```

### Using SCSS Source

```scss
@use 'soltana-ui/scss' as soltana;
```

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

## Runtime Registration

```typescript
import { registerTheme, registerRelief, registerFinish } from 'soltana-ui';

// Register a custom theme from seed colors
registerTheme({
  name: 'ocean',
  seedColors: {
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#3b82f6',
  },
});

// Register a custom relief
registerRelief({
  name: 'lifted',
  tokens: {
    '--shadow-near': '0 4px 8px rgba(0,0,0,0.2)',
    '--shadow-far': '0 12px 24px rgba(0,0,0,0.3)',
  },
});
```

## PostCSS Tree-Shaking

Remove unused tier CSS in production:

```javascript
// postcss.config.mjs
import soltanaTreeshake from 'soltana-ui/postcss';

export default {
  plugins: [
    soltanaTreeshake({
      keep: ['dark', 'light', 'glassmorphic', 'neumorphic', 'frosted', 'matte'],
    }),
  ],
};
```

## Ecosystem

| Package                             | Purpose                                                        |
| ----------------------------------- | -------------------------------------------------------------- |
| [`@soltana-ui/tokens`](../tokens)   | Token compiler — outputs Mermaid themes, DTCG JSON, agent docs |
| [`@soltana-ui/react`](../react)     | React bindings — `useSoltana()` hook, `SoltanaProvider`        |
| [`@soltana-ui/mermaid`](../mermaid) | Mermaid theme bridge for diagram synchronization               |

## Documentation

- **[Full Documentation](https://soltana-tech.github.io/soltana-ui/)**
- **[Component Gallery](https://soltana-tech.github.io/soltana-ui/#/explore)** — Live interactive previews of all components
- **[Playground](https://soltana-tech.github.io/soltana-ui/#/playground)** — Experiment with tier combinations
- **[Component Reference](https://soltana-tech.github.io/soltana-ui/#/reference/components)** — CSS class reference for all components
- **[AI Agent Reference](https://soltana-tech.github.io/soltana-ui/llms-full.txt)** — Machine-readable reference for AI agents

## License

MIT License - see [LICENSE](../../LICENSE) file for details.
