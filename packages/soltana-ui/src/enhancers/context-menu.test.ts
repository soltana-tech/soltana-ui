// Unit tests for context-menu enhancer focus on ARIA correctness, event handling,
// keyboard navigation, and right-click behavior.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initContextMenus } from './context-menu.js';
import { mockBoundingClientRect } from './test-helpers.js';

function createContextMenu(items: string[]): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-sol-context-menu', '');

  const menu = document.createElement('div');
  menu.className = 'context-menu';
  mockBoundingClientRect(menu, { top: 0, left: 0, width: 150, height: 200 });

  items.forEach((itemText) => {
    const item = document.createElement('button');
    item.className = 'context-menu-item';
    item.textContent = itemText;
    menu.appendChild(item);
  });

  wrapper.appendChild(menu);

  const content = document.createElement('p');
  content.textContent = 'Right-click here';
  wrapper.appendChild(content);

  document.body.appendChild(wrapper);
  return wrapper;
}

describe('initContextMenus', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initContextMenus();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('handles multiple init calls without duplicating listeners', () => {
    const wrapper = createContextMenu(['Cut', 'Copy', 'Paste']);

    initContextMenus();
    const cleanup = initContextMenus();

    const menu = wrapper.querySelector<HTMLElement>('.context-menu')!;

    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 100,
      clientY: 150,
    });
    wrapper.dispatchEvent(event);

    expect(menu.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('sets ARIA role on menu', () => {
    const wrapper = createContextMenu(['Cut', 'Copy']);
    const cleanup = initContextMenus();

    const menu = wrapper.querySelector<HTMLElement>('.context-menu')!;

    expect(menu.getAttribute('role')).toBe('menu');

    cleanup.destroy();
  });

  it('sets ARIA role and tabindex on menu items', () => {
    const wrapper = createContextMenu(['Cut', 'Copy', 'Paste']);
    const cleanup = initContextMenus();

    const items = wrapper.querySelectorAll('.context-menu-item');

    items.forEach((item) => {
      expect(item.getAttribute('role')).toBe('menuitem');
      expect(item.getAttribute('tabindex')).toBe('-1');
    });

    cleanup.destroy();
  });

  it('opens menu on right-click and prevents default', () => {
    const wrapper = createContextMenu(['Cut', 'Copy']);
    const cleanup = initContextMenus();

    const menu = wrapper.querySelector<HTMLElement>('.context-menu')!;

    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 150,
    });

    let defaultPrevented = false;
    event.preventDefault = () => {
      defaultPrevented = true;
    };

    wrapper.dispatchEvent(event);

    expect(menu.classList.contains('active')).toBe(true);
    expect(defaultPrevented).toBe(true);

    cleanup.destroy();
  });

  it('sets custom properties for menu position', () => {
    const wrapper = createContextMenu(['Cut', 'Copy']);
    const cleanup = initContextMenus();

    const menu = wrapper.querySelector<HTMLElement>('.context-menu')!;

    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 200,
      clientY: 300,
    });
    wrapper.dispatchEvent(event);

    expect(menu.style.getPropertyValue('--context-menu-top')).toBeTruthy();
    expect(menu.style.getPropertyValue('--context-menu-left')).toBeTruthy();

    cleanup.destroy();
  });

  it('focuses first menu item after opening', async () => {
    const wrapper = createContextMenu(['Cut', 'Copy', 'Paste']);
    const cleanup = initContextMenus();

    const items = wrapper.querySelectorAll<HTMLElement>('.context-menu-item');

    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 100,
      clientY: 150,
    });
    wrapper.dispatchEvent(event);

    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(document.activeElement).toBe(items[0]);

    cleanup.destroy();
  });

  it('closes menu on Escape key', () => {
    const wrapper = createContextMenu(['Cut', 'Copy']);
    const cleanup = initContextMenus();

    const menu = wrapper.querySelector<HTMLElement>('.context-menu')!;

    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 100,
      clientY: 150,
    });
    wrapper.dispatchEvent(event);

    expect(menu.classList.contains('active')).toBe(true);

    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(menu.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('closes menu after clicking outside', () => {
    const wrapper = createContextMenu(['Cut', 'Copy']);
    const cleanup = initContextMenus();

    const menu = wrapper.querySelector<HTMLElement>('.context-menu')!;

    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 100,
      clientY: 150,
    });
    wrapper.dispatchEvent(event);

    expect(menu.classList.contains('active')).toBe(true);

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(menu.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('scopes queries to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-sol-context-menu', '');

    const menu = document.createElement('div');
    menu.className = 'context-menu';
    mockBoundingClientRect(menu, { top: 0, left: 0, width: 150, height: 100 });

    const item = document.createElement('button');
    item.className = 'context-menu-item';
    item.textContent = 'Item';
    menu.appendChild(item);

    wrapper.appendChild(menu);
    root.appendChild(wrapper);

    const cleanup = initContextMenus({ root });

    expect(item.getAttribute('role')).toBe('menuitem');

    cleanup.destroy();
  });

  describe('error handling', () => {
    it('handles gracefully when no elements match the context-menu selector', () => {
      expect(() => initContextMenus()).not.toThrow();
      const cleanup = initContextMenus();
      expect(typeof cleanup.destroy).toBe('function');
      cleanup.destroy();
    });

    it('handles gracefully when context-menu lacks menu element', () => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-sol-context-menu', '');
      const content = document.createElement('p');
      content.textContent = 'Content';
      wrapper.appendChild(content);
      document.body.appendChild(wrapper);

      expect(() => initContextMenus()).not.toThrow();
      const cleanup = initContextMenus();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });

    it('handles gracefully when menu has no items', () => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-sol-context-menu', '');
      const menu = document.createElement('div');
      menu.className = 'context-menu';
      mockBoundingClientRect(menu, { top: 0, left: 0, width: 150, height: 100 });
      wrapper.appendChild(menu);
      document.body.appendChild(wrapper);

      expect(() => initContextMenus()).not.toThrow();
      const cleanup = initContextMenus();
      expect(typeof cleanup.destroy).toBe('function');

      const event = new MouseEvent('contextmenu', {
        bubbles: true,
        clientX: 100,
        clientY: 150,
      });
      wrapper.dispatchEvent(event);

      expect(menu.classList.contains('active')).toBe(true);

      cleanup.destroy();
    });
  });
});
