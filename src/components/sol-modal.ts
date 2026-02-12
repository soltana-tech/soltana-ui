import { SoltanaElement } from './base/SoltanaElement.js';

export class SolModal extends SoltanaElement {
  static get observedAttributes(): string[] {
    return ['open', 'size'];
  }

  constructor() {
    super();
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
    if (this.hasAttribute('open')) {
      this._trapFocus();
      document.addEventListener('keydown', this._handleEscape);
    } else {
      document.removeEventListener('keydown', this._handleEscape);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._handleEscape);
  }

  private _handleEscape = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      this.removeAttribute('open');
      this.dispatchEvent(new CustomEvent('sol-close'));
    }
  };

  private _trapFocus(): void {
    requestAnimationFrame(() => {
      const focusable = this.shadow.querySelector<HTMLElement>('.modal__content');
      focusable?.focus();
    });
  }

  protected render(): void {
    const isOpen = this.hasAttribute('open');
    const size = this.getAttribute('size') ?? 'md';

    const sizeMap: Record<string, string> = {
      sm: '28rem',
      md: '36rem',
      lg: '48rem',
    };

    this.setContent(
      `
      :host {
        display: ${isOpen ? 'block' : 'none'};
        position: fixed;
        inset: 0;
        z-index: 50;
      }
      .modal__backdrop {
        position: fixed;
        inset: 0;
        background: rgb(0 0 0 / 60%);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }
      .modal__container {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }
      .modal__content {
        position: relative;
        width: 100%;
        max-width: ${sizeMap[size] || sizeMap.md};
        max-height: 85vh;
        overflow-y: auto;
        background: var(--surface-1);
        border-radius: var(--radius-xl);
        border: 1px solid rgb(212 168 67 / 15%);
        outline: 1px solid rgb(212 168 67 / 8%);
        outline-offset: 4px;
        box-shadow: 0 20px 60px rgb(0 0 0 / 30%), 0 0 40px rgb(212 168 67 / 5%);
        padding: 2rem;
      }
      .modal__content:focus {
        outline: 2px solid var(--gold-400, #d4a843);
        outline-offset: 4px;
      }
      /* Corner ornaments */
      .corner {
        position: absolute;
        width: 20px;
        height: 20px;
        border-color: var(--gold-400, #d4a843);
        border-style: solid;
        opacity: 0.4;
        pointer-events: none;
      }
      .corner--tl { top: 8px; left: 8px; border-width: 2px 0 0 2px; }
      .corner--tr { top: 8px; right: 8px; border-width: 2px 2px 0 0; }
      .corner--bl { bottom: 8px; left: 8px; border-width: 0 0 2px 2px; }
      .corner--br { bottom: 8px; right: 8px; border-width: 0 2px 2px 0; }

      ::slotted([slot="header"]) {
        font-family: var(--font-serif);
        font-weight: var(--font-bold);
        letter-spacing: var(--tracking-elegant);
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--border-subtle);
      }
      ::slotted([slot="footer"]) {
        margin-top: 1.5rem;
        padding-top: 0.75rem;
        border-top: 1px solid var(--border-subtle);
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
      }
      `,
      `<div class="modal__backdrop" part="backdrop"></div>
      <div class="modal__container">
        <div class="modal__content" tabindex="-1">
          <span class="corner corner--tl"></span>
          <span class="corner corner--tr"></span>
          <span class="corner corner--bl"></span>
          <span class="corner corner--br"></span>
          <slot name="header"></slot>
          <slot></slot>
          <slot name="footer"></slot>
        </div>
      </div>`
    );

    // Backdrop click to close
    const backdrop = this.shadow.querySelector('.modal__backdrop');
    backdrop?.addEventListener('click', () => {
      this.removeAttribute('open');
      this.dispatchEvent(new CustomEvent('sol-close'));
    });
  }
}

customElements.define('sol-modal', SolModal);
