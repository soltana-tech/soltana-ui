import { describe, it, expect, beforeEach } from 'vitest';
import {
  THEME_TOKEN_NAMES,
  deriveThemeTokens,
  registerTheme,
  registerRelief,
  registerFinish,
  registerOrnament,
  _resetIntrospectionCache,
} from './register';
import { _resetStylesheet } from './stylesheet';
import type { ThemeSeed } from './types';

const DARK_SEED: ThemeSeed = {
  surfaceBg: '#08091a',
  textPrimary: '#f5f0e6',
  accentPrimary: '#d4a843',
};

const LIGHT_SEED: ThemeSeed = {
  surfaceBg: '#f6f7fa',
  textPrimary: '#1e2128',
  accentPrimary: '#576378',
  colorScheme: 'light',
};

function getCustomSheet(): CSSStyleSheet | null {
  const el = document.getElementById('soltana-custom') as HTMLStyleElement | null;
  return el?.sheet ?? null;
}

function getAllRuleTexts(): string[] {
  const sheet = getCustomSheet();
  if (!sheet) return [];
  return Array.from(sheet.cssRules).map((r) => r.cssText);
}

describe('THEME_TOKEN_NAMES', () => {
  it('contains all surface tokens', () => {
    expect(THEME_TOKEN_NAMES).toContain('--surface-bg');
    expect(THEME_TOKEN_NAMES).toContain('--surface-1');
    expect(THEME_TOKEN_NAMES).toContain('--surface-4');
  });

  it('contains all text tokens', () => {
    expect(THEME_TOKEN_NAMES).toContain('--text-primary');
    expect(THEME_TOKEN_NAMES).toContain('--text-inverse');
  });

  it('contains accent tokens', () => {
    expect(THEME_TOKEN_NAMES).toContain('--accent-primary');
    expect(THEME_TOKEN_NAMES).toContain('--accent-secondary');
    expect(THEME_TOKEN_NAMES).toContain('--accent-decorative');
  });

  it('contains semantic color tokens', () => {
    expect(THEME_TOKEN_NAMES).toContain('--color-success');
    expect(THEME_TOKEN_NAMES).toContain('--color-error');
    expect(THEME_TOKEN_NAMES).toContain('--color-info');
  });

  it('contains state tokens', () => {
    expect(THEME_TOKEN_NAMES).toContain('--state-hover');
    expect(THEME_TOKEN_NAMES).toContain('--state-focus-ring');
  });

  it('contains channel and bridge tokens', () => {
    expect(THEME_TOKEN_NAMES).toContain('--shadow-color');
    expect(THEME_TOKEN_NAMES).toContain('--neu-shadow');
  });

  it('contains component tokens', () => {
    expect(THEME_TOKEN_NAMES).toContain('--input-bg');
    expect(THEME_TOKEN_NAMES).toContain('--card-bg');
    expect(THEME_TOKEN_NAMES).toContain('--code-bg');
  });

  it('contains icon tokens', () => {
    expect(THEME_TOKEN_NAMES).toContain('--icon-select-chevron');
  });

  it('does not contain removed mask-image icon tokens', () => {
    expect(THEME_TOKEN_NAMES).not.toContain('--icon-checkbox-check');
    expect(THEME_TOKEN_NAMES).not.toContain('--icon-radio-dot');
  });
});

