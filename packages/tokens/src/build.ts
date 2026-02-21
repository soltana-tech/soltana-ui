// ---------------------------------------------------------------------------
// Token Compiler — Build Entry Point
// ---------------------------------------------------------------------------
// Reads the compiled CSS from soltana-ui, extracts tokens, and writes
// themed output files for Mermaid, DTCG, agent docs, and llms.txt
// references.
// ---------------------------------------------------------------------------

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { extractFoundation, extractThemes } from './extract.js';
import { extractUtilities } from './extract-utilities.js';
import { extractComponents } from './extract-components.js';
import { extractEnhancers } from './extract-enhancers.js';
import { extractIntegrations } from './extract-integrations.js';
import { buildMermaidConfig } from './formats/mermaid.js';
import { buildDtcgTheme, buildDtcgFoundation } from './formats/dtcg.js';
import { buildAgentDocs } from './formats/agent-docs.js';
import { buildLlmsTxt } from './formats/llms-txt.js';
import { buildLlmsFullTxt } from './formats/llms-full-txt.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const CSS_PATH = require.resolve('soltana-ui/css');
const DIST = resolve(__dirname, '../dist');
const MONOREPO_ROOT = resolve(__dirname, '../../..');

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

    // Mermaid
    ensureDir(resolve(DIST, 'mermaid'));
    writeJson(resolve(DIST, `mermaid/${name}.json`), buildMermaidConfig(theme, foundation));
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

  // Enhancers + integrations (dynamic extraction)
  const enhancersDir = resolve(dirname(CSS_PATH), '../src/enhancers');
  const { enhancers, imperatives } = extractEnhancers(enhancersDir);

  const integrations = extractIntegrations({
    packages: [
      resolve(MONOREPO_ROOT, 'packages/mermaid'),
      resolve(MONOREPO_ROOT, 'packages/react'),
    ],
  });

  // Agent documentation (YAML)
  const componentsDir = resolve(dirname(CSS_PATH), '../src/styles/components');
  const utilities = extractUtilities(css);
  const components = extractComponents(componentsDir, enhancers);
  const agentInput = { foundation, themes, utilities, components, enhancers, integrations };
  const agentYaml = buildAgentDocs(agentInput, { imperatives });

  ensureDir(resolve(DIST, 'agents'));
  writeFileSync(resolve(DIST, 'agents/reference.yaml'), agentYaml);
  fileCount++;

  writeFileSync(resolve(MONOREPO_ROOT, '.claude/reference.yaml'), agentYaml);
  fileCount++;

  // llms.txt / llms-full.txt
  const llmsTxt = buildLlmsTxt({ themeNames, integrations });
  const llmsFullTxt = buildLlmsFullTxt(agentInput, { imperatives });

  const docsPublicDir = resolve(MONOREPO_ROOT, 'apps/docs/public');
  ensureDir(docsPublicDir);
  writeFileSync(resolve(docsPublicDir, 'llms.txt'), llmsTxt);
  writeFileSync(resolve(docsPublicDir, 'llms-full.txt'), llmsFullTxt);
  fileCount += 2;

  console.log(
    `@soltana-ui/tokens: wrote ${String(fileCount)} files for ${String(themeNames.length)} themes (${themeNames.join(', ')})`
  );
}

main();
