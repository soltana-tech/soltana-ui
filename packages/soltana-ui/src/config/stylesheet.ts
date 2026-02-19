// ---------------------------------------------------------------------------
// Managed CSSStyleSheet for Runtime Tier Registrations
// ---------------------------------------------------------------------------
// Lazily created on first insertRule() call — zero overhead when registration
// is unused. Prefers Constructable Stylesheets (adoptedStyleSheets) with a
// <style> element fallback for environments that lack support.
// ---------------------------------------------------------------------------

let sheet: CSSStyleSheet | null = null;
let styleElement: HTMLStyleElement | null = null;

function supportsConstructableStylesheets(): boolean {
  try {
    new CSSStyleSheet();
    return typeof document.adoptedStyleSheets !== 'undefined';
  } catch {
    return false;
  }
}

function ensureSheet(): CSSStyleSheet {
  if (sheet) return sheet;

  if (supportsConstructableStylesheets()) {
    sheet = new CSSStyleSheet();
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  } else {
    styleElement = document.createElement('style');
    styleElement.id = 'soltana-custom';
    document.head.appendChild(styleElement);
    if (!styleElement.sheet) {
      throw new Error('[soltana] Failed to create stylesheet — styleElement.sheet is null');
    }
    sheet = styleElement.sheet;
  }

  return sheet;
}

/**
 * Append a CSS rule and return the inserted CSSRule reference.
 * Using references (not indices) avoids stale-index problems when
 * earlier registrations are unregistered.
 */
export function insertRule(cssText: string): CSSRule {
  const s = ensureSheet();
  const index = s.insertRule(cssText, s.cssRules.length);
  return s.cssRules[index];
}

/**
 * Remove rules by reference. Finds current indices and deletes in
 * reverse order so earlier deletions don't shift later indices.
 */
export function removeRules(rules: CSSRule[]): void {
  if (!sheet) return;
  const indices: number[] = [];
  for (let i = 0; i < sheet.cssRules.length; i++) {
    if (rules.includes(sheet.cssRules[i])) {
      indices.push(i);
    }
  }
  // Delete in reverse to maintain stable indices
  for (let i = indices.length - 1; i >= 0; i--) {
    sheet.deleteRule(indices[i]);
  }
}

/** Remove the stylesheet from the document entirely. */
export function teardown(): void {
  if (sheet && styleElement) {
    styleElement.remove();
  } else if (sheet) {
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s) => s !== sheet);
  }
  sheet = null;
  styleElement = null;
}
