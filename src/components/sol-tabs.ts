import { SoltanaElement } from './base/SoltanaElement.js';

export class SolTabs extends SoltanaElement {
  private _activeIndex = 0;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this._handleKeydown);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeydown);
  }

  private _handleKeydown = (e: KeyboardEvent): void => {
    const tabs = this.shadow.querySelectorAll<HTMLElement>('[role="tab"]');
    const count = tabs.length;
    if (!count) return;

    let newIndex = this._activeIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = (this._activeIndex + 1) % count;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = (this._activeIndex - 1 + count) % count;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = count - 1;
    }

    if (newIndex !== this._activeIndex) {
      this._activateTab(newIndex);
    }
  };

  private _activateTab(index: number): void {
    this._activeIndex = index;
    this.render();
    requestAnimationFrame(() => {
      const tab = this.shadow.querySelectorAll<HTMLElement>('[role="tab"]')[index];
      tab.focus();
    });
    this.dispatchEvent(
      new CustomEvent('sol-tab-change', {
        detail: { index },
        bubbles: true,
      })
    );
  }

  protected render(): void {
    // Gather slotted tab labels from child elements
    const children = Array.from(this.children);
    const tabLabels = children.map((child, i) => {
      const label = child.getAttribute('label') ?? `Tab ${String(i + 1)}`;
      return label;
    });

    if (tabLabels.length === 0) {
      this.setContent('', '<slot></slot>');
      return;
    }

    const tabsHtml = tabLabels
      .map((label, i) => {
        const active = i === this._activeIndex;
        return `<button
        role="tab"
        aria-selected="${String(active)}"
        tabindex="${active ? '0' : '-1'}"
        class="tab ${active ? 'tab--active' : ''}"
        data-index="${String(i)}"
      >${label}</button>`;
      })
      .join('');

    const panelsHtml = children
      .map((_, i) => {
        const active = i === this._activeIndex;
        return `<div
        role="tabpanel"
        class="panel ${active ? 'panel--active' : ''}"
        ${active ? '' : 'hidden'}
      ><slot name="tab-${String(i)}"></slot></div>`;
      })
      .join('');

    // Assign slot names to children
    children.forEach((child, i) => {
      child.setAttribute('slot', `tab-${String(i)}`);
    });

    this.setContent(
      `
      :host {
        display: block;
      }
      .tablist {
        display: flex;
        gap: 0;
        border-bottom: 2px solid var(--border-default);
        margin-bottom: 1rem;
      }
      .tab {
        padding: 0.75rem 1.25rem;
        font-family: var(--font-sans);
        font-size: 0.85rem;
        font-weight: var(--font-medium);
        letter-spacing: var(--tracking-elegant);
        text-transform: uppercase;
        color: var(--text-muted);
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        cursor: pointer;
        transition: all var(--transition-normal) ease;
      }
      .tab:hover {
        color: var(--text-secondary);
      }
      .tab:focus-visible {
        outline: 2px solid var(--gold-400, #d4a843);
        outline-offset: -2px;
      }
      .tab--active {
        color: var(--gold-400, #d4a843);
        border-bottom-color: var(--gold-400, #d4a843);
      }
      .panel {
        display: none;
      }
      .panel--active {
        display: block;
      }
      `,
      `<div class="tablist" role="tablist">${tabsHtml}</div>${panelsHtml}`
    );

    // Tab click handlers
    this.shadow.querySelectorAll<HTMLElement>('[role="tab"]').forEach((tab) => {
      tab.addEventListener('click', () => {
        const index = Number(tab.dataset.index);
        this._activateTab(index);
      });
    });
  }
}

customElements.define('sol-tabs', SolTabs);
