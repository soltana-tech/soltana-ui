// ---------------------------------------------------------------------------
// Utility Class Extraction
// ---------------------------------------------------------------------------
// PostCSS-based parser that reads compiled CSS and groups utility classes
// by category. Produces compact representations (patterns + scale ranges)
// rather than exhaustive class lists.
// ---------------------------------------------------------------------------

import postcss from 'postcss';
import type { UtilityGroup } from './types.js';

// ---------------------------------------------------------------------------
// Category detection patterns
// ---------------------------------------------------------------------------

interface CategoryRule {
  category: string;
  description: string;
  test: RegExp;
}

const CATEGORY_RULES: CategoryRule[] = [
  { category: 'spacing', description: 'Padding, margin, and gap utilities', test: /^\.(p|m|gap)-/ },
  {
    category: 'spacing',
    description: 'Padding, margin, and gap utilities',
    test: /^\.(px|py|pt|pr|pb|pl|mx|my|mt|mr|mb|ml)-/,
  },
  {
    category: 'spacing',
    description: 'Padding, margin, and gap utilities',
    test: /^\.(gap-x|gap-y)-/,
  },
  {
    category: 'spacing',
    description: 'Padding, margin, and gap utilities',
    test: /^\.(mx-auto|ml-auto|mr-auto)$/,
  },
  {
    category: 'layout',
    description: 'Display, flexbox, grid, and positioning',
    test: /^\.(block|inline-block|inline-flex|inline-grid|inline|flex|grid|hidden|contents)$/,
  },
  {
    category: 'layout',
    description: 'Display, flexbox, grid, and positioning',
    test: /^\.(flex-row|flex-col|flex-wrap|flex-nowrap|flex-1|flex-auto|flex-initial|flex-none|grow|shrink)/,
  },
  {
    category: 'layout',
    description: 'Display, flexbox, grid, and positioning',
    test: /^\.(grid-cols-|col-span-|grid-rows-|row-span-)/,
  },
  {
    category: 'layout',
    description: 'Display, flexbox, grid, and positioning',
    test: /^\.(relative|absolute|fixed|sticky|static|inset-|top-|right-|bottom-|left-)/,
  },
  {
    category: 'layout',
    description: 'Display, flexbox, grid, and positioning',
    test: /^\.(items-|justify-|self-)/,
  },
  {
    category: 'layout',
    description: 'Display, flexbox, grid, and positioning',
    test: /^\.(overflow-|text-left|text-center|text-right|text-justify)$/,
  },
  {
    category: 'layout',
    description: 'Display, flexbox, grid, and positioning',
    test: /^\.(visible|invisible|order-|aspect-|z-|container)/,
  },
  {
    category: 'sizing',
    description: 'Width, height, and max-width',
    test: /^\.(w-|h-|min-h-|max-w-)/,
  },
  {
    category: 'visual',
    description: 'Borders, backgrounds, shadows, opacity, transitions, transforms, animations',
    test: /^\.(bg-|border|rounded|shadow|opacity-)/,
  },
  {
    category: 'visual',
    description: 'Borders, backgrounds, shadows, opacity, transitions, transforms, animations',
    test: /^\.(transition|duration-|ease-|animate-)/,
  },
  {
    category: 'visual',
    description: 'Borders, backgrounds, shadows, opacity, transitions, transforms, animations',
    test: /^\.(scale-|rotate-|-rotate-|translate-|-translate-|skew-|-skew-)/,
  },
  {
    category: 'visual',
    description: 'Borders, backgrounds, shadows, opacity, transitions, transforms, animations',
    test: /^\.(cursor-|pointer-events-|select-|visible|invisible)$/,
  },
  {
    category: 'typography',
    description: 'Font size, weight, tracking, and text utilities',
    test: /^\.(text-|font-|tracking-|leading-)/,
  },
];

const RESPONSIVE_PREFIX_RE = /^\.(\w+)\\:/;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Walk compiled CSS, extract utility class selectors, and group them by
 * category. Detects responsive prefixes and infers scale ranges.
 */
