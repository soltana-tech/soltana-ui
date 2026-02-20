// ---------------------------------------------------------------------------
// Token Compiler — Build Entry Point
// ---------------------------------------------------------------------------
// Reads the compiled CSS from soltana-ui, extracts tokens, and writes
// themed output files for ECharts, Plotly, matplotlib, DTCG, and agent docs.
// ---------------------------------------------------------------------------

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { extractFoundation, extractThemes } from './extract.js';
import { extractUtilities } from './extract-utilities.js';
import { extractComponents } from './extract-components.js';
import { buildEChartsTheme } from './formats/echarts.js';
import { buildPlotlyTemplate } from './formats/plotly.js';
import { buildMplStyle } from './formats/matplotlib.js';
import { buildDtcgTheme, buildDtcgFoundation } from './formats/dtcg.js';
import { buildAgentDocs } from './formats/agent-docs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const CSS_PATH = require.resolve('soltana-ui/css');
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

function main(): void {
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

  // Agent documentation (YAML)
  const componentsDir = resolve(dirname(CSS_PATH), '../src/styles/components');
  const utilities = extractUtilities(css);
  const components = extractComponents(componentsDir);
  const agentYaml = buildAgentDocs({ foundation, themes, utilities, components });

  ensureDir(resolve(DIST, 'agents'));
  writeFileSync(resolve(DIST, 'agents/reference.yaml'), agentYaml);
  fileCount++;

  const monorepoRoot = resolve(__dirname, '../../..');
  ensureDir(resolve(monorepoRoot, '.claude/agents'));
  writeFileSync(resolve(monorepoRoot, '.claude/agents/reference.yaml'), agentYaml);
  fileCount++;

  console.log(
    `@soltana-ui/tokens: wrote ${String(fileCount)} files for ${String(themeNames.length)} themes (${themeNames.join(', ')})`
  );
}

main();
