// ---------------------------------------------------------------------------
// PostCSS Soltana Tree-Shake Plugin
// ---------------------------------------------------------------------------
// Strips CSS rules referencing excluded built-in tier values from the compiled
// output. Only explicitly excluded built-in values are removed — custom tier
// values and non-tier selectors are never touched.
// ---------------------------------------------------------------------------

import type { Plugin, Rule } from 'postcss';
import type { SoltanaTreeshakeOptions, TierConfig } from './types.js';
import { BUILT_IN_THEMES, BUILT_IN_RELIEFS, BUILT_IN_FINISHES } from '../config/types.js';

const BUILT_IN: Record<string, readonly string[]> = {
  theme: BUILT_IN_THEMES,
  relief: BUILT_IN_RELIEFS,
  finish: BUILT_IN_FINISHES,
};

// Maps plural config keys to singular tier names used in selectors
const TIER_KEY_MAP: Record<string, string> = {
  themes: 'theme',
  reliefs: 'relief',
  finishes: 'finish',
};

// Matches [data-tier='value'] in a selector fragment (global for all occurrences)
const DATA_ATTR_RE = /\[data-(theme|relief|finish)='([^']+)'\]/g;

// Matches .tier-value in a selector fragment
const CLASS_RE = /\.(theme|relief|finish)-([\w-]+)/;

// Matches [data-tier='value'] that appears inside :not()
const NEGATED_ATTR_RE = /:not\([^)]*\[data-(theme|relief|finish)='[^']+'\][^)]*\)/g;

/**
 * Compute the set of tier values to exclude from output.
 */
function buildExcludeSet(options: SoltanaTreeshakeOptions): Map<string, Set<string>> {
  const excludes = new Map<string, Set<string>>();

  for (const [pluralKey, value] of Object.entries(options)) {
    const tier = TIER_KEY_MAP[pluralKey];
    if (!tier || !(tier in BUILT_IN)) continue;

    const tierConfig = value as TierConfig | undefined;
    if (!tierConfig) continue;

    const builtIn = BUILT_IN[tier];

    if (tierConfig.include && tierConfig.exclude) {
      console.warn(
        `[soltana] Tier "${tier}" specifies both include and exclude; exclude will be ignored`
      );
    }

    let excluded: string[];
    if (tierConfig.include) {
      // Exclude everything built-in that isn't in the include list
      const included = new Set(tierConfig.include);
      excluded = builtIn.filter((v) => !included.has(v));
    } else if (tierConfig.exclude) {
      // Exclude only explicitly listed values (intersected with built-in)
      const builtInSet = new Set(builtIn);
      excluded = tierConfig.exclude.filter((v) => builtInSet.has(v));
    } else {
      continue;
    }

    if (excluded.length > 0) {
      excludes.set(tier, new Set(excluded));
    }
  }

  return excludes;
}

/**
 * Extract tier + value from a single selector fragment, if present.
 * Returns null for neutral selectors (no tier reference).
 * Ignores tier references inside :not() — those are negations, not positive matches.
 */
function extractTierRef(fragment: string): { tier: string; value: string } | null {
  // Strip :not() contents so negated tier refs are ignored
  const stripped = fragment.replace(NEGATED_ATTR_RE, '');

  DATA_ATTR_RE.lastIndex = 0;
  const dataMatch = DATA_ATTR_RE.exec(stripped);
  if (dataMatch) {
    return { tier: dataMatch[1], value: dataMatch[2] };
  }

  const classMatch = CLASS_RE.exec(stripped);
  if (classMatch) {
    return { tier: classMatch[1], value: classMatch[2] };
  }

  return null;
}

/**
 * Determine whether a selector fragment should be excluded.
 */
function isExcluded(fragment: string, excludes: Map<string, Set<string>>): boolean {
  const ref = extractTierRef(fragment);
  if (!ref) return false; // Neutral selector — never excluded
  const tierExcludes = excludes.get(ref.tier);
  if (!tierExcludes) return false;
  return tierExcludes.has(ref.value);
}

/**
 * PostCSS plugin that strips CSS rules referencing excluded tier values.
 */
function soltanaTreeshake(options: SoltanaTreeshakeOptions = {}): Plugin {
  const excludes = buildExcludeSet(options);

  return {
    postcssPlugin: 'postcss-soltana-treeshake',
    Once(root) {
      if (excludes.size === 0) return;

      root.walkRules((rule: Rule) => {
        // Never touch @keyframes children
        if (rule.parent && 'name' in rule.parent && rule.parent.name === 'keyframes') {
          return;
        }

        const fragments = rule.selectors;
        const kept: string[] = [];

        for (const fragment of fragments) {
          if (!isExcluded(fragment, excludes)) {
            kept.push(fragment);
          }
        }

        if (kept.length === 0) {
          rule.remove();
        } else if (kept.length < fragments.length) {
          rule.selectors = kept;
        }
      });
    },
  };
}

soltanaTreeshake.postcss = true as const;

export default soltanaTreeshake;
