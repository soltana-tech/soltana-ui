import { describe, it, expect, vi, beforeEach } from 'vitest';
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

  it('overflow stacking with multiple modals', () => {
    const { modal: modal1, trigger: trigger1 } = createModalFixture();
    // Create a second modal
    const modal2 = document.createElement('div');
    modal2.id = 'test-modal-2';
    modal2.setAttribute('data-sol-modal', '');
    modal2.setAttribute('aria-hidden', 'true');
    modal2.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal__content" role="dialog" aria-modal="true">
        <button data-modal-close>Close</button>
      </div>
    `;
    const trigger2 = document.createElement('button');
    trigger2.setAttribute('data-modal-open', 'test-modal-2');
    document.body.appendChild(modal2);
    document.body.appendChild(trigger2);

    initModals();

    trigger1.click();
    trigger2.click();
    expect(document.body.style.overflow).toBe('hidden');

    // Close first modal — overflow should still be hidden
    const close1 = modal1.querySelector<HTMLElement>('[data-modal-close]');
    close1?.click();
    expect(document.body.style.overflow).toBe('hidden');

    // Close second modal — overflow should be restored
    const close2 = modal2.querySelector<HTMLElement>('[data-modal-close]');
    close2?.click();
    expect(document.body.style.overflow).toBe('');
  });

  it('double initModals does not duplicate handlers', () => {
    const { modal, trigger } = createModalFixture();
    initModals();
    initModals(); // second call should replace, not duplicate

    trigger.click();
    expect(modal.classList.contains('active')).toBe(true);

    const closeBtn = modal.querySelector<HTMLElement>('[data-modal-close]');
    closeBtn?.click();
    expect(modal.classList.contains('active')).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('destroy removes all listeners', () => {
    const { modal, trigger } = createModalFixture();
    const cleanup = initModals();

    cleanup.destroy();

    trigger.click();
    expect(modal.classList.contains('active')).toBe(false);
    expect(modal.getAttribute('aria-hidden')).toBe('true');
  });

  it('Tab key wraps focus forward within modal', () => {
    const { modal, trigger } = createModalFixture();
    initModals();
    trigger.click();

    const focusables = modal.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    // Focus the last focusable element, then Tab
    last.focus();
    expect(document.activeElement).toBe(last);

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    const spy = vi.spyOn(event, 'preventDefault');
    modal.dispatchEvent(event);

    expect(spy).toHaveBeenCalled();
    expect(document.activeElement).toBe(first);
  });

  it('Shift+Tab wraps focus backward within modal', () => {
    const { modal, trigger } = createModalFixture();
    initModals();
    trigger.click();

    const focusables = modal.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    // Focus the first focusable element, then Shift+Tab
    first.focus();
    expect(document.activeElement).toBe(first);

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    });
    const spy = vi.spyOn(event, 'preventDefault');
    modal.dispatchEvent(event);

    expect(spy).toHaveBeenCalled();
    expect(document.activeElement).toBe(last);
  });

  it('focuses first focusable element on open', () => {
    vi.useFakeTimers();
    const { modal, trigger } = createModalFixture();
    initModals();

    trigger.click();
    vi.runAllTimers();

    const closeBtn = modal.querySelector<HTMLElement>('[data-modal-close]');
    expect(document.activeElement).toBe(closeBtn);
    vi.useRealTimers();
  });

  it('clicking inside modal content does not close the modal', () => {
    const { modal, trigger } = createModalFixture();
    initModals();

    trigger.click();
    expect(modal.classList.contains('active')).toBe(true);

    const content = modal.querySelector<HTMLElement>('.modal__content');
    content?.click();
    expect(modal.classList.contains('active')).toBe(true);

    const input = modal.querySelector<HTMLElement>('input');
    input?.click();
    expect(modal.classList.contains('active')).toBe(true);
  });

  it('trigger pointing to nonexistent modal id does nothing', () => {
    const trigger = document.createElement('button');
    trigger.setAttribute('data-modal-open', 'does-not-exist');
    document.body.appendChild(trigger);

    initModals();
    trigger.click();

    // No error thrown, body overflow unchanged
    expect(document.body.style.overflow).toBe('');
  });
});
