import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
      entryRoot: 'src',
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'soltana-echarts.js',
    },
    rollupOptions: {
      external: ['echarts', 'soltana-ui'],
    },
    minify: 'esbuild',
    sourcemap: false,
  },
});
