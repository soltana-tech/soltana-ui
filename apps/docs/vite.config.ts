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
      '@soltana': resolve(__dirname, '../../packages/soltana-ui/src'),
    },
  },
});
