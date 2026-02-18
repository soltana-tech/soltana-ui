/**
 * Binds interactive playground controls to live preview elements.
 * Call `bindAll()` after page content is rendered.
 */
export class PlaygroundControls {
  /**
   * Bind all interactive playground controls within the given root.
   * Defaults to the page document when called outside an iframe context.
   */
  bindAll(root: Document | DocumentFragment = document): void {
    this.bindClassToggles(root);
    this.bindRangeSliders(root);
    this.bindSelectControls(root);
    this.bindCopyButtons(root);
    this.bindModalTriggers(root);
    this.bindToggles(root);
    this.bindColorPickers(root);
  }

  /**
   * Buttons that toggle a CSS class on a target element.
   * Usage: <button data-toggle-class="neu-raised" data-target="#preview-el">
   */
  private bindClassToggles(root: Document | DocumentFragment): void {
    root.querySelectorAll<HTMLButtonElement>('[data-toggle-class]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cls = btn.dataset.toggleClass;
        const targetSel = btn.dataset.target;
        if (!cls || !targetSel) return;
        const target = root.querySelector(targetSel);
        if (!target) return;

        // If part of a radio group, remove class from siblings first
        const group = btn.dataset.toggleGroup;
        if (group) {
          root
            .querySelectorAll<HTMLButtonElement>(`[data-toggle-group="${group}"]`)
            .forEach((sibling) => {
              sibling.classList.remove('active');
              const sibCls = sibling.dataset.toggleClass;
              if (sibCls) target.classList.remove(sibCls);
            });
        }

        target.classList.toggle(cls);
        btn.classList.toggle('active');
      });
    });
  }

  /**
   * Range sliders that update a CSS variable on a target element.
   * Usage: <input type="range" data-css-var="--blur" data-unit="px" data-target="#el">
   */
  private bindRangeSliders(root: Document | DocumentFragment): void {
    root.querySelectorAll<HTMLInputElement>('input[data-css-var]').forEach((input) => {
      const update = () => {
        const cssVar = input.dataset.cssVar;
        const unit = input.dataset.unit ?? '';
        const targetSel = input.dataset.target;
        if (!cssVar || !targetSel) return;
        const target = root.querySelector<HTMLElement>(targetSel);
        if (!target) return;
        target.style.setProperty(cssVar, `${input.value}${unit}`);

        // Update the value display if present
        const display = input.parentElement?.querySelector('.range-value');
        if (display) display.textContent = `${input.value}${unit}`;
      };
      input.addEventListener('input', update);
      update();
    });
  }

  /**
   * Select dropdowns that swap a class on a target element.
   * Removes all option values from the target, then adds the selected one.
   * Usage: <select data-class-swap data-target="#el">
   */
  private bindSelectControls(root: Document | DocumentFragment): void {
    root.querySelectorAll<HTMLSelectElement>('select[data-class-swap]').forEach((select) => {
      // Collect all possible class values from the options
      const optionClasses = [...select.options].map((o) => o.value).filter(Boolean);

      select.addEventListener('change', () => {
        const targetSel = select.dataset.target;
        if (!targetSel) return;
        const target = root.querySelector(targetSel);
        if (!target) return;

        // Remove all option classes from the target
        for (const cls of optionClasses) {
          target.classList.remove(cls);
        }

        if (select.value) {
          target.classList.add(select.value);
        }
      });
    });
  }

  /** Copy-to-clipboard buttons. Usage: <button data-copy="text to copy"> */
  private bindCopyButtons(root: Document | DocumentFragment): void {
    root.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.copy ?? '';
        void navigator.clipboard.writeText(text).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => {
            btn.textContent = orig;
          }, 1500);
        });
      });
    });
  }

  /** Modal open/close triggers. */
  private bindModalTriggers(root: Document | DocumentFragment): void {
    root.querySelectorAll<HTMLButtonElement>('[data-modal-open]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.modalOpen;
        if (!id) return;
        (root as Document).getElementById(id)?.classList.add('active');
      });
    });

    root.querySelectorAll<HTMLButtonElement>('[data-modal-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.modalClose;
        if (!id) return;
        (root as Document).getElementById(id)?.classList.remove('active');
      });
    });

    // Close modal on backdrop click
    root.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.classList.remove('active');
      });
    });
  }

  /** Toggle buttons. */
  private bindToggles(root: Document | DocumentFragment): void {
    root.querySelectorAll('.toggle').forEach((toggle) => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        const isActive = toggle.classList.contains('active');
        toggle.setAttribute('aria-checked', String(isActive));
      });
    });
  }

  /** Color pickers that update a CSS variable. */
  private bindColorPickers(root: Document | DocumentFragment): void {
    root
      .querySelectorAll<HTMLInputElement>('input[type="color"][data-css-var]')
      .forEach((input) => {
        const update = () => {
          const cssVar = input.dataset.cssVar;
          const targetSel = input.dataset.target;
          if (!cssVar) return;
          const target = targetSel
            ? root.querySelector<HTMLElement>(targetSel)
            : (root as Document).documentElement;
          target!.style.setProperty(cssVar, input.value);
        };
        input.addEventListener('input', update);
      });
  }
}
