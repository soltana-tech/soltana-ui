import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const isDocsMode = process.env.DOCS === 'true';

export default defineConfig(
  isDocsMode
    ? {
        // Documentation site build
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
        // Library build
        plugins: [dts()],
        build: {
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'SoltanaTech',
            fileName: 'soltana-tech',
            cssFileName: 'soltana-tech',
          },
          rollupOptions: {
            external: [],
            output: {
              globals: {},
            },
          },
        },
      }
);
