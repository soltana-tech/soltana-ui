interface ViewportPreset {
  label: string;
  width: string | null; // null = full width (no constraint)
}

const PRESETS: ViewportPreset[] = [
  { label: 'Mobile', width: '375px' },
  { label: 'Tablet', width: '768px' },
  { label: 'Desktop', width: '1024px' },
  { label: 'Full', width: null },
];

/**
 * Viewport width selector for the Sandbox preview.
 * Sets `max-width` on the target element — CSS-only, no iframes.
 */
export class ResponsiveFrame {
  private target: HTMLElement;
  private element: HTMLElement;

  constructor(target: HTMLElement) {
    this.target = target;
    this.element = this.build();
    this.bind();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  private build(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'sandbox__tier-group';

    const buttons = PRESETS.map(
      (p) =>
        `<button class="segmented-control__option${p.width === null ? ' active' : ''}" data-viewport="${p.width ?? ''}">${p.label}</button>`
    ).join('');

    el.innerHTML = `
      <span class="sandbox__tier-label">Viewport</span>
      <div class="segmented-control segmented-control-sm">${buttons}</div>
    `;

    return el;
  }

  private bind(): void {
    this.element.querySelectorAll<HTMLButtonElement>('[data-viewport]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const width = btn.dataset.viewport ?? null;
        this.target.style.maxWidth = width ?? '';

        this.element.querySelectorAll('.segmented-control__option').forEach((b) => {
          b.classList.toggle('active', b === btn);
        });
      });
    });
  }
}
