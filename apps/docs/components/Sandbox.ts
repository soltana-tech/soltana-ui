import type { TierName } from '@soltana/config';
import { PlaygroundControls } from './PlaygroundControls';
import { type SandboxState, createDefaultState, stateToClasses } from '../lib/sandbox-state';
import { VariantMatrix } from './VariantMatrix';
import { A11yToolbar } from './A11yToolbar';
import { ResponsiveFrame } from './ResponsiveFrame';
import { TierControls } from './TierControls';
import type { SolPreview } from './SolPreview';

export interface SandboxConfig {
  id: string;
  renderPreview: (state: SandboxState) => string;
  tiers?: TierName[];
  initialState?: Partial<SandboxState>;
}

type StateChangeHandler = (state: SandboxState) => void;

const TIERS = ['theme', 'relief', 'finish'] as const;

/** A11y simulation CSS injected into the preview iframe. */
const A11Y_CSS = `
.a11y-reduced-motion *,
.a11y-reduced-motion *::before,
.a11y-reduced-motion *::after {
  animation-duration: 0.001ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.001ms !important;
}
.a11y-focus-visible *:focus {
  outline: 2px solid var(--accent-primary) !important;
  outline-offset: 2px !important;
}`;

/**
 * Per-component sandbox with scoped tier controls, preview iframe, code panel, and toolbar.
 *
 * The preview renders inside a `<sol-preview>` custom element that manages
 * an isolated iframe with the Soltana design system CSS. Tier state is applied
 * via attributes on the `<sol-preview>`, giving full isolation from the docs page.
 */
export class Sandbox {
  private config: SandboxConfig;
  private state: SandboxState;
  private element: HTMLElement;
  private preview: SolPreview;
  private codePanel: HTMLElement;
  private tierControls: TierControls;
  private playground = new PlaygroundControls();
  private a11yToolbar!: A11yToolbar;
  private matrixContainer: HTMLElement | null = null;
  private matrixVisible = false;
  private iframeReady = false;
  private onStateChangeHandlers: StateChangeHandler[] = [];

  constructor(config: SandboxConfig) {
    this.config = config;
    // Default each tier to the page-level data-attribute value
    const root = document.documentElement;
    const pageState: SandboxState = {
      theme: root.getAttribute('data-theme'),
      relief: root.getAttribute('data-relief'),
      finish: root.getAttribute('data-finish'),
    };
    this.state = { ...pageState, ...config.initialState };

    this.tierControls = new TierControls(
      this.state,
      (newState) => {
        this.state = { ...newState };
        this.syncPreviewTiers();
        if (this.iframeReady) this.renderPreview();
        this.updateCodePanel();
        this.notifyStateChange();
      },
      config.tiers
    );

    this.element = this.build();
    this.preview = this.element.querySelector<SolPreview>('sol-preview')!;
    this.codePanel = this.element.querySelector('.sandbox__code-panel')!;

    // Mount tier controls
    const controlsMount = this.element.querySelector('.sandbox__controls');
    controlsMount?.appendChild(this.tierControls.getElement());

    this.insertFrameToolbars();
    this.bindToolbar();

    // Set initial content and tier attributes
    this.syncPreviewTiers();
    this.preview.content = this.config.renderPreview(this.state);
    this.updateCodePanel();

    // Once the iframe content is parsed, bind interactive controls inside it
    this.preview.frame.addEventListener('load', () => {
      this.iframeReady = true;
      const doc = this.preview.frame.contentDocument;
      if (!doc) return;
      this.injectA11yCSS(doc);
      this.a11yToolbar.setIframeDoc(doc);
      this.playground.bindAll(doc);
    });
  }

  /** Get the root DOM element for insertion. */
  getElement(): HTMLElement {
    return this.element;
  }

  /** Get current sandbox state. */
  getState(): SandboxState {
    return { ...this.state };
  }

  /** Update state externally (e.g. from URL params or recipe presets). */
  setState(partial: Partial<SandboxState>): void {
    Object.assign(this.state, partial);
    this.syncPreviewTiers();
    if (this.iframeReady) {
      this.renderPreview();
    } else {
      this.preview.content = this.config.renderPreview(this.state);
    }
    this.tierControls.setState(partial);
    this.updateCodePanel();
  }

  /** Register a callback for state changes. */
  onStateChange(handler: StateChangeHandler): void {
    this.onStateChangeHandlers.push(handler);
  }

  private build(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'sandbox';
    el.id = `sandbox-${this.config.id}`;

    el.innerHTML = `
      <div class="sandbox__layout">
        <div class="sandbox__preview-col">
          <sol-preview class="sandbox__preview-frame"></sol-preview>
        </div>
        <div class="flex flex-col gap-4">
          <div class="sandbox__controls"></div>
          <div class="sandbox__code-panel">
            <pre class="text-sm rounded-lg p-4"><code></code></pre>
          </div>
        </div>
      </div>
      <div class="sandbox__toolbar flex flex-wrap gap-2">
        <button class="btn btn-ghost btn-sm" data-action="copy-html" title="Copy HTML">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
          <span>Copy HTML</span>
        </button>
        <button class="btn btn-ghost btn-sm" data-action="copy-classes" title="Copy CSS classes">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 7h10v10H7z"/><path d="M3 3h10v10H3z" opacity="0.5"/></svg>
          <span>Copy Classes</span>
        </button>
        <button class="btn btn-ghost btn-sm" data-action="share" title="Copy shareable URL">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          <span>Share</span>
        </button>
        <button class="btn btn-ghost btn-sm" data-action="matrix" title="Toggle variant matrix">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          <span>Matrix</span>
        </button>
      </div>
    `;

    return el;
  }

