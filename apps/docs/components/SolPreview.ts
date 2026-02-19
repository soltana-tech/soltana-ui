import soltanaCSS from '@soltana/styles/index.scss?inline';

const BODY_CSS = `
body {
  margin: 0;
  padding: 1.5rem;
  background: var(--surface-bg);
  color: var(--text-primary);
}`;

const TIERS = ['theme', 'relief', 'finish'] as const;

export class SolPreview extends HTMLElement {
  static observedAttributes = ['theme', 'relief', 'finish', 'auto-height'];

  private _content = '';
  private _iframe: HTMLIFrameElement;
  private _loaded = false;

  constructor() {
    super();
    this._iframe = document.createElement('iframe');
    this._iframe.style.border = 'none';
    this._iframe.style.width = '100%';
    this._iframe.setAttribute('scrolling', 'no');
  }

  get frame(): HTMLIFrameElement {
    return this._iframe;
  }

  get content(): string {
    return this._content;
  }

  set content(html: string) {
    this._content = html;
    if (this._loaded) {
      const preview = this._iframe.contentDocument?.querySelector('.sol-preview__body');
      if (preview) {
        preview.innerHTML = html;
        this.syncHeight();
        return;
      }
    }
    this._iframe.srcdoc = this.buildSrcdoc();
  }

  setTier(tier: string, value: string | null): void {
    if (value) {
      this.setAttribute(tier, value);
    } else {
      this.removeAttribute(tier);
    }
  }

  /** Sync iframe height to its content. */
  syncHeight(): void {
    const doc = this._iframe.contentDocument;
    if (!doc) return;
    const height = doc.documentElement.scrollHeight;
    if (height > 0) {
      this._iframe.style.height = `${String(height)}px`;
    }
  }

  connectedCallback(): void {
    this.appendChild(this._iframe);
    this._iframe.srcdoc = this.buildSrcdoc();

    this._iframe.addEventListener('load', () => {
      this._loaded = true;
      this.syncTierAttributes();
      this.syncHeight();
    });
  }

  attributeChangedCallback(): void {
    if (this._loaded) {
      this.syncTierAttributes();
    } else {
      this._iframe.srcdoc = this.buildSrcdoc();
    }
  }

  private buildSrcdoc(): string {
    const attrs = TIERS.map((tier) => {
      const value = this.getAttribute(tier);
      return value ? `data-${tier}="${value}"` : '';
    })
      .filter(Boolean)
      .join(' ');

    return [
      '<!DOCTYPE html>',
      `<html ${attrs}>`,
      '<head>',
      `<style>${soltanaCSS}</style>`,
      `<style>${BODY_CSS}</style>`,
      '</head>',
      `<body><div class="sol-preview__body">${this._content}</div></body>`,
      '</html>',
    ].join('\n');
  }

  private syncTierAttributes(): void {
    const doc = this._iframe.contentDocument;
    if (!doc) return;

    for (const tier of TIERS) {
      const value = this.getAttribute(tier);
      if (value) {
        doc.documentElement.setAttribute(`data-${tier}`, value);
      } else {
        doc.documentElement.removeAttribute(`data-${tier}`);
      }
    }
  }
}

customElements.define('sol-preview', SolPreview);
