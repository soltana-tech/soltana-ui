# soltana-ui

A CSS-first design system with a 3-tier configuration model (theme, relief, finish).

## PostCSS Plugin

The tree-shake plugin (`soltana-ui/postcss`) is **ESM-only**. If your PostCSS
configuration is CommonJS (`postcss.config.js`), rename it to
`postcss.config.mjs`:

```js
// postcss.config.mjs
import soltanaTreeshake from 'soltana-ui/postcss';

export default {
  plugins: [soltanaTreeshake({ keep: ['dark', 'light'] })],
};
```
