import { describe, it, expect, beforeEach } from 'vitest';
import { insertRule, removeRules, teardown, _resetStylesheet } from './stylesheet';

describe('stylesheet', () => {
  beforeEach(() => {
    _resetStylesheet();
  });

  it('lazily creates a <style> element on first insertRule', () => {
    expect(document.getElementById('soltana-custom')).toBeNull();
    insertRule('body { color: red; }');
    expect(document.getElementById('soltana-custom')).not.toBeNull();
  });

  it('insertRule returns a CSSRule reference', () => {
    const rule = insertRule('.test { color: blue; }');
    expect(rule).toBeDefined();
    expect(rule.cssText).toContain('.test');
  });

  it('appends multiple rules in order', () => {
    const r1 = insertRule('.a { color: red; }');
    const r2 = insertRule('.b { color: green; }');
    const r3 = insertRule('.c { color: blue; }');

    expect(r1.cssText).toContain('.a');
    expect(r2.cssText).toContain('.b');
    expect(r3.cssText).toContain('.c');
  });

  it('removeRules deletes rules by reference', () => {
    const r1 = insertRule('.a { color: red; }');
    insertRule('.b { color: green; }');
    const r3 = insertRule('.c { color: blue; }');

    removeRules([r1, r3]);

    const el = document.getElementById('soltana-custom') as HTMLStyleElement;
    const sheet = el.sheet!;
    expect(sheet.cssRules.length).toBe(1);
    expect(sheet.cssRules[0].cssText).toContain('.b');
  });

  it('removeRules handles interleaved insertions and deletions', () => {
    const r1 = insertRule('.a { color: red; }');
    const r2 = insertRule('.b { color: green; }');
    removeRules([r1]);

    const r3 = insertRule('.c { color: blue; }');
    removeRules([r2]);

    const el = document.getElementById('soltana-custom') as HTMLStyleElement;
    const sheet = el.sheet!;
    expect(sheet.cssRules.length).toBe(1);
    expect(sheet.cssRules[0]).toBe(r3);
  });

  it('removeRules is a no-op when sheet does not exist', () => {
    // Should not throw
    removeRules([{} as CSSRule]);
  });

  it('teardown removes <style> element from document', () => {
    insertRule('.x { color: red; }');
    expect(document.getElementById('soltana-custom')).not.toBeNull();

    teardown();
    expect(document.getElementById('soltana-custom')).toBeNull();
  });

  it('teardown is idempotent', () => {
    insertRule('.x { color: red; }');
    teardown();
    teardown();
    expect(document.getElementById('soltana-custom')).toBeNull();
  });

  it('_resetStylesheet allows re-creation', () => {
    insertRule('.x { color: red; }');
    _resetStylesheet();

    const rule = insertRule('.y { color: green; }');
    expect(rule.cssText).toContain('.y');

    const el = document.getElementById('soltana-custom') as HTMLStyleElement;
    expect(el.sheet!.cssRules.length).toBe(1);
  });
});
