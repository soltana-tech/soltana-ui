import {
  VALID_THEMES,
  VALID_RELIEFS,
  VALID_FINISHES,
} from '../../packages/soltana-ui/src/config/validation';

export interface TierCombination {
  theme: string;
  relief: string;
  finish: string;
}

const BASE: TierCombination = {
  theme: 'dark',
  relief: 'neumorphic',
  finish: 'matte',
};

function key(c: TierCombination): string {
  return `${c.theme}|${c.relief}|${c.finish}`;
}

function deduplicate(combos: TierCombination[]): TierCombination[] {
  const seen = new Set<string>();
  return combos.filter((c) => {
    const k = key(c);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** Visual themes only — excludes 'auto' (runtime resolver, not a static token set). */
const visualThemes = VALID_THEMES.filter((t) => t !== 'auto');

/** Vary one tier at a time from the base combination, covering every built-in value. */
export function singleAxis(): TierCombination[] {
  const combos: TierCombination[] = [];

  for (const theme of visualThemes) {
    combos.push({ ...BASE, theme });
  }
  for (const relief of VALID_RELIEFS) {
    combos.push({ ...BASE, relief });
  }
  for (const finish of VALID_FINISHES) {
    combos.push({ ...BASE, finish });
  }

  return deduplicate(combos);
}

/** Single-axis variation, deduplicated. Default test strategy. */
export function defaultCombinations(): TierCombination[] {
  return singleAxis();
}

/** Full cartesian product of all tier values. Opt-in via FULL_MATRIX=1. */
export function cartesian(): TierCombination[] {
  const combos: TierCombination[] = [];

  for (const theme of visualThemes) {
    for (const relief of VALID_RELIEFS) {
      for (const finish of VALID_FINISHES) {
        combos.push({ theme, relief, finish });
      }
    }
  }

  return combos;
}
