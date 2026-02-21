import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { parseComponent, parseHeaderComment } from './extract-components.js';

const BUTTON_SCSS = `
// ---------------------------------------------------------------------------
// Button Components
// ---------------------------------------------------------------------------
// Base button uses --relief-* variables for automatic relief switching.
// Semantic variants (primary, danger, success) override as needed.
// ---------------------------------------------------------------------------

@use '../variables' as *;
@use '../base/register' as *;

.btn {
  display: inline-flex;
  @include relief-container;
  @include finish-surface;
}
.btn-primary { color: var(--accent-primary); }
.btn-ghost { background: transparent; }
.btn-outline { border: 1px solid; }
.btn-sm { padding: 0.25rem 0.75rem; }
.btn-lg { padding: 0.75rem 1.5rem; }
.btn-group { display: flex; }
`;

const CARD_SCSS = `
// ---------------------------------------------------------------------------
// Card Components
// ---------------------------------------------------------------------------
// Base cards use --relief-* variables for automatic relief switching.
// ---------------------------------------------------------------------------

.card {
  position: relative;
  @include relief-container;
}
.card-flat { box-shadow: none; }
.card-hover { &:hover { transform: translateY(-3px); } }
.card-beveled { border: 3px solid var(--border-strong); }
.card-header { padding: 1rem; }
.card-body { padding: 1rem; }
.card-footer { padding: 1rem; }
`;

const INDICATOR_SCSS = `
// ---------------------------------------------------------------------------
// Indicator Components
// ---------------------------------------------------------------------------
// Steppers, timelines, keyboard keys, stats, description lists, empty
// states, and ratings.
// ---------------------------------------------------------------------------

@use '../base/register' as *;

.stepper { display: flex; }
.step { display: flex; flex-direction: column; }
.step-indicator { width: 2rem; height: 2rem; @include relief-container; }
`;

const CAROUSEL_SCSS = `
// ---------------------------------------------------------------------------
// Carousel Component
// ---------------------------------------------------------------------------
// Horizontal slide container with navigation buttons and indicator dots.
// Uses --relief-* and --finish-* variables for tier integration.
// ---------------------------------------------------------------------------

.carousel { position: relative; overflow: hidden; }
.carousel-track { display: flex; }
.carousel-slide { flex: 0 0 100%; }
.carousel-dots { display: flex; justify-content: center; }
.carousel-dot { width: 0.5rem; height: 0.5rem; border-radius: 50%; }
`;

describe('parseHeaderComment', () => {
  it('extracts name from standard header', () => {
    const result = parseHeaderComment(BUTTON_SCSS);
    expect(result).not.toBeNull();
    expect(result!.name).toBe('Button Components');
  });

  it('extracts description, filtering implementation lines', () => {
    const result = parseHeaderComment(BUTTON_SCSS);
    expect(result!.description).toContain('Base button');
    expect(result!.description).toContain('Semantic variants');
    expect(result!.description).not.toContain('Uses --relief-*');
  });

  it('extracts carousel header', () => {
    const result = parseHeaderComment(CAROUSEL_SCSS);
    expect(result!.name).toBe('Carousel Component');
    expect(result!.description).toContain('Horizontal slide container');
  });

  it('extracts indicators header', () => {
    const result = parseHeaderComment(INDICATOR_SCSS);
    expect(result).not.toBeNull();
    expect(result!.name).toBe('Indicator Components');
  });
});

describe('parseComponent', () => {
  describe('buttons module', () => {
    const result = parseComponent('buttons', BUTTON_SCSS);

    it('identifies base class via override', () => {
      expect(result.baseClass).toBe('.btn');
    });

    it('detects tier awareness', () => {
      expect(result.tierAware).toBe(true);
    });

    it('extracts variants', () => {
      expect(result.variants).toContain('.btn-primary');
      expect(result.variants).toContain('.btn-ghost');
      expect(result.variants).toContain('.btn-outline');
    });

    it('extracts group variant', () => {
      expect(result.variants).toContain('.btn-group');
    });

    it('uses header comment for name', () => {
      expect(result.name).toBe('Button Components');
    });

    it('uses header comment for description', () => {
      expect(result.description).toContain('Base button');
    });

    it('includes HTML example', () => {
      expect(result.example).toContain('btn');
      expect(result.example).toContain('btn-primary');
    });
  });

  describe('cards module', () => {
    const result = parseComponent('cards', CARD_SCSS);

    it('identifies base class', () => {
      expect(result.baseClass).toBe('.card');
    });

    it('extracts child elements', () => {
      expect(result.children).toContain('.card-header');
      expect(result.children).toContain('.card-body');
      expect(result.children).toContain('.card-footer');
    });

    it('extracts variants (non-child, non-size)', () => {
      expect(result.variants).toContain('.card-flat');
      expect(result.variants).toContain('.card-hover');
      expect(result.variants).toContain('.card-beveled');
    });
  });

  describe('carousels module', () => {
    const result = parseComponent('carousels', CAROUSEL_SCSS);

    it('detects base class from first selector heuristic', () => {
      expect(result.baseClass).toBe('.carousel');
    });

    it('gets name from header comment', () => {
      expect(result.name).toBe('Carousel Component');
    });

    it('gets description from header comment', () => {
      expect(result.description).toContain('Horizontal slide container');
    });

    it('detects child suffixes (track, slide, dots, dot)', () => {
      expect(result.children).toContain('.carousel-track');
      expect(result.children).toContain('.carousel-slide');
      expect(result.children).toContain('.carousel-dots');
      expect(result.children).toContain('.carousel-dot');
    });
  });

  describe('indicators module (with header)', () => {
    const result = parseComponent('indicators', INDICATOR_SCSS);

    it('detects tier awareness', () => {
      expect(result.tierAware).toBe(true);
    });

    it('uses header comment for name', () => {
      expect(result.name).toBe('Indicator Components');
    });
  });
});

describe('source file smoke tests', () => {
  const componentsDir = resolve(__dirname, '../../soltana-ui/src/styles/components');

  it.each(['_buttons.scss', '_cards.scss', '_indicators.scss', '_carousels.scss'])(
    '%s exists on disk',
    (filename) => {
      expect(existsSync(resolve(componentsDir, filename))).toBe(true);
    }
  );
});
