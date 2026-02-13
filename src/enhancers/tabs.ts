// ---------------------------------------------------------------------------
// Tabs Enhancer
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-tabs] elements.
// Handles tab switching, keyboard navigation, and ARIA attributes.
// ---------------------------------------------------------------------------

function activateTab(container: HTMLElement, index: number): void {
  const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');
  const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]');

  tabs.forEach((tab, i) => {
    const isActive = i === index;
    tab.setAttribute('aria-selected', String(isActive));
    tab.setAttribute('tabindex', isActive ? '0' : '-1');
    tab.classList.toggle('active', isActive);
  });

  panels.forEach((panel, i) => {
    const isActive = i === index;
    panel.hidden = !isActive;
    panel.classList.toggle('active', isActive);
  });
}

function getActiveIndex(container: HTMLElement): number {
  const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].getAttribute('aria-selected') === 'true') return i;
  }
  return 0;
}

/**
 * Enhance all [data-sol-tabs] elements on the page.
 * Expected structure:
 *   <div data-sol-tabs>
 *     <div role="tablist">
 *       <button role="tab" aria-selected="true">Tab 1</button>
 *       <button role="tab">Tab 2</button>
 *     </div>
 *     <div role="tabpanel">Panel 1</div>
 *     <div role="tabpanel" hidden>Panel 2</div>
 *   </div>
 */
export function initTabs(): void {
  document.querySelectorAll<HTMLElement>('[data-sol-tabs]').forEach((container) => {
    const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');
    const count = tabs.length;
    if (count === 0) return;

    // Initialize ARIA ids and relationships
    const baseId = container.id || `sol-tabs-${Math.random().toString(36).slice(2, 7)}`;
    const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    tabs.forEach((tab, i) => {
      const tabId = `${baseId}-tab-${String(i)}`;
      const panelId = `${baseId}-panel-${String(i)}`;
      tab.id = tabId;
      tab.setAttribute('aria-controls', panelId);
      const panel = panels[i] as HTMLElement | undefined;
      if (panel) {
        panel.id = panelId;
        panel.setAttribute('aria-labelledby', tabId);
      }
    });

    // Activate initial tab
    activateTab(container, getActiveIndex(container));

    // Click handler
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        activateTab(container, i);
        tab.focus();
      });
    });

    // Keyboard navigation on the tablist
    const tablist = container.querySelector('[role="tablist"]');
    tablist?.addEventListener('keydown', (e: Event) => {
      const ke = e as KeyboardEvent;
      const current = getActiveIndex(container);
      let next = current;

      switch (ke.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          ke.preventDefault();
          next = (current + 1) % count;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          ke.preventDefault();
          next = (current - 1 + count) % count;
          break;
        case 'Home':
          ke.preventDefault();
          next = 0;
          break;
        case 'End':
          ke.preventDefault();
          next = count - 1;
          break;
        default:
          return;
      }

      activateTab(container, next);
      tabs[next].focus();
    });
  });
}
