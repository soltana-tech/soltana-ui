/**
 * Accessibility simulation toolbar for the Sandbox.
 * Toggles class-based overrides on the preview frame to simulate
 * user accessibility preferences without affecting the global page.
 *
 * When targeting an iframe preview, `iframeDoc` is provided so that
 * reduced-motion and focus-visible classes toggle on the iframe's
 * `<html>` element (where descendant selectors can reach). High-contrast
 * filter and font-size still apply to the outer iframe element (`target`).
 */
export class A11yToolbar {
  private target: HTMLElement;
  private iframeDoc: Document | null;
  private element: HTMLElement;

  constructor(target: HTMLElement, iframeDoc?: Document) {
    this.target = target;
    this.iframeDoc = iframeDoc ?? null;
    this.element = this.build();
    this.bind();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  /** Update the iframe document reference (e.g. after srcdoc rewrite). */
  setIframeDoc(doc: Document): void {
    this.iframeDoc = doc;
  }

  private build(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'sandbox__tier-group';
    el.innerHTML = `
      <span class="sandbox__tier-label">Accessibility</span>
      <div class="flex flex-wrap items-center gap-2">
        <div class="segmented-control segmented-control-sm">
          <button class="segmented-control__option" data-a11y="high-contrast">High Contrast</button>
          <button class="segmented-control__option" data-a11y="reduced-motion">Reduced Motion</button>
          <button class="segmented-control__option" data-a11y="focus-visible">Focus Visible</button>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-secondary">Font Size</span>
          <input type="range" class="range range-sm" min="75" max="200" value="100" data-a11y-scale style="width: 6rem;" />
          <span class="text-xs text-secondary" data-a11y-scale-value>100%</span>
        </div>
      </div>
    `;
    return el;
  }

  private bind(): void {
    this.element.querySelectorAll<HTMLButtonElement>('[data-a11y]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.a11y;
        if (!mode) return;

        const cls = `a11y-${mode}`;

        if (mode === 'high-contrast') {
          const active = this.target.classList.toggle(cls);
          btn.classList.toggle('active', active);
        } else if (this.iframeDoc) {
          const active = this.iframeDoc.documentElement.classList.toggle(cls);
          btn.classList.toggle('active', active);
        } else {
          const active = this.target.classList.toggle(cls);
          btn.classList.toggle('active', active);
        }
      });
    });

    const slider = this.element.querySelector<HTMLInputElement>('[data-a11y-scale]');
    const valueDisplay = this.element.querySelector('[data-a11y-scale-value]');
    slider?.addEventListener('input', () => {
      const pct = Number(slider.value);
      const pctStr = String(pct);
      // Apply to iframe body if available, otherwise to target
      if (this.iframeDoc) {
        this.iframeDoc.documentElement.style.fontSize = `${pctStr}%`;
      } else {
        this.target.style.fontSize = `${String(pct / 100)}em`;
      }
      if (valueDisplay) valueDisplay.textContent = `${pctStr}%`;
    });
  }
}
