import { describe, it, expect } from 'vitest';
import { buildDtcgTheme, buildDtcgFoundation } from './dtcg.js';
import { darkTheme, foundationComprehensive as foundation } from '../__fixtures__/tokens.js';

describe('buildDtcgTheme', () => {
  const result = buildDtcgTheme(darkTheme);

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
});

describe('buildDtcgFoundation', () => {
  const result = buildDtcgFoundation(foundation);

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
});
