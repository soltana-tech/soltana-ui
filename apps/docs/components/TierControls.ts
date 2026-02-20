import { VALID_THEMES, VALID_RELIEFS, VALID_FINISHES } from 'soltana-ui';
import type { TierName } from 'soltana-ui';
import type { SandboxState } from '../lib/sandbox-state';

type StateChangeHandler = (state: SandboxState) => void;

const TIER_VALUES: Record<TierName, readonly string[]> = {
  theme: VALID_THEMES,
  relief: VALID_RELIEFS,
  finish: VALID_FINISHES,
};

const TIER_LABELS: Record<TierName, string> = {
  theme: 'Theme',
  relief: 'Relief',
  finish: 'Finish',
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Reusable tier segmented controls for theme, relief, and finish.
 * Renders segmented control groups using design system utility classes
 * and emits state changes via callback.
 */
export class TierControls {
  private state: SandboxState;
  private element: HTMLElement;
  private onChange: StateChangeHandler;
  private tiers: TierName[];

  constructor(
    initial: SandboxState,
    onChange: StateChangeHandler,
    tiers: TierName[] = ['theme', 'relief', 'finish']
  ) {
    this.state = { ...initial };
    this.onChange = onChange;
    this.tiers = tiers;
    this.element = this.build();
    this.bind();
    this.updateActiveStates();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getState(): SandboxState {
    return { ...this.state };
  }

  setState(partial: Partial<SandboxState>): void {
    Object.assign(this.state, partial);
    this.updateActiveStates();
  }

  private build(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'flex flex-col gap-5';

    el.innerHTML = this.tiers
      .map((tier) => {
        const values = TIER_VALUES[tier];
        const buttons = values
          .map(
            (value) =>
              `<button class="segmented-control__option" data-tier="${tier}" data-value="${value}" style="flex: 1; text-align: center;">${capitalize(value)}</button>`
          )
          .join('');

        return `
        <div class="flex flex-col gap-2" data-tier-group="${tier}">
          <span class="text-sm font-bold text-secondary" style="text-transform: uppercase; letter-spacing: var(--tracking-display);">${TIER_LABELS[tier]}</span>
          <div class="segmented-control" style="display: flex; width: 100%;">
            ${buttons}
          </div>
        </div>`;
      })
      .join('');

    return el;
  }

  private bind(): void {
    this.element.querySelectorAll<HTMLButtonElement>('[data-tier]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tier = btn.dataset.tier as TierName;
        const value = btn.dataset.value ?? null;
        this.state[tier] = value;
        this.updateActiveStates();
        this.onChange(this.getState());
      });
    });
  }

  private updateActiveStates(): void {
    this.element.querySelectorAll<HTMLButtonElement>('[data-tier]').forEach((btn) => {
      const tier = btn.dataset.tier as TierName;
      const value = btn.dataset.value ?? null;
      btn.classList.toggle('active', this.state[tier] === value);
    });
  }
}
