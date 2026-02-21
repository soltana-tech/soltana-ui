import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initModals } from './modal.js';
import {
  testDestroyPreventsInteraction,
  testIdempotentInit,
  testNoMatchGraceful,
  testCustomRoot,
} from './test-utils.js';

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

  testDestroyPreventsInteraction(
    initModals,
    () => {
      createModal('test-modal');
      return createTrigger('test-modal');
    },
    (trigger) => {
      trigger.click();
    },
    () => {
      const modal = document.getElementById('test-modal')!;
      expect(modal.classList.contains('active')).toBe(false);
    }
  );

  testIdempotentInit(
    initModals,
    () => {
      createModal('test-modal');
      return createTrigger('test-modal');
    },
    (trigger) => {
      trigger.click();
      const modal = document.getElementById('test-modal')!;
      expect(modal.classList.contains('active')).toBe(true);
      expect(modal.getAttribute('aria-hidden')).toBe('false');
    }
  );

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

  testCustomRoot(
    initModals,
    (root) => {
      const modal = document.createElement('div');
      modal.id = 'scoped-modal';
      modal.setAttribute('data-sol-modal', '');
      modal.setAttribute('aria-hidden', 'true');
      root.appendChild(modal);

      const trigger = document.createElement('button');
      trigger.setAttribute('data-modal-open', 'scoped-modal');
      root.appendChild(trigger);

      const outsideTrigger = document.createElement('button');
      outsideTrigger.setAttribute('data-modal-open', 'scoped-modal');
      document.body.appendChild(outsideTrigger);
    },
    (root) => {
      const trigger = root.querySelector<HTMLElement>('[data-modal-open]')!;
      trigger.click();
      const modal = root.querySelector('[data-sol-modal]')!;
      expect(modal.classList.contains('active')).toBe(true);
    }
  );

  describe('error handling', () => {
    testNoMatchGraceful(initModals);

    it('handles gracefully when trigger references non-existent modal ID', () => {
      const trigger = createTrigger('non-existent-modal');
      const cleanup = initModals();

      expect(() => {
        trigger.click();
      }).not.toThrow();

      cleanup.destroy();
    });

    it('handles gracefully when modal lacks required inner structure', () => {
      const modal = document.createElement('div');
      modal.id = 'incomplete-modal';
      modal.setAttribute('data-sol-modal', '');
      modal.setAttribute('aria-hidden', 'true');
      document.body.appendChild(modal);

      createTrigger('incomplete-modal');

      expect(() => initModals()).not.toThrow();
      initModals().destroy();
    });
  });
});
