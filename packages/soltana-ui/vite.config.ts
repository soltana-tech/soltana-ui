import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

export default defineConfig({
  define: {
    __SOLTANA_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SoltanaUI',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'umd') return 'soltana-ui.umd.cjs';
        return 'soltana-ui.js';
      },
    },
    cssFileName: 'soltana-ui',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'soltana-ui.css';
          }
          return assetInfo.name ?? 'assets/[name]-[hash][extname]';
        },
      },
    },
    minify: 'esbuild',
    sourcemap: false,
  },
});