describe('deriveThemeTokens', () => {
  it('is a pure function returning a Record<string, string>', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(typeof result).toBe('object');
    for (const [k, v] of Object.entries(result)) {
      expect(typeof k).toBe('string');
      expect(typeof v).toBe('string');
    }
  });

  it('maps seed surfaceBg to --surface-bg', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--surface-bg']).toBe('#08091a');
  });

  it('maps seed textPrimary to --text-primary', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--text-primary']).toBe('#f5f0e6');
  });

  it('maps seed accentPrimary to --accent-primary', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--accent-primary']).toBe('#d4a843');
  });

  it('derives surface scale with color-mix expressions', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--surface-1']).toContain('color-mix');
    expect(result['--surface-2']).toContain('color-mix');
    expect(result['--surface-3']).toContain('color-mix');
    expect(result['--surface-4']).toContain('color-mix');
  });

  it('derives text hierarchy fading toward surfaceBg', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--text-secondary']).toContain('color-mix');
    expect(result['--text-secondary']).toContain('#08091a');
  });

  it('sets --text-inverse to surfaceBg', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--text-inverse']).toBe('#08091a');
  });

  it('derives accent hover/active variants', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--accent-primary-hover']).toContain('color-mix');
    expect(result['--accent-primary-active']).toContain('color-mix');
  });

  it('dark scheme hover lightens (mixes with white)', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--accent-primary-hover']).toContain('white');
  });

  it('light scheme hover darkens (mixes with black)', () => {
    const result = deriveThemeTokens(LIGHT_SEED);
    expect(result['--accent-primary-hover']).toContain('black');
  });

  it('defaults accentDecorative to accentPrimary', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--accent-decorative']).toBe('#d4a843');
  });

  it('uses provided accentDecorative when given', () => {
    const result = deriveThemeTokens({ ...DARK_SEED, accentDecorative: '#ff00ff' });
    expect(result['--accent-decorative']).toBe('#ff00ff');
  });

  it('defaults colorScheme to dark', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--shadow-color']).toBe('0 0 0');
    expect(result['--neu-shadow']).toContain('65%');
  });

  it('light colorScheme produces light-appropriate tokens', () => {
    const result = deriveThemeTokens(LIGHT_SEED);
    expect(result['--shadow-color']).toBe('140 150 170');
    expect(result['--neu-shadow']).toContain('35%');
    expect(result['--neu-light']).toContain('88%');
  });

  it('dark scheme uses dark semantic colors', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--color-success']).toBe('#10b981');
    expect(result['--color-error']).toBe('#ef4444');
  });

  it('light scheme uses light semantic colors', () => {
    const result = deriveThemeTokens(LIGHT_SEED);
    expect(result['--color-success']).toBe('#0d6b4e');
    expect(result['--color-error']).toBe('#991b1b');
  });

  it('does not include icon tokens (--icon-*)', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--icon-select-chevron']).toBeUndefined();
  });

  it('produces bridge tokens as var() references', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--surface-deep']).toBe('var(--surface-2)');
    expect(result['--input-border-focus']).toBe('var(--accent-primary)');
  });

  it('uses provided colorSuccess seed', () => {
    const result = deriveThemeTokens({ ...DARK_SEED, colorSuccess: '#00cc66' });
    expect(result['--color-success']).toBe('#00cc66');
    expect(result['--color-success-subtle']).toContain('#00cc66');
    expect(result['--color-success-text']).toContain('#00cc66');
  });

  it('uses provided colorError seed', () => {
    const result = deriveThemeTokens({ ...DARK_SEED, colorError: '#ff2222' });
    expect(result['--color-error']).toBe('#ff2222');
    expect(result['--color-error-subtle']).toContain('#ff2222');
    expect(result['--color-error-text']).toContain('#ff2222');
  });

  it('uses provided colorWarning seed', () => {
    const result = deriveThemeTokens({ ...DARK_SEED, colorWarning: '#ffaa00' });
    expect(result['--color-warning']).toBe('#ffaa00');
  });

  it('uses provided colorInfo seed', () => {
    const result = deriveThemeTokens({ ...DARK_SEED, colorInfo: '#0066ff' });
    expect(result['--color-info']).toBe('#0066ff');
  });

  it('falls back to defaults when semantic color seeds are omitted', () => {
    const result = deriveThemeTokens(DARK_SEED);
    expect(result['--color-success']).toBe('#10b981');
    expect(result['--color-error']).toBe('#ef4444');
    expect(result['--color-warning']).toBe('#fcd34d');
    expect(result['--color-info']).toBe('#3b82f6');
  });

  it('produces all expected non-icon tokens', () => {
    const result = deriveThemeTokens(DARK_SEED);
    const iconTokens = ['--icon-select-chevron'];
    const expectedTokens = THEME_TOKEN_NAMES.filter((t) => !iconTokens.includes(t));
    for (const token of expectedTokens) {
      expect(result[token], `Missing token: ${token}`).toBeDefined();
    }
  });
});

