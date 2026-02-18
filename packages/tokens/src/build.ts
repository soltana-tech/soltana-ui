// ---------------------------------------------------------------------------
// Token Compiler — Build Entry Point
// ---------------------------------------------------------------------------
// Reads the compiled CSS from soltana-ui, extracts tokens, and writes
// themed output files for ECharts, Plotly, matplotlib, and DTCG.
// ---------------------------------------------------------------------------

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { extractFoundation, extractThemes } from './extract.js';
import { buildEChartsTheme } from './formats/echarts.js';
import { buildPlotlyTemplate } from './formats/plotly.js';
import { buildMplStyle } from './formats/matplotlib.js';
import { buildDtcgTheme, buildDtcgFoundation } from './formats/dtcg.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CSS_PATH = resolve(__dirname, '../../soltana-ui/dist/soltana-ui.css');
const DIST = resolve(__dirname, '../dist');

function ensureDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
}

function writeJson(path: string, data: unknown): void {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const css = readFileSync(CSS_PATH, 'utf-8');
const foundation = extractFoundation(css);
const themes = extractThemes(css);

const themeNames = Object.keys(themes);
let fileCount = 0;

for (const name of themeNames) {
  const theme = themes[name];

  // ECharts
  ensureDir(resolve(DIST, 'echarts'));
  writeJson(resolve(DIST, `echarts/${name}.json`), buildEChartsTheme(theme, foundation));
  fileCount++;

  // Plotly
  ensureDir(resolve(DIST, 'plotly'));
  writeJson(resolve(DIST, `plotly/${name}.json`), buildPlotlyTemplate(theme, foundation));
  fileCount++;

  // matplotlib
  ensureDir(resolve(DIST, 'matplotlib'));
  writeFileSync(resolve(DIST, `matplotlib/${name}.mplstyle`), buildMplStyle(theme, foundation));
  fileCount++;

  // DTCG
  ensureDir(resolve(DIST, 'dtcg'));
  writeJson(resolve(DIST, `dtcg/${name}.tokens.json`), buildDtcgTheme(theme));
  fileCount++;
}

// Foundation (DTCG only)
ensureDir(resolve(DIST, 'dtcg'));
writeJson(resolve(DIST, 'dtcg/foundation.tokens.json'), buildDtcgFoundation(foundation));
fileCount++;

console.log(
  `@soltana-ui/tokens: wrote ${String(fileCount)} files for ${String(themeNames.length)} themes (${themeNames.join(', ')})`
);
