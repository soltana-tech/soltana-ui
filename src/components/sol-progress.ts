import { SoltanaElement } from './base/SoltanaElement.js';

export class SolProgress extends SoltanaElement {
  static get observedAttributes(): string[] {
    return ['value', 'variant'];
  }

  constructor() {
    super();
    this.setAttribute('role', 'progressbar');
    this.setAttribute('aria-valuemin', '0');
    this.setAttribute('aria-valuemax', '100');
  }

  attributeChangedCallback(): void {
    const value = this.getAttribute('value') ?? '0';
    this.setAttribute('aria-valuenow', value);
    if (this.isConnected) this.render();
  }

  protected render(): void {
    const raw = Number(this.getAttribute('value'));
    const value = Math.min(100, Math.max(0, Number.isNaN(raw) ? 0 : raw));
    const variant = this.getAttribute('variant') ?? 'default';

    const fillStyles: Record<string, string> = {
      default: `background: linear-gradient(90deg, var(--gold-500, #b8860b), var(--gold-400, #d4a843), var(--gold-300, #fcd34d));`,
      gold: `background: var(--gold-gradient);`,
      jewel: `background: linear-gradient(90deg, var(--jewel-emerald-deep, #0d6b4e), var(--jewel-sapphire, #3b82f6), var(--jewel-amethyst, #a855f7));`,
    };

    this.setContent(
      `
      :host {
        display: block;
        width: 100%;
      }
      .progress {
        position: relative;
        width: 100%;
        height: 8px;
        background: var(--surface-3);
        border-radius: var(--radius-full);
        overflow: hidden;
        box-shadow: inset 0 1px 3px rgb(0 0 0 / 15%);
      }
      .progress__fill {
        height: 100%;
        border-radius: var(--radius-full);
        ${fillStyles[variant] ?? fillStyles.default}
        transition: width var(--transition-slow) ease;
        position: relative;
      }
      .progress__fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 50%;
        background: linear-gradient(180deg, rgb(255 255 255 / 15%), transparent);
        border-radius: var(--radius-full);
      }
      /* Ornamental track ends */
      .progress::before,
      .progress::after {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--gold-400, #d4a843);
        opacity: 0.4;
        z-index: 1;
      }
      .progress::before { left: 2px; }
      .progress::after { right: 2px; }
      `,
      `<div class="progress">
        <div class="progress__fill" style="width: ${String(value)}%"></div>
      </div>`
    );
  }
}

customElements.define('sol-progress', SolProgress);
