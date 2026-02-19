/** API Reference — applyRecipe() and recipe registry. */

import { sectionHeading, codeExample, specimenBlock } from '../../utils/helpers';

export function renderApiRecipes(): string {
  return `
<div class="page-api-recipes">
  ${sectionHeading('Recipes', 'api-recipes', 'Named tier presets for common configurations.')}

  ${specimenBlock(
    'applyRecipe()',
    `
    <p class="text-secondary mb-4">
      Applies a named recipe, setting all three tiers atomically. The instance
      state and DOM attributes update in a single pass.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`applyRecipe(recipeName: RecipeName): void`, 'typescript')}

    <h4 class="font-semibold mt-6 mb-2">Example</h4>
    ${codeExample(`soltana.applyRecipe('luxury-dark');`, 'typescript')}
  `
  )}

  ${specimenBlock(
    'Built-in Recipes',
    `
    <div class="table-container">
      <table class="table table-striped">
        <thead>
          <tr><th>Name</th><th>Theme</th><th>Relief</th><th>Finish</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>'corporate-clean'</code></td>
            <td>light</td><td>flat</td><td>matte</td>
            <td>Minimal and professional.</td>
          </tr>
          <tr>
            <td><code>'luxury-dark'</code></td>
            <td>dark</td><td>neumorphic</td><td>glossy</td>
            <td>Rich neumorphic depth with glossy sheen.</td>
          </tr>
          <tr>
            <td><code>'frosted-modern'</code></td>
            <td>dark</td><td>glassmorphic</td><td>frosted</td>
            <td>Glassmorphic frosted panels on a dark backdrop.</td>
          </tr>
          <tr>
            <td><code>'classic-warm'</code></td>
            <td>sepia</td><td>skeuomorphic</td><td>matte</td>
            <td>Warm parchment tones with skeuomorphic depth.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
  )}

  ${specimenBlock(
    'registerRecipe()',
    `
    <p class="text-secondary mb-4">
      Register a custom recipe. Once registered, it can be applied via
      <code>applyRecipe()</code> by name.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(`registerRecipe(name: string, recipe: Recipe): void`, 'typescript')}

    <h4 class="font-semibold mt-6 mb-2">Recipe Interface</h4>
    ${codeExample(
      `interface Recipe {
  name: string;
  description: string;
  theme: Theme;
  relief: Relief;
  finish: Finish;
}`,
      'typescript'
    )}

    <h4 class="font-semibold mt-6 mb-2">Example</h4>
    ${codeExample(
      `soltana.registerRecipe('midnight-frost', {
  name: 'Midnight Frost',
  description: 'Glassmorphic frost on dark.',
  theme: 'dark',
  relief: 'glassmorphic',
  finish: 'frosted',
});

soltana.applyRecipe('midnight-frost');`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'RECIPES constant',
    `
    <p class="text-secondary mb-4">
      The <code>RECIPES</code> export provides read-only access to all registered
      recipes (built-in and custom). Useful for building recipe pickers.
    </p>
    ${codeExample(
      `import { RECIPES } from '@soltana/config';

Object.entries(RECIPES).forEach(([key, recipe]) => {
  console.log(key, recipe.name, recipe.description);
});`,
      'typescript'
    )}
  `
  )}
</div>`;
}
