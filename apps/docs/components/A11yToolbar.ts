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
    el.className = 'a11y-toolbar';
    el.innerHTML = `
      <span class="a11y-toolbar__label">Accessibility</span>
      <div class="a11y-toolbar__controls">
        <button class="a11y-toolbar__toggle" data-a11y="high-contrast" title="Simulate high contrast">
          High Contrast
        </button>
        <button class="a11y-toolbar__toggle" data-a11y="reduced-motion" title="Simulate reduced motion">
          Reduced Motion
        </button>
        <button class="a11y-toolbar__toggle" data-a11y="focus-visible" title="Force focus indicators">
          Focus Visible
        </button>
        <label class="a11y-toolbar__range">
          <span class="text-xs">Font Size</span>
          <input type="range" min="75" max="200" value="100" data-a11y-scale />
          <span class="a11y-toolbar__range-value">100%</span>
        </label>
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
          // Filter applies to the outer iframe element
          const active = this.target.classList.toggle(cls);
          btn.classList.toggle('a11y-toolbar__toggle--active', active);
        } else if (this.iframeDoc) {
          // reduced-motion / focus-visible toggle inside iframe <html>
          const active = this.iframeDoc.documentElement.classList.toggle(cls);
          btn.classList.toggle('a11y-toolbar__toggle--active', active);
        } else {
          // Fallback: toggle on outer target (non-iframe context)
          const active = this.target.classList.toggle(cls);
          btn.classList.toggle('a11y-toolbar__toggle--active', active);
        }
      });
    });

    // Font size slider — always targets the outer iframe element
    const slider = this.element.querySelector<HTMLInputElement>('[data-a11y-scale]');
    const valueDisplay = this.element.querySelector('.a11y-toolbar__range-value');
    slider?.addEventListener('input', () => {
      const scale = Number(slider.value) / 100;
      this.target.style.fontSize = `${String(scale)}em`;
      if (valueDisplay) valueDisplay.textContent = `${slider.value}%`;
    });
  }
}
