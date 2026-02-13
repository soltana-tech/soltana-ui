import { describe, it, expect, beforeEach } from 'vitest';
import { initModals } from './modal';

function createModalFixture(): { modal: HTMLElement; trigger: HTMLElement } {
  const modal = document.createElement('div');
  modal.id = 'test-modal';
  modal.setAttribute('data-sol-modal', '');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal__content" role="dialog" aria-modal="true">
      <button data-modal-close>Close</button>
      <input type="text" />
    </div>
  `;

  const trigger = document.createElement('button');
  trigger.setAttribute('data-modal-open', 'test-modal');
  trigger.textContent = 'Open';

  document.body.appendChild(modal);
  document.body.appendChild(trigger);

  return { modal, trigger };
}

describe('initModals', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.overflow = '';
  });

  it('opens modal on trigger click', () => {
    const { modal, trigger } = createModalFixture();
    initModals();

    trigger.click();
    expect(modal.classList.contains('active')).toBe(true);
    expect(modal.getAttribute('aria-hidden')).toBe('false');
  });

  it('closes modal on close button click', () => {
    const { modal, trigger } = createModalFixture();
    initModals();

    trigger.click();
    expect(modal.classList.contains('active')).toBe(true);

    const closeBtn = modal.querySelector<HTMLElement>('[data-modal-close]');
    expect(closeBtn).toBeTruthy();
    closeBtn?.click();
    expect(modal.classList.contains('active')).toBe(false);
    expect(modal.getAttribute('aria-hidden')).toBe('true');
  });

  it('closes modal on Escape key', () => {
    const { modal, trigger } = createModalFixture();
    initModals();

    trigger.click();
    modal.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(modal.classList.contains('active')).toBe(false);
  });

  it('closes modal on backdrop click', () => {
    const { modal, trigger } = createModalFixture();
    initModals();

    trigger.click();
    const backdrop = modal.querySelector<HTMLElement>('.modal-backdrop');
    expect(backdrop).toBeTruthy();
    backdrop?.click();
    expect(modal.classList.contains('active')).toBe(false);
  });
});
