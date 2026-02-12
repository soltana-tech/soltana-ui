import { SoltanaElement } from './base/SoltanaElement.js';

export class SolPanel extends SoltanaElement {
  static get observedAttributes(): string[] {
    return ['columns', 'variant'];
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }

  protected render(): void {
    const hasColumns = this.hasAttribute('columns');
    const variant = this.getAttribute('variant') ?? 'default';

    this.setContent(
      `
      :host {
        display: block;
      }
      .panel {
        position: relative;
        border-radius: var(--radius-lg);
        overflow: hidden;
      }
      .panel--default {
        background: var(--surface-1);
        border: 1px solid var(--border-default);
      }
      .panel--marble {
        background-color: var(--surface-2);
        background-image:
          radial-gradient(ellipse at 20% 50%, rgb(200 195 180 / 20%) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgb(180 175 160 / 15%) 0%, transparent 40%);
        border: 1px solid var(--border-default);
      }
      .panel--glass {
        background: var(--glass-bg);
        backdrop-filter: blur(16px) saturate(1.4);
        -webkit-backdrop-filter: blur(16px) saturate(1.4);
        border: 1px solid var(--glass-border);
      }
      .panel--columns {
        border-left: 3px solid rgb(212 168 67 / 20%);
        border-right: 3px solid rgb(212 168 67 / 20%);
      }
      .panel__body {
        padding: 1.618rem;
      }
      ::slotted([slot="header"]) {
        display: block;
        padding: 1rem 1.618rem;
        font-family: var(--font-serif);
        font-weight: var(--font-semibold);
        letter-spacing: var(--tracking-elegant);
        border-bottom: 1px solid var(--border-default);
      }
      ::slotted([slot="footer"]) {
        display: block;
        padding: 1rem 1.618rem;
        border-top: 1px solid var(--border-default);
      }
      `,
      `<div class="panel panel--${variant} ${hasColumns ? 'panel--columns' : ''}">
        <slot name="header"></slot>
        <div class="panel__body"><slot></slot></div>
        <slot name="footer"></slot>
      </div>`
    );
  }
}

customElements.define('sol-panel', SolPanel);
