import { SoltanaElement } from './base/SoltanaElement.js';

export class SolTooltip extends SoltanaElement {
  static get observedAttributes(): string[] {
    return ['text', 'position'];
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }

  protected render(): void {
    const text = this.getAttribute('text') ?? '';
    const position = this.getAttribute('position') ?? 'top';
    const tooltipId = `sol-tooltip-${Math.random().toString(36).slice(2, 9)}`;

    const positionStyles: Record<string, string> = {
      top: `bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);`,
      bottom: `top: calc(100% + 8px); left: 50%; transform: translateX(-50%);`,
      left: `right: calc(100% + 8px); top: 50%; transform: translateY(-50%);`,
      right: `left: calc(100% + 8px); top: 50%; transform: translateY(-50%);`,
    };

    const arrowStyles: Record<string, string> = {
      top: `top: 100%; left: 50%; transform: translateX(-50%); border-color: var(--surface-3) transparent transparent;`,
      bottom: `bottom: 100%; left: 50%; transform: translateX(-50%); border-color: transparent transparent var(--surface-3);`,
      left: `left: 100%; top: 50%; transform: translateY(-50%); border-color: transparent transparent transparent var(--surface-3);`,
      right: `right: 100%; top: 50%; transform: translateY(-50%); border-color: transparent var(--surface-3) transparent transparent;`,
    };

    this.setContent(
      `
      :host {
        display: inline-block;
        position: relative;
      }
      .tooltip-trigger {
        display: inline-block;
      }
      .tooltip {
        position: absolute;
        ${positionStyles[position] || positionStyles.top}
        padding: 0.5rem 0.875rem;
        background: var(--surface-3);
        color: var(--text-primary);
        font-size: 0.8rem;
        font-family: var(--font-sans);
        border-radius: var(--radius-md);
        border: 1px solid rgb(212 168 67 / 12%);
        box-shadow: 0 4px 16px rgb(0 0 0 / 20%);
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--transition-normal) ease;
        z-index: 50;
      }
      .tooltip::after {
        content: '';
        position: absolute;
        ${arrowStyles[position] || arrowStyles.top}
        border-style: solid;
        border-width: 5px;
      }
      :host(:hover) .tooltip,
      :host(:focus-within) .tooltip {
        opacity: 1;
      }
      `,
      `<span class="tooltip-trigger" aria-describedby="${tooltipId}">
        <slot></slot>
      </span>
      <span class="tooltip" id="${tooltipId}" role="tooltip">${text}</span>`
    );
  }
}

customElements.define('sol-tooltip', SolTooltip);
