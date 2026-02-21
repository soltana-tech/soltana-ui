// Unit tests for tabs enhancer focus on ARIA correctness, event handling, and
// keyboard navigation. Tier integration (theme/relief/finish interaction with
// enhancers) is verified in E2E tests (tests/enhancers/).

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initTabs } from './tabs.js';
import { testSingletonBehavior } from './__tests__/helpers.js';

function createTabs(tabLabels: string[]): HTMLElement {
  const container = document.createElement('div');
  container.setAttribute('data-sol-tabs', '');

  const tablist = document.createElement('div');
  tablist.setAttribute('role', 'tablist');

  tabLabels.forEach((label, i) => {
    const tab = document.createElement('button');
    tab.setAttribute('role', 'tab');
    if (i === 0) tab.setAttribute('aria-selected', 'true');
    tab.textContent = label;
    tablist.appendChild(tab);
  });

  container.appendChild(tablist);

  tabLabels.forEach((label, i) => {
    const panel = document.createElement('div');
    panel.setAttribute('role', 'tabpanel');
    panel.textContent = `${label} content`;
    if (i > 0) panel.hidden = true;
    container.appendChild(panel);
  });

  document.body.appendChild(container);
  return container;
}

describe('initTabs', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initTabs();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('sets ARIA ids on tabs and panels', () => {
    const container = createTabs(['One', 'Two', 'Three']);
    const cleanup = initTabs();

    const tabs = container.querySelectorAll('[role="tab"]');
    const panels = container.querySelectorAll('[role="tabpanel"]');

    tabs.forEach((tab, i) => {
      expect(tab.id).toContain(`tab-${String(i)}`);
      expect(tab.getAttribute('aria-controls')).toContain(`panel-${String(i)}`);
    });

    panels.forEach((panel, i) => {
      expect(panel.id).toContain(`panel-${String(i)}`);
      expect(panel.getAttribute('aria-labelledby')).toContain(`tab-${String(i)}`);
    });

    cleanup.destroy();
  });

  it('activates a tab on click', () => {
    const container = createTabs(['One', 'Two', 'Three']);
    const cleanup = initTabs();

    const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');
    const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    tabs[1].click();

    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].classList.contains('active')).toBe(true);
    expect(panels[1].hidden).toBe(false);

    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(panels[0].hidden).toBe(true);

    cleanup.destroy();
  });

  it('supports ArrowRight keyboard navigation', () => {
    const container = createTabs(['One', 'Two', 'Three']);
    const cleanup = initTabs();

    const tablist = container.querySelector('[role="tablist"]')!;
    const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');

    tabs[0].focus();
    tablist.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
    );

    expect(tabs[1].getAttribute('aria-selected')).toBe('true');

    cleanup.destroy();
  });

  it('wraps ArrowRight from last tab to first', () => {
    const container = createTabs(['One', 'Two']);
    const cleanup = initTabs();

    const tablist = container.querySelector('[role="tablist"]')!;
    const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');

    // Activate last tab
    tabs[1].click();

    tablist.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
    );

    expect(tabs[0].getAttribute('aria-selected')).toBe('true');

    cleanup.destroy();
  });

  it('singleton: re-calling initTabs() does not duplicate listeners', () => {
    testSingletonBehavior(
      () => initTabs(),
      () => {
        const container = createTabs(['One', 'Two']);
        return container.querySelectorAll<HTMLElement>('[role="tab"]')[1];
      },
      (tab) => {
        tab.click();
        expect(tab.getAttribute('aria-selected')).toBe('true');
        expect(tab.classList.contains('active')).toBe(true);
      }
    );
  });

  it('scopes queries to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const container = document.createElement('div');
    container.setAttribute('data-sol-tabs', '');
    const tablist = document.createElement('div');
    tablist.setAttribute('role', 'tablist');
    const tab = document.createElement('button');
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'true');
    tablist.appendChild(tab);
    container.appendChild(tablist);
    const panel = document.createElement('div');
    panel.setAttribute('role', 'tabpanel');
    container.appendChild(panel);
    root.appendChild(container);

    const cleanup = initTabs({ root });

    expect(tab.id).toContain('tab-0');

    cleanup.destroy();
  });
});
