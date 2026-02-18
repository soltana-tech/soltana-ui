/** API Reference — Runtime tier registration (themes, reliefs, finishes, ornaments). */

import { sectionHeading, codeExample, specimenBlock } from '../../utils/helpers';

export function renderApiRegistration(): string {
  return `
<div class="page-api-registration">
  ${sectionHeading('Tier Registration', 'api-registration', 'Register custom themes, reliefs, finishes, and ornaments at runtime.')}

  <p class="text-secondary mt-4 mb-6">
    All registration methods return a <code>TierRegistration</code> handle with
    an <code>unregister()</code> method for cleanup. Registered tiers are
    immediately usable with the corresponding setter.
  </p>

  ${specimenBlock(
    'registerTheme()',
    `
    <p class="text-secondary mb-4">
      Register a custom theme from a seed of core colors. Soltana derives
      the full token set (surfaces, text, borders, accents, semantic colors,
      interactive states, component tokens) automatically.
    </p>

    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(
      `registerTheme(
  name: string,
  options: RegisterThemeOptions
): TierRegistration`,
      'typescript'
    )}

    <h4 class="font-semibold mt-6 mb-2">RegisterThemeOptions</h4>
    ${codeExample(
      `interface RegisterThemeOptions {
  seed: ThemeSeed;
  tokens?: Record<string, string>; // Override any derived token
}`,
      'typescript'
    )}

    <h4 class="font-semibold mt-6 mb-2">ThemeSeed</h4>
    <div class="table-container">
      <table class="table table-striped">
        <thead>
          <tr><th>Property</th><th>Type</th><th>Required</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>surfaceBg</code></td><td><code>string</code></td><td>Yes</td><td>Base surface background color.</td></tr>
          <tr><td><code>textPrimary</code></td><td><code>string</code></td><td>Yes</td><td>Primary text color.</td></tr>
          <tr><td><code>accentPrimary</code></td><td><code>string</code></td><td>Yes</td><td>Primary accent / brand color.</td></tr>
          <tr><td><code>accentDecorative</code></td><td><code>string</code></td><td>No</td><td>Decorative accent for ornament borders and highlights.</td></tr>
          <tr><td><code>colorScheme</code></td><td><code>'light' | 'dark'</code></td><td>No</td><td>Hint for derived token generation. Auto-detected if omitted.</td></tr>
          <tr><td><code>colorSuccess</code></td><td><code>string</code></td><td>No</td><td>Semantic success color.</td></tr>
          <tr><td><code>colorWarning</code></td><td><code>string</code></td><td>No</td><td>Semantic warning color.</td></tr>
          <tr><td><code>colorError</code></td><td><code>string</code></td><td>No</td><td>Semantic error color.</td></tr>
          <tr><td><code>colorInfo</code></td><td><code>string</code></td><td>No</td><td>Semantic info color.</td></tr>
        </tbody>
      </table>
    </div>

    <h4 class="font-semibold mt-6 mb-2">Example</h4>
    ${codeExample(
      `const reg = soltana.registerTheme('ocean', {
  seed: {
    surfaceBg: '#0a1628',
    textPrimary: '#c8d6e5',
    accentPrimary: '#0984e3',
    accentDecorative: '#00cec9',
    colorScheme: 'dark',
  },
});

soltana.setTheme('ocean');

// Later, to remove:
reg.unregister();`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'registerRelief()',
    `
    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(
      `registerRelief(
  name: string,
  options: RegisterReliefOptions
): TierRegistration`,
      'typescript'
    )}

    <h4 class="font-semibold mt-6 mb-2">Required Tokens</h4>
    ${codeExample(
      `interface RegisterReliefOptions {
  tokens: {
    '--relief-bg': string;
    '--relief-shadow-sm': string;
    '--relief-shadow': string;
    '--relief-shadow-lg': string;
    '--relief-shadow-inset-sm': string;
    '--relief-shadow-inset': string;
    '--relief-shadow-inset-lg': string;
    '--relief-border': string;
  };
}`,
      'typescript'
    )}

    <h4 class="font-semibold mt-6 mb-2">Example</h4>
    ${codeExample(
      `soltana.registerRelief('dramatic', {
  tokens: {
    '--relief-bg': 'var(--surface-bg)',
    '--relief-shadow-sm': '0 2px 8px rgb(0 0 0 / 0.4)',
    '--relief-shadow': '0 4px 16px rgb(0 0 0 / 0.5)',
    '--relief-shadow-lg': '0 8px 32px rgb(0 0 0 / 0.6)',
    '--relief-shadow-inset-sm': 'inset 0 1px 4px rgb(0 0 0 / 0.3)',
    '--relief-shadow-inset': 'inset 0 2px 8px rgb(0 0 0 / 0.4)',
    '--relief-shadow-inset-lg': 'inset 0 4px 16px rgb(0 0 0 / 0.5)',
    '--relief-border': '1px solid rgb(255 255 255 / 0.05)',
  },
});`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'registerFinish()',
    `
    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(
      `registerFinish(
  name: string,
  options: RegisterFinishOptions
): TierRegistration`,
      'typescript'
    )}

    <h4 class="font-semibold mt-6 mb-2">Required Tokens</h4>
    ${codeExample(
      `interface RegisterFinishOptions {
  tokens: {
    '--finish-blur': string;
    '--finish-saturation': string;
    '--finish-opacity': string;
    '--finish-overlay': string;
    '--finish-sheen': string;
  };
}`,
      'typescript'
    )}

    <h4 class="font-semibold mt-6 mb-2">Example</h4>
    ${codeExample(
      `soltana.registerFinish('neon', {
  tokens: {
    '--finish-blur': '0px',
    '--finish-saturation': '1.4',
    '--finish-opacity': '1',
    '--finish-overlay': 'linear-gradient(135deg, transparent, rgb(0 255 255 / 0.05))',
    '--finish-sheen': '0 0 20px rgb(0 255 255 / 0.1)',
  },
});`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'registerOrnament()',
    `
    <h4 class="font-semibold mt-6 mb-2">Signature</h4>
    ${codeExample(
      `registerOrnament(
  name: string,
  options: RegisterOrnamentOptions
): TierRegistration`,
      'typescript'
    )}

    <h4 class="font-semibold mt-6 mb-2">Options</h4>
    ${codeExample(
      `interface RegisterOrnamentOptions {
  tokens: Record<string, string>; // Free-form ornament token map
}`,
      'typescript'
    )}
  `
  )}

  ${specimenBlock(
    'TierRegistration',
    `
    <p class="text-secondary mb-4">
      Returned by all <code>register*()</code> methods. Call <code>unregister()</code>
      to remove the tier value, its CSS rule, and its entry in the validation registry.
    </p>
    ${codeExample(
      `interface TierRegistration {
  readonly name: string;
  readonly tier: TierName;
  unregister(): void;
}`,
      'typescript'
    )}
  `
  )}
</div>`;
}
