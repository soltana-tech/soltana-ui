import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { parseComponent, parseHeaderComment } from './extract-components.js';

const BUTTON_SCSS = readFileSync(
  resolve(__dirname, '../../soltana-ui/src/styles/components/_buttons.scss'),
  'utf-8'
);

const CARD_SCSS = readFileSync(
  resolve(__dirname, '../../soltana-ui/src/styles/components/_cards.scss'),
  'utf-8'
);

const PLAIN_SCSS = readFileSync(
  resolve(__dirname, '../../soltana-ui/src/styles/components/_indicators.scss'),
  'utf-8'
);

const CAROUSEL_SCSS = readFileSync(
  resolve(__dirname, '../../soltana-ui/src/styles/components/_carousel.scss'),
  'utf-8'
);

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
    const result = parseHeaderComment(PLAIN_SCSS);
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

  describe('indicators module (with header)', () => {
    const result = parseComponent('indicators', PLAIN_SCSS);

    it('detects tier awareness from real source', () => {
      expect(result.tierAware).toBe(true);
    });

    it('uses header comment for name', () => {
      expect(result.name).toBe('Indicator Components');
    });
  });
});
