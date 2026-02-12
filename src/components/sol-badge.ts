import { SoltanaElement } from './base/SoltanaElement.js';

export class SolBadge extends SoltanaElement {
  static get observedAttributes(): string[] {
    return ['variant'];
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }

  protected render(): void {
    const variant = this.getAttribute('variant') ?? 'default';

    this.setContent(
      `
      :host {
        display: inline-flex;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.25rem 0.75rem;
        font-family: var(--font-sans);
        font-size: 0.75rem;
        font-weight: var(--font-semibold);
        letter-spacing: var(--tracking-elegant);
        text-transform: uppercase;
        border-radius: var(--radius-full);
        line-height: 1.4;
      }

      .badge--default {
        background: var(--badge-bg);
        color: var(--text-secondary);
        border: 1px solid var(--border-default);
      }
      .badge--primary {
        background: rgb(212 168 67 / 15%);
        color: var(--gold-400, #d4a843);
        border: 1px solid rgb(212 168 67 / 25%);
      }
      .badge--success {
        background: rgb(16 185 129 / 12%);
        color: var(--jewel-emerald, #10b981);
        border: 1px solid rgb(16 185 129 / 20%);
      }
      .badge--warning {
        background: rgb(252 211 77 / 12%);
        color: var(--gold-300, #fcd34d);
        border: 1px solid rgb(252 211 77 / 20%);
      }
      .badge--error {
        background: rgb(239 68 68 / 12%);
        color: var(--jewel-ruby, #ef4444);
        border: 1px solid rgb(239 68 68 / 20%);
      }
      .badge--gold {
        background: var(--gold-gradient);
        color: var(--gold-900, #2c2005);
        border: none;
      }
      .badge--medallion {
        border-radius: 50%;
        width: 2.5rem;
        height: 2.5rem;
        padding: 0;
        border: 2px solid var(--gold-400, #d4a843);
        background: var(--surface-2);
        color: var(--gold-400, #d4a843);
        box-shadow:
          0 0 0 3px var(--surface-bg),
          0 0 0 5px rgb(212 168 67 / 20%);
      }
      `,
      `<span class="badge badge--${variant}"><slot></slot></span>`
    );
  }
}

customElements.define('sol-badge', SolBadge);