describe('registerTheme', () => {
  beforeEach(() => {
    _resetStylesheet();
    _resetIntrospectionCache();
  });

  it('injects a CSS rule with theme selector', () => {
    registerTheme('brand', { seed: DARK_SEED });
    const rules = getAllRuleTexts();
    const themeRule = rules.find((r) => r.includes("[data-theme='brand']"));
    expect(themeRule).toBeDefined();
    expect(themeRule).toContain('.theme-brand');
  });

  it('includes color-scheme in injected rule', () => {
    registerTheme('brand', { seed: DARK_SEED });
    const rules = getAllRuleTexts();
    const themeRule = rules.find((r) => r.includes("[data-theme='brand']"));
    expect(themeRule).toContain('color-scheme: dark');
  });

  it('light seed sets color-scheme: light', () => {
    registerTheme('clean', { seed: LIGHT_SEED });
    const rules = getAllRuleTexts();
    const themeRule = rules.find((r) => r.includes("[data-theme='clean']"));
    expect(themeRule).toContain('color-scheme: light');
  });

  it('includes derived tokens in injected rule', () => {
    registerTheme('brand', { seed: DARK_SEED });
    const rules = getAllRuleTexts();
    const themeRule = rules.find((r) => r.includes("[data-theme='brand']"));
    expect(themeRule).toContain('--surface-bg');
    expect(themeRule).toContain('--accent-primary');
  });

  it('tokens override map takes precedence', () => {
    registerTheme('brand', {
      seed: DARK_SEED,
      tokens: { '--color-success': '#00ff00' },
    });
    const rules = getAllRuleTexts();
    const themeRule = rules.find((r) => r.includes("[data-theme='brand']"));
    expect(themeRule).toContain('#00ff00');
  });

  it('returns TierRegistration with correct name and tier', () => {
    const reg = registerTheme('brand', { seed: DARK_SEED });
    expect(reg.name).toBe('brand');
    expect(reg.tier).toBe('theme');
  });

  it('unregister() removes injected rules', () => {
    const reg = registerTheme('brand', { seed: DARK_SEED });
    expect(getAllRuleTexts().length).toBeGreaterThan(0);

    reg.unregister();
    expect(getAllRuleTexts().length).toBe(0);
  });
});

describe('registerRelief', () => {
  beforeEach(() => {
    _resetStylesheet();
    _resetIntrospectionCache();
  });

  it('injects rule with data-relief and utility class selectors', () => {
    registerRelief('paper', {
      tokens: {
        '--relief-bg': 'var(--surface-1)',
        '--relief-shadow-sm': '1px 1px 0 rgba(0,0,0,0.03)',
        '--relief-shadow': '2px 2px 0 rgba(0,0,0,0.05)',
        '--relief-shadow-lg': '4px 4px 0 rgba(0,0,0,0.07)',
        '--relief-shadow-inset-sm': 'none',
        '--relief-shadow-inset': 'none',
        '--relief-shadow-inset-lg': 'none',
        '--relief-border': '1px solid var(--border-default)',
      },
    });
    const rules = getAllRuleTexts();
    expect(rules.length).toBe(1);
    expect(rules[0]).toContain("[data-relief='paper']");
    expect(rules[0]).toContain('.relief-paper');
  });

  it('includes all 8 relief tokens', () => {
    registerRelief('paper', {
      tokens: {
        '--relief-bg': 'var(--surface-1)',
        '--relief-shadow-sm': 'a',
        '--relief-shadow': 'b',
        '--relief-shadow-lg': 'c',
        '--relief-shadow-inset-sm': 'd',
        '--relief-shadow-inset': 'e',
        '--relief-shadow-inset-lg': 'f',
        '--relief-border': 'g',
      },
    });
    const rules = getAllRuleTexts();
    expect(rules[0]).toContain('--relief-bg');
    expect(rules[0]).toContain('--relief-shadow-sm');
    expect(rules[0]).toContain('--relief-border');
  });

  it('returns TierRegistration', () => {
    const reg = registerRelief('paper', {
      tokens: {
        '--relief-bg': 'a',
        '--relief-shadow-sm': 'b',
        '--relief-shadow': 'c',
        '--relief-shadow-lg': 'd',
        '--relief-shadow-inset-sm': 'e',
        '--relief-shadow-inset': 'f',
        '--relief-shadow-inset-lg': 'g',
        '--relief-border': 'h',
      },
    });
    expect(reg.name).toBe('paper');
    expect(reg.tier).toBe('relief');
  });

  it('unregister() removes rules', () => {
    const reg = registerRelief('paper', {
      tokens: {
        '--relief-bg': 'a',
        '--relief-shadow-sm': 'b',
        '--relief-shadow': 'c',
        '--relief-shadow-lg': 'd',
        '--relief-shadow-inset-sm': 'e',
        '--relief-shadow-inset': 'f',
        '--relief-shadow-inset-lg': 'g',
        '--relief-border': 'h',
      },
    });
    reg.unregister();
    expect(getAllRuleTexts().length).toBe(0);
  });
});