export function extractUtilities(css: string): UtilityGroup[] {
  const root = postcss.parse(css);

  const categorized = new Map<string, Set<string>>();
  const responsivePrefixes = new Set<string>();
  const responsiveCategories = new Set<string>();
  const descriptions = new Map<string, string>();

  root.walkRules((rule) => {
    for (const rawSelector of rule.selectors) {
      const selector = rawSelector.trim();
      if (!selector.startsWith('.')) continue;

      // Strip pseudo-classes/elements for classification (preserve escaped colons)
      const base = selector.split(/(?:::|\[|(?<!\\):(?!:))/, 2)[0];

      // Check for responsive prefix
      const prefixMatch = RESPONSIVE_PREFIX_RE.exec(base);
      if (prefixMatch) {
        responsivePrefixes.add(prefixMatch[1]);
        // Classify the un-prefixed version
        const unprefixed = '.' + base.slice(prefixMatch[0].length);
        const cat = classify(unprefixed);
        if (cat) responsiveCategories.add(cat);
        continue;
      }

      const category = classify(base);
      if (!category) continue;

      if (!categorized.has(category)) categorized.set(category, new Set());
      categorized.get(category)!.add(base.slice(1)); // strip leading dot
    }
  });

  // Build output
  const groups: UtilityGroup[] = [];

  for (const [category, classSet] of categorized) {
    const classes = Array.from(classSet).sort();
    groups.push({
      category,
      description: descriptions.get(category) ?? descriptionFor(category),
      responsive: responsiveCategories.has(category),
      classes: compactRepresentation(category, classes),
    });
  }

  return groups.sort((a, b) => a.category.localeCompare(b.category));
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function classify(selector: string): string | null {
  for (const rule of CATEGORY_RULES) {
    if (rule.test.test(selector)) return rule.category;
  }
  return null;
}

function descriptionFor(category: string): string {
  const entry = CATEGORY_RULES.find((r) => r.category === category);
  return entry?.description ?? category;
}

/**
 * Collapse raw class lists into compact patterns with scale ranges.
 * For example, `p-0, p-1, p-2, ... p-64` becomes `{ pattern: "p-{step}", range: "0–64" }`.
 */
function compactRepresentation(category: string, classes: string[]): Record<string, unknown> {
  switch (category) {
    case 'spacing':
      return compactSpacing(classes);
    case 'layout':
      return compactLayout(classes);
    case 'sizing':
      return compactSizing(classes);
    case 'visual':
      return compactVisual(classes);
    case 'typography':
      return compactTypography(classes);
    default:
      return { all: classes };
  }
}

function inferRange(classes: string[], prefix: string): string | null {
  const nums = classes
    .filter((c) => c.startsWith(prefix + '-'))
    .map((c) => c.slice(prefix.length + 1))
    .filter((v) => /^[\d.]+$/.test(v))
    .map(Number)
    .sort((a, b) => a - b);
  if (nums.length < 2) return null;
  return `${String(nums[0])}–${String(nums[nums.length - 1])}`;
}

function compactSpacing(classes: string[]): Record<string, unknown> {
  const result: Record<string, unknown> = {
    scale_note: '4px base — multiply step by 0.25rem',
  };

  const padding = classes.filter((c) => /^p[xytblr]?-/.test(c));
  const margin = classes.filter((c) => /^m[xytblr]?-/.test(c));
  const gap = classes.filter((c) => c.startsWith('gap'));
  const auto = classes.filter((c) => c.endsWith('-auto'));

  if (padding.length > 0) {
    result.padding = {
      pattern: 'p-{step}',
      axes: ['px', 'py'],
      dirs: ['pt', 'pr', 'pb', 'pl'],
      range: inferRange(padding, 'p'),
    };
  }

  if (margin.length > 0) {
    result.margin = {
      pattern: 'm-{step}',
      axes: ['mx', 'my'],
      dirs: ['mt', 'mr', 'mb', 'ml'],
      range: inferRange(margin, 'm'),
    };
  }

  if (gap.length > 0) {
    result.gap = {
      pattern: 'gap-{step}',
      axes: ['gap-x', 'gap-y'],
      range: inferRange(gap, 'gap'),
    };
  }

  if (auto.length > 0) {
    result.auto = auto;
  }

  return result;
}

function compactLayout(classes: string[]): Record<string, unknown> {
  const display = classes.filter((c) =>
    /^(block|inline-block|inline-flex|inline-grid|inline|flex|grid|hidden|contents)$/.test(c)
  );
  const flexClasses = classes.filter((c) =>
    /^(flex-row|flex-col|flex-wrap|flex-nowrap|flex-1|flex-auto|flex-initial|flex-none|grow|shrink)/.test(
      c
    )
  );
  const gridClasses = classes.filter((c) => /^(grid-cols-|col-span-|grid-rows-|row-span-)/.test(c));
  const position = classes.filter((c) =>
    /^(relative|absolute|fixed|sticky|static|inset-|top-|right-|bottom-|left-)/.test(c)
  );
  const alignment = classes.filter((c) => /^(items-|justify-|self-)/.test(c));
  const overflow = classes.filter((c) => c.startsWith('overflow-'));
  const textAlign = classes.filter((c) =>
    /^(text-left|text-center|text-right|text-justify)$/.test(c)
  );
  const aspect = classes.filter((c) => c.startsWith('aspect-'));
  const zIndex = classes.filter((c) => c.startsWith('z-'));
  const order = classes.filter((c) => c.startsWith('order-'));
  const misc = classes.filter((c) => /^(visible|invisible|container)$/.test(c));

  const result: Record<string, unknown> = {};
  if (display.length) result.display = display;
  if (flexClasses.length) result.flex = flexClasses;
  if (gridClasses.length) {
    result.grid = {
      cols: 'grid-cols-{1-12}',
      span: 'col-span-{1-12}',
      rows: 'grid-rows-{1-6}',
      row_span: 'row-span-{1-6}',
      special: gridClasses.filter((c) => c.includes('full')),
    };
  }
  if (position.length) result.position = position;
  if (alignment.length) result.alignment = alignment;
  if (overflow.length) result.overflow = overflow;
  if (textAlign.length) result.text_align = textAlign;
  if (aspect.length) result.aspect = aspect;
  if (zIndex.length) result.z_index = zIndex;
  if (order.length) result.order = order;
  if (misc.length) result.misc = misc;

  return result;
}

function compactSizing(classes: string[]): Record<string, unknown> {
  const width = classes.filter((c) => c.startsWith('w-') && !/^w-\d/.test(c));
  const widthFixed = classes.filter((c) => /^w-\d/.test(c));
  const height = classes.filter((c) => c.startsWith('h-') && !/^h-\d/.test(c));
  const heightFixed = classes.filter((c) => /^h-\d/.test(c));
  const minH = classes.filter((c) => c.startsWith('min-h-'));
  const maxW = classes.filter((c) => c.startsWith('max-w-'));

  const result: Record<string, unknown> = {};
  if (width.length) result.width_fractions = width;
  if (widthFixed.length)
    result.width_fixed = { pattern: 'w-{step}', range: inferRange(widthFixed, 'w') };
  if (height.length) result.height_fractions = height;
  if (heightFixed.length)
    result.height_fixed = { pattern: 'h-{step}', range: inferRange(heightFixed, 'h') };
  if (minH.length) result.min_height = minH;
  if (maxW.length) result.max_width = maxW;

  return result;
}

function compactVisual(classes: string[]): Record<string, unknown> {
  const bg = classes.filter((c) => c.startsWith('bg-'));
  const border = classes.filter((c) => c.startsWith('border'));
  const rounded = classes.filter((c) => c.startsWith('rounded'));
  const shadow = classes.filter((c) => c.startsWith('shadow'));
  const opacity = classes.filter((c) => c.startsWith('opacity-'));
  const transition = classes.filter((c) => /^(transition|duration-|ease-)/.test(c));
  const transform = classes.filter((c) =>
    /^(scale-|rotate-|-rotate-|translate-|-translate-|skew-|-skew-)/.test(c)
  );
  const animate = classes.filter((c) => c.startsWith('animate-'));
  const interaction = classes.filter((c) => /^(cursor-|pointer-events-|select-)/.test(c));

  const result: Record<string, unknown> = {};
  if (bg.length) result.backgrounds = bg;
  if (border.length) result.borders = border;
  if (rounded.length) result.border_radius = rounded;
  if (shadow.length) result.shadows = shadow;
  if (opacity.length) result.opacity = { pattern: 'opacity-{0-100}', values: opacity };
  if (transition.length) result.transitions = transition;
  if (transform.length) result.transforms = transform;
  if (animate.length) result.animations = animate;
  if (interaction.length) result.interaction = interaction;

  return result;
}

function compactTypography(classes: string[]): Record<string, unknown> {
  const textSize = classes.filter((c) => /^text-(2xs|xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)/.test(c));
  const fontWeight = classes.filter((c) =>
    /^font-(light|regular|medium|semibold|bold|extrabold|black)/.test(c)
  );
  const fontFamily = classes.filter((c) => /^font-(sans|serif|display|mono)/.test(c));
  const tracking = classes.filter((c) => c.startsWith('tracking-'));
  const leading = classes.filter((c) => c.startsWith('leading-'));
  const misc = classes.filter((c) =>
    /^(text-uppercase|text-lowercase|text-capitalize|text-normal-case|text-decoration-|truncate|line-clamp-)/.test(
      c
    )
  );

  const result: Record<string, unknown> = {};
  if (textSize.length) result.sizes = textSize;
  if (fontWeight.length) result.weights = fontWeight;
  if (fontFamily.length) result.families = fontFamily;
  if (tracking.length) result.letter_spacing = tracking;
  if (leading.length) result.line_height = leading;
  if (misc.length) result.text_transforms = misc;

  return result;
}
