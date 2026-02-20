// ---------------------------------------------------------------------------
// Component Pattern Extraction
// ---------------------------------------------------------------------------
// Reads SCSS source files from the components directory and extracts base
// classes, variants, sizes, child elements, and tier-awareness status.
// ---------------------------------------------------------------------------

import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ComponentData } from './types.js';

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

/** Map from SCSS filename (without extension) to display name. */
const MODULE_NAMES: Record<string, string> = {
  buttons: 'Buttons',
  inputs: 'Inputs',
  cards: 'Cards',
  badges: 'Badges',
  feedback: 'Feedback',
  navigation: 'Navigation',
  overlays: 'Overlays',
  toggle: 'Toggle',
  close: 'Close',
  toast: 'Toast',
  menus: 'Menus',
  lists: 'Lists',
  indicators: 'Indicators',
  tables: 'Tables',
  layout: 'Layout',
  'segmented-control': 'Segmented Control',
  hero: 'Hero',
  figure: 'Figure',
  callout: 'Callout',
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Scan the soltana-ui components SCSS directory and extract structured
 * component data from each module file.
 */
export function extractComponents(componentsDir: string): ComponentData[] {
  const files = readdirSync(componentsDir)
    .filter((f) => f.startsWith('_') && f.endsWith('.scss') && f !== '_index.scss')
    .sort();

  return files.map((file) => {
    const scss = readFileSync(resolve(componentsDir, file), 'utf-8');
    const moduleName = file.replace(/^_/, '').replace(/\.scss$/, '');
    return parseComponent(moduleName, scss);
  });
}

/**
 * Parse a single SCSS source string into ComponentData.
 * Exported for unit testing with fixture strings.
 */
export function parseComponent(moduleName: string, scss: string): ComponentData {
  const selectors = extractSelectors(scss);
  const baseClass = detectBaseClass(moduleName, selectors);
  const tierAware = detectTierAwareness(scss);

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
    name: MODULE_NAMES[moduleName] ?? moduleName,
    baseClass,
    description: describeModule(moduleName),
    tierAware,
    variants,
    sizes,
    children,
    example: buildExample(moduleName, baseClass),
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Extract top-level class selectors from SCSS source. */
function extractSelectors(scss: string): string[] {
  const selectors = new Set<string>();

  // Match class selectors at the start of lines (top-level rules)
  // Handles: .btn { ... }, .btn-primary { ... }, .btn, \n.btn-secondary { ... }
  const CLASS_RE = /^\s*\.([\w-]+)/gm;
  let match: RegExpExecArray | null;

  while ((match = CLASS_RE.exec(scss)) !== null) {
    const cls = match[1];
    // Skip Sass placeholders, private classes, and mixin content
    if (cls.startsWith('_') || cls.startsWith('sol-')) continue;
    selectors.add('.' + cls);
  }

  return Array.from(selectors).sort();
}

/** Detect the primary base class for a component module. */
function detectBaseClass(moduleName: string, selectors: string[]): string {
  // Direct mapping for common modules
  const KNOWN_BASES = new Map<string, string>([
    ['buttons', '.btn'],
    ['inputs', '.input'],
    ['cards', '.card'],
    ['badges', '.badge'],
    ['feedback', '.alert'],
    ['navigation', '.nav'],
    ['overlays', '.modal'],
    ['toggle', '.toggle'],
    ['close', '.close'],
    ['toast', '.toast'],
    ['menus', '.popover'],
    ['lists', '.accordion'],
    ['indicators', '.stepper'],
    ['tables', '.table'],
    ['layout', '.app-layout'],
    ['segmented-control', '.segmented-control'],
    ['hero', '.hero'],
    ['figure', '.figure'],
    ['callout', '.callout'],
  ]);

  const known = KNOWN_BASES.get(moduleName);
  if (known != null) return known;
  return selectors.length > 0 ? selectors[0] : `.${moduleName}`;
}

/** Detect whether a component module uses tier-specific includes or tokens. */
function detectTierAwareness(scss: string): boolean {
  return TIER_INDICATORS.some((indicator) => scss.includes(indicator));
}

/** Heuristic: child elements tend to be nouns (header, body, footer, title, content). */
function isChildElement(suffix: string): boolean {
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
  ]);
  return CHILD_SUFFIXES.has(suffix);
}

