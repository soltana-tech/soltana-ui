import {
  VALID_THEMES,
  VALID_RELIEFS,
  VALID_FINISHES,
  VALID_ORNAMENTS,
} from '@soltana/config/validation';
import type { TierName } from '@soltana/config';
import { PlaygroundControls } from './PlaygroundControls';
import { type SandboxState, createDefaultState, stateToClasses } from '../lib/sandbox-state';
import { VariantMatrix } from './VariantMatrix';
import { A11yToolbar } from './A11yToolbar';
import { ResponsiveFrame } from './ResponsiveFrame';

export interface SandboxConfig {
  id: string;
  renderPreview: (state: SandboxState) => string;
  tiers?: TierName[];
  initialState?: Partial<SandboxState>;
}

type StateChangeHandler = (state: SandboxState) => void;

const TIER_VALUES: Record<TierName, readonly string[]> = {
  theme: VALID_THEMES,
  relief: VALID_RELIEFS,
  finish: VALID_FINISHES,
  ornament: VALID_ORNAMENTS,
};

const TIER_LABELS: Record<TierName, string> = {
  theme: 'Theme',
  relief: 'Relief',
  finish: 'Finish',
  ornament: 'Ornament',
};

const LABEL_OVERRIDES = new Map<string, string>([['neu', 'Neumorphic']]);

function capitalize(s: string): string {
  return LABEL_OVERRIDES.get(s) ?? s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Per-component sandbox with scoped tier controls, preview, code panel, and toolbar.
 *
 * Tier scoping works via the existing utility class system (`.relief-lifted`,
 * `.finish-frosted`, etc.) applied to the preview frame element. Components
 * inside inherit tier tokens through CSS cascade.
 */
export class Sandbox {
  private config: SandboxConfig;
  private state: SandboxState;
  private element: HTMLElement;
  private previewFrame: HTMLElement;
  private codePanel: HTMLElement;
  private playground = new PlaygroundControls();
  private matrixContainer: HTMLElement | null = null;
  private matrixVisible = false;
  private onStateChangeHandlers: StateChangeHandler[] = [];

  constructor(config: SandboxConfig) {
    this.config = config;
    this.state = { ...createDefaultState(), ...config.initialState };
    this.element = this.build();
    this.previewFrame = this.element.querySelector('.sandbox__preview-frame')!;
    this.codePanel = this.element.querySelector('.sandbox__code-panel')!;
    this.insertFrameToolbars();
    this.bindControls();
    this.bindToolbar();
    this.renderPreview();
  }

  /** Get the root DOM element for insertion. */
  getElement(): HTMLElement {
    return this.element;
  }

  /** Get current sandbox state. */
  getState(): SandboxState {
    return { ...this.state };
  }

  /** Update state externally (e.g. from URL params). */
  setState(partial: Partial<SandboxState>): void {
    Object.assign(this.state, partial);
    this.applyTierClasses();
    this.renderPreview();
    this.updateControlStates();
  }

  /** Register a callback for state changes. */
  onStateChange(handler: StateChangeHandler): void {
    this.onStateChangeHandlers.push(handler);
  }

  private build(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'sandbox';
    el.id = `sandbox-${this.config.id}`;

    const tiers = this.config.tiers ?? ['theme', 'relief', 'finish', 'ornament'];

    el.innerHTML = `
      <div class="sandbox__controls">
        ${tiers.map((tier) => this.buildTierGroup(tier)).join('')}
      </div>
      <div class="sandbox__preview-frame">
        <div class="sandbox__preview"></div>
      </div>
      <div class="sandbox__code-panel">
        <pre class="text-sm rounded-lg p-4"><code></code></pre>
      </div>
      <div class="sandbox__toolbar">
        <button class="sandbox__tool" data-action="copy-html" title="Copy HTML">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
          <span>Copy HTML</span>
        </button>
        <button class="sandbox__tool" data-action="copy-classes" title="Copy CSS classes">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 7h10v10H7z"/><path d="M3 3h10v10H3z" opacity="0.5"/></svg>
          <span>Copy Classes</span>
        </button>
        <button class="sandbox__tool" data-action="share" title="Copy shareable URL">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          <span>Share</span>
        </button>
        <button class="sandbox__tool" data-action="matrix" title="Toggle variant matrix">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          <span>Matrix</span>
        </button>
      </div>
    `;

    return el;
  }

  private insertFrameToolbars(): void {
    const responsive = new ResponsiveFrame(this.previewFrame);
    const a11y = new A11yToolbar(this.previewFrame);

    // Insert above the preview frame
    this.previewFrame.before(responsive.getElement(), a11y.getElement());
  }

  private buildTierGroup(tier: TierName): string {
    const values = TIER_VALUES[tier];
    const buttons = values.map((value) => {
      const label = capitalize(value);
      return `<button class="sandbox__tier-btn" data-tier="${tier}" data-value="${value}">${label}</button>`;
    });

    // Add "Inherit" option to reset to global
    const inheritBtn = `<button class="sandbox__tier-btn sandbox__tier-btn--inherit" data-tier="${tier}" data-value="">Inherit</button>`;

    return `
      <div class="sandbox__tier-group" data-tier-group="${tier}">
        <span class="sandbox__tier-label">${TIER_LABELS[tier]}</span>
        <div class="sandbox__tier-options">
          ${inheritBtn}
          ${buttons.join('')}
        </div>
      </div>
    `;
  }

  private bindControls(): void {
    this.element.querySelectorAll<HTMLButtonElement>('.sandbox__tier-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tier = btn.dataset.tier as TierName;
        const value = btn.dataset.value ?? null;
        this.state[tier] = value;
        this.applyTierClasses();
        this.renderPreview();
        this.updateControlStates();
        this.notifyStateChange();
      });
    });
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
    const btn = this.element.querySelector(`[data-action="${action}"] span`);
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = message;
    setTimeout(() => {
      btn.textContent = orig;
    }, 1500);
  }

  private applyTierClasses(): void {
    // Remove all existing tier utility classes
    const prefixes = ['theme-', 'relief-', 'finish-', 'ornament-'];
    const toRemove = [...this.previewFrame.classList].filter((cls) =>
      prefixes.some((p) => cls.startsWith(p))
    );
    this.previewFrame.classList.remove(...toRemove);

    // Apply current state classes
    const classes = stateToClasses(this.state);
    if (classes) {
      this.previewFrame.classList.add(...classes.split(' '));
    }
  }

  private renderPreview(): void {
    const preview = this.previewFrame.querySelector('.sandbox__preview');
    if (!preview) return;

    const html = this.config.renderPreview(this.state);
    preview.innerHTML = html;

    // Bind any inner playground controls (variant selects, toggles, etc.)
    this.playground.bindAll();

    // Update code panel
    this.codePanel.querySelector('code')!.textContent = this.getCleanHtml();
  }

  private updateControlStates(): void {
    this.element.querySelectorAll<HTMLButtonElement>('.sandbox__tier-btn').forEach((btn) => {
      const tier = btn.dataset.tier as TierName;
      const value = btn.dataset.value ?? null;
      btn.classList.toggle('sandbox__tier-btn--active', this.state[tier] === value);
    });
  }

  /** Generate clean HTML for export — strip internal data attributes. */
  private getCleanHtml(): string {
    const preview = this.previewFrame.querySelector('.sandbox__preview');
    if (!preview) return '';

    const clone = preview.cloneNode(true) as HTMLElement;

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