describe('registerFinish', () => {
  beforeEach(() => {
    _resetStylesheet();
    _resetIntrospectionCache();
  });

  it('injects rule with data-finish and utility class selectors', () => {
    registerFinish('satin', {
      tokens: {
        '--finish-blur': '0px',
        '--finish-saturation': '1',
        '--finish-opacity': '1',
        '--finish-overlay': 'none',
        '--finish-sheen': 'none',
      },
    });
    const rules = getAllRuleTexts();
    expect(rules.length).toBe(1);
    expect(rules[0]).toContain("[data-finish='satin']");
    expect(rules[0]).toContain('.finish-satin');
  });

  it('includes all 5 finish tokens', () => {
    registerFinish('satin', {
      tokens: {
        '--finish-blur': '2px',
        '--finish-saturation': '1.2',
        '--finish-opacity': '0.9',
        '--finish-overlay': 'linear-gradient(transparent, transparent)',
        '--finish-sheen': 'none',
      },
    });
    const rules = getAllRuleTexts();
    expect(rules[0]).toContain('--finish-blur');
    expect(rules[0]).toContain('--finish-saturation');
    expect(rules[0]).toContain('--finish-opacity');
    expect(rules[0]).toContain('--finish-overlay');
    expect(rules[0]).toContain('--finish-sheen');
  });

  it('unregister() removes rules', () => {
    const reg = registerFinish('satin', {
      tokens: {
        '--finish-blur': '0px',
        '--finish-saturation': '1',
        '--finish-opacity': '1',
        '--finish-overlay': 'none',
        '--finish-sheen': 'none',
      },
    });
    reg.unregister();
    expect(getAllRuleTexts().length).toBe(0);
  });
});

describe('registerOrnament', () => {
  beforeEach(() => {
    _resetStylesheet();
    _resetIntrospectionCache();
  });

  it('injects :where() and .ornament-* token blocks', () => {
    registerOrnament('art-deco', {
      tokens: { '--ornament-color': 'gold' },
    });
    const rules = getAllRuleTexts();
    expect(rules.some((r) => r.includes(":where([data-ornament='art-deco'])"))).toBe(true);
    expect(rules.some((r) => r.includes('.ornament-art-deco'))).toBe(true);
  });

  it('includes provided tokens in injected rules', () => {
    registerOrnament('art-deco', {
      tokens: {
        '--ornament-frame-border': '3px solid gold',
        '--ornament-corner-display': 'block',
      },
    });
    const rules = getAllRuleTexts();
    const tokenRule = rules.find((r) => r.includes(":where([data-ornament='art-deco'])"));
    expect(tokenRule).toContain('--ornament-frame-border');
    expect(tokenRule).toContain('--ornament-corner-display');
  });

  it('unregister() removes all rules', () => {
    const reg = registerOrnament('art-deco', {
      tokens: { '--ornament-color': 'gold' },
    });
    reg.unregister();
    expect(getAllRuleTexts().length).toBe(0);
  });

  it('returns TierRegistration with tier ornament', () => {
    const reg = registerOrnament('art-deco', {
      tokens: { '--ornament-color': 'gold' },
    });
    expect(reg.name).toBe('art-deco');
    expect(reg.tier).toBe('ornament');
  });
});

