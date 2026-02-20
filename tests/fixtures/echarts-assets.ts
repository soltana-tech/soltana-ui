import fs from 'node:fs';
import path from 'node:path';
import { getCSS } from './assets';

const ECHARTS_JS_PATH = path.resolve('packages/echarts/node_modules/echarts/dist/echarts.min.js');

const THEME_DIR = path.resolve('packages/tokens/dist/echarts');

let echartsJsCache: string | null = null;
const themeJsonCache = new Map<string, string>();

export function getEChartsJS(): string {
  if (!echartsJsCache) echartsJsCache = fs.readFileSync(ECHARTS_JS_PATH, 'utf-8');
  return echartsJsCache;
}

export function getThemeJSON(theme: string): string {
  let cached = themeJsonCache.get(theme);
  if (!cached) {
    cached = fs.readFileSync(path.join(THEME_DIR, `${theme}.json`), 'utf-8');
    themeJsonCache.set(theme, cached);
  }
  return cached;
}

export interface EChartsDocumentOptions {
  theme: string;
  chartOption: Record<string, unknown>;
  width?: number;
  height?: number;
}

export function buildEChartsTestDocument(options: EChartsDocumentOptions): string {
  const { theme, chartOption, width = 800, height = 600 } = options;
  const css = getCSS();
  const echartsJs = getEChartsJS();
  const themeJson = getThemeJSON(theme);
  const optionJson = JSON.stringify(chartOption);

  return `<!DOCTYPE html>
<html lang="en" data-theme="${theme}" data-relief="flat" data-finish="matte">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ECharts Test — ${theme}</title>
  <style>${css}</style>
  <style>
    body { margin: 0; padding: 0; background: var(--surface-bg); }
    #chart { width: ${width}px; height: ${height}px; }
  </style>
</head>
<body>
  <div id="chart"></div>
  <script>${echartsJs}</script>
  <script>
    (function() {
      var themeData = ${themeJson};
      echarts.registerTheme('soltana', themeData);
      var chart = echarts.init(document.getElementById('chart'), 'soltana');
      chart.setOption(${optionJson});
      window.__chart = chart;
    })();
  </script>
</body>
</html>`;
}
