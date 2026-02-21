// ---------------------------------------------------------------------------
// Date Picker Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-date-picker] elements.
// Calendar-based date selection with full keyboard support and ARIA.
//
// Unlike declarative enhancers that progressively enhance existing markup,
// this module creates DOM elements imperatively.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';
import { onClickAway } from './utils/click-away.js';
import { trapFocus } from './utils/focus-trap.js';

export const DATE_PICKER_SELECTOR = '[data-sol-date-picker]';

/** Singleton guard — aborted and replaced on each `init*()` call. */
let _controller: AbortController | null = null;

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(d: Date): string {
  const y = String(d.getFullYear());
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

interface PickerState {
  viewYear: number;
  viewMonth: number;
  selected: Date | null;
}

function buildCalendarGrid(
  popup: HTMLElement,
  state: PickerState,
  today: Date,
  onSelect: (date: Date) => void
): void {
  let grid = popup.querySelector<HTMLElement>('.date-picker-grid');
  if (!grid) {
    grid = document.createElement('div');
    grid.className = 'date-picker-grid';
    grid.setAttribute('role', 'grid');
    popup.appendChild(grid);
  }
  grid.innerHTML = '';

  // Weekday headers
  for (const day of WEEKDAYS) {
    const wd = document.createElement('div');
    wd.className = 'date-picker-weekday';
    wd.textContent = day;
    grid.appendChild(wd);
  }

  const totalDays = daysInMonth(state.viewYear, state.viewMonth);
  const startDay = firstDayOfMonth(state.viewYear, state.viewMonth);

  // Previous month filler
  const prevMonthDays = daysInMonth(
    state.viewMonth === 0 ? state.viewYear - 1 : state.viewYear,
    state.viewMonth === 0 ? 11 : state.viewMonth - 1
  );
  for (let i = startDay - 1; i >= 0; i--) {
    const cell = document.createElement('button');
    cell.className = 'date-picker-cell date-picker-cell-other';
    cell.textContent = String(prevMonthDays - i);
    cell.setAttribute('tabindex', '-1');
    cell.setAttribute('role', 'gridcell');
    cell.disabled = true;
    grid.appendChild(cell);
  }

  // Current month days
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(state.viewYear, state.viewMonth, day);
    const cell = document.createElement('button');
    cell.className = 'date-picker-cell';
    cell.textContent = String(day);
    cell.setAttribute('tabindex', '-1');
    cell.setAttribute('role', 'gridcell');

    if (isSameDay(date, today)) {
      cell.classList.add('today');
    }

    if (state.selected && isSameDay(date, state.selected)) {
      cell.classList.add('selected');
      cell.setAttribute('aria-selected', 'true');
      cell.setAttribute('tabindex', '0');
    }

    cell.addEventListener('click', () => {
      onSelect(date);
    });
    grid.appendChild(cell);
  }

  // Next month filler
  const totalCells = startDay + totalDays;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    const cell = document.createElement('button');
    cell.className = 'date-picker-cell date-picker-cell-other';
    cell.textContent = String(i);
    cell.setAttribute('tabindex', '-1');
    cell.setAttribute('role', 'gridcell');
    cell.disabled = true;
    grid.appendChild(cell);
  }
}

function updateHeader(popup: HTMLElement, state: PickerState): void {
  const title = popup.querySelector('.date-picker-title');
  if (title) {
    title.textContent = `${MONTH_NAMES[state.viewMonth]} ${String(state.viewYear)}`;
  }
  popup.setAttribute('aria-label', `${MONTH_NAMES[state.viewMonth]} ${String(state.viewYear)}`);
}

/**
 * Enhance all `[data-sol-date-picker]` elements with calendar popup behavior.
 *
 * Uses native `<input type="date">` fallback when `data-sol-date-native` is present.
 */
