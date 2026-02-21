import { describe, it, expect } from 'vitest';
import { buildDtcgTheme, buildDtcgFoundation } from './dtcg.js';
import { darkTheme, foundationComprehensive as foundation } from '../__fixtures__/tokens.js';

describe('buildDtcgTheme', () => {
  const result = buildDtcgTheme(darkTheme);

  // Smoke tests: verify structural output
  it('groups surface tokens with $type: color', () => {
    const surface = result.surface as Record<string, Record<string, unknown>>;
    expect(surface.bg.$type).toBe('color');
    expect(surface.bg.$value).toBe('#08091a');
    expect(surface['1'].$value).toBe('#0e1028');
  });

  it('groups text tokens', () => {
    const text = result.text as Record<string, Record<string, unknown>>;
    expect(text.primary.$value).toBe('#f5f0e6');
    expect(text.muted.$value).toBe('#897d69');
  });

  it('groups border tokens', () => {
    const border = result.border as Record<string, Record<string, unknown>>;
    expect(border.default.$type).toBe('color');
    expect(border.default.$value).toBe('rgb(255 255 255 / 6%)');
  });

  it('groups accent tokens', () => {
    const accent = result.accent as Record<string, Record<string, unknown>>;
    expect(accent.primary.$value).toBe('#d4a843');
    expect(accent.secondary.$value).toBe('#a855f7');
  });

  it('groups semantic tokens', () => {
    const semantic = result.semantic as Record<string, Record<string, unknown>>;
    expect(semantic.success.$value).toBe('#10b981');
    expect(semantic.error.$value).toBe('#ef4444');
  });

  it('includes colorScheme as string type', () => {
    const cs = result.colorScheme as Record<string, unknown>;
    expect(cs.$type).toBe('string');
    expect(cs.$value).toBe('dark');
  });

  // Edge case and invariant tests
  it('all color tokens have $type: "color"', () => {
    const colorGroups = ['surface', 'text', 'border', 'accent', 'semantic', 'tooltip'];
    colorGroups.forEach((groupKey) => {
      const group = result[groupKey] as Record<string, Record<string, unknown>> | undefined;
      if (group) {
        Object.values(group).forEach((token) => {
          if ('$type' in token) {
            expect(token.$type).toBe('color');
          }
        });
      }
    });
  });

  it('handles minimal theme input', () => {
    const minimalTheme = {
      colorScheme: 'dark' as const,
      surfaceBg: '#000',
      surface1: '#111',
      surface2: '#222',
      surface3: '#333',
      surface4: '#444',
      textPrimary: '#fff',
      textSecondary: '#ddd',
      textTertiary: '#bbb',
      textMuted: '#999',
      textInverse: '#000',
      borderDefault: '#333',
      borderSubtle: '#222',
      borderStrong: '#444',
      accentPrimary: '#0f0',
      accentSecondary: '#00f',
      colorSuccess: '#0f0',
      colorWarning: '#ff0',
      colorError: '#f00',
      colorInfo: '#00f',
      tooltipBg: '#000',
      tooltipText: '#fff',
    };
    const minResult = buildDtcgTheme(minimalTheme);
    expect(minResult).toHaveProperty('surface');
    expect(minResult).toHaveProperty('text');
    const surface = minResult.surface as Record<string, Record<string, unknown>>;
    expect(surface.bg.$value).toBe('#000');
  });

  it('color values are strings or valid CSS color expressions', () => {
    const colorGroups = ['surface', 'text', 'border', 'accent', 'semantic', 'tooltip'];
    colorGroups.forEach((groupKey) => {
      const group = result[groupKey] as Record<string, Record<string, unknown>> | undefined;
      if (group) {
        Object.values(group).forEach((token) => {
          if ('$value' in token) {
            expect(typeof token.$value).toBe('string');
            expect((token.$value as string).length).toBeGreaterThan(0);
          }
        });
      }
    });
  });
});

