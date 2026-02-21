import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initDatePickers } from './date-picker.js';

function createDatePicker(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-sol-date-picker', '');
  wrapper.className = 'date-picker';

  const input = document.createElement('input');
  input.className = 'date-picker-input';
  input.type = 'text';
  wrapper.appendChild(input);

  document.body.appendChild(wrapper);
  return wrapper;
}

function createNativeDatePicker(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-sol-date-picker', '');
  wrapper.setAttribute('data-sol-date-native', '');
  wrapper.className = 'date-picker';

  const input = document.createElement('input');
  input.className = 'date-picker-input';
  input.type = 'date';
  wrapper.appendChild(input);

  document.body.appendChild(wrapper);
  return wrapper;
}

describe('initDatePickers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initDatePickers();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('handles multiple init calls without duplicating listeners', () => {
    const wrapper = createDatePicker();
    const input = wrapper.querySelector<HTMLInputElement>('.date-picker-input')!;

    initDatePickers();
    const cleanup = initDatePickers();

    input.click();

    const activePopups = wrapper.querySelectorAll('.date-picker-popup.active');
    expect(activePopups).toHaveLength(1);

    cleanup.destroy();
  });

  it('creates calendar popup with ARIA dialog role', () => {
    const wrapper = createDatePicker();
    const cleanup = initDatePickers();

    const popup = wrapper.querySelector('.date-picker-popup');
    expect(popup).not.toBeNull();
    expect(popup!.getAttribute('role')).toBe('dialog');
    expect(popup!.getAttribute('aria-modal')).toBe('true');

    cleanup.destroy();
  });

  it('builds calendar grid with ARIA grid role', () => {
    const wrapper = createDatePicker();
    const input = wrapper.querySelector<HTMLInputElement>('.date-picker-input')!;
    const cleanup = initDatePickers();

    input.click();

    const grid = wrapper.querySelector('.date-picker-grid');
    expect(grid).not.toBeNull();
    expect(grid!.getAttribute('role')).toBe('grid');

    const cells = wrapper.querySelectorAll('[role="gridcell"]');
    expect(cells.length).toBeGreaterThan(0);

    cleanup.destroy();
  });

  it('renders weekday headers in calendar grid', () => {
    const wrapper = createDatePicker();
    const input = wrapper.querySelector<HTMLInputElement>('.date-picker-input')!;
    const cleanup = initDatePickers();

    input.click();

    const weekdays = wrapper.querySelectorAll('.date-picker-weekday');
    expect(weekdays).toHaveLength(7);
    expect(weekdays[0].textContent).toBe('Su');
    expect(weekdays[1].textContent).toBe('Mo');

    cleanup.destroy();
  });

  it('navigates to previous month on prev button click', () => {
    const wrapper = createDatePicker();
    const input = wrapper.querySelector<HTMLInputElement>('.date-picker-input')!;
    const cleanup = initDatePickers();

    input.click();

    const initialTitle = wrapper.querySelector('.date-picker-title')!.textContent;
    const prevBtn = wrapper.querySelector<HTMLButtonElement>('.date-picker-nav')!;

    prevBtn.click();

    const newTitle = wrapper.querySelector('.date-picker-title')!.textContent;
    expect(newTitle).not.toBe(initialTitle);

    cleanup.destroy();
  });

  it('navigates to next month on next button click', () => {
    const wrapper = createDatePicker();
    const input = wrapper.querySelector<HTMLInputElement>('.date-picker-input')!;
    const cleanup = initDatePickers();

    input.click();

    const initialTitle = wrapper.querySelector('.date-picker-title')!.textContent;
    const navButtons = wrapper.querySelectorAll<HTMLButtonElement>('.date-picker-nav');
    const nextBtn = navButtons[1];

    nextBtn.click();

    const newTitle = wrapper.querySelector('.date-picker-title')!.textContent;
    expect(newTitle).not.toBe(initialTitle);

    cleanup.destroy();
  });

  it('selects date on cell click and updates input value', () => {
    const wrapper = createDatePicker();
    const input = wrapper.querySelector<HTMLInputElement>('.date-picker-input')!;
    const cleanup = initDatePickers();

    input.click();

    const cell = wrapper.querySelector<HTMLButtonElement>(
      '.date-picker-cell:not(.date-picker-cell-other)'
    )!;
    cell.click();

    expect(input.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const popup = wrapper.querySelector('.date-picker-popup');
    expect(popup!.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('marks selected date with aria-selected attribute', () => {
    const wrapper = createDatePicker();
    const input = wrapper.querySelector<HTMLInputElement>('.date-picker-input')!;
    const cleanup = initDatePickers();

    input.click();

    const cell = wrapper.querySelector<HTMLButtonElement>(
      '.date-picker-cell:not(.date-picker-cell-other)'
    )!;
    cell.click();

    input.click();

    const selectedCell = wrapper.querySelector('.date-picker-cell.selected');
    expect(selectedCell).not.toBeNull();
    expect(selectedCell!.getAttribute('aria-selected')).toBe('true');
    expect(selectedCell!.getAttribute('tabindex')).toBe('0');

    cleanup.destroy();
  });

  it('closes popup on Escape key', () => {
    const wrapper = createDatePicker();
    const input = wrapper.querySelector<HTMLInputElement>('.date-picker-input')!;
    const cleanup = initDatePickers();

    input.click();

    const popup = wrapper.querySelector<HTMLElement>('.date-picker-popup')!;
    expect(popup.classList.contains('active')).toBe(true);

    popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(popup.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('navigates between days with arrow keys', () => {
    const wrapper = createDatePicker();
    const input = wrapper.querySelector<HTMLInputElement>('.date-picker-input')!;
    const cleanup = initDatePickers();

    input.click();

    const cells = Array.from(
      wrapper.querySelectorAll<HTMLElement>('.date-picker-cell:not(.date-picker-cell-other)')
    );
    cells[0].focus();

    const popup = wrapper.querySelector<HTMLElement>('.date-picker-popup')!;

    popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(cells[1]);

    popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(cells[8]);

    popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(document.activeElement).toBe(cells[7]);

    popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(document.activeElement).toBe(cells[0]);

    cleanup.destroy();
  });

  it('selects date on Enter or Space key', () => {
    const wrapper = createDatePicker();
    const input = wrapper.querySelector<HTMLInputElement>('.date-picker-input')!;
    const cleanup = initDatePickers();

    input.click();

    const cell = wrapper.querySelector<HTMLElement>(
      '.date-picker-cell:not(.date-picker-cell-other)'
    )!;
    cell.focus();

    const popup = wrapper.querySelector<HTMLElement>('.date-picker-popup')!;
    popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(input.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(popup.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('skips enhancement when data-sol-date-native attribute is present', () => {
    const wrapper = createNativeDatePicker();
    const cleanup = initDatePickers();

    const popup = wrapper.querySelector('.date-picker-popup');
    expect(popup).toBeNull();

    cleanup.destroy();
  });

  it('scopes queries to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-sol-date-picker', '');
    const input = document.createElement('input');
    input.className = 'date-picker-input';
    wrapper.appendChild(input);
    root.appendChild(wrapper);

    const cleanup = initDatePickers({ root });

    const popup = wrapper.querySelector('.date-picker-popup');
    expect(popup).not.toBeNull();

    cleanup.destroy();
  });

  describe('error handling', () => {
    it('handles gracefully when no elements match the date picker selector', () => {
      expect(() => initDatePickers()).not.toThrow();
      const cleanup = initDatePickers();
      expect(typeof cleanup.destroy).toBe('function');
      cleanup.destroy();
    });

    it('handles gracefully when date picker lacks input element', () => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-sol-date-picker', '');
      document.body.appendChild(wrapper);

      expect(() => initDatePickers()).not.toThrow();
      const cleanup = initDatePickers();
      expect(typeof cleanup.destroy).toBe('function');

      const popup = wrapper.querySelector('.date-picker-popup');
      expect(popup).toBeNull();

      cleanup.destroy();
    });

    it('handles gracefully when multiple date pickers exist', () => {
      createDatePicker();
      createDatePicker();

      const cleanup = initDatePickers();

      const popups = document.querySelectorAll('.date-picker-popup');
      expect(popups).toHaveLength(2);

      cleanup.destroy();
    });
  });
});
