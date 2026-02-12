import { SoltanaElement } from './base/SoltanaElement.js';

export class SolInput extends SoltanaElement {
  static get observedAttributes(): string[] {
    return [
      'type',
      'placeholder',
      'value',
      'disabled',
      'error',
      'label',
      'help',
      'material',
      'ornament',
    ];
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }

  protected render(): void {
    const type = this.getAttribute('type') ?? 'text';
    const placeholder = this.getAttribute('placeholder') ?? '';
    const value = this.getAttribute('value') ?? '';
    const disabled = this.hasAttribute('disabled');
    const error = this.getAttribute('error') ?? '';
    const label = this.getAttribute('label') ?? '';
    const help = this.getAttribute('help') ?? '';
    const material = this.getMaterial();
    const inputId = `sol-input-${Math.random().toString(36).slice(2, 9)}`;

    const materialClass = material !== 'neuro' ? `field__input--${material}` : '';

    this.setContent(
      `
      :host {
        display: block;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      .field__label {
        font-family: var(--font-sans);
        font-size: 0.85rem;
        font-weight: var(--font-medium);
        color: var(--text-secondary);
        letter-spacing: var(--tracking-elegant);
      }
      .field__input-wrap {
        position: relative;
      }
      .field__input {
        width: 100%;
        padding: 0.625rem 0.875rem;
        font-family: var(--font-sans);
        font-size: 0.9rem;
        color: var(--text-primary);
        background: var(--input-bg);
        border: 1px solid var(--input-border);
        border-radius: var(--radius-default);
        outline: none;
        transition: all var(--transition-normal) ease;
        letter-spacing: var(--tracking-refined);
        box-sizing: border-box;
      }
      .field__input::placeholder {
        color: var(--input-placeholder);
      }
      .field__input:focus {
        border-color: var(--input-border-focus);
        box-shadow: 0 0 0 3px rgb(212 168 67 / 15%);
      }
      /* Gold underline on focus */
      .field__input-wrap::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background: var(--gold-gradient);
        transition: all var(--transition-slow) ease;
        transform: translateX(-50%);
        border-radius: 1px;
      }
      .field__input:focus ~ .field__underline,
      .field__input-wrap:focus-within::after {
        width: 100%;
      }
      .field__input--error {
        border-color: var(--jewel-ruby, #ef4444);
      }
      .field__input--error:focus {
        box-shadow: 0 0 0 3px rgb(239 68 68 / 15%);
      }
      .field__input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .field__help {
        font-size: 0.8rem;
        color: var(--text-muted);
      }
      .field__error {
        font-size: 0.8rem;
        color: var(--jewel-ruby, #ef4444);
      }

      /* Material variants */
      .field__input--glass {
        background: var(--glass-bg);
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        border: 1px solid var(--glass-border);
        box-shadow: none;
      }
      .field__input--glass:focus {
        box-shadow:
          0 0 0 3px var(--state-focus-ring),
          inset 0 1px 0 var(--glass-inner-glow);
      }

      .field__input--hybrid {
        background: linear-gradient(145deg, var(--glass-gradient-end), var(--glass-gradient-start));
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        border: 1px solid var(--glass-border);
        box-shadow:
          inset 2px 2px 6px var(--neuro-shadow-dark),
          inset -2px -2px 6px var(--neuro-shadow-light);
      }
      .field__input--hybrid:focus {
        box-shadow:
          inset 2px 2px 6px var(--neuro-shadow-dark),
          inset -2px -2px 6px var(--neuro-shadow-light),
          0 0 0 3px var(--state-focus-ring);
      }
      `,
      `<div class="field">
        ${label ? `<label class="field__label" for="${inputId}">${label}</label>` : ''}
        <div class="field__input-wrap">
          <input
            class="field__input ${materialClass} ${error ? 'field__input--error' : ''}"
            id="${inputId}"
            type="${type}"
            placeholder="${placeholder}"
            value="${value}"
            ${disabled ? 'disabled' : ''}
            ${error ? `aria-invalid="true" aria-describedby="${inputId}-error"` : ''}
          />
        </div>
        ${error ? `<span class="field__error" id="${inputId}-error">${error}</span>` : ''}
        ${help && !error ? `<span class="field__help">${help}</span>` : ''}
      </div>`
    );

    // Forward input events
    const input = this.shadow.querySelector('input');
    input?.addEventListener('input', (e) => {
      this.dispatchEvent(
        new CustomEvent('sol-input', {
          detail: { value: (e.target as HTMLInputElement).value },
          bubbles: true,
        })
      );
    });
  }
}

customElements.define('sol-input', SolInput);
