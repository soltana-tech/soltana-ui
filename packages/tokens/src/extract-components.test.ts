import { describe, it, expect } from 'vitest';
import { parseComponent } from './extract-components.js';

const BUTTON_SCSS = `
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

describe('parseComponent', () => {
  describe('buttons module', () => {
    const result = parseComponent('buttons', BUTTON_SCSS);

    it('identifies base class', () => {
      expect(result.baseClass).toBe('.btn');
    });

    it('detects tier awareness', () => {
      expect(result.tierAware).toBe(true);
    });

    it('extracts variants', () => {
      expect(result.variants).toContain('.btn-primary');
      expect(result.variants).toContain('.btn-ghost');
      expect(result.variants).toContain('.btn-icon');
    });

    it('extracts sizes', () => {
      expect(result.sizes).toContain('.btn-sm');
      expect(result.sizes).toContain('.btn-lg');
    });

    it('sets module name', () => {
      expect(result.name).toBe('Buttons');
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

  describe('non-tier-aware module', () => {
    const result = parseComponent('indicators', PLAIN_SCSS);

    it('detects lack of tier awareness', () => {
      expect(result.tierAware).toBe(false);
    });
  });
});
