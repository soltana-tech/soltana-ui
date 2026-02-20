import { describe, it, expect } from 'vitest';
import { parseComponent, parseHeaderComment } from './extract-components.js';

const BUTTON_SCSS = `
// ---------------------------------------------------------------------------
// Button Components
// ---------------------------------------------------------------------------
// Base button uses --relief-* variables for automatic relief switching.
// Semantic variants (primary, danger, success) override as needed.
// ---------------------------------------------------------------------------

@use '../mixins' as *;

.btn {
  display: inline-flex;
  @include relief-container;
  @include finish-surface;
}

.btn-primary { background-color: var(--accent-primary); }
.btn-secondary { background-color: var(--accent-secondary); }
.btn-ghost { background: transparent; }
.btn-outline { border: 1px solid var(--border-default); }
.btn-danger { background-color: var(--color-error); }
.btn-success { background-color: var(--color-success); }
.btn-sm { padding: 0.25rem 0.5rem; font-size: var(--text-sm); }
.btn-lg { padding: 0.75rem 1.5rem; font-size: var(--text-lg); }
.btn-icon { padding: 0.5rem; }
.btn-group { display: inline-flex; }
`;

const CARD_SCSS = `
// ---------------------------------------------------------------------------
// Card Components
// ---------------------------------------------------------------------------
// Content containers with header/body/footer sections.
// Uses --relief-* and --finish-* variables for tier integration.
// ---------------------------------------------------------------------------

@use '../mixins' as *;

.card {
  @include relief-container;
  @include finish-surface;
}

.card-header { padding: 1rem; }
.card-body { padding: 1rem; }
.card-footer { padding: 1rem; }
.card-flat { box-shadow: none; }
.card-hover { &:hover { transform: translateY(-2px); } }
.card-beveled { border: 2px solid var(--border-default); }
`;

const PLAIN_SCSS = `
.indicator {
  display: flex;
}

.indicator-step { margin-right: 1rem; }
.indicator-label { font-size: var(--text-sm); }
`;

const CAROUSEL_SCSS = `
// ---------------------------------------------------------------------------
// Carousel Component
// ---------------------------------------------------------------------------
// Horizontal slide container with navigation buttons and indicator dots.
// Uses --relief-* and --finish-* variables for tier integration.
// ---------------------------------------------------------------------------

@use '../base/register' as *;

.carousel {
  position: relative;
  overflow: hidden;
  @include relief-container;
}

.carousel-track { display: flex; }
.carousel-slide { flex: 0 0 100%; }
.carousel-dots { display: flex; }
.carousel-dot { width: 8px; }
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

  it('returns null for SCSS without header comment', () => {
    const result = parseHeaderComment(PLAIN_SCSS);
    expect(result).toBeNull();
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

    it('extracts sizes', () => {
      expect(result.sizes).toContain('.btn-sm');
      expect(result.sizes).toContain('.btn-lg');
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

  describe('carousel module (new component without override)', () => {
    const result = parseComponent('carousel', CAROUSEL_SCSS);

    it('detects base class from filename heuristic', () => {
      expect(result.baseClass).toBe('.carousel');
    });

    it('gets name from header comment', () => {
      expect(result.name).toBe('Carousel Component');
    });

    it('gets description from header comment', () => {
      expect(result.description).toContain('Horizontal slide container');
    });

    it('detects new child suffixes (track, slide, dots, dot)', () => {
      expect(result.children).toContain('.carousel-track');
      expect(result.children).toContain('.carousel-slide');
      expect(result.children).toContain('.carousel-dots');
      expect(result.children).toContain('.carousel-dot');
    });
  });

  describe('non-tier-aware module', () => {
    const result = parseComponent('indicators', PLAIN_SCSS);

    it('detects lack of tier awareness', () => {
      expect(result.tierAware).toBe(false);
    });

    it('falls back to title-cased module name when no header', () => {
      expect(result.name).toBe('Indicators');
    });
  });
});
