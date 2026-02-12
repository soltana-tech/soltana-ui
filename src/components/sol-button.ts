import { SoltanaElement } from './base/SoltanaElement.js';

export class SolButton extends SoltanaElement {
  static get observedAttributes(): string[] {
    return ['variant', 'size', 'disabled', 'material', 'ornament'];
  }

  constructor() {
    super();
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
  }

  attributeChangedCallback(): void {
    if (this.hasAttribute('disabled')) {
      this.setAttribute('aria-disabled', 'true');
      this.setAttribute('tabindex', '-1');
    } else {
      this.removeAttribute('aria-disabled');
      this.setAttribute('tabindex', '0');
    }
    if (this.isConnected) this.render();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick);
    this.addEventListener('keydown', this._handleKeydown);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._handleKeydown);
  }

  private _handleClick = (e: Event): void => {
    if (this.hasAttribute('disabled')) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  private _handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!this.hasAttribute('disabled')) {
        this.click();
      }
    }
  };

  protected render(): void {
    const variant = this.getAttribute('variant') ?? 'primary';
    const size = this.getAttribute('size') ?? 'md';
    const disabled = this.hasAttribute('disabled');

    this.setContent(
      `
      :host {
        display: inline-block;
      }
      @keyframes metal-shine {
        0% { transform: translateX(-100%) skewX(-15deg); }
        100% { transform: translateX(200%) skewX(-15deg); }
      }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-default);
        background: var(--neuro-bg);
        color: var(--text-primary);
        cursor: pointer;
        font-family: var(--font-sans);
        font-weight: var(--font-semibold);
        letter-spacing: var(--tracking-elegant);
        text-transform: uppercase;
        box-shadow:
          3px 3px 8px var(--neuro-shadow-dark),
          -3px -3px 8px var(--neuro-shadow-light);
        transition: all var(--transition-normal) ease;
        position: relative;
        overflow: hidden;
      }
      .btn:hover:not(.btn--disabled) {
        box-shadow:
          4px 4px 12px var(--neuro-shadow-dark),
          -4px -4px 12px var(--neuro-shadow-light);
        transform: translateY(-1px);
      }
      .btn:active:not(.btn--disabled) {
        transform: scale(0.97);
        box-shadow:
          inset 2px 2px 5px var(--neuro-shadow-dark),
          inset -2px -2px 5px var(--neuro-shadow-light);
      }
      .btn:focus-visible {
        outline: 2px solid var(--accent-primary);
        outline-offset: 3px;
      }

      /* Sizes */
      .btn--xs { padding: 0.375rem 0.75rem; font-size: 0.7rem; }
      .btn--sm { padding: 0.5rem 1rem; font-size: 0.8rem; }
      .btn--md { padding: 0.625rem 1.5rem; font-size: 0.85rem; }
      .btn--lg { padding: 0.75rem 2rem; font-size: 0.9rem; }
      .btn--xl { padding: 1rem 2.5rem; font-size: 1rem; }

      /* Color variants */
      .btn--primary {
        background: linear-gradient(145deg, var(--accent-primary), var(--accent-primary-active));
        color: var(--text-inverse);
        border-color: transparent;
        box-shadow:
          3px 3px 10px var(--neuro-shadow-dark),
          -2px -2px 8px var(--neuro-shadow-light),
          inset 0 1px 0 rgb(255 255 255 / 15%);
      }
      .btn--primary:hover:not(.btn--disabled) {
        background: linear-gradient(145deg, var(--accent-primary-hover), var(--accent-primary));
        box-shadow:
          5px 5px 16px var(--neuro-shadow-dark),
          -3px -3px 12px var(--neuro-shadow-light);
      }

      .btn--secondary {
        background: var(--surface-3);
        color: var(--text-primary);
        border: 1px solid var(--border-default);
      }
      .btn--secondary:hover:not(.btn--disabled) {
        background: var(--surface-4);
        border-color: var(--border-strong);
      }

      .btn--ghost {
        background: transparent;
        color: var(--text-secondary);
        border-color: transparent;
        box-shadow: none;
      }
      .btn--ghost:hover:not(.btn--disabled) {
        background: var(--state-hover);
        color: var(--text-primary);
        box-shadow:
          2px 2px 6px var(--neuro-shadow-dark),
          -2px -2px 6px var(--neuro-shadow-light);
      }

      .btn--outline {
        background: transparent;
        color: var(--accent-primary);
        border: 2px solid var(--accent-primary);
        box-shadow: none;
      }
      .btn--outline:hover:not(.btn--disabled) {
        background: var(--state-hover);
        box-shadow:
          3px 3px 8px var(--neuro-shadow-dark),
          -3px -3px 8px var(--neuro-shadow-light);
      }

      .btn--danger {
        background: linear-gradient(145deg, var(--jewel-ruby, #ef4444), var(--jewel-ruby-deep, #991b1b));
        color: #fff;
        border-color: transparent;
      }
      .btn--danger:hover:not(.btn--disabled) {
        box-shadow:
          5px 5px 14px var(--neuro-shadow-dark),
          -3px -3px 10px var(--neuro-shadow-light),
          0 4px 16px rgb(239 68 68 / 30%);
      }

      /* Metallic variants */
      .btn--gold {
        background: var(--gold-gradient);
        color: var(--gold-900, #2c2005);
        border-color: transparent;
        box-shadow:
          3px 3px 10px var(--neuro-shadow-dark),
          -2px -2px 8px var(--neuro-shadow-light),
          0 2px 12px rgb(212 168 67 / 25%);
      }
      .btn--gold .shine {
        position: absolute;
        inset: 0;
        background: linear-gradient(105deg, transparent 40%, rgb(255 255 255 / 25%) 50%, transparent 60%);
        transform: translateX(-100%) skewX(-15deg);
        pointer-events: none;
      }
      .btn--gold:hover:not(.btn--disabled) .shine {
        animation: metal-shine 0.8s ease-in-out;
      }

      .btn--silver {
        background: var(--silver-gradient, linear-gradient(145deg, #d8dde6, #929cb0, #6e7a92, #929cb0, #d8dde6));
        color: var(--silver-900, #252a34);
        border-color: transparent;
        box-shadow:
          3px 3px 10px var(--neuro-shadow-dark),
          -2px -2px 8px var(--neuro-shadow-light),
          0 2px 12px rgb(146 156 176 / 20%);
      }
      .btn--silver .shine {
        position: absolute;
        inset: 0;
        background: linear-gradient(105deg, transparent 40%, rgb(255 255 255 / 35%) 50%, transparent 60%);
        transform: translateX(-100%) skewX(-15deg);
        pointer-events: none;
      }
      .btn--silver:hover:not(.btn--disabled) .shine {
        animation: metal-shine 0.8s ease-in-out;
      }

      .btn--bronze {
        background: var(--bronze-gradient, linear-gradient(145deg, #f0cd9e, #cd8d3a, #a06e2b, #cd8d3a, #f0cd9e));
        color: var(--bronze-900, #2a1b0d);
        border-color: transparent;
        box-shadow:
          3px 3px 10px var(--neuro-shadow-dark),
          -2px -2px 8px var(--neuro-shadow-light),
          0 2px 12px rgb(160 110 43 / 20%);
      }
      .btn--bronze .shine {
        position: absolute;
        inset: 0;
        background: linear-gradient(105deg, transparent 40%, rgb(255 240 210 / 30%) 50%, transparent 60%);
        transform: translateX(-100%) skewX(-15deg);
        pointer-events: none;
      }
      .btn--bronze:hover:not(.btn--disabled) .shine {
        animation: metal-shine 0.8s ease-in-out;
      }

      .btn--platinum {
        background: var(--platinum-gradient, linear-gradient(145deg, #dce1ea, #a8b3c7, #6d7b94, #a8b3c7, #dce1ea));
        color: var(--platinum-900, #2a3040);
        border-color: transparent;
        box-shadow:
          3px 3px 10px var(--neuro-shadow-dark),
          -2px -2px 8px var(--neuro-shadow-light),
          0 2px 12px rgb(109 123 148 / 18%);
      }
      .btn--platinum .shine {
        position: absolute;
        inset: 0;
        background: linear-gradient(105deg, transparent 40%, rgb(255 255 255 / 40%) 50%, transparent 60%);
        transform: translateX(-100%) skewX(-15deg);
        pointer-events: none;
      }
      .btn--platinum:hover:not(.btn--disabled) .shine {
        animation: metal-shine 0.8s ease-in-out;
      }

      .btn--embossed {
        background: var(--surface-3);
        color: var(--accent-primary);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 10%),
          inset 0 -1px 0 rgb(0 0 0 / 15%),
          3px 3px 8px var(--neuro-shadow-dark),
          -3px -3px 8px var(--neuro-shadow-light);
        border: 1px solid var(--border-default);
      }

      /* Structural variants */
      .btn--chiseled {
        border-radius: var(--radius-sm);
        border: 2px solid var(--border-strong);
        background: linear-gradient(175deg, var(--surface-2, #eef0f5) 0%, var(--surface-3, #e2e5ed) 100%);
        box-shadow:
          inset 0 2px 0 var(--neuro-highlight),
          inset 0 -2px 0 var(--neuro-shadow-dark),
          3px 3px 8px var(--neuro-shadow-dark),
          -2px -2px 6px var(--neuro-shadow-light);
        clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px);
      }

      .btn--medallion {
        width: 3.5rem;
        height: 3.5rem;
        padding: 0;
        border-radius: 9999px;
        border: 3px solid var(--accent-primary);
        background: radial-gradient(circle at 35% 35%, var(--surface-1, #fff), var(--surface-3, #e2e5ed));
        box-shadow:
          4px 4px 12px var(--neuro-shadow-dark),
          -4px -4px 12px var(--neuro-shadow-light),
          inset 0 0 8px var(--neuro-shadow-mid);
      }

      .btn--baroque {
        padding: 0.625rem 2rem;
        border-radius: var(--radius-sm);
        border: 2px solid var(--accent-gold, var(--accent-primary));
        background: linear-gradient(145deg, var(--surface-1, #fff), var(--neuro-bg, #e2e5ed));
        box-shadow:
          4px 4px 10px var(--neuro-shadow-dark),
          -3px -3px 8px var(--neuro-shadow-light);
        overflow: visible;
      }
      .btn--baroque .corner-tl,
      .btn--baroque .corner-br {
        position: absolute;
        width: 10px;
        height: 10px;
        border-color: var(--accent-gold, var(--accent-primary));
        border-style: solid;
        opacity: 0.6;
        pointer-events: none;
      }
      .btn--baroque .corner-tl {
        top: -3px;
        left: -3px;
        border-width: 2px 0 0 2px;
      }
      .btn--baroque .corner-br {
        bottom: -3px;
        right: -3px;
        border-width: 0 2px 2px 0;
      }

      .btn--faceted {
        border-radius: 0;
        border: 1px solid var(--accent-primary);
        background: linear-gradient(
          135deg,
          var(--surface-1, #fff) 0%,
          var(--surface-2, #eef0f5) 25%,
          var(--neuro-highlight) 50%,
          var(--surface-2, #eef0f5) 75%,
          var(--surface-1, #fff) 100%
        );
        padding: 0.5rem 2rem;
        clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0 50%);
        box-shadow:
          3px 3px 8px var(--neuro-shadow-dark),
          -2px -2px 6px var(--neuro-shadow-light);
      }

      .btn--disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }
      `,
      this._buildMarkup(variant, size, disabled)
    );
  }

  private _needsShine(variant: string): boolean {
    return ['gold', 'silver', 'bronze', 'platinum'].includes(variant);
  }

  private _needsBaroqueCorners(variant: string): boolean {
    return variant === 'baroque';
  }

  private _buildMarkup(variant: string, size: string, disabled: boolean): string {
    const cls = `btn btn--${variant} btn--${size} ${disabled ? 'btn--disabled' : ''}`;
    let inner = '<slot></slot>';
    if (this._needsShine(variant)) {
      inner = `<span class="shine"></span><slot></slot>`;
    }
    if (this._needsBaroqueCorners(variant)) {
      inner = `<span class="corner-tl"></span><span class="corner-br"></span><slot></slot>`;
    }
    return `<span class="${cls}">${inner}</span>`;
  }
}

customElements.define('sol-button', SolButton);
