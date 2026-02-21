import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initTabs } from './tabs.js';
import {
  testDestroyPreventsInteraction,
  testIdempotentInit,
  testNoMatchGraceful,
  testCustomRoot,
} from './test-utils.js';

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

  testDestroyPreventsInteraction(
    initTabs,
    () => createTabs(['One', 'Two']),
    (container) => {
      const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');
      tabs[1].click();
    },
    (container) => {
      const tabs = container.querySelectorAll('[role="tab"]');
      expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    }
  );

  testIdempotentInit(
    initTabs,
    () => createTabs(['One', 'Two']),
    (container) => {
      const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');
      const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]');

      tabs[1].click();

      expect(tabs[1].getAttribute('aria-selected')).toBe('true');
      expect(tabs[0].getAttribute('aria-selected')).toBe('false');
      expect(panels[1].hidden).toBe(false);
      expect(panels[0].hidden).toBe(true);
    }
  );

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

  testCustomRoot(
    initTabs,
    (root) => {
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
    },
    (root) => {
      const tab = root.querySelector('[role="tab"]')!;
      expect(tab.id).toContain('tab-0');
    }
  );

  describe('error handling', () => {
    testNoMatchGraceful(initTabs);

    it('handles gracefully when tab buttons reference non-existent panels', () => {
      const container = document.createElement('div');
      container.setAttribute('data-sol-tabs', '');
      const tablist = document.createElement('div');
      tablist.setAttribute('role', 'tablist');
      const tab = document.createElement('button');
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', 'true');
      tablist.appendChild(tab);
      container.appendChild(tablist);
      document.body.appendChild(container);

      expect(() => initTabs()).not.toThrow();
      initTabs().destroy();
    });

    it('handles gracefully when tabs container has buttons but no panels', () => {
      const container = document.createElement('div');
      container.setAttribute('data-sol-tabs', '');
      const tablist = document.createElement('div');
      tablist.setAttribute('role', 'tablist');
      const tab1 = document.createElement('button');
      tab1.setAttribute('role', 'tab');
      tab1.setAttribute('aria-selected', 'true');
      const tab2 = document.createElement('button');
      tab2.setAttribute('role', 'tab');
      tablist.appendChild(tab1);
      tablist.appendChild(tab2);
      container.appendChild(tablist);
      document.body.appendChild(container);

      expect(() => initTabs()).not.toThrow();
      initTabs().destroy();
    });
  });
});