function describeModule(moduleName: string): string {
  const descriptions: Record<string, string> = {
    buttons: 'Action triggers with color variants and size modifiers',
    inputs: 'Text input, select, and textarea form controls',
    cards: 'Content containers with header/body/footer sections',
    badges: 'Inline status indicators with semantic color variants',
    feedback: 'Alerts, tooltips, progress bars, and skeleton loaders',
    navigation: 'Nav bars, tabs, breadcrumbs, and pagination',
    overlays: 'Modal dialogs and drawer panels',
    toggle: 'Toggle switch control with on/off states',
    close: 'Dismiss button (X) for closeable components',
    toast: 'Toast notification containers and items',
    menus: 'Popovers, dropdown menus, and context menus',
    lists: 'Accordions and list groups',
    indicators: 'Steppers, timelines, keyboard hints, stats, and ratings',
    tables: 'Data tables with hover and striped variants',
    layout: 'App shell layout with header, sidebar, and main area',
    'segmented-control': 'Segmented toggle control with multiple options',
    hero: 'Hero banner section with title and action slots',
    figure: 'Image figure with caption, optional card variant',
    callout: 'Highlighted content block with semantic variants',
  };
  return descriptions[moduleName] ?? moduleName;
}

function buildExample(moduleName: string, baseClass: string): string {
  const cls = baseClass.slice(1); // strip leading dot
  const examples: Record<string, string> = {
    buttons: `<button class="btn btn-primary">Label</button>`,
    inputs: `<input class="input" type="text" placeholder="Enter text" />`,
    cards: [
      `<div class="card">`,
      `  <div class="card-header">Title</div>`,
      `  <div class="card-body">Content</div>`,
      `</div>`,
    ].join('\n'),
    badges: `<span class="badge badge-primary">New</span>`,
    feedback: `<div class="alert alert-success">Operation complete.</div>`,
    navigation: [
      `<nav class="nav">`,
      `  <a class="nav-item active" href="#">Home</a>`,
      `  <a class="nav-item" href="#">About</a>`,
      `</nav>`,
    ].join('\n'),
    overlays: [
      `<div class="modal" data-sol-modal>`,
      `  <div class="modal-backdrop"></div>`,
      `  <div class="modal-center">…</div>`,
      `</div>`,
    ].join('\n'),
    toggle: `<button class="toggle" role="switch" aria-checked="false">Off</button>`,
    toast: [
      `<div class="toast-container toast-container-top-right">`,
      `  <div class="toast toast-success">Saved.</div>`,
      `</div>`,
    ].join('\n'),
    menus: [
      `<div class="popover popover-bottom">`,
      `  <div class="popover-body">Content</div>`,
      `</div>`,
    ].join('\n'),
    lists: [
      `<div class="accordion">`,
      `  <div class="accordion-item">`,
      `    <button class="accordion-header">Section</button>`,
      `    <div class="accordion-body">Content</div>`,
      `  </div>`,
      `</div>`,
    ].join('\n'),
    tables: [
      `<table class="table">`,
      `  <thead><tr><th>Name</th></tr></thead>`,
      `  <tbody><tr><td>Value</td></tr></tbody>`,
      `</table>`,
    ].join('\n'),
    'segmented-control': [
      `<div class="segmented-control">`,
      `  <button class="segmented-control__option active">A</button>`,
      `  <button class="segmented-control__option">B</button>`,
      `</div>`,
    ].join('\n'),
    hero: [
      `<section class="hero">`,
      `  <h1 class="hero-title">Welcome</h1>`,
      `  <p class="hero-subtitle">Subtitle text</p>`,
      `  <div class="hero-actions"><button class="btn btn-primary">CTA</button></div>`,
      `</section>`,
    ].join('\n'),
    callout: [
      `<div class="callout callout-info">`,
      `  <div class="callout-title">Note</div>`,
      `  <div class="callout-content">Important information.</div>`,
      `</div>`,
    ].join('\n'),
    figure: [
      `<figure class="figure">`,
      `  <img class="figure-img" src="photo.jpg" alt="" />`,
      `  <figcaption class="figure-caption">Caption</figcaption>`,
      `</figure>`,
    ].join('\n'),
  };

  return examples[moduleName] ?? `<div class="${cls}">…</div>`;
}