describe('ornament introspection', () => {
  let mockStyle: HTMLStyleElement;

  beforeEach(() => {
    _resetStylesheet();
    _resetIntrospectionCache();

    // Insert mock compiled CSS to simulate SCSS output
    mockStyle = document.createElement('style');
    mockStyle.textContent = `
      :where([data-ornament]:not([data-ornament='none'])) .btn-ornament { background: var(--btn-ornament-bg); }
      :where([data-ornament]:not([data-ornament='none'])) .btn-ornament:hover { background: var(--btn-ornament-hover-bg); }
      :where([data-ornament]:not([data-ornament='none'])) .btn-ornament:active { box-shadow: var(--btn-ornament-active-shadow); }
      :where([data-ornament]:not([data-ornament='none'])) .modal-ornament { border: var(--modal-ornament-border); }
      :where([data-ornament]:not([data-ornament='none'])) .checkbox-ornament { border: var(--checkbox-ornament-border); }
      :where([data-ornament]:not([data-ornament='none'])) .checkbox-ornament:checked { background: var(--checkbox-ornament-checked-bg); }
      :where([data-ornament]:not([data-ornament='none'])) .radio-ornament { border: var(--radio-ornament-border); }
      :where([data-ornament]:not([data-ornament='none'])) .radio-ornament:checked { background: var(--radio-ornament-checked-bg); }
    `;
    document.head.appendChild(mockStyle);
  });

  it('generates consume selectors from introspected templates', () => {
    registerOrnament('art-deco', {
      tokens: { '--ornament-color': 'gold' },
    });
    const rules = getAllRuleTexts();
    // Should have 2 token blocks + 8 consume selector rules
    expect(rules.length).toBe(10);
  });

  it('consume selectors include both parent and direct patterns', () => {
    registerOrnament('art-deco', {
      tokens: { '--ornament-color': 'gold' },
    });
    const rules = getAllRuleTexts();
    // Check that btn-ornament consume selectors include both patterns
    const btnRule = rules.find(
      (r) =>
        r.includes('.ornament-art-deco .btn-ornament') &&
        !r.includes(':hover') &&
        !r.includes(':active')
    );
    expect(btnRule).toBeDefined();
    expect(btnRule).toContain('.btn-ornament.ornament-art-deco');
  });

  it('consume selectors preserve pseudo-states', () => {
    registerOrnament('art-deco', {
      tokens: { '--ornament-color': 'gold' },
    });
    const rules = getAllRuleTexts();
    const hoverRule = rules.find((r) => r.includes('.btn-ornament.ornament-art-deco:hover'));
    expect(hoverRule).toBeDefined();
  });

  it('caches introspection results', () => {
    registerOrnament('first', { tokens: { '--ornament-color': 'gold' } });
    const firstRuleCount = getAllRuleTexts().length;

    // Add more mock styles after first introspection
    const extraStyle = document.createElement('style');
    extraStyle.textContent = `
      :where([data-ornament]:not([data-ornament='none'])) .extra-ornament { color: red; }
    `;
    document.head.appendChild(extraStyle);

    registerOrnament('second', { tokens: { '--ornament-color': 'silver' } });
    const secondRuleCount = getAllRuleTexts().length;

    // Both registrations should produce the same number of consume selectors
    // (8 each) because the cache doesn't include the newly added .extra-ornament
    const firstConsumeCount = firstRuleCount - 2; // subtract 2 token blocks
    const secondConsumeCount = secondRuleCount - firstRuleCount - 2;
    expect(firstConsumeCount).toBe(secondConsumeCount);

    extraStyle.remove();
  });
});
