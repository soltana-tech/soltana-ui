import fs from 'node:fs';
import path from 'node:path';
import { getCSS } from './assets';

const PLOTLY_JS_PATH = path.resolve('packages/plotly/node_modules/plotly.js-dist/plotly.js');

const TEMPLATE_DIR = path.resolve('packages/tokens/dist/plotly');

let plotlyJsCache: string | null = null;
const templateJsonCache = new Map<string, string>();

export function getPlotlyJS(): string {
  if (!plotlyJsCache) plotlyJsCache = fs.readFileSync(PLOTLY_JS_PATH, 'utf-8');
  return plotlyJsCache;
}

export function getTemplateJSON(theme: string): string {
  let cached = templateJsonCache.get(theme);
  if (!cached) {
    cached = fs.readFileSync(path.join(TEMPLATE_DIR, `${theme}.json`), 'utf-8');
    templateJsonCache.set(theme, cached);
  }
  return cached;
}

export interface PlotlyDocumentOptions {
  theme: string;
  chartData: { data: unknown[]; layout?: Record<string, unknown> };
  width?: number;
  height?: number;
}

export function buildPlotlyTestDocument(options: PlotlyDocumentOptions): string {
  const { theme, chartData, width = 800, height = 600 } = options;
  const css = getCSS();
  const plotlyJs = getPlotlyJS();
  const templateJson = getTemplateJSON(theme);
  const dataJson = JSON.stringify(chartData.data);
  const extraLayout = chartData.layout ? JSON.stringify(chartData.layout) : '{}';

  return `<!DOCTYPE html>
<html lang="en" data-theme="${theme}" data-relief="flat" data-finish="matte">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Plotly Test — ${theme}</title>
  <style>${css}</style>
  <style>
    body { margin: 0; padding: 0; background: var(--surface-bg); }
    #chart { width: ${width}px; height: ${height}px; }
  </style>
</head>
<body>
  <div id="chart"></div>
  <script>${plotlyJs}</script>
  <script>
    (function() {
      var template = ${templateJson};
      var data = ${dataJson};
      var extra = ${extraLayout};
      var layout = Object.assign({}, template.layout, extra, { template: template });
      Plotly.newPlot('chart', data, layout, { staticPlot: true }).then(function() {
        window.__plotlyReady = true;
      });
    })();
  </script>
</body>
</html>`;
}
