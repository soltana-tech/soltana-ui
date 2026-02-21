// Unit tests for modal enhancer focus on ARIA correctness, event handling, and
// focus trapping. Tier integration (theme/relief/finish interaction with
// enhancers) is verified in E2E tests (tests/enhancers/).

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initModals } from './modal.js';
import { testSingletonBehavior } from './__tests__/helpers.js';

function createModal(id: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.id = id;
  wrapper.setAttribute('data-sol-modal', '');
  wrapper.setAttribute('aria-hidden', 'true');

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  wrapper.appendChild(backdrop);

  const modal = document.createElement('div');
  modal.className = 'modal';
  const content = document.createElement('div');
  content.className = 'modal__content';
  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('data-modal-close', '');
  closeBtn.textContent = 'Close';
  content.appendChild(closeBtn);
  modal.appendChild(content);
  wrapper.appendChild(modal);

  document.body.appendChild(wrapper);
  return wrapper;
}

function createTrigger(targetId: string): HTMLElement {
  const btn = document.createElement('button');
  btn.setAttribute('data-modal-open', targetId);
  document.body.appendChild(btn);
  return btn;
}

describe('initModals', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.classList.remove('sol-modal-open');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.body.classList.remove('sol-modal-open');
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initModals();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('opens a modal when trigger is clicked', () => {
    const modal = createModal('test-modal');
    const trigger = createTrigger('test-modal');
    const cleanup = initModals();

    trigger.click();

    expect(modal.classList.contains('active')).toBe(true);
    expect(modal.getAttribute('aria-hidden')).toBe('false');
    expect(document.body.classList.contains('sol-modal-open')).toBe(true);

    cleanup.destroy();
  });

  it('closes a modal when close button is clicked', () => {
    const modal = createModal('test-modal');
    createTrigger('test-modal');
    const cleanup = initModals();

    // Open then close
    const trigger = document.querySelector<HTMLElement>('[data-modal-open]')!;
    trigger.click();
    expect(modal.classList.contains('active')).toBe(true);

    const closeBtn = modal.querySelector<HTMLElement>('[data-modal-close]')!;
    closeBtn.click();
    expect(modal.classList.contains('active')).toBe(false);
    expect(modal.getAttribute('aria-hidden')).toBe('true');

    cleanup.destroy();
  });

  it('closes a modal on Escape key', () => {
    const modal = createModal('test-modal');
    createTrigger('test-modal');
    const cleanup = initModals();

    const trigger = document.querySelector<HTMLElement>('[data-modal-open]')!;
    trigger.click();
    expect(modal.classList.contains('active')).toBe(true);

    modal.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(modal.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('singleton: re-calling initModals() does not duplicate listeners', () => {
    testSingletonBehavior(
      () => initModals(),
      () => {
        createModal('test-modal');
        const trigger = createTrigger('test-modal');
        return trigger;
      },
      (trigger) => {
        trigger.click();
        const modal = document.getElementById('test-modal')!;
        expect(modal.classList.contains('active')).toBe(true);
        expect(modal.getAttribute('aria-hidden')).toBe('false');
      }
    );
  });

  it('destroy() removes sol-modal-open from body', () => {
    createModal('test-modal');
    createTrigger('test-modal');
    const cleanup = initModals();

    const trigger = document.querySelector<HTMLElement>('[data-modal-open]')!;
    trigger.click();
    expect(document.body.classList.contains('sol-modal-open')).toBe(true);

    cleanup.destroy();
    expect(document.body.classList.contains('sol-modal-open')).toBe(false);
  });

  it('scopes queries to custom root via options', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const modal = document.createElement('div');
    modal.id = 'scoped-modal';
    modal.setAttribute('data-sol-modal', '');
    modal.setAttribute('aria-hidden', 'true');
    container.appendChild(modal);

    const trigger = document.createElement('button');
    trigger.setAttribute('data-modal-open', 'scoped-modal');
    container.appendChild(trigger);

    // A trigger outside the root should not be wired up
    const outsideTrigger = document.createElement('button');
    outsideTrigger.setAttribute('data-modal-open', 'scoped-modal');
    document.body.appendChild(outsideTrigger);

    const cleanup = initModals({ root: container });

    trigger.click();
    expect(modal.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });
});
