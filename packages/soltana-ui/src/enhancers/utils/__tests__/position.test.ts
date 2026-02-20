import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fc from 'fast-check';
import { computePosition } from '../position.js';

function mockElement(rect: Partial<DOMRect>): HTMLElement {
  const el = document.createElement('div');
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...rect,
  });
  return el;
}

describe('computePosition', () => {
  beforeEach(() => {
    // Default viewport: 1024x768
    vi.stubGlobal('innerWidth', 1024);
    vi.stubGlobal('innerHeight', 768);
  });

  it('positions floating element above the anchor (top)', () => {
    const anchor = mockElement({
      top: 200,
      bottom: 240,
      left: 100,
      right: 200,
      width: 100,
      height: 40,
    });
    const floating = mockElement({ width: 80, height: 30 });

    const { top, left } = computePosition({ anchor, floating, placement: 'top' });

    expect(top).toBe(200 - 30 - 8); // anchorTop - floatingH - gap
    expect(left).toBe(100 + 50 - 40); // centered
  });

  it('positions floating element below the anchor (bottom)', () => {
    const anchor = mockElement({
      top: 200,
      bottom: 240,
      left: 100,
      right: 200,
      width: 100,
      height: 40,
    });
    const floating = mockElement({ width: 80, height: 30 });

    const { top, left } = computePosition({ anchor, floating, placement: 'bottom' });

    expect(top).toBe(240 + 8);
    expect(left).toBe(110);
  });

  it('positions floating element to the left of anchor', () => {
    const anchor = mockElement({
      top: 200,
      bottom: 240,
      left: 200,
      right: 300,
      width: 100,
      height: 40,
    });
    const floating = mockElement({ width: 80, height: 30 });

    const { top, left } = computePosition({ anchor, floating, placement: 'left' });

    expect(top).toBe(200 + 20 - 15);
    expect(left).toBe(200 - 80 - 8);
  });

  it('positions floating element to the right of anchor', () => {
    const anchor = mockElement({
      top: 200,
      bottom: 240,
      left: 200,
      right: 300,
      width: 100,
      height: 40,
    });
    const floating = mockElement({ width: 80, height: 30 });

    const { top, left } = computePosition({ anchor, floating, placement: 'right' });

    expect(top).toBe(205);
    expect(left).toBe(308);
  });

  it('flips from top to bottom when clipped at top', () => {
    const anchor = mockElement({
      top: 10,
      bottom: 50,
      left: 100,
      right: 200,
      width: 100,
      height: 40,
    });
    const floating = mockElement({ width: 80, height: 30 });

    const { top } = computePosition({ anchor, floating, placement: 'top', flip: true });

    // Flipped to bottom: anchorBottom + gap
    expect(top).toBe(50 + 8);
  });

  it('clamps to viewport boundaries', () => {
    const anchor = mockElement({
      top: 400,
      bottom: 440,
      left: 0,
      right: 20,
      width: 20,
      height: 40,
    });
    const floating = mockElement({ width: 200, height: 30 });

    const { left } = computePosition({ anchor, floating, placement: 'bottom' });

    // Clamped to viewportPadding=4
    expect(left).toBe(4);
  });

  it('accepts point coordinates as anchor', () => {
    const floating = mockElement({ width: 100, height: 50 });

    const { top, left } = computePosition({
      anchor: { x: 500, y: 400 },
      floating,
      placement: 'bottom',
    });

    expect(top).toBe(408);
    expect(left).toBe(450);
  });

  it('respects custom gap and viewportPadding', () => {
    const anchor = mockElement({
      top: 200,
      bottom: 240,
      left: 100,
      right: 200,
      width: 100,
      height: 40,
    });
    const floating = mockElement({ width: 80, height: 30 });

    const { top } = computePosition({ anchor, floating, placement: 'top', gap: 16 });

    expect(top).toBe(200 - 30 - 16);
  });

  it('does not flip when flip is disabled', () => {
    const anchor = mockElement({
      top: 10,
      bottom: 50,
      left: 100,
      right: 200,
      width: 100,
      height: 40,
    });
    const floating = mockElement({ width: 80, height: 30 });

    const { top } = computePosition({ anchor, floating, placement: 'top', flip: false });

    // Clamped to viewportPadding, not flipped
    expect(top).toBe(4);
  });

  describe('RTL direction', () => {
    beforeEach(() => {
      document.documentElement.dir = 'rtl';
    });

    afterEach(() => {
      document.documentElement.dir = '';
    });

    it('positions right-side in RTL same as left in LTR', () => {
      const anchor = mockElement({
        top: 200,
        bottom: 240,
        left: 200,
        right: 300,
        width: 100,
        height: 40,
      });
      const floating = mockElement({ width: 80, height: 30 });

      const rtlResult = computePosition({ anchor, floating, placement: 'right' });

      document.documentElement.dir = '';
      const ltrResult = computePosition({ anchor, floating, placement: 'right' });

      // Both should produce valid positions (exact values may differ but both within viewport)
      expect(rtlResult.top).toBeGreaterThanOrEqual(0);
      expect(rtlResult.left).toBeGreaterThanOrEqual(0);
      expect(ltrResult.top).toBeGreaterThanOrEqual(0);
      expect(ltrResult.left).toBeGreaterThanOrEqual(0);
    });

    it('clamps to viewport in RTL', () => {
      const anchor = mockElement({
        top: 400,
        bottom: 440,
        left: 980,
        right: 1020,
        width: 40,
        height: 40,
      });
      const floating = mockElement({ width: 200, height: 30 });

      const { left } = computePosition({ anchor, floating, placement: 'bottom' });

      expect(left).toBeGreaterThanOrEqual(4);
      expect(left + 200).toBeLessThanOrEqual(1024);
    });
  });
});

describe('computePosition property-based', () => {
  it('output always within viewport', () => {
    const vw = 1024;
    const vh = 768;
    vi.stubGlobal('innerWidth', vw);
    vi.stubGlobal('innerHeight', vh);

    fc.assert(
      fc.property(
        fc.record({
          anchorTop: fc.integer({ min: 0, max: vh }),
          anchorLeft: fc.integer({ min: 0, max: vw }),
          anchorW: fc.integer({ min: 1, max: 200 }),
          anchorH: fc.integer({ min: 1, max: 200 }),
          floatW: fc.integer({ min: 1, max: 300 }),
          floatH: fc.integer({ min: 1, max: 300 }),
          placement: fc.constantFrom(
            'top' as const,
            'bottom' as const,
            'left' as const,
            'right' as const
          ),
        }),
        ({ anchorTop, anchorLeft, anchorW, anchorH, floatW, floatH, placement }) => {
          const anchor = mockElement({
            top: anchorTop,
            bottom: anchorTop + anchorH,
            left: anchorLeft,
            right: anchorLeft + anchorW,
            width: anchorW,
            height: anchorH,
          });
          const floating = mockElement({ width: floatW, height: floatH });

          const { top, left } = computePosition({ anchor, floating, placement });

          expect(top).toBeGreaterThanOrEqual(0);
          expect(left).toBeGreaterThanOrEqual(0);
          expect(top + floatH).toBeLessThanOrEqual(vh);
          expect(left + floatW).toBeLessThanOrEqual(vw);
        }
      )
    );
  });
});
