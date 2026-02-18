import type { Router } from './Router';

interface SearchEntry {
  label: string;
  path: string;
  section: string;
}

/**
 * Cmd+K search overlay.
 * Builds a static index from sidebar sections at init time and
 * filters with case-insensitive substring matching.
 */
export class Search {
  private router: Router;
  private entries: SearchEntry[];
  private overlay: HTMLElement;
  private input: HTMLInputElement;
  private results: HTMLElement;
  private visible = false;
  private selectedIndex = -1;

  constructor(
    router: Router,
    sections: { label: string; items: { label: string; path: string }[] }[]
  ) {
    this.router = router;
    this.entries = this.buildIndex(sections);
    this.overlay = this.buildOverlay();
    this.input = this.overlay.querySelector<HTMLInputElement>('.search__input')!;
    this.results = this.overlay.querySelector<HTMLElement>('.search__results')!;
    document.body.appendChild(this.overlay);
    this.bind();
  }

  open(): void {
    this.visible = true;
    this.overlay.classList.add('search--visible');
    this.input.value = '';
    this.selectedIndex = -1;
    this.renderResults(this.entries);
    this.input.focus();
  }

  close(): void {
    this.visible = false;
    this.overlay.classList.remove('search--visible');
  }

  private buildIndex(
    sections: { label: string; items: { label: string; path: string }[] }[]
  ): SearchEntry[] {
    const entries: SearchEntry[] = [];
    for (const section of sections) {
      for (const item of section.items) {
        entries.push({
          label: item.label,
          path: item.path,
          section: section.label,
        });
      }
    }
    return entries;
  }

  private buildOverlay(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'search';
    el.innerHTML = `
      <div class="search__backdrop"></div>
      <div class="search__dialog">
        <div class="search__input-wrapper">
          <svg class="search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="search__input" type="text" placeholder="Search docs..." aria-label="Search documentation" />
          <kbd class="search__kbd">Esc</kbd>
        </div>
        <ul class="search__results" role="listbox"></ul>
      </div>
    `;
    return el;
  }

  private bind(): void {
    // Global Cmd+K / Ctrl+K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (this.visible) {
          this.close();
        } else {
          this.open();
        }
      }
      if (e.key === 'Escape' && this.visible) {
        this.close();
      }
    });

    // Backdrop click
    this.overlay.querySelector('.search__backdrop')?.addEventListener('click', () => {
      this.close();
    });

    // Input filtering
    this.input.addEventListener('input', () => {
      const query = this.input.value.toLowerCase().trim();
      this.selectedIndex = -1;
      if (!query) {
        this.renderResults(this.entries);
        return;
      }
      const filtered = this.entries.filter(
        (e) =>
          e.label.toLowerCase().includes(query) ||
          e.section.toLowerCase().includes(query) ||
          e.path.toLowerCase().includes(query)
      );
      this.renderResults(filtered);
    });

    // Keyboard navigation
    this.input.addEventListener('keydown', (e) => {
      const items = this.results.querySelectorAll('.search__result');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
        this.updateSelection(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.updateSelection(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const target =
          this.selectedIndex >= 0
            ? (items[this.selectedIndex] as HTMLElement)
            : (items[0] as HTMLElement | undefined);
        if (target) {
          const path = target.dataset.path;
          if (path) {
            this.router.navigate(path);
            this.close();
          }
        }
      }
    });
  }

  private renderResults(entries: SearchEntry[]): void {
    if (!entries.length) {
      this.results.innerHTML = '<li class="search__empty">No results found.</li>';
      return;
    }

    this.results.innerHTML = entries
      .map(
        (e, i) =>
          `<li class="search__result${i === this.selectedIndex ? ' search__result--active' : ''}" data-path="${e.path}" role="option">
            <span class="search__result-label">${e.label}</span>
            <span class="search__result-section">${e.section}</span>
          </li>`
      )
      .join('');

    // Click handler on results
    this.results.querySelectorAll('.search__result').forEach((item) => {
      item.addEventListener('click', () => {
        const path = (item as HTMLElement).dataset.path;
        if (path) {
          this.router.navigate(path);
          this.close();
        }
      });
    });
  }

  private updateSelection(items: NodeListOf<Element>): void {
    items.forEach((item, i) => {
      item.classList.toggle('search__result--active', i === this.selectedIndex);
    });
    if (this.selectedIndex >= 0) {
      items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }
}
