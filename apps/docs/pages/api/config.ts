/** API Reference — Configuration: runtime tier registration. */

import {
  sectionHeading,
  codeExample,
  specimenBlock,
  quickNav,
  sectionDivider,
} from '../../lib/helpers';

export function renderApiConfig(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-api-config">
  ${sectionHeading('Configuration', 'api-config', 'Runtime tier registration.')}

  ${quickNav([{ label: 'Tier Registration', href: '#api-registration' }])}

  ${sectionDivider()}

  <div id="api-registration">
    <h3 class="text-2xl font-bold mb-6">Tier Registration</h3>

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

      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(
        `registerTheme(
  name: string,
  options: RegisterThemeOptions
): TierRegistration`,
        'typescript'
      )}

      <h4 class="text-lg font-semibold mt-6 mb-2">RegisterThemeOptions</h4>
      ${codeExample(
        `interface RegisterThemeOptions {
  seed: ThemeSeed;
  tokens?: Record<string, string>; // Override any derived token
}`,
        'typescript'
      )}

      <h4 class="text-lg font-semibold mt-6 mb-2">ThemeSeed</h4>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Required</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>surfaceBg</code></td><td><code>string</code></td><td>Yes</td><td>Base surface background color.</td></tr>
            <tr><td><code>textPrimary</code></td><td><code>string</code></td><td>Yes</td><td>Primary text color.</td></tr>
            <tr><td><code>accentPrimary</code></td><td><code>string</code></td><td>Yes</td><td>Primary accent / brand color.</td></tr>
            <tr><td><code>accentDecorative</code></td><td><code>string</code></td><td>No</td><td>Decorative accent for borders and highlights. Defaults to <code>accentPrimary</code>.</td></tr>
            <tr><td><code>colorScheme</code></td><td><code>'light' | 'dark'</code></td><td>No</td><td>Hint for derived token generation. Defaults to <code>'dark'</code>.</td></tr>
            <tr><td><code>colorSuccess</code></td><td><code>string</code></td><td>No</td><td>Semantic success color.</td></tr>
            <tr><td><code>colorWarning</code></td><td><code>string</code></td><td>No</td><td>Semantic warning color.</td></tr>
            <tr><td><code>colorError</code></td><td><code>string</code></td><td>No</td><td>Semantic error color.</td></tr>
            <tr><td><code>colorInfo</code></td><td><code>string</code></td><td>No</td><td>Semantic info color.</td></tr>
            <tr><td><code>highlightColor</code></td><td><code>string</code></td><td>No</td><td>Highlight channel (R G B space-separated) for relief inset highlights and neumorphic light edges. Defaults to <code>'255 255 255'</code>.</td></tr>
          </tbody>
        </table>
      </div>

      <h4 class="text-lg font-semibold mt-6 mb-2">Basic Example</h4>
      ${codeExample(
        `const reg = soltana.registerTheme('ocean', {
  seed: {
    surfaceBg: '#0a1628',
    textPrimary: '#c8d6e5',
    accentPrimary: '#0984e3',
    colorScheme: 'dark',
  },
});

soltana.setTheme('ocean');

// Later, to remove:
reg.unregister();`,
        'typescript'
      )}

      <h4 class="text-lg font-semibold mt-6 mb-2">Full-Featured Theme with All Seed Properties</h4>
      ${codeExample(
        `const reg = soltana.registerTheme('brand', {
  seed: {
    surfaceBg: '#1a1a2e',
    textPrimary: '#eaeaea',
    accentPrimary: '#6366f1',
    accentDecorative: '#8b5cf6',
    colorScheme: 'dark',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    highlightColor: '200 200 255',
  },
});

soltana.setTheme('brand');`,
        'typescript'
      )}

      <h4 class="text-lg font-semibold mt-6 mb-2">Token Override Example</h4>
      <p class="text-secondary mb-4">
        Use the <code>tokens</code> option to override specific derived tokens after generation:
      </p>
      ${codeExample(
        `const reg = soltana.registerTheme('custom', {
  seed: {
    surfaceBg: '#0f0f0f',
    textPrimary: '#e0e0e0',
    accentPrimary: '#0ea5e9',
    colorScheme: 'dark',
  },
  tokens: {
    '--card-bg': 'rgb(20 20 30 / 0.95)',
    '--border-default': '1px solid rgb(255 255 255 / 0.08)',
    '--accent-primary-hover': '#0284c7',
  },
});

soltana.setTheme('custom');`,
        'typescript'
      )}

      <h4 class="text-lg font-semibold mt-6 mb-2">Cleanup Example</h4>
      <p class="text-secondary mb-4">
        Call <code>unregister()</code> to remove the theme's CSS rules and deregister it from validation:
      </p>
      ${codeExample(
        `const reg = soltana.registerTheme('temporary', {
  seed: {
    surfaceBg: '#ffffff',
    textPrimary: '#000000',
    accentPrimary: '#3b82f6',
    colorScheme: 'light',
  },
});

// Use the theme
soltana.setTheme('temporary');

// Clean up when done
reg.unregister();
// Attempting to use 'temporary' now will fail validation`,
        'typescript'
      )}
    `
    )}

    ${specimenBlock(
      'registerRelief()',
      `
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(
        `registerRelief(
  name: string,
  options: RegisterReliefOptions
): TierRegistration`,
        'typescript'
      )}

      <h4 class="text-lg font-semibold mt-6 mb-2">Required Tokens</h4>
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
    '--relief-opacity'?: string; // Optional — defaults to 1
  };
}`,
        'typescript'
      )}

      <h4 class="text-lg font-semibold mt-6 mb-2">Example</h4>
      ${codeExample(
        `const reg = soltana.registerRelief('dramatic', {
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
});