describe('buildDtcgFoundation', () => {
  const result = buildDtcgFoundation(foundation);

  // Smoke tests: verify structural output
  it('maps radius to dimension type', () => {
    const radius = result.radius as Record<string, Record<string, unknown>>;
    expect(radius.sm.$type).toBe('dimension');
    expect(radius.sm.$value).toBe('.25rem');
  });

  it('maps shadow to shadow type', () => {
    const shadow = result.shadow as Record<string, Record<string, unknown>>;
    expect(shadow.sm.$type).toBe('shadow');
    expect(shadow.none.$type).toBe('shadow');
  });

  it('maps transition to duration type', () => {
    const transition = result.transition as Record<string, Record<string, unknown>>;
    expect(transition.fast.$type).toBe('duration');
    expect(transition.fast.$value).toBe('75ms');
  });

  it('maps easing to cubicBezier type', () => {
    const easing = result.easing as Record<string, Record<string, unknown>>;
    expect(easing.in.$type).toBe('cubicBezier');
    expect(easing.in.$value).toEqual([0.4, 0, 1, 1]);
  });

  it('maps z-index to number type', () => {
    const z = result.z as Record<string, Record<string, unknown>>;
    expect(z['10'].$type).toBe('number');
    expect(z['10'].$value).toBe(10);
    expect(z.modal.$value).toBe(200);
  });

  it('maps font family to fontFamily type with array value', () => {
    const ff = result.fontFamily as Record<string, Record<string, unknown>>;
    expect(ff.sans.$type).toBe('fontFamily');
    expect(ff.sans.$value).toEqual(['Raleway', 'ui-sans-serif', 'sans-serif']);
  });

  it('maps font weight to fontWeight type', () => {
    const fw = result.fontWeight as Record<string, Record<string, unknown>>;
    expect(fw.regular.$type).toBe('fontWeight');
    expect(fw.regular.$value).toBe(400);
  });

  it('maps font size with paired line height', () => {
    const fs = result.fontSize as Record<string, Record<string, Record<string, unknown>>>;
    expect(fs.base.size.$type).toBe('dimension');
    expect(fs.base.size.$value).toBe('1rem');
    expect(fs.base.lineHeight.$value).toBe('1.65');
  });

  it('maps letter spacing to dimension type', () => {
    const ls = result.letterSpacing as Record<string, Record<string, unknown>>;
    expect(ls.refined.$type).toBe('dimension');
    expect(ls.refined.$value).toBe('.02em');
  });

  // Edge case and invariant tests
  it('handles empty token sets without crashing', () => {
    const emptyFoundation = {
      radius: {},
      shadow: {},
      transition: {},
      easing: {},
      z: {},
      fontFamily: {},
      fontSize: {},
      fontWeight: {},
      letterSpacing: {},
    };
    const emptyResult = buildDtcgFoundation(emptyFoundation);
    expect(emptyResult).toHaveProperty('radius');
    expect(emptyResult).toHaveProperty('shadow');
    expect(Object.keys(emptyResult.radius as object)).toHaveLength(0);
  });

  it('dimension token values end with valid CSS units', () => {
    const validUnits = ['px', 'rem', 'em', '%', 'vw', 'vh', 'ch', 'ex'];
    const dimensionGroups = ['radius', 'letterSpacing'];
    dimensionGroups.forEach((groupKey) => {
      const group = result[groupKey] as Record<string, Record<string, unknown>> | undefined;
      if (group && Object.keys(group).length > 0) {
        Object.values(group).forEach((token) => {
          if ('$value' in token) {
            const value = token.$value as string;
            const hasValidUnit = validUnits.some((unit) => value.endsWith(unit));
            expect(hasValidUnit || /^\d+$/.test(value)).toBe(true);
          }
        });
      }
    });
  });

  it('duration values are strings with time units', () => {
    const transition = result.transition as Record<string, Record<string, unknown>> | undefined;
    if (transition && Object.keys(transition).length > 0) {
      Object.values(transition).forEach((token) => {
        if ('$value' in token) {
          const value = token.$value as string;
          expect(/\d+(ms|s)/.exec(value)).toBeTruthy();
        }
      });
    }
  });

  it('z-index values are numbers', () => {
    const z = result.z as Record<string, Record<string, unknown>> | undefined;
    if (z && Object.keys(z).length > 0) {
      Object.values(z).forEach((token) => {
        if ('$value' in token) {
          expect(typeof token.$value).toBe('number');
          expect(token.$value).toBeGreaterThanOrEqual(0);
        }
      });
    }
  });

  it('cubicBezier values are arrays of four numbers', () => {
    const easing = result.easing as Record<string, Record<string, unknown>> | undefined;
    if (easing && Object.keys(easing).length > 0) {
      Object.values(easing).forEach((token) => {
        if ('$value' in token) {
          expect(Array.isArray(token.$value)).toBe(true);
          expect((token.$value as unknown[]).length).toBe(4);
          (token.$value as unknown[]).forEach((val) => {
            expect(typeof val).toBe('number');
          });
        }
      });
    }
  });

  it('font weight values are integers', () => {
    const fw = result.fontWeight as Record<string, Record<string, unknown>> | undefined;
    if (fw && Object.keys(fw).length > 0) {
      Object.values(fw).forEach((token) => {
        if ('$value' in token) {
          expect(typeof token.$value).toBe('number');
          expect(Number.isInteger(token.$value)).toBe(true);
          expect(token.$value).toBeGreaterThan(0);
        }
      });
    }
  });

  it('font family values are non-empty arrays of strings', () => {
    const ff = result.fontFamily as Record<string, Record<string, unknown>> | undefined;
    if (ff && Object.keys(ff).length > 0) {
      Object.values(ff).forEach((token) => {
        if ('$value' in token) {
          expect(Array.isArray(token.$value)).toBe(true);
          expect((token.$value as unknown[]).length).toBeGreaterThan(0);
          (token.$value as unknown[]).forEach((val) => {
            expect(typeof val).toBe('string');
            expect((val as string).length).toBeGreaterThan(0);
          });
        }
      });
    }
  });
});
