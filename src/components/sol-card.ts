import { SoltanaElement } from './base/SoltanaElement.js';

export class SolCard extends SoltanaElement {
  static get observedAttributes(): string[] {
    return ['variant', 'elevation', 'gold-border'];
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }

  protected render(): void {
    const variant = this.getAttribute('variant') ?? 'default';
    const elevation = this.getAttribute('elevation') ?? 'raised';
    const goldBorder = this.hasAttribute('gold-border');

    this.setContent(
      `
      :host {
        display: block;
      }
      .card {
        position: relative;
        padding: 1.618rem;
        border-radius: var(--radius-xl);
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        transition: transform var(--transition-slow) ease,
                    box-shadow var(--transition-slow) ease;
        overflow: hidden;
      }
      .card:hover {
        transform: translateY(-2px);
      }

      /* Neumorphic elevations */
      .card--raised {
        box-shadow:
          4px 4px 12px var(--neuro-shadow-dark),
          -4px -4px 12px var(--neuro-shadow-light);
      }
      .card--raised:hover {
        box-shadow:
          6px 6px 20px var(--neuro-shadow-dark),
          -6px -6px 20px var(--neuro-shadow-light);
      }
      .card--floating {
        box-shadow:
          8px 8px 28px var(--neuro-shadow-dark),
          -8px -8px 28px var(--neuro-shadow-light);
      }
      .card--floating:hover {
        box-shadow:
          10px 10px 36px var(--neuro-shadow-dark),
          -10px -10px 36px var(--neuro-shadow-light);
      }
      .card--flat {
        box-shadow: none;
      }

      /* Ornate — four corner brackets */
      .card--ornate {
        border: 1px solid rgb(212 168 67 / 20%);
      }
      .card--ornate .corner {
        position: absolute;
        width: 24px;
        height: 24px;
        border-color: var(--accent-gold, var(--gold-400, #d4a843));
        border-style: solid;
        opacity: 0.5;
        pointer-events: none;
      }
      .corner--tl { top: 8px; left: 8px; border-width: 2px 0 0 2px; }
      .corner--tr { top: 8px; right: 8px; border-width: 2px 2px 0 0; }
      .corner--bl { bottom: 8px; left: 8px; border-width: 0 0 2px 2px; }
      .corner--br { bottom: 8px; right: 8px; border-width: 0 2px 2px 0; }

      /* Baroque — full ornamental frame with medallion top */
      .card--baroque {
        border-radius: var(--radius-sm);
        border: 3px solid var(--accent-gold, var(--gold-400, #d4a843));
        overflow: visible;
        padding: 1.75rem;
        box-shadow:
          5px 5px 16px var(--neuro-shadow-dark),
          -5px -5px 16px var(--neuro-shadow-light),
          inset 2px 2px 8px var(--neuro-shadow-mid),
          inset -2px -2px 8px var(--neuro-highlight);
      }
      .card--baroque .frame {
        position: absolute;
        inset: 5px;
        border: 1px solid rgb(212 168 67 / 25%);
        pointer-events: none;
      }
      .card--baroque .medallion {
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        width: 24px;
        height: 24px;
        border-radius: 9999px;
        border: 2px solid var(--accent-gold, var(--gold-400, #d4a843));
        background: var(--surface-1);
        box-shadow:
          0 0 8px rgb(212 168 67 / 20%),
          inset 0 0 4px rgb(212 168 67 / 10%);
        pointer-events: none;
      }
      .card--baroque .corner {
        position: absolute;
        width: 14px;
        height: 14px;
        border-color: var(--accent-gold, var(--gold-400, #d4a843));
        border-style: solid;
        opacity: 0.5;
        pointer-events: none;
      }

      /* Carved — stone-cut frame with raised rim */
      .card--carved {
        border-radius: var(--radius-lg);
        border: 3px solid var(--border-strong);
        background: var(--surface-2);
        box-shadow:
          6px 6px 18px var(--neuro-shadow-dark),
          -6px -6px 18px var(--neuro-shadow-light),
          inset 3px 3px 8px var(--neuro-shadow-dark),
          inset -3px -3px 8px var(--neuro-shadow-light);
      }
      .card--carved .chisel-highlight {
        position: absolute;
        inset: -1px;
        border-radius: inherit;
        border: 1px solid rgb(255 255 255 / 12%);
        border-bottom-color: rgb(0 0 0 / 10%);
        border-right-color: rgb(0 0 0 / 10%);
        pointer-events: none;
      }
      .card--carved .rosette {
        position: absolute;
        top: -6px;
        left: -6px;
        width: 12px;
        height: 12px;
        border-radius: 9999px;
        background: var(--surface-3);
        border: 2px solid var(--border-strong);
        box-shadow:
          inset 1px 1px 2px var(--neuro-shadow-dark),
          inset -1px -1px 2px var(--neuro-shadow-light);
        pointer-events: none;
      }

      /* Stained glass variant */
      .card--stained-glass {
        border-radius: var(--radius-lg);
        border: 2px solid rgb(40 35 30 / 45%);
        background: linear-gradient(
          135deg,
          var(--stained-primary, rgb(212 168 67 / 12%)),
          var(--stained-secondary, rgb(168 85 247 / 8%)),
          var(--stained-accent, rgb(16 185 129 / 8%))
        );
        -webkit-backdrop-filter: blur(28px) saturate(160%);
        backdrop-filter: blur(28px) saturate(160%);
        box-shadow:
          4px 4px 12px var(--neuro-shadow-dark),
          -4px -4px 12px var(--neuro-shadow-light),
          inset 0 0 20px rgb(255 255 255 / 5%);
      }
      .card--stained-glass .lead-frame {
        position: absolute;
        inset: 6px;
        border: 1px solid rgb(40 35 30 / 20%);
        border-radius: calc(var(--radius-lg) - 4px);
        pointer-events: none;
      }

      .card--marble {
        background-color: var(--surface-2);
        background-image:
          radial-gradient(ellipse at 20% 50%, rgb(200 195 180 / 20%) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgb(180 175 160 / 15%) 0%, transparent 40%),
          linear-gradient(160deg, rgb(255 255 255 / 5%) 0%, transparent 50%);
      }

      .card--glass {
        background: var(--glass-bg);
        -webkit-backdrop-filter: blur(16px) saturate(1.4);
        backdrop-filter: blur(16px) saturate(1.4);
        border: 1px solid var(--glass-border);
      }

      /* Gold border */
      .card--gold-border {
        border: 2px solid transparent;
        background-clip: padding-box;
      }
      .card--gold-border::before {
        content: '';
        position: absolute;
        inset: -2px;
        z-index: -1;
        border-radius: inherit;
        background: var(--gold-gradient);
      }

      /* Slots */
      ::slotted([slot="header"]) {
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--border-subtle);
        font-family: var(--font-serif);
        font-weight: var(--font-semibold);
        letter-spacing: var(--tracking-elegant);
      }
      ::slotted([slot="footer"]) {
        margin-top: 1rem;
        padding-top: 0.75rem;
        border-top: 1px solid var(--border-subtle);
      }
      `,
      this._buildMarkup(variant, elevation, goldBorder)
    );
  }

  private _buildMarkup(variant: string, elevation: string, goldBorder: boolean): string {
    const classes = `card card--${variant} card--${elevation} ${goldBorder ? 'card--gold-border' : ''}`;

    let innerMarkup = '';

    if (variant === 'ornate') {
      innerMarkup = `
        <span class="corner corner--tl"></span>
        <span class="corner corner--tr"></span>
        <span class="corner corner--bl"></span>
        <span class="corner corner--br"></span>`;
    } else if (variant === 'baroque') {
      innerMarkup = `
        <span class="frame"></span>
        <span class="medallion"></span>
        <span class="corner corner--tl"></span>
        <span class="corner corner--tr"></span>
        <span class="corner corner--bl"></span>
        <span class="corner corner--br"></span>`;
    } else if (variant === 'carved') {
      innerMarkup = `
        <span class="chisel-highlight"></span>
        <span class="rosette"></span>`;
    } else if (variant === 'stained-glass') {
      innerMarkup = `<span class="lead-frame"></span>`;
    }

    return `<div class="${classes}">
      ${innerMarkup}
      <slot name="header"></slot>
      <slot></slot>
      <slot name="footer"></slot>
    </div>`;
  }
}

customElements.define('sol-card', SolCard);
