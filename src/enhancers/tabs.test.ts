import { describe, it, expect, beforeEach } from 'vitest';
import { initTabs } from './tabs';

function createTabsFixture(): HTMLElement {
  const container = document.createElement('div');
  container.setAttribute('data-sol-tabs', '');
  container.innerHTML = `
    <div role="tablist">
      <button role="tab" aria-selected="true">Tab 1</button>
      <button role="tab">Tab 2</button>
      <button role="tab">Tab 3</button>
    </div>
    <div role="tabpanel">Panel 1</div>
    <div role="tabpanel" hidden>Panel 2</div>
    <div role="tabpanel" hidden>Panel 3</div>
  `;
  document.body.appendChild(container);
  return container;
}

describe('initTabs', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('initializes ARIA ids and relationships', () => {
    const container = createTabsFixture();
    initTabs();
    const tabs = container.querySelectorAll('[role="tab"]');
    const panels = container.querySelectorAll('[role="tabpanel"]');

    expect(tabs[0].getAttribute('aria-controls')).toBeTruthy();
    expect(panels[0].getAttribute('aria-labelledby')).toBe(tabs[0].id);
  });

  it('clicking a tab activates it', () => {
    const container = createTabsFixture();
    initTabs();
    const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');
    const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    tabs[1].click();

    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(panels[0].hidden).toBe(true);
    expect(panels[1].hidden).toBe(false);
  });

  it('arrow keys navigate between tabs', () => {
    const container = createTabsFixture();
    initTabs();
    const tablist = container.querySelector('[role="tablist"]')!;
    const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');

    // Wraps around
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
  });

  it('Home/End keys go to first/last tab', () => {
    const container = createTabsFixture();
    initTabs();
    const tablist = container.querySelector('[role="tablist"]')!;
    const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
  });
});
