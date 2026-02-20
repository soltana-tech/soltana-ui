// ---------------------------------------------------------------------------
// Component Pattern Extraction
// ---------------------------------------------------------------------------
// Reads SCSS source files from the components directory and extracts base
// classes, variants, sizes, child elements, and tier-awareness status.
// Descriptions and names are parsed dynamically from SCSS header comments.
// ---------------------------------------------------------------------------

import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ComponentData, EnhancerData } from './types.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SIZE_SUFFIXES = new Set(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']);

const TIER_INDICATORS = [
  'relief-container',
  'finish-surface',
  '--relief-',
  '--finish-',
  'hover-state',
];

const CHILD_SUFFIXES = new Set([
  'header',
  'body',
  'footer',
  'title',
  'subtitle',
  'content',
  'actions',
  'caption',
  'img',
  'text',
  'label',
  'container',
  'item',
  'nav',
  'backdrop',
  'dismissible',
  'icon',
  'trigger',
  'input',
  'popup',
  'area',
  'hue',
  'alpha',
  'preview',
  'swatches',
  'listbox',
  'option',
  'divider',
  'grid',
  'cell',
  'track',
  'slide',
  'dots',
  'dot',
  'children',
  'node',
  'toggle',
  'weekday',
  'thumb',
  'empty',
]);

/**
 * Override map for modules whose base class cannot be derived from filename.
 * Only genuine mismatches belong here — most modules derive their base class
 * from the filename directly (e.g., `carousel` → `.carousel`).
 */
const BASE_CLASS_OVERRIDES = new Map<string, string>([
  ['buttons', '.btn'],
  ['inputs', '.input'],
  ['feedback', '.alert'],
  ['navigation', '.nav'],
  ['overlays', '.modal'],
  ['menus', '.popover'],
  ['lists', '.accordion'],
  ['indicators', '.stepper'],
  ['layout', '.app-layout'],
]);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Scan the soltana-ui components SCSS directory and extract structured
 * component data from each module file.
 *
 * @param enhancers - Optional enhancer data for cross-referencing HTML examples.
 */
export function extractComponents(
  componentsDir: string,
  enhancers?: EnhancerData[]
): ComponentData[] {
  const files = readdirSync(componentsDir)
    .filter((f) => f.startsWith('_') && f.endsWith('.scss') && f !== '_index.scss')
    .sort();

  return files.map((file) => {
    const scss = readFileSync(resolve(componentsDir, file), 'utf-8');
    const moduleName = file.replace(/^_/, '').replace(/\.scss$/, '');
    return parseComponent(moduleName, scss, enhancers);
  });
}

/**
 * Parse a single SCSS source string into ComponentData.
 * Exported for unit testing with fixture strings.
 */
export function parseComponent(
  moduleName: string,
  scss: string,
  enhancers?: EnhancerData[]
): ComponentData {
  const selectors = extractSelectors(scss);
  const baseClass = detectBaseClass(moduleName, selectors);
  const tierAware = detectTierAwareness(scss);
  const header = parseHeaderComment(scss);

  const variants: string[] = [];
  const sizes: string[] = [];
  const children: string[] = [];

  for (const sel of selectors) {
    if (sel === baseClass) continue;

    // BEM children (e.g. .segmented-control__option)
    if (sel.includes('__')) {
      children.push(sel);
      continue;
    }

    // Size variant (e.g. .btn-sm, .btn-lg)
    const suffix = sel.replace(baseClass + '-', '');
    if (sel.startsWith(baseClass + '-') && SIZE_SUFFIXES.has(suffix)) {
      sizes.push(sel);
      continue;
    }

    // Child elements (e.g. .card-header, .card-body)
    if (baseClass && sel.startsWith(baseClass + '-') && isChildElement(suffix)) {
      children.push(sel);
      continue;
    }

    // Remaining are variants
    variants.push(sel);
  }

  return {
    name: header?.name ?? titleCase(moduleName),
    baseClass,
    description: header?.description ?? moduleName,
    tierAware,
    variants,
    sizes,
    children,
    example: resolveExample(moduleName, baseClass, children, enhancers),
  };
}

// ---------------------------------------------------------------------------
// Header comment parsing
// ---------------------------------------------------------------------------

/** Parsed result from an SCSS header comment block. */
export interface HeaderComment {
  name: string;
  description: string;
}

/**
 * Extract the component name and description from the standard SCSS header
 * comment block. Returns null if the header format is not found.
 *
 * Expected format:
 * ```
 * // ---------------------------------------------------------------------------
 * // Component Name Here
 * // ---------------------------------------------------------------------------
 * // Description line one.
 * // Description continues here.
 * // ---------------------------------------------------------------------------
 * ```
 */
