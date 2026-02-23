<div align="center">

# @soltana-ui/react

[![npm version](https://img.shields.io/npm/v/@soltana-ui/react?color=ff79c6&logo=npm&logoColor=white&labelColor=6272a4)](https://www.npmjs.com/package/@soltana-ui/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-8be9fd?logo=opensourceinitiative&logoColor=white&labelColor=6272a4)](LICENSE)
[![React](https://img.shields.io/badge/React-18|19-bd93f9?logo=react&logoColor=white&labelColor=6272a4)](https://react.dev/)

---

React bindings for [Soltana UI](../soltana-ui) — `useSoltana()` hook, `SoltanaProvider`, and 13 enhancer hooks.

[Documentation](https://soltana-tech.github.io/soltana-ui/) • [Main Package](../soltana-ui)

---

</div>

## Features

- **`useSoltana()` hook** — Access and control active tier configuration
- **`SoltanaProvider`** — Initialize Soltana UI with tier config and font loading
- **13 enhancer hooks** — React wrappers for Soltana UI's JS enhancers (modals, tooltips, accordions, etc.)
- **Toast API re-exports** — `showToast()` and `dismissToast()` for imperative toast notifications
- **ESM-only** — Modern React ecosystem compatibility

## Installation

```bash
npm install @soltana-ui/react soltana-ui
```

**Peer dependencies:** `react@^18.0.0 || ^19.0.0`, `react-dom@^18.0.0 || ^19.0.0`, `soltana-ui`

## Quick Start

```tsx
import { SoltanaProvider, useSoltana } from '@soltana-ui/react';
import 'soltana-ui/css';

function App() {
  return (
    <SoltanaProvider theme="dark" relief="glassmorphic" finish="frosted" loadFonts>
      <YourApp />
    </SoltanaProvider>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useSoltana();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

## API

### `SoltanaProvider`

Root provider that initializes Soltana UI and optionally loads fonts.

```tsx
<SoltanaProvider
  theme="dark" // Initial theme (optional)
  relief="neumorphic" // Initial relief (optional)
  finish="matte" // Initial finish (optional)
  loadFonts // Load Google Fonts (optional)
>
  <App />
</SoltanaProvider>
```

**Props:**

- `theme?: 'dark' | 'light' | 'sepia' | 'auto'` — Initial theme (default: current HTML attribute or 'dark')
- `relief?: 'flat' | 'glassmorphic' | 'skeuomorphic' | 'neumorphic'` — Initial relief (default: current HTML attribute)
- `finish?: 'matte' | 'frosted' | 'tinted' | 'glossy'` — Initial finish (default: current HTML attribute)
- `loadFonts?: boolean` — Load Raleway, Cinzel, Cinzel Decorative, and JetBrains Mono from Google Fonts

### `useSoltana()`

Access and control the active tier configuration.

```tsx
const { theme, relief, finish, setTheme, setRelief, setFinish } = useSoltana();

// Read current tiers
console.log(theme); // 'dark'
console.log(relief); // 'glassmorphic'
console.log(finish); // 'frosted'

// Update tiers
setTheme('light');
setRelief('flat');
setFinish('matte');
```

**Returns:**

- `theme: 'dark' | 'light' | 'sepia'` — Current resolved theme (never 'auto')
- `relief: ReliefName | null` — Current relief
- `finish: FinishName | null` — Current finish
- `setTheme: (theme: ThemeName) => void` — Update theme
- `setRelief: (relief: ReliefName) => void` — Update relief
- `setFinish: (finish: FinishName) => void` — Update finish

### Enhancer Hooks

React wrappers for Soltana UI's JS enhancers. Call during component mount:

```tsx
import { useModals, useTooltips, useAccordions } from '@soltana-ui/react';

function MyComponent() {
  useModals(); // Initialize modals
  useTooltips(); // Initialize tooltips
  useAccordions(); // Initialize accordions

  return <button data-modal-open="my-modal">Open Modal</button>;
}
```

**Available hooks:**

- `useModals()` — Modal dialogs
- `useDrawers()` — Slide-in drawers
- `useTooltips()` — Tooltips (viewport-aware)
- `useToasts()` — Toast notifications
- `useAccordions()` — Collapsible sections
- `useTabs()` — Tab navigation
- `useCarousels()` — Content carousels
- `useComboboxes()` — Filterable dropdowns
- `useColorPickers()` — HSV color pickers
- `useContextMenus()` — Right-click menus
- `useDatePickers()` — Calendar date selection
- `useHoverCards()` — Hover-activated cards
- `useToggles()` — Toggle switches

### Toast API

Imperative toast notifications:

```tsx
import { showToast, dismissToast } from '@soltana-ui/react';

// Show a toast
const toastEl = showToast({
  variant: 'success',
  title: 'Saved',
  body: 'Changes saved successfully.',
  duration: 3000, // Auto-dismiss after 3s (optional)
});

// Manually dismiss
dismissToast(toastEl);
```

**`showToast()` options:**

- `variant?: 'success' | 'error' | 'warning' | 'info'` — Toast style (default: no variant)
- `title?: string` — Toast header text
- `body?: string` — Toast body text
- `duration?: number` — Auto-dismiss delay in milliseconds (optional)
- `position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'` — Container position (default: 'top-right')

## TypeScript

Full TypeScript support with exported types:

```typescript
import type { ThemeName, ReliefName, FinishName } from '@soltana-ui/react';
```

## Ecosystem

| Package                             | Purpose                 |
| ----------------------------------- | ----------------------- |
| [`soltana-ui`](../soltana-ui)       | Core CSS + JS enhancers |
| [`@soltana-ui/tokens`](../tokens)   | Token compiler          |
| [`@soltana-ui/mermaid`](../mermaid) | Mermaid theme bridge    |

## Documentation

- **[Full Documentation](https://soltana-tech.github.io/soltana-ui/)**
- **[Component Gallery](https://soltana-tech.github.io/soltana-ui/#/explore)**
- **[Main Package README](../soltana-ui)**

## License

MIT License - see [LICENSE](../../LICENSE) file for details.
