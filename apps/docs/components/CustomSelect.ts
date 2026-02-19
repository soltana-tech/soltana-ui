/**
 * Custom dropdown select built with Soltana .dropdown components.
 * Replaces native <select> for full visual control.
 */

export interface SelectGroup {
  label: string;
  items: SelectItem[];
}

export interface SelectItem {
  value: string;
  label: string;
}

type ChangeHandler = (value: string) => void;

export class CustomSelect {
  private element: HTMLElement;
  private trigger: HTMLButtonElement;
  private menu: HTMLElement;
  private groups: SelectGroup[];
  private selected: string;
  private onChange: ChangeHandler;
  private open = false;
  private ariaLabel: string;
  private outsideClickHandler: (e: MouseEvent) => void;
  private keydownHandler: (e: KeyboardEvent) => void;

  constructor(
    groups: SelectGroup[],
    initial: string,
    onChange: ChangeHandler,
    ariaLabel = 'Select option'
  ) {
    this.groups = groups;
    this.selected = initial;
    this.onChange = onChange;
    this.ariaLabel = ariaLabel;
    this.element = this.build();
    this.trigger = this.element.querySelector('.custom-select__trigger')!;
    this.menu = this.element.querySelector('.custom-select__menu')!;
    this.bind();

    this.outsideClickHandler = (e: MouseEvent) => {
      if (!this.element.contains(e.target as Node)) this.close();
    };
    this.keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') this.close();
    };
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getValue(): string {
    return this.selected;
  }

  setValue(value: string): void {
    this.selected = value;
    this.trigger.querySelector('span')!.textContent = this.findLabel(value);
    this.updateActiveStates();
  }

  private findLabel(value: string): string {
    for (const group of this.groups) {
      for (const item of group.items) {
        if (item.value === value) return item.label;
      }
    }
    return value;
  }

  private build(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'custom-select dropdown';

    const selectedLabel = this.findLabel(this.selected);

    // Trigger button
    el.innerHTML = `
      <button class="custom-select__trigger btn btn-secondary" type="button" aria-label="${this.ariaLabel}" aria-expanded="false" aria-haspopup="listbox">
        <span>${selectedLabel}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; opacity: 0.6;"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
    `;

    // Menu
    const menu = document.createElement('div');
    menu.className = 'custom-select__menu dropdown-menu';
    menu.setAttribute('role', 'listbox');

    for (const group of this.groups) {
      const header = document.createElement('div');
      header.className = 'dropdown-header';
      header.textContent = group.label;
      menu.appendChild(header);

      for (const item of group.items) {
        const btn = document.createElement('button');
        btn.className = 'dropdown-item';
        btn.setAttribute('role', 'option');
        btn.dataset.value = item.value;
        btn.textContent = item.label;
        if (item.value === this.selected) btn.classList.add('active');
        menu.appendChild(btn);
      }
    }

    el.appendChild(menu);
    return el;
  }

  private bind(): void {
    this.element.querySelector('.custom-select__trigger')!.addEventListener('click', () => {
      if (this.open) {
        this.close();
      } else {
        this.openMenu();
      }
    });

    this.element.querySelector('.custom-select__menu')!.addEventListener('click', (e) => {
      const item = (e.target as HTMLElement).closest<HTMLButtonElement>('.dropdown-item');
      if (!item?.dataset.value) return;

      this.selected = item.dataset.value;
      this.trigger.querySelector('span')!.textContent = item.textContent;
      this.updateActiveStates();
      this.close();
      this.onChange(this.selected);
    });
  }

  private openMenu(): void {
    this.open = true;
    this.menu.classList.add('active');
    this.trigger.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', this.outsideClickHandler, true);
    document.addEventListener('keydown', this.keydownHandler);

    // Scroll active item into view
    const active = this.menu.querySelector('.dropdown-item.active');
    if (active) active.scrollIntoView({ block: 'nearest' });
  }

  private close(): void {
    this.open = false;
    this.menu.classList.remove('active');
    this.trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', this.outsideClickHandler, true);
    document.removeEventListener('keydown', this.keydownHandler);
  }

  private updateActiveStates(): void {
    this.menu.querySelectorAll('.dropdown-item').forEach((item) => {
      item.classList.toggle('active', (item as HTMLElement).dataset.value === this.selected);
    });
  }
}
