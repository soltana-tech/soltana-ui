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

function isTierConfig(value: unknown): value is TierConfig {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  if ('include' in obj && !Array.isArray(obj.include)) return false;
  if ('exclude' in obj && !Array.isArray(obj.exclude)) return false;
  return true;
}

/**
 * Compute the set of tier values to exclude from output.
 */
function buildExcludeSet(options: SoltanaTreeshakeOptions): Map<string, Set<string>> {
  const excludes = new Map<string, Set<string>>();

  for (const [pluralKey, value] of Object.entries(options)) {
    const tier = TIER_KEY_MAP[pluralKey];
    if (!tier || !(tier in BUILT_IN)) continue;

    if (!isTierConfig(value)) continue;
    const tierConfig = value;

    const builtIn = BUILT_IN[tier];

    if (tierConfig.include && tierConfig.exclude) {
      console.warn(
        `[soltana] Tier "${tier}" specifies both include and exclude; exclude will be ignored`
      );
    }

    let excluded: string[];
    const builtInSet = new Set(builtIn);
    if (tierConfig.include) {
      // Warn on unrecognized include values
      for (const v of tierConfig.include) {
        if (!builtInSet.has(v)) {
          console.warn(`[soltana] Treeshake: include value "${v}" is not a built-in ${tier}`);
        }
      }
      // Exclude everything built-in that isn't in the include list
      const included = new Set(tierConfig.include);
      excluded = builtIn.filter((v) => !included.has(v));
    } else if (tierConfig.exclude) {
      // Warn on unrecognized exclude values
      for (const v of tierConfig.exclude) {
        if (!builtInSet.has(v)) {
          console.warn(`[soltana] Treeshake: exclude value "${v}" is not a built-in ${tier}`);
        }
      }
      // Exclude only explicitly listed values (intersected with built-in)
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
 * Extract all tier + value pairs from a single selector fragment.
 * Returns an empty array for neutral selectors (no tier reference).
 * Ignores tier references inside :not() — those are negations, not positive matches.
 */
function extractTierRefs(fragment: string): { tier: string; value: string }[] {
  const stripped = fragment.replace(NEGATED_ATTR_RE, '');
  const refs: { tier: string; value: string }[] = [];

  DATA_ATTR_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = DATA_ATTR_RE.exec(stripped)) !== null) {
    refs.push({ tier: match[1], value: match[2] });
  }

  const classMatch = CLASS_RE.exec(stripped);
  if (classMatch) {
    refs.push({ tier: classMatch[1], value: classMatch[2] });
  }

  return refs;
}

/**
 * Determine whether a selector fragment should be excluded.
 * A fragment is excluded if any of its tier references targets an excluded value.
 */
function isExcluded(fragment: string, excludes: Map<string, Set<string>>): boolean {
  const refs = extractTierRefs(fragment);
  if (refs.length === 0) return false; // Neutral selector — never excluded
  return refs.some((ref) => {
    const tierExcludes = excludes.get(ref.tier);
    return tierExcludes?.has(ref.value) ?? false;
  });
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
