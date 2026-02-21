// Unit tests for dropdown enhancer focus on ARIA correctness, event handling,
// and keyboard navigation.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initDropdowns } from './dropdown.js';

function createDropdown(id: string): HTMLElement {
  const dropdown = document.createElement('div');
  dropdown.id = id;
  dropdown.setAttribute('data-sol-dropdown', '');
  dropdown.className = 'dropdown';

  const toggle = document.createElement('button');
  toggle.className = 'dropdown-toggle';
  toggle.textContent = 'Options';

  const menu = document.createElement('div');
  menu.className = 'dropdown-menu';
  menu.setAttribute('role', 'menu');

  const item1 = document.createElement('button');
  item1.className = 'dropdown-item';
  item1.setAttribute('role', 'menuitem');
  item1.textContent = 'Edit';

  const item2 = document.createElement('button');
  item2.className = 'dropdown-item';
  item2.setAttribute('role', 'menuitem');
  item2.textContent = 'Delete';

  menu.appendChild(item1);
  menu.appendChild(item2);
  dropdown.appendChild(toggle);
  dropdown.appendChild(menu);
  document.body.appendChild(dropdown);

  return dropdown;
}

describe('initDropdowns', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initDropdowns();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('handles multiple init calls without duplicating listeners', () => {
    const dropdown = createDropdown('test-dropdown');

    initDropdowns();
    const cleanup = initDropdowns();

    const toggle = dropdown.querySelector<HTMLElement>('.dropdown-toggle')!;
    const menu = dropdown.querySelector<HTMLElement>('.dropdown-menu')!;

    toggle.click();

    expect(menu.classList.contains('active')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    cleanup.destroy();
  });

  it('sets ARIA attributes on toggle and menu items', () => {
    const dropdown = createDropdown('test-dropdown');
    const cleanup = initDropdowns();

    const toggle = dropdown.querySelector('.dropdown-toggle')!;
    const menu = dropdown.querySelector('.dropdown-menu')!;
    const items = dropdown.querySelectorAll('.dropdown-item');

    expect(toggle.getAttribute('aria-haspopup')).toBe('menu');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(menu.getAttribute('role')).toBe('menu');

    items.forEach((item) => {
      expect(item.getAttribute('role')).toBe('menuitem');
      expect(item.getAttribute('tabindex')).toBe('-1');
    });

    cleanup.destroy();
  });

  it('toggles menu on click', () => {
    const dropdown = createDropdown('test-dropdown');
    const cleanup = initDropdowns();

    const toggle = dropdown.querySelector<HTMLElement>('.dropdown-toggle')!;
    const menu = dropdown.querySelector<HTMLElement>('.dropdown-menu')!;

    expect(menu.classList.contains('active')).toBe(false);

    toggle.click();
    expect(menu.classList.contains('active')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    toggle.click();
    expect(menu.classList.contains('active')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    cleanup.destroy();
  });

  it('closes menu on Escape key', () => {
    const dropdown = createDropdown('test-dropdown');
    const cleanup = initDropdowns();

    const toggle = dropdown.querySelector<HTMLElement>('.dropdown-toggle')!;
    const menu = dropdown.querySelector<HTMLElement>('.dropdown-menu')!;

    toggle.click();
    expect(menu.classList.contains('active')).toBe(true);

    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(menu.classList.contains('active')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    cleanup.destroy();
  });

  it('opens menu on ArrowDown key from toggle', () => {
    const dropdown = createDropdown('test-dropdown');
    const cleanup = initDropdowns();

    const toggle = dropdown.querySelector<HTMLElement>('.dropdown-toggle')!;
    const menu = dropdown.querySelector<HTMLElement>('.dropdown-menu')!;

    toggle.focus();
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

    expect(menu.classList.contains('active')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    cleanup.destroy();
  });

  it('opens menu on Enter key from toggle', () => {
    const dropdown = createDropdown('test-dropdown');
    const cleanup = initDropdowns();

    const toggle = dropdown.querySelector<HTMLElement>('.dropdown-toggle')!;
    const menu = dropdown.querySelector<HTMLElement>('.dropdown-menu')!;

    toggle.focus();
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(menu.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('opens menu on Space key from toggle', () => {
    const dropdown = createDropdown('test-dropdown');
    const cleanup = initDropdowns();

    const toggle = dropdown.querySelector<HTMLElement>('.dropdown-toggle')!;
    const menu = dropdown.querySelector<HTMLElement>('.dropdown-menu')!;

    toggle.focus();
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

    expect(menu.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('scopes queries to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const dropdown = document.createElement('div');
    dropdown.setAttribute('data-sol-dropdown', '');
    dropdown.className = 'dropdown';

    const toggle = document.createElement('button');
    toggle.className = 'dropdown-toggle';
    dropdown.appendChild(toggle);

    const menu = document.createElement('div');
    menu.className = 'dropdown-menu';
    dropdown.appendChild(menu);

    root.appendChild(dropdown);

    const cleanup = initDropdowns({ root });

    expect(toggle.getAttribute('aria-haspopup')).toBe('menu');

    cleanup.destroy();
  });

  describe('error handling', () => {
    it('handles gracefully when no elements match the dropdown selector', () => {
      expect(() => initDropdowns()).not.toThrow();
      const cleanup = initDropdowns();
      expect(typeof cleanup.destroy).toBe('function');
      cleanup.destroy();
    });

    it('handles gracefully when dropdown lacks toggle element', () => {
      const dropdown = document.createElement('div');
      dropdown.setAttribute('data-sol-dropdown', '');
      const menu = document.createElement('div');
      menu.className = 'dropdown-menu';
      dropdown.appendChild(menu);
      document.body.appendChild(dropdown);

      expect(() => initDropdowns()).not.toThrow();
      const cleanup = initDropdowns();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });

    it('handles gracefully when dropdown lacks menu element', () => {
      const dropdown = document.createElement('div');
      dropdown.setAttribute('data-sol-dropdown', '');
      const toggle = document.createElement('button');
      toggle.className = 'dropdown-toggle';
      dropdown.appendChild(toggle);
      document.body.appendChild(dropdown);

      expect(() => initDropdowns()).not.toThrow();
      const cleanup = initDropdowns();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });

    it('handles gracefully when menu has no items', () => {
      const dropdown = document.createElement('div');
      dropdown.setAttribute('data-sol-dropdown', '');
      const toggle = document.createElement('button');
      toggle.className = 'dropdown-toggle';
      const menu = document.createElement('div');
      menu.className = 'dropdown-menu';
      dropdown.appendChild(toggle);
      dropdown.appendChild(menu);
      document.body.appendChild(dropdown);

      expect(() => initDropdowns()).not.toThrow();
      const cleanup = initDropdowns();

      expect(() => {
        toggle.click();
      }).not.toThrow();

      cleanup.destroy();
    });
  });
});
