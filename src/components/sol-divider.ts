import { SoltanaElement } from './base/SoltanaElement.js';

export class SolDivider extends SoltanaElement {
  static get observedAttributes(): string[] {
    return ['pattern', 'color'];
  }

  constructor() {
    super();
    this.setAttribute('role', 'separator');
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }

  protected render(): void {
    const pattern = this.getAttribute('pattern') ?? 'simple';
    const color = this.getAttribute('color') ?? 'default';

    const goldColor = '#d4a843';
    const accentColor = color === 'gold' ? goldColor : color === 'accent' ? '#a855f7' : goldColor;
    const opacity = color === 'default' ? '0.4' : '0.6';

    const patternStyles: Record<string, string> = {
      simple: `
        .divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, ${accentColor} 20%, ${accentColor} 80%, transparent);
          opacity: ${opacity};
          position: relative;
        }
        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          width: 8px;
          height: 8px;
          background: ${accentColor};
          border-radius: 1px;
        }
      `,
      'greek-key': `
        .divider {
          height: 24px;
          background-repeat: repeat-x;
          background-position: center;
          background-size: 24px 24px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='${encodeURIComponent(accentColor)}' stroke-width='1.5' d='M0 12h6v6h12v-12h-12v6'/%3E%3C/svg%3E");
          opacity: ${opacity};
        }
      `,
      scrollwork: `
        .divider {
          height: 32px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: 200px 32px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='32' viewBox='0 0 200 32'%3E%3Cpath fill='none' stroke='${encodeURIComponent(accentColor)}' stroke-width='1.5' stroke-linecap='round' d='M10 16c0-8 12-8 12 0s12 8 12 0-12-8-12 0 M56 16c0-8 12-8 12 0s12 8 12 0-12-8-12 0 M100 8l0 16 M122 16c0-8 12-8 12 0s12 8 12 0-12-8-12 0 M166 16c0-8 12-8 12 0s12 8 12 0-12-8-12 0'/%3E%3Ccircle cx='100' cy='16' r='4' fill='${encodeURIComponent(accentColor)}' opacity='0.6'/%3E%3C/svg%3E");
          opacity: ${opacity};
        }
      `,
      dentil: `
        .divider {
          height: 12px;
          background-repeat: repeat-x;
          background-position: center;
          background-size: 16px 12px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='12' viewBox='0 0 16 12'%3E%3Crect x='2' y='2' width='6' height='8' fill='${encodeURIComponent(accentColor)}' opacity='0.5'/%3E%3C/svg%3E");
          opacity: ${opacity};
        }
      `,
      medallion: `
        .divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, ${accentColor} 20%, ${accentColor} 80%, transparent);
          opacity: ${opacity};
          position: relative;
        }
        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid ${accentColor};
          background: var(--surface-bg);
        }
        .divider::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${accentColor};
          opacity: 0.6;
        }
      `,
    };

    this.setContent(
      `
      :host {
        display: block;
        margin: 1rem 0;
      }
      ${patternStyles[pattern] || patternStyles.simple}
      `,
      '<div class="divider"></div>'
    );
  }
}

customElements.define('sol-divider', SolDivider);
