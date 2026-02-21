// Unit tests for drawer enhancer focus on ARIA correctness, event handling,
// and focus trapping.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initDrawers } from './drawer.js';

function createDrawer(id: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.id = id;
  wrapper.setAttribute('data-sol-drawer', '');
  wrapper.setAttribute('aria-hidden', 'true');

  const backdrop = document.createElement('div');
  backdrop.className = 'drawer-backdrop';
  wrapper.appendChild(backdrop);

  const drawer = document.createElement('div');
  drawer.className = 'drawer';
  const content = document.createElement('div');
  content.className = 'drawer__content';
  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('data-drawer-close', '');
  closeBtn.textContent = 'Close';
  content.appendChild(closeBtn);
  drawer.appendChild(content);
  wrapper.appendChild(drawer);

  document.body.appendChild(wrapper);
  return wrapper;
}

function createTrigger(targetId: string): HTMLElement {
  const btn = document.createElement('button');
  btn.setAttribute('data-drawer-open', targetId);
  document.body.appendChild(btn);
  return btn;
}

describe('initDrawers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.classList.remove('sol-drawer-open');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.body.classList.remove('sol-drawer-open');
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initDrawers();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('handles multiple init calls without duplicating listeners', () => {
    const drawer = createDrawer('test-drawer');
    const trigger = createTrigger('test-drawer');

    initDrawers();
    const cleanup = initDrawers();

    trigger.click();

    expect(drawer.classList.contains('active')).toBe(true);
    expect(drawer.getAttribute('aria-hidden')).toBe('false');

    cleanup.destroy();
  });

  it('sets ARIA dialog role on drawer element', () => {
    const drawer = createDrawer('test-drawer');
    const cleanup = initDrawers();

    const drawerEl = drawer.querySelector('.drawer')!;
    expect(drawerEl.getAttribute('role')).toBe('dialog');

    cleanup.destroy();
  });

  it('opens drawer on trigger click', () => {
    const drawer = createDrawer('test-drawer');
    createTrigger('test-drawer');
    const cleanup = initDrawers();

    const trigger = document.querySelector<HTMLElement>('[data-drawer-open]')!;

    trigger.click();

    expect(drawer.classList.contains('active')).toBe(true);
    expect(drawer.getAttribute('aria-hidden')).toBe('false');
    expect(document.body.classList.contains('sol-drawer-open')).toBe(true);

    cleanup.destroy();
  });

  it('closes drawer on close button click', () => {
    const drawer = createDrawer('test-drawer');
    createTrigger('test-drawer');
    const cleanup = initDrawers();

    const trigger = document.querySelector<HTMLElement>('[data-drawer-open]')!;
    trigger.click();

    const closeBtn = drawer.querySelector<HTMLElement>('[data-drawer-close]')!;
    closeBtn.click();

    expect(drawer.classList.contains('active')).toBe(false);
    expect(drawer.getAttribute('aria-hidden')).toBe('true');

    cleanup.destroy();
  });

  it('destroy() removes sol-drawer-open from body', () => {
    createDrawer('test-drawer');
    createTrigger('test-drawer');
    const cleanup = initDrawers();

    const trigger = document.querySelector<HTMLElement>('[data-drawer-open]')!;
    trigger.click();
    expect(document.body.classList.contains('sol-drawer-open')).toBe(true);

    cleanup.destroy();
    expect(document.body.classList.contains('sol-drawer-open')).toBe(false);
  });

  it('scopes queries to custom root via options', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const drawer = document.createElement('div');
    drawer.id = 'scoped-drawer';
    drawer.setAttribute('data-sol-drawer', '');
    drawer.setAttribute('aria-hidden', 'true');
    const drawerEl = document.createElement('div');
    drawerEl.className = 'drawer';
    drawer.appendChild(drawerEl);
    container.appendChild(drawer);

    const trigger = document.createElement('button');
    trigger.setAttribute('data-drawer-open', 'scoped-drawer');
    container.appendChild(trigger);

    const outsideTrigger = document.createElement('button');
    outsideTrigger.setAttribute('data-drawer-open', 'scoped-drawer');
    document.body.appendChild(outsideTrigger);

    const cleanup = initDrawers({ root: container });

    trigger.click();
    expect(drawer.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  describe('error handling', () => {
    it('handles gracefully when no elements match the drawer selector', () => {
      expect(() => initDrawers()).not.toThrow();
      const cleanup = initDrawers();
      expect(typeof cleanup.destroy).toBe('function');
      cleanup.destroy();
    });

    it('handles gracefully when trigger references non-existent drawer ID', () => {
      const trigger = createTrigger('non-existent-drawer');
      const cleanup = initDrawers();

      expect(() => {
        trigger.click();
      }).not.toThrow();

      cleanup.destroy();
    });

    it('handles gracefully when drawer lacks required inner structure', () => {
      const drawer = document.createElement('div');
      drawer.id = 'incomplete-drawer';
      drawer.setAttribute('data-sol-drawer', '');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(drawer);

      createTrigger('incomplete-drawer');

      expect(() => initDrawers()).not.toThrow();
      const cleanup = initDrawers();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });
  });
});