soltana.setRelief('dramatic');

// Clean up when done
reg.unregister();`,
        'typescript'
      )}
    `
    )}

    ${specimenBlock(
      'registerFinish()',
      `
      <h4 class="text-lg font-semibold mt-6 mb-2">Signature</h4>
      ${codeExample(
        `registerFinish(
  name: string,
  options: RegisterFinishOptions
): TierRegistration`,
        'typescript'
      )}

      <h4 class="text-lg font-semibold mt-6 mb-2">Required Tokens</h4>
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

      <h4 class="text-lg font-semibold mt-6 mb-2">Example</h4>
      ${codeExample(
        `const reg = soltana.registerFinish('neon', {
  tokens: {
    '--finish-blur': '0px',
    '--finish-saturation': '1.4',
    '--finish-opacity': '1',
    '--finish-overlay': 'linear-gradient(135deg, transparent, rgb(0 255 255 / 0.05))',
    '--finish-sheen': '0 0 20px rgb(0 255 255 / 0.1)',
  },
});

soltana.setFinish('neon');

// Clean up when done
reg.unregister();`,
        'typescript'
      )}
    `
    )}

    ${specimenBlock(
      'registerTierValue() (internal)',
      `
      <p class="text-secondary mb-4">
        <strong>Internal / advanced.</strong> Low-level function to register a
        tier value in the validation registry. Called internally by
        <code>registerTheme()</code> / <code>registerRelief()</code> /
        <code>registerFinish()</code>. Not exported from the top-level
        <code>soltana-ui</code> barrel — use the instance-scoped APIs instead,
        which provide <code>unregister()</code> handles for cleanup.
      </p>
      <p class="text-secondary mb-4">
        Accessible via deep import at <code>soltana-ui/config/validation</code>
        for advanced use cases, but not considered public API.
      </p>

      <h4 class="text-lg font-semibold mt-6 mb-2">Recommended: Instance API</h4>
      ${codeExample(
        `const reg = soltana.registerTheme('ocean', {
  seed: { surfaceBg: '#0a1628', textPrimary: '#c8d6e5', accentPrimary: '#0984e3' },
});
soltana.setTheme('ocean');

// Clean up when done
reg.unregister();`,
        'typescript'
      )}
    `
    )}

    ${specimenBlock(
      'Built-in Constants',
      `
      <p class="text-secondary mb-4">
        These constants are available as named exports for type-safe enumeration:
      </p>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr><th>Export</th><th>Values</th></tr>
          </thead>
          <tbody>
            <tr><td><code>BUILT_IN_THEMES</code></td><td><code>'dark'</code>, <code>'light'</code>, <code>'sepia'</code> (<code>'auto'</code> is always valid but not listed here — it is a runtime resolver, not a static token set)</td></tr>
            <tr><td><code>BUILT_IN_RELIEFS</code></td><td><code>'flat'</code>, <code>'glassmorphic'</code>, <code>'skeuomorphic'</code>, <code>'neumorphic'</code></td></tr>
            <tr><td><code>BUILT_IN_FINISHES</code></td><td><code>'matte'</code>, <code>'frosted'</code>, <code>'tinted'</code>, <code>'glossy'</code></td></tr>
          </tbody>
        </table>
      </div>
    `
    )}

    ${specimenBlock(
      'Error Handling',
      `
      <p class="text-secondary mb-4">Registration behavior depends on the <code>strict</code> mode set during <code>initSoltana()</code>:</p>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr><th>Scenario</th><th>Strict mode</th><th>Non-strict mode</th></tr>
          </thead>
          <tbody>
            <tr><td>Invalid tier value</td><td>Throws <code>Error</code></td><td>Logs warning to console</td></tr>
            <tr><td>Duplicate registration (same name)</td><td colspan="2">Overwrites silently — previous CSS rules remain unless <code>unregister()</code> was called</td></tr>
          </tbody>
        </table>
      </div>
      <p class="text-secondary mt-4">
        Call <code>unregister()</code> on the returned <code>TierRegistration</code> to remove
        injected CSS rules and deregister the tier value from validation.
      </p>
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
  </div>
</div>`;
  return page;
}
