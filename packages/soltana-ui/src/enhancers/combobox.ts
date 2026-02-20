// ---------------------------------------------------------------------------
// Combobox / Autocomplete Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-combobox] elements.
// Text input with filterable dropdown list.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';
import { onClickAway } from './utils/click-away.js';
import { handleKeyboardNav } from './utils/keyboard-nav.js';

export const COMBOBOX_SELECTOR = '[data-sol-combobox]';

/** Singleton guard — aborted and replaced on each `init*()` call. */
let _controller: AbortController | null = null;

function getOptionText(el: HTMLElement): string {
  return (el.getAttribute('data-value') ?? el.textContent ?? '').toLowerCase(); // eslint-disable-line @typescript-eslint/no-unnecessary-condition -- getAttribute returns string | null
}

/**
 * Enhance all `[data-sol-combobox]` elements with filtering, keyboard
 * navigation, and ARIA combobox behavior.
 *
 * Expected structure:
 * ```html
 * <div data-sol-combobox class="combobox">
 *   <input class="combobox-input input" role="combobox" />
 *   <ul class="combobox-listbox" role="listbox">
 *     <li class="combobox-option" role="option">Option 1</li>
 *   </ul>
 * </div>
 * ```
 */
export function initComboboxes(options?: EnhancerOptions): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  const { signal } = _controller;

  const root = options?.root ?? document;
  root.querySelectorAll<HTMLElement>(options?.selector ?? COMBOBOX_SELECTOR).forEach((wrapper) => {
    const inputEl = wrapper.querySelector<HTMLInputElement>('.combobox-input');
    const listboxEl = wrapper.querySelector<HTMLElement>('.combobox-listbox');
    if (!inputEl || !listboxEl) return;

    // Capture as non-null for use in closures
    const input: HTMLInputElement = inputEl;
    const listbox: HTMLElement = listboxEl;
    const allOptions = Array.from(listbox.querySelectorAll<HTMLElement>('.combobox-option'));
    const emptyEl = listbox.querySelector<HTMLElement>('.combobox-empty');

    // ARIA setup
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-autocomplete', 'list');
    if (!listbox.id) {
      listbox.id = `sol-combobox-list-${Math.random().toString(36).slice(2, 7)}`;
    }
    input.setAttribute('aria-controls', listbox.id);
    listbox.setAttribute('role', 'listbox');

    allOptions.forEach((opt) => {
      opt.setAttribute('role', 'option');
      opt.setAttribute('tabindex', '-1');
    });

    function openListbox(): void {
      listbox.classList.add('active');
      input.setAttribute('aria-expanded', 'true');
    }

    function closeListbox(): void {
      listbox.classList.remove('active');
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      allOptions.forEach((opt) => {
        opt.classList.remove('active');
      });
    }

    function filterOptions(query: string): void {
      const q = query.toLowerCase();
      let visibleCount = 0;

      allOptions.forEach((opt) => {
        const text = getOptionText(opt);
        const matches = q === '' || text.includes(q);
        opt.hidden = !matches;
        opt.classList.remove('active');
        if (matches) visibleCount++;
      });

      if (emptyEl) {
        emptyEl.hidden = visibleCount > 0 || q === '';
      }
    }

    function selectOption(opt: HTMLElement): void {
      const value = opt.getAttribute('data-value') ?? opt.textContent.trim();
      input.value = value;
      allOptions.forEach((o) => {
        o.classList.remove('selected');
      });
      opt.classList.add('selected');
      opt.setAttribute('aria-selected', 'true');
      closeListbox();
      input.focus();
    }

    // Input events
    input.addEventListener(
      'input',
      () => {
        filterOptions(input.value);
        if (!listbox.classList.contains('active')) {
          openListbox();
        }
      },
      { signal }
    );

    input.addEventListener(
      'focus',
      () => {
        filterOptions(input.value);
        openListbox();
      },
      { signal }
    );

    // Option click
    allOptions.forEach((opt) => {
      opt.addEventListener(
        'click',
        () => {
          selectOption(opt);
        },
        { signal }
      );
    });

    // Click-away
    onClickAway(
      wrapper,
      () => {
        if (listbox.classList.contains('active')) {
          closeListbox();
        }
      },
      signal
    );

    // Keyboard navigation
    wrapper.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        const isOpen = listbox.classList.contains('active');

        if (e.key === 'Escape' && isOpen) {
          e.preventDefault();
          closeListbox();
          input.focus();
          return;
        }

        if (e.key === 'ArrowDown' && !isOpen) {
          e.preventDefault();
          openListbox();
          return;
        }

        if (isOpen) {
          handleKeyboardNav(
            {
              container: listbox,
              itemSelector: '.combobox-option:not([hidden])',
              orientation: 'vertical',
              onActivate: selectOption,
            },
            e
          );
        }
      },
      { signal }
    );
  });

  return {
    destroy() {
      _controller?.abort();
      _controller = null;
    },
  };
}
