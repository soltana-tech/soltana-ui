import { describe, it, expect } from 'vitest';
import { extractUtilities } from './extract-utilities.js';

// Representative subset of compiled utility CSS — mirrors actual output from
// src/styles/utilities/. Using a fixture avoids a build dependency at test time.
const FIXTURE_CSS = `
/* Spacing */
.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-4 { padding: 1rem; }
.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.m-0 { margin: 0; }
.m-2 { margin: 0.5rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }

/* Layout */
.block { display: block; }
.flex { display: flex; }
.grid { display: grid; }
.hidden { display: none; }
.flex-row { flex-direction: row; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.col-span-1 { grid-column: span 1 / span 1; }
.relative { position: relative; }
.absolute { position: absolute; }

/* Sizing */
.w-full { width: 100%; }
.w-1\\/2 { width: 50%; }
.h-full { height: 100%; }
.max-w-md { max-width: 28rem; }
.w-4 { width: 1rem; }
.w-8 { width: 2rem; }

/* Visual */
.bg-surface { background-color: var(--surface-bg); }
.rounded { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }
.shadow-sm { box-shadow: var(--shadow-sm); }
.opacity-50 { opacity: 0.5; }
.transition { transition-property: all; }
.border { border-width: 1px; }

/* Typography */
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.font-bold { font-weight: 700; }
.tracking-refined { letter-spacing: 0.02em; }

/* Responsive */
.sm\\:flex { display: flex; }
.sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.md\\:flex-row { flex-direction: row; }
.lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
`;

describe('extractUtilities', () => {
  const groups = extractUtilities(FIXTURE_CSS);

  it('returns non-empty array', () => {
    expect(groups.length).toBeGreaterThan(0);
  });

  it('extracts spacing category', () => {
    const spacing = groups.find((g) => g.category === 'spacing');
    expect(spacing).toBeDefined();
    expect(spacing!.classes).toHaveProperty('padding');
    expect(spacing!.classes).toHaveProperty('margin');
    expect(spacing!.classes).toHaveProperty('gap');
  });

  it('extracts layout category', () => {
    const layout = groups.find((g) => g.category === 'layout');
    expect(layout).toBeDefined();
    expect(layout!.classes).toHaveProperty('display');
    expect(layout!.classes).toHaveProperty('flex');
    expect(layout!.classes).toHaveProperty('grid');
  });

  it('extracts sizing category', () => {
    const sizing = groups.find((g) => g.category === 'sizing');
    expect(sizing).toBeDefined();
  });

  it('extracts visual category', () => {
    const visual = groups.find((g) => g.category === 'visual');
    expect(visual).toBeDefined();
    expect(visual!.classes).toHaveProperty('backgrounds');
    expect(visual!.classes).toHaveProperty('border_radius');
  });

  it('extracts typography category', () => {
    const typo = groups.find((g) => g.category === 'typography');
    expect(typo).toBeDefined();
    expect(typo!.classes).toHaveProperty('sizes');
    expect(typo!.classes).toHaveProperty('weights');
  });

  it('detects responsive prefixes', () => {
    const layout = groups.find((g) => g.category === 'layout');
    expect(layout!.responsive).toBe(true);
  });

  it('marks non-responsive categories as false', () => {
    const visual = groups.find((g) => g.category === 'visual');
    expect(visual!.responsive).toBe(false);
  });

  it('includes description for each group', () => {
    for (const group of groups) {
      expect(typeof group.description).toBe('string');
      expect(group.description.length).toBeGreaterThan(0);
    }
  });
});
