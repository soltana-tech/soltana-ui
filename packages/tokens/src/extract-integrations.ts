// ---------------------------------------------------------------------------
// Integration Package Extraction
// ---------------------------------------------------------------------------
// Reads package.json, src/index.ts exports, and JSDoc from source files
// for each integration package in the monorepo.
// ---------------------------------------------------------------------------

import { readFileSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import type { IntegrationData, IntegrationExport } from './types.js';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface IntegrationExtractionOptions {
  packages: string[];
  python: string[];
}

/**
 * Scan integration package directories and extract metadata, exports,
 * and JSDoc descriptions for each.
 */
export function extractIntegrations(opts: IntegrationExtractionOptions): IntegrationData[] {
  const results: IntegrationData[] = [];

  for (const dir of opts.packages) {
    const data = extractTsPackage(dir);
    if (data) results.push(data);
  }

  for (const dir of opts.python) {
    const data = extractPythonPackage(dir);
    if (data) results.push(data);
  }

  return results;
}

// ---------------------------------------------------------------------------
// TypeScript package extraction
// ---------------------------------------------------------------------------

function extractTsPackage(dir: string): IntegrationData | null {
  const pkgPath = resolve(dir, 'package.json');
  if (!existsSync(pkgPath)) return null;

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as {
    name: string;
    description?: string;
  };

  const indexPath = resolve(dir, 'src/index.ts');
  if (!existsSync(indexPath)) return null;
  const indexSource = readFileSync(indexPath, 'utf-8');

  const exports = parseIndexExports(indexSource, resolve(dir, 'src'));
  const staticThemes = parseStaticThemes(indexSource);

  return {
    package: pkg.name,
    description: pkg.description ?? '',
    language: 'typescript',
    exports,
    staticThemes,
  };
}

/** Parse re-export lines from an index.ts file and resolve JSDoc from source. */
export function parseIndexExports(indexSource: string, srcDir: string): IntegrationExport[] {
  const results: IntegrationExport[] = [];

  // Match: export { name1, name2 } from './file.js'
  // Match: export type { Name } from './file.js'
  const re = /export\s+(type\s+)?\{\s*([^}]+)\s*\}\s*from\s+['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(indexSource)) !== null) {
    const isType = Boolean(match[1]);
    const names = match[2].split(',').map((n) => n.trim());
    const fromPath = match[3];

    for (const name of names) {
      if (!name) continue;

      // Static theme constants
      if (/^(dark|light|sepia)$/.test(name)) continue;

      const kind = classifyExport(name, isType);

      const jsdoc = resolveJsDoc(srcDir, fromPath, name);

      results.push({
        name,
        kind,
        description: jsdoc.description,
        ...(jsdoc.signature ? { signature: jsdoc.signature } : {}),
        ...(jsdoc.returns ? { returns: jsdoc.returns } : {}),
      });
    }
  }

  return results;
}

/** Determine the kind of an export based on naming conventions. */
function classifyExport(name: string, isType: boolean): IntegrationExport['kind'] {
  if (isType) return 'type';
  // React components start with uppercase and aren't hooks/types
  if (/^[A-Z]/.test(name) && !name.includes('SELECTOR')) return 'component';
  // Functions start with lowercase
  if (/^(init|build|use|register|autoSync|show|dismiss)/.test(name)) return 'function';
  return 'constant';
}

/** Read source file and extract JSDoc for a specific exported symbol. */
function resolveJsDoc(
  srcDir: string,
  fromPath: string,
  symbolName: string
): { description: string; signature?: string; returns?: string } {
  const basePath = fromPath.replace(/\.js$/, '');
  const candidates = [resolve(srcDir, basePath + '.ts'), resolve(srcDir, basePath + '.tsx')];

  const filePath = candidates.find(existsSync);
  if (!filePath) return { description: '' };

  const source = readFileSync(filePath, 'utf-8');

  // Find JSDoc + function/export for this symbol
  const escapedName = symbolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const fnPattern = new RegExp(
    `(/\\*\\*[\\s\\S]*?\\*/\\s*\\n)\\s*export\\s+(?:function\\s+${escapedName}|const\\s+${escapedName}|function\\s+${escapedName})\\s*[(<]`
  );
  const fnMatch = fnPattern.exec(source);

  if (!fnMatch) {
    // Try type/interface
    const typePattern = new RegExp(
      `(/\\*\\*[\\s\\S]*?\\*/\\s*\\n)\\s*export\\s+(?:type|interface)\\s+${escapedName}`
    );
    const typeMatch = typePattern.exec(source);
    if (typeMatch) {
      return { description: extractFirstLine(typeMatch[1]) };
    }
    return { description: '' };
  }

  const jsdocBlock = fnMatch[1];
  const description = extractFirstLine(jsdocBlock);

  // Extract @returns
  const returnsMatch = /@returns?\s+(.+)/i.exec(jsdocBlock);
  const returns = returnsMatch ? returnsMatch[1].trim() : undefined;

  // Extract signature from function definition line
  const sigPattern = new RegExp(
    `export\\s+function\\s+${escapedName}(\\([^)]*\\))(?:\\s*:\\s*([^{]+?))?\\s*\\{`
  );
  const sigMatch = sigPattern.exec(source);
  const signature = sigMatch
    ? `${symbolName}${sigMatch[1]}${sigMatch[2] ? ': ' + sigMatch[2].trim() : ''}`
    : undefined;

  return { description, ...(signature ? { signature } : {}), ...(returns ? { returns } : {}) };
}

/** Extract the first descriptive line from a JSDoc block. */
function extractFirstLine(jsdocBlock: string): string {
  const match = /\*\s+([^@\n*][^\n]*)/m.exec(jsdocBlock);
  return match ? match[1].trim() : '';
}

/** Extract static theme names from export statements. */
function parseStaticThemes(indexSource: string): string[] {
  const match = /export\s+\{([^}]+)\}\s*from\s+['"]\.\/themes/.exec(indexSource);
  if (!match) return [];
  return match[1]
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Python package extraction
// ---------------------------------------------------------------------------

function extractPythonPackage(dir: string): IntegrationData | null {
  const pyprojectPath = resolve(dir, 'pyproject.toml');
  if (!existsSync(pyprojectPath)) return null;

  const toml = readFileSync(pyprojectPath, 'utf-8');

  const nameMatch = /^name\s*=\s*"([^"]+)"/m.exec(toml);
  const descMatch = /^description\s*=\s*"([^"]+)"/m.exec(toml);

  const pkgName = nameMatch ? nameMatch[1] : basename(dir);
  const description = descMatch ? descMatch[1] : '';

  return {
    package: pkgName,
    description,
    language: 'python',
    install: `pip install ${pkgName}`,
    exports: [
      {
        name: 'soltana_matplotlib.styles',
        kind: 'constant',
        description: 'Pre-built .mplstyle file paths for use with matplotlib.style.use()',
      },
    ],
    staticThemes: ['dark', 'light', 'sepia'],
  };
}
