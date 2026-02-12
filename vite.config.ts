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
        plugins: [
          dts({
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.test.ts', 'docs/**/*'],
          }),
        ],
        build: {
          lib: {
            entry: {
              'soltana-ui': resolve(__dirname, 'src/index.ts'),
              runtime: resolve(__dirname, 'src/runtime/index.ts'),
            },
            name: 'SoltanaUI',
            formats: ['es', 'umd'],
            fileName: (format, entryName) => {
              if (format === 'umd') {
                return `${entryName}.umd.cjs`;
              }
              return `${entryName}.js`;
            },
          },
          cssFileName: 'soltana-ui',
          rollupOptions: {
            external: [],
            output: {
              globals: {},
              // Ensure CSS is extracted to a single file
              assetFileNames: (assetInfo) => {
                if (assetInfo.name?.endsWith('.css')) {
                  return 'soltana-ui.css';
                }
                return assetInfo.name ?? 'assets/[name]-[hash][extname]';
              },
            },
          },
          // Generate minified version
          minify: 'terser',
          sourcemap: false,
        },
        define: {
          // Ensure custom element definitions are preserved
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }
);
