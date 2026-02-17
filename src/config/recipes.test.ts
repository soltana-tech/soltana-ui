import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initSoltana } from './index';
import { RECIPES } from './recipes';
import type { RecipeName } from './types';
import { _resetFontLoader } from '../fonts/index';

vi.mock('../enhancers/index.js');

import { mockEnhancerDestroy } from '../enhancers/__mocks__/index';

const mockDestroy = mockEnhancerDestroy;

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
    expect(recipe).toHaveProperty('ornament');
    expect(typeof recipe.name).toBe('string');
    expect(typeof recipe.description).toBe('string');
  });
});

describe('applyRecipe', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-relief');
    document.documentElement.removeAttribute('data-finish');
    document.documentElement.removeAttribute('data-ornament');
    document.documentElement.removeAttribute('style');
    document.head.innerHTML = '';
    _resetFontLoader();
    mockDestroy.mockClear();
  });

  it.each(Object.entries(RECIPES))(
    '%s applies tier values matching RECIPES definition',
    (key, recipe) => {
      const soltana = initSoltana();
      soltana.applyRecipe(key as RecipeName);

      const root = document.documentElement;
      expect(root.getAttribute('data-theme')).toBe(recipe.theme);
      expect(root.getAttribute('data-relief')).toBe(recipe.relief);
      expect(root.getAttribute('data-finish')).toBe(recipe.finish);
      expect(root.getAttribute('data-ornament')).toBe(recipe.ornament);

      const state = soltana.getState();
      expect(state.theme).toBe(recipe.theme);
      expect(state.relief).toBe(recipe.relief);
      expect(state.finish).toBe(recipe.finish);
      expect(state.ornament).toBe(recipe.ornament);
    }
  );

  it('invalid recipe name triggers console.warn and preserves state', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    const soltana = initSoltana({ theme: 'sepia', relief: 'sharp' });

    soltana.applyRecipe('nonexistent' as RecipeName);

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Unknown recipe'));
    expect(soltana.getState().theme).toBe('sepia');
    expect(soltana.getState().relief).toBe('sharp');
    spy.mockRestore();
  });

  it('individual setters can override tiers after recipe application', () => {
    const soltana = initSoltana();
    soltana.applyRecipe('luxury-dark');

    soltana.setTheme('light');
    soltana.setRelief('flat');

    const state = soltana.getState();
    expect(state.theme).toBe('light');
    expect(state.relief).toBe('flat');
    expect(state.finish).toBe('glossy');
    expect(state.ornament).toBe('gilt');
  });
});
