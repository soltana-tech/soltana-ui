import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  base: './',
  build: {
    outDir: resolve(__dirname, '../../docs-dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // Restrict alias to SCSS inline imports only; TS imports use 'soltana-ui' barrel
      '@soltana/styles': resolve(__dirname, '../../packages/soltana-ui/src/styles'),
    },
  },
});
