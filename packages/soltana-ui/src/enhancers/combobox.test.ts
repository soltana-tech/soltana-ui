// Unit tests for combobox enhancer focus on ARIA correctness, event handling,
// keyboard navigation, and filtering behavior.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initComboboxes } from './combobox.js';

function createCombobox(options: string[]): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-sol-combobox', '');
  wrapper.className = 'combobox';

  const input = document.createElement('input');
  input.className = 'combobox-input input';
  wrapper.appendChild(input);

  const listbox = document.createElement('ul');
  listbox.className = 'combobox-listbox';
  options.forEach((opt) => {
    const li = document.createElement('li');
    li.className = 'combobox-option';
    li.textContent = opt;
    listbox.appendChild(li);
  });
  wrapper.appendChild(listbox);

  document.body.appendChild(wrapper);
  return wrapper;
}

describe('initComboboxes', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initComboboxes();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('handles multiple init calls without duplicating listeners', () => {
    const wrapper = createCombobox(['Apple', 'Banana', 'Cherry']);

    initComboboxes();
    const cleanup = initComboboxes();

    const input = wrapper.querySelector<HTMLInputElement>('.combobox-input')!;
    const listbox = wrapper.querySelector<HTMLElement>('.combobox-listbox')!;
    const options = Array.from(listbox.querySelectorAll<HTMLElement>('.combobox-option'));

    input.focus();

    expect(listbox.classList.contains('active')).toBe(true);
    expect(input.getAttribute('aria-expanded')).toBe('true');

    options[0].click();

    expect(input.value).toBe('Apple');
    expect(listbox.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('sets ARIA attributes on input and listbox', () => {
    const wrapper = createCombobox(['Option 1', 'Option 2']);
    const cleanup = initComboboxes();

    const input = wrapper.querySelector<HTMLInputElement>('.combobox-input')!;
    const listbox = wrapper.querySelector<HTMLElement>('.combobox-listbox')!;

    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-controls')).toBe(listbox.id);

    expect(listbox.getAttribute('role')).toBe('listbox');
    expect(listbox.id).toContain('sol-combobox-list-');

    cleanup.destroy();
  });

  it('sets ARIA role and tabindex on options', () => {
    const wrapper = createCombobox(['Option 1', 'Option 2', 'Option 3']);
    const cleanup = initComboboxes();

    const options = wrapper.querySelectorAll('.combobox-option');

    options.forEach((opt) => {
      expect(opt.getAttribute('role')).toBe('option');
      expect(opt.getAttribute('tabindex')).toBe('-1');
    });

    cleanup.destroy();
  });

  it('opens listbox on input focus', () => {
    const wrapper = createCombobox(['Apple', 'Banana']);
    const cleanup = initComboboxes();

    const input = wrapper.querySelector<HTMLInputElement>('.combobox-input')!;
    const listbox = wrapper.querySelector<HTMLElement>('.combobox-listbox')!;

    input.focus();

    expect(listbox.classList.contains('active')).toBe(true);
    expect(input.getAttribute('aria-expanded')).toBe('true');

    cleanup.destroy();
  });

  it('filters options based on input value', () => {
    const wrapper = createCombobox(['Apple', 'Apricot', 'Banana', 'Cherry']);
    const cleanup = initComboboxes();

    const input = wrapper.querySelector<HTMLInputElement>('.combobox-input')!;
    const options = Array.from(wrapper.querySelectorAll<HTMLElement>('.combobox-option'));

    input.value = 'ap';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(options[0].hidden).toBe(false);
    expect(options[1].hidden).toBe(false);
    expect(options[2].hidden).toBe(true);
    expect(options[3].hidden).toBe(true);

    cleanup.destroy();
  });

  it('selects option on click and closes listbox', () => {
    const wrapper = createCombobox(['Apple', 'Banana', 'Cherry']);
    const cleanup = initComboboxes();

    const input = wrapper.querySelector<HTMLInputElement>('.combobox-input')!;
    const listbox = wrapper.querySelector<HTMLElement>('.combobox-listbox')!;
    const options = Array.from(listbox.querySelectorAll<HTMLElement>('.combobox-option'));

    input.focus();
    options[1].click();

    expect(input.value).toBe('Banana');
    expect(options[1].classList.contains('selected')).toBe(true);
    expect(options[1].getAttribute('aria-selected')).toBe('true');
    expect(listbox.classList.contains('active')).toBe(false);
    expect(input.getAttribute('aria-expanded')).toBe('false');

    cleanup.destroy();
  });

  it('uses data-value attribute when present', () => {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-sol-combobox', '');

    const input = document.createElement('input');
    input.className = 'combobox-input';
    wrapper.appendChild(input);

    const listbox = document.createElement('ul');
    listbox.className = 'combobox-listbox';
    const option = document.createElement('li');
    option.className = 'combobox-option';
    option.setAttribute('data-value', 'custom-value');
    option.textContent = 'Display Text';
    listbox.appendChild(option);
    wrapper.appendChild(listbox);
    document.body.appendChild(wrapper);

    const cleanup = initComboboxes();

    input.focus();
    option.click();

    expect(input.value).toBe('custom-value');

    cleanup.destroy();
  });

  it('closes listbox on Escape key', () => {
    const wrapper = createCombobox(['Apple', 'Banana']);
    const cleanup = initComboboxes();

    const input = wrapper.querySelector<HTMLInputElement>('.combobox-input')!;
    const listbox = wrapper.querySelector<HTMLElement>('.combobox-listbox')!;

    input.focus();
    expect(listbox.classList.contains('active')).toBe(true);

    wrapper.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(listbox.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('opens listbox on ArrowDown when closed', () => {
    const wrapper = createCombobox(['Apple', 'Banana']);
    const cleanup = initComboboxes();

    const listbox = wrapper.querySelector<HTMLElement>('.combobox-listbox')!;

    expect(listbox.classList.contains('active')).toBe(false);

    wrapper.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

    expect(listbox.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('scopes queries to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-sol-combobox', '');
    const input = document.createElement('input');
    input.className = 'combobox-input';
    const listbox = document.createElement('ul');
    listbox.className = 'combobox-listbox';
    const option = document.createElement('li');
    option.className = 'combobox-option';
    option.textContent = 'Test';
    listbox.appendChild(option);
    wrapper.appendChild(input);
    wrapper.appendChild(listbox);
    root.appendChild(wrapper);

    const cleanup = initComboboxes({ root });

    expect(input.getAttribute('role')).toBe('combobox');

    cleanup.destroy();
  });

  describe('error handling', () => {
    it('handles gracefully when no elements match the combobox selector', () => {
      expect(() => initComboboxes()).not.toThrow();
      const cleanup = initComboboxes();
      expect(typeof cleanup.destroy).toBe('function');
      cleanup.destroy();
    });

    it('handles gracefully when combobox lacks input element', () => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-sol-combobox', '');
      const listbox = document.createElement('ul');
      listbox.className = 'combobox-listbox';
      wrapper.appendChild(listbox);
      document.body.appendChild(wrapper);

      expect(() => initComboboxes()).not.toThrow();
      const cleanup = initComboboxes();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });

    it('handles gracefully when combobox lacks listbox element', () => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-sol-combobox', '');
      const input = document.createElement('input');
      input.className = 'combobox-input';
      wrapper.appendChild(input);
      document.body.appendChild(wrapper);

      expect(() => initComboboxes()).not.toThrow();
      const cleanup = initComboboxes();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });

    it('handles gracefully when listbox has no options', () => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-sol-combobox', '');
      const input = document.createElement('input');
      input.className = 'combobox-input';
      const listbox = document.createElement('ul');
      listbox.className = 'combobox-listbox';
      wrapper.appendChild(input);
      wrapper.appendChild(listbox);
      document.body.appendChild(wrapper);

      expect(() => initComboboxes()).not.toThrow();
      const cleanup = initComboboxes();
      expect(typeof cleanup.destroy).toBe('function');

      input.focus();
      expect(input.getAttribute('aria-expanded')).toBe('true');

      cleanup.destroy();
    });
  });
});
