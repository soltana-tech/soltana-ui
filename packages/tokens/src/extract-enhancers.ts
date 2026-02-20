// ---------------------------------------------------------------------------
// Enhancer Pattern Extraction
// ---------------------------------------------------------------------------
// Reads TypeScript source files from the enhancers directory and extracts
// selector constants, init functions, JSDoc descriptions, and HTML examples.
// ---------------------------------------------------------------------------

import { readFileSync, readdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import type { EnhancerData } from './types.js';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Imperative API export detected in an enhancer file. */
export interface ImperativeExport {
  name: string;
  description: string;
}

export interface EnhancerExtractionResult {
  enhancers: EnhancerData[];
  imperatives: ImperativeExport[];
}

/**
 * Scan the enhancers directory and extract structured data from each module.
 * Excludes index.ts and the utils/ directory.
 */
export function extractEnhancers(enhancersDir: string): EnhancerExtractionResult {
  const files = readdirSync(enhancersDir)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
    .sort();

  const enhancers: EnhancerData[] = [];
  const imperatives: ImperativeExport[] = [];

  for (const file of files) {
    const source = readFileSync(resolve(enhancersDir, file), 'utf-8');
    const fileName = basename(file, '.ts');

    const parsed = parseEnhancerFile(fileName, source);
    if (parsed) enhancers.push(parsed);

    imperatives.push(...parseImperatives(source));
  }

  return { enhancers, imperatives };
}

/**
 * Parse a single enhancer source string into EnhancerData.
 * Exported for unit testing with fixture strings.
 */
export function parseEnhancerFile(fileName: string, source: string): EnhancerData | null {
  const selectorMatch = /export const (\w+_SELECTOR)\s*=\s*'([^']+)'/.exec(source);
  if (!selectorMatch) return null;

  const initMatch = /export function (init\w+)\(/.exec(source);
  if (!initMatch) return null;

  const description = extractJsDocDescription(source, initMatch.index);
  const htmlExample = extractHtmlExample(source, initMatch.index);

  return {
    fileName,
    initFunction: initMatch[1],
    selector: selectorMatch[2],
    selectorConst: selectorMatch[1],
    description,
    htmlExample,
  };
}

/**
 * Detect imperative (non-init) exported functions like showToast/dismissToast.
 * Exported for unit testing.
 */
export function parseImperatives(source: string): ImperativeExport[] {
  const results: ImperativeExport[] = [];
  const re = /\/\*\*\s*\n\s*\*\s*(.+?)\n[\s\S]*?\*\/\s*\nexport function (?!init)(\w+)\(/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(source)) !== null) {
    results.push({
      name: match[2],
      description: match[1].trim(),
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Extract the first line of the JSDoc block preceding the given position. */
function extractJsDocDescription(source: string, initPosition: number): string {
  const preceding = source.slice(0, initPosition);
  const jsdocMatch = /\/\*\*\s*\n\s*\*\s*(.+?)(?:\n|\s*$)/g;
  let lastMatch: RegExpExecArray | null = null;
  let m: RegExpExecArray | null;

  while ((m = jsdocMatch.exec(preceding)) !== null) {
    lastMatch = m;
  }

  return lastMatch ? lastMatch[1].replace(/`/g, '').trim() : '';
}

/** Extract the fenced HTML code block from the JSDoc preceding the given position. */
function extractHtmlExample(source: string, initPosition: number): string {
  const preceding = source.slice(0, initPosition);
  // Find the last JSDoc block before the init function
  const jsdocBlocks = [...preceding.matchAll(/\/\*\*[\s\S]*?\*\//g)];
  if (jsdocBlocks.length === 0) return '';

  const lastBlock = jsdocBlocks[jsdocBlocks.length - 1][0];
  const htmlMatch = /```html\s*\n([\s\S]*?)\n\s*\*?\s*```/.exec(lastBlock);
  if (!htmlMatch) return '';

  // Strip leading ` * ` prefixes from each line
  return htmlMatch[1]
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, ''))
    .join('\n')
    .trim();
}
