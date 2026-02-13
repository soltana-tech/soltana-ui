import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const isDocsMode = process.env.DOCS === 'true';

export default defineConfig(
  isDocsMode
    ? {
        root: resolve(__dirname, 'docs'),
        base: './',
        build: {
          outDir: resolve(__dirname, 'docs-dist'),
          emptyOutDir: true,
        },
        resolve: {
          alias: {
            '@styles': resolve(__dirname, 'src/styles'),
          },
        },
      }
    : {
        plugins: [
          dts({
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.test.ts', 'docs/**/*'],
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
      }
);