export function initDatePickers(options?: EnhancerOptions): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  const { signal } = _controller;

  const root = options?.root ?? document;
  root
    .querySelectorAll<HTMLElement>(options?.selector ?? DATE_PICKER_SELECTOR)
    .forEach((wrapper) => {
      // Native fallback
      if (wrapper.hasAttribute('data-sol-date-native')) return;

      const inputEl = wrapper.querySelector<HTMLInputElement>('.date-picker-input');
      if (!inputEl) return;
      const input: HTMLInputElement = inputEl;

      const today = new Date();
      const state: PickerState = {
        viewYear: today.getFullYear(),
        viewMonth: today.getMonth(),
        selected: null,
      };

      // Build popup
      const popup = document.createElement('div');
      popup.className = 'date-picker-popup';
      popup.setAttribute('role', 'dialog');
      popup.setAttribute('aria-modal', 'true');

      // Header
      const header = document.createElement('div');
      header.className = 'date-picker-header';

      const prevBtn = document.createElement('button');
      prevBtn.className = 'date-picker-nav';
      prevBtn.setAttribute('aria-label', 'Previous month');
      prevBtn.innerHTML = '&#8249;';

      const title = document.createElement('span');
      title.className = 'date-picker-title';

      const nextBtn = document.createElement('button');
      nextBtn.className = 'date-picker-nav';
      nextBtn.setAttribute('aria-label', 'Next month');
      nextBtn.innerHTML = '&#8250;';

      header.appendChild(prevBtn);
      header.appendChild(title);
      header.appendChild(nextBtn);
      popup.appendChild(header);

      wrapper.appendChild(popup);

      function render(): void {
        updateHeader(popup, state);
        buildCalendarGrid(popup, state, today, selectDate);
      }

      function openPopup(): void {
        popup.classList.add('active');
        render();

        requestAnimationFrame(() => {
          const selected =
            popup.querySelector<HTMLElement>('.date-picker-cell.selected') ??
            popup.querySelector<HTMLElement>('.date-picker-cell.today') ??
            popup.querySelector<HTMLElement>('.date-picker-cell:not(.date-picker-cell-other)');
          selected?.focus();
        });
      }

      function closePopup(): void {
        popup.classList.remove('active');
        input.focus();
      }

      function selectDate(date: Date): void {
        state.selected = date;
        input.value = formatDate(date);
        input.dispatchEvent(new Event('change', { bubbles: true }));
        closePopup();
      }

      // Navigation
      prevBtn.addEventListener(
        'click',
        () => {
          state.viewMonth--;
          if (state.viewMonth < 0) {
            state.viewMonth = 11;
            state.viewYear--;
          }
          render();
        },
        { signal }
      );

      nextBtn.addEventListener(
        'click',
        () => {
          state.viewMonth++;
          if (state.viewMonth > 11) {
            state.viewMonth = 0;
            state.viewYear++;
          }
          render();
        },
        { signal }
      );

      // Open on click/focus
      input.addEventListener(
        'click',
        () => {
          if (popup.classList.contains('active')) {
            closePopup();
          } else {
            openPopup();
          }
        },
        { signal }
      );

      // Click-away
      onClickAway(
        wrapper,
        () => {
          if (popup.classList.contains('active')) {
            closePopup();
          }
        },
        signal
      );

      // Keyboard
      popup.addEventListener(
        'keydown',
        (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            closePopup();
            return;
          }

          if (e.key === 'Tab') {
            trapFocus(popup, e);
            return;
          }

          // Grid navigation
          const cells = Array.from(
            popup.querySelectorAll<HTMLElement>('.date-picker-cell:not(.date-picker-cell-other)')
          );
          const currentIdx = cells.indexOf(document.activeElement as HTMLElement);

          let nextIdx = currentIdx;
          switch (e.key) {
            case 'ArrowRight':
              e.preventDefault();
              nextIdx = currentIdx + 1;
              break;
            case 'ArrowLeft':
              e.preventDefault();
              nextIdx = currentIdx - 1;
              break;
            case 'ArrowDown':
              e.preventDefault();
              nextIdx = currentIdx + 7;
              break;
            case 'ArrowUp':
              e.preventDefault();
              nextIdx = currentIdx - 7;
              break;
            case 'Home':
              e.preventDefault();
              nextIdx = currentIdx - (currentIdx % 7);
              break;
            case 'End':
              e.preventDefault();
              nextIdx = currentIdx + (6 - (currentIdx % 7));
              break;
            case 'PageDown':
              e.preventDefault();
              nextBtn.click();
              return;
            case 'PageUp':
              e.preventDefault();
              prevBtn.click();
              return;
            case 'Enter':
            case ' ':
              if (currentIdx >= 0) {
                e.preventDefault();
                cells[currentIdx].click();
              }
              return;
            default:
              return;
          }

          if (nextIdx >= 0 && nextIdx < cells.length) {
            cells[nextIdx].focus();
          }
        },
        { signal }
      );

      render();
    });

  return {
    destroy() {
      _controller?.abort();
      _controller = null;
    },
  };
}