export function parseHeaderComment(scss: string): HeaderComment | null {
  const match = /^\/\/ -{3,}\n\/\/ (.+)\n\/\/ -{3,}\n((?:\/\/ .+\n)+)\/\/ -{3,}/m.exec(scss);
  if (!match) return null;

  const rawName = match[1].trim();
  const descriptionLines = match[2]
    .split('\n')
    .map((line) => line.replace(/^\/\/\s?/, '').trim())
    .filter(Boolean);

  // Take only the first sentence/line as description, skip lines about
  // implementation details (e.g., "Uses --relief-* variables...")
  const description = descriptionLines
    .filter((line) => !line.startsWith('Uses --'))
    .join(' ')
    .trim();

  return { name: rawName, description: description || rawName };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Extract top-level class selectors from SCSS source. */
function extractSelectors(scss: string): string[] {
  const selectors = new Set<string>();

  const CLASS_RE = /^\s*\.([\w-]+)/gm;
  let match: RegExpExecArray | null;

  while ((match = CLASS_RE.exec(scss)) !== null) {
    const cls = match[1];
    if (cls.startsWith('_') || cls.startsWith('sol-')) continue;
    selectors.add('.' + cls);
  }

  return Array.from(selectors).sort();
}

/**
 * Detect the primary base class for a component module.
 * Uses overrides for genuine mismatches, then falls back to heuristics:
 * 1. `.{moduleName}` if present in selectors
 * 2. `.{moduleName-with-hyphens}` if present
 * 3. First selector in the file
 */
function detectBaseClass(moduleName: string, selectors: string[]): string {
  const override = BASE_CLASS_OVERRIDES.get(moduleName);
  if (override != null) return override;

  // Try direct match (e.g., `carousel` → `.carousel`)
  const direct = `.${moduleName}`;
  if (selectors.includes(direct)) return direct;

  // Try hyphenated match (e.g., `segmented-control` → `.segmented-control`)
  const hyphenated = `.${moduleName.replace(/_/g, '-')}`;
  if (hyphenated !== direct && selectors.includes(hyphenated)) return hyphenated;

  return selectors.length > 0 ? selectors[0] : direct;
}

/** Detect whether a component module uses tier-specific includes or tokens. */
function detectTierAwareness(scss: string): boolean {
  return TIER_INDICATORS.some((indicator) => scss.includes(indicator));
}

/** Heuristic: child elements tend to be nouns. */
function isChildElement(suffix: string): boolean {
  return CHILD_SUFFIXES.has(suffix);
}

/** Convert a hyphenated/underscored module name to title case. */
function titleCase(name: string): string {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Resolve an HTML example for a component module. Checks enhancer JSDoc
 * examples first, then falls back to generating from children.
 */
function resolveExample(
  moduleName: string,
  baseClass: string,
  children: string[],
  enhancers?: EnhancerData[]
): string {
  // Try to find a matching enhancer HTML example
  if (enhancers) {
    const cls = baseClass.slice(1);
    const enhancer = enhancers.find(
      (e) => e.fileName === moduleName || e.selector === `[data-sol-${moduleName}]`
    );
    if (enhancer?.htmlExample) return enhancer.htmlExample;

    // Also try matching by base class in the selector
    const bySelectorClass = enhancers.find((e) => e.selector === `[data-sol-${cls}]`);
    if (bySelectorClass?.htmlExample) return bySelectorClass.htmlExample;
  }

  // Fall back to static examples for multi-component modules
  const staticExample = STATIC_EXAMPLES[moduleName];
  if (staticExample) return staticExample;

  // Generate a basic example from children
  return buildChildExample(baseClass, children);
}

/** Generate a basic HTML example from a base class and its children. */
function buildChildExample(baseClass: string, children: string[]): string {
  const cls = baseClass.slice(1);
  if (children.length === 0) return `<div class="${cls}">…</div>`;

  const childLines = children.slice(0, 3).map((c) => {
    const childCls = c.replace(/^\./, '');
    return `  <div class="${childCls}">…</div>`;
  });

  return [`<div class="${cls}">`, ...childLines, '</div>'].join('\n');
}

/**
 * Static examples for multi-component modules that don't have a 1:1
 * enhancer mapping (e.g., feedback contains alerts + progress + skeletons).
 */
const STATIC_EXAMPLES: Record<string, string> = {
  buttons: '<button class="btn btn-primary">Label</button>',
  inputs: '<input class="input" type="text" placeholder="Enter text" />',
  cards: [
    '<div class="card">',
    '  <div class="card-header">Title</div>',
    '  <div class="card-body">Content</div>',
    '</div>',
  ].join('\n'),
  badges: '<span class="badge badge-primary">New</span>',
  feedback: '<div class="alert alert-success">Operation complete.</div>',
  navigation: [
    '<nav class="nav">',
    '  <a class="nav-item active" href="#">Home</a>',
    '  <a class="nav-item" href="#">About</a>',
    '</nav>',
  ].join('\n'),
  overlays: [
    '<div class="modal" data-sol-modal>',
    '  <div class="modal-backdrop"></div>',
    '  <div class="modal-center">…</div>',
    '</div>',
  ].join('\n'),
  toggle: '<button class="toggle" role="switch" aria-checked="false">Off</button>',
  menus: [
    '<div class="popover popover-bottom">',
    '  <div class="popover-body">Content</div>',
    '</div>',
  ].join('\n'),
  tables: [
    '<table class="table">',
    '  <thead><tr><th>Name</th></tr></thead>',
    '  <tbody><tr><td>Value</td></tr></tbody>',
    '</table>',
  ].join('\n'),
};
