import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: import.meta.dirname,
  base: './',
  build: {
    outDir: resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // Restrict alias to SCSS inline imports only; TS imports use 'soltana-ui' barrel
      '@soltana/styles': resolve(import.meta.dirname, '../../packages/soltana-ui/src/styles'),
    },
  },
});
