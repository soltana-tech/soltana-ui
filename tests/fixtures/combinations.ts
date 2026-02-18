import {
  VALID_THEMES,
  VALID_RELIEFS,
  VALID_FINISHES,
  VALID_ORNAMENTS,
} from '../../packages/soltana-ui/src/config/validation';
import { RECIPES } from '../../packages/soltana-ui/src/config/recipes';

export interface TierCombination {
  theme: string;
  relief: string;
  finish: string;
  ornament: string;
}

const BASE: TierCombination = {
  theme: 'dark',
  relief: 'neu',
  finish: 'matte',
  ornament: 'none',
};

function key(c: TierCombination): string {
  return `${c.theme}|${c.relief}|${c.finish}|${c.ornament}`;
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

/** Recipe presets as tier combinations. */
export function recipes(): TierCombination[] {
  return Object.values(RECIPES).map((r) => ({
    theme: r.theme === 'auto' ? 'dark' : r.theme,
    relief: r.relief,
    finish: r.finish,
    ornament: r.ornament,
  }));
}

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
  for (const ornament of VALID_ORNAMENTS) {
    combos.push({ ...BASE, ornament });
  }

  return deduplicate(combos);
}

/** Recipes + single-axis variation, deduplicated. Default test strategy. */
export function defaultCombinations(): TierCombination[] {
  return deduplicate([...recipes(), ...singleAxis()]);
}

/** Full cartesian product of all tier values. Opt-in via FULL_MATRIX=1. */
export function cartesian(): TierCombination[] {
  const combos: TierCombination[] = [];

  for (const theme of visualThemes) {
    for (const relief of VALID_RELIEFS) {
      for (const finish of VALID_FINISHES) {
        for (const ornament of VALID_ORNAMENTS) {
          combos.push({ theme, relief, finish, ornament });
        }
      }
    }
  }

  return combos;
}