  private insertFrameToolbars(): void {
    const responsive = new ResponsiveFrame(this.preview.frame);
    this.a11yToolbar = new A11yToolbar(this.preview.frame);

    // Insert inside the preview column, above the sol-preview element
    const previewCol = this.element.querySelector('.sandbox__preview-col');
    if (previewCol) {
      previewCol.insertBefore(this.a11yToolbar.getElement(), this.preview);
      previewCol.insertBefore(responsive.getElement(), this.a11yToolbar.getElement());
    }
  }

  private bindToolbar(): void {
    this.element.querySelector('[data-action="copy-html"]')?.addEventListener('click', () => {
      const html = this.getCleanHtml();
      void navigator.clipboard.writeText(html).then(() => {
        this.flashToolButton('copy-html', 'Copied!');
      });
    });

    this.element.querySelector('[data-action="copy-classes"]')?.addEventListener('click', () => {
      const classes = stateToClasses(this.state);
      void navigator.clipboard.writeText(classes).then(() => {
        this.flashToolButton('copy-classes', 'Copied!');
      });
    });

    this.element.querySelector('[data-action="share"]')?.addEventListener('click', () => {
      void navigator.clipboard.writeText(location.href).then(() => {
        this.flashToolButton('share', 'Copied!');
      });
    });

    this.element.querySelector('[data-action="matrix"]')?.addEventListener('click', () => {
      this.toggleMatrix();
    });
  }

  private toggleMatrix(): void {
    if (this.matrixVisible && this.matrixContainer) {
      this.matrixContainer.remove();
      this.matrixContainer = null;
      this.matrixVisible = false;
      return;
    }

    const matrix = new VariantMatrix({
      renderCell: () => this.config.renderPreview(createDefaultState()),
      rowAxis: 'relief',
      colAxis: 'finish',
    });

    // Override cells to use per-element utility classes directly
    this.matrixContainer = document.createElement('div');
    this.matrixContainer.className = 'sandbox__matrix';
    this.matrixContainer.appendChild(matrix.getElement());

    // Insert before code panel
    this.codePanel.before(this.matrixContainer);
    this.matrixVisible = true;
  }

  private flashToolButton(action: string, message: string): void {
    const span = this.element.querySelector(`[data-action="${action}"] span`);
    if (!span) return;
    const orig = span.textContent;
    span.textContent = message;
    setTimeout(() => {
      span.textContent = orig;
    }, 1500);
  }

  /** Sync sandbox tier state to the <sol-preview> attributes. */
  private syncPreviewTiers(): void {
    for (const tier of TIERS) {
      const value = this.state[tier] ?? document.documentElement.getAttribute(`data-${tier}`);
      this.preview.setTier(tier, value);
    }
  }

  /** Inject A11y simulation CSS into the iframe document. */
  private injectA11yCSS(doc: Document): void {
    const style = doc.createElement('style');
    style.textContent = A11Y_CSS;
    doc.head.appendChild(style);
  }

  /** Write preview HTML into the iframe and bind interactive controls. */
  private renderPreview(): void {
    const doc = this.preview.frame.contentDocument;
    if (!doc) return;

    const previewEl = doc.querySelector('.sol-preview__body');
    if (!previewEl) return;

    previewEl.innerHTML = this.config.renderPreview(this.state);
    this.playground.bindAll(doc);
    this.updateCodePanel();
  }

  /** Update the code panel with clean exported HTML. */
  private updateCodePanel(): void {
    const codeEl = this.codePanel.querySelector('code');
    if (codeEl) codeEl.textContent = this.getCleanHtml();
  }

  /** Generate clean HTML for export — strip internal data attributes. */
  private getCleanHtml(): string {
    // Use iframe's live DOM if available (captures interactive modifications)
    const doc = this.preview.frame.contentDocument;
    const livePreview = doc?.querySelector('.sol-preview__body');

    let clone: HTMLElement;
    if (livePreview) {
      clone = livePreview.cloneNode(true) as HTMLElement;
    } else {
      // Before iframe loads, generate from the render function
      clone = document.createElement('div');
      clone.innerHTML = this.config.renderPreview(this.state);
    }

    // Strip internal data attributes used by PlaygroundControls
    clone
      .querySelectorAll(
        '[data-toggle-class], [data-css-var], [data-class-swap], [data-copy], [data-modal-open], [data-modal-close]'
      )
      .forEach((el) => {
        el.removeAttribute('data-toggle-class');
        el.removeAttribute('data-toggle-group');
        el.removeAttribute('data-target');
        el.removeAttribute('data-css-var');
        el.removeAttribute('data-unit');
        el.removeAttribute('data-class-swap');
        el.removeAttribute('data-copy');
        el.removeAttribute('data-modal-open');
        el.removeAttribute('data-modal-close');
      });

    return clone.innerHTML.trim();
  }

  private notifyStateChange(): void {
    const snapshot = this.getState();
    for (const handler of this.onStateChangeHandlers) {
      handler(snapshot);
    }
  }
}
