import { describe, it, expect } from 'vitest';
import { RECIPES } from './recipes.js';
import type { RecipeName } from './types.js';
import { BUILT_IN_THEMES, BUILT_IN_RELIEFS, BUILT_IN_FINISHES } from './types.js';

describe('RECIPES data integrity', () => {
  const expectedKeys: RecipeName[] = [
    'corporate-clean',
    'luxury-dark',
    'frosted-modern',
    'classic-warm',
  ];

  it('contains all expected keys', () => {
    expect(Object.keys(RECIPES)).toEqual(expect.arrayContaining(expectedKeys));
    expect(Object.keys(RECIPES)).toHaveLength(expectedKeys.length);
  });

  it.each(Object.entries(RECIPES))('%s specifies all required fields', (_key, recipe) => {
    expect(recipe).toHaveProperty('name');
    expect(recipe).toHaveProperty('description');
    expect(recipe).toHaveProperty('theme');
    expect(recipe).toHaveProperty('relief');
    expect(recipe).toHaveProperty('finish');
    expect(typeof recipe.name).toBe('string');
    expect(typeof recipe.description).toBe('string');
  });

  it.each(Object.entries(RECIPES))('%s uses valid built-in tier values', (_key, recipe) => {
    expect([...BUILT_IN_THEMES, 'auto']).toContain(recipe.theme);
    expect([...BUILT_IN_RELIEFS]).toContain(recipe.relief);
    expect([...BUILT_IN_FINISHES]).toContain(recipe.finish);
  });
});
