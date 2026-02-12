export type TabId = 'getting-started' | 'design-system' | 'components' | 'patterns' | 'examples';

type PageRenderer = () => string;

/** Hash-based tab router for the documentation site. */
export class TabRouter {
  private container: HTMLElement;
  private tabs: NodeListOf<HTMLButtonElement>;
  private pages = new Map<TabId, PageRenderer>();
  private afterRenderHooks: ((tabId: TabId) => void)[] = [];
  private currentTab: TabId = 'getting-started';

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;
    this.tabs = document.querySelectorAll<HTMLButtonElement>('[data-tab]');
    this.bind();
  }

  register(tabId: TabId, renderer: PageRenderer): void {
    this.pages.set(tabId, renderer);
  }

  onAfterRender(hook: (tabId: TabId) => void): void {
    this.afterRenderHooks.push(hook);
  }

  /** Navigate to the tab from the URL hash, or the default tab. */
  start(): void {
    const hash = location.hash.slice(1) as TabId;
    const target = this.pages.has(hash) ? hash : 'getting-started';
    this.navigate(target);
  }

  navigate(tabId: TabId): void {
    const renderer = this.pages.get(tabId);
    if (!renderer) return;

    this.currentTab = tabId;
    location.hash = tabId;

    this.tabs.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    this.container.innerHTML = renderer();

    for (const hook of this.afterRenderHooks) {
      hook(tabId);
    }

    window.scrollTo({ top: 0 });
  }

  getActiveTab(): TabId {
    return this.currentTab;
  }

  private bind(): void {
    this.tabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab as TabId | undefined;
        if (tab) this.navigate(tab);
      });
    });

    window.addEventListener('hashchange', () => {
      const hash = location.hash.slice(1) as TabId;
      if (this.pages.has(hash) && hash !== this.currentTab) {
        this.navigate(hash);
      }
    });
  }
}
