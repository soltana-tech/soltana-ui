import { describe, it, expect, beforeEach } from 'vitest';
import { initAll } from './index';

describe('initAll', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('initializes all enhancers and destroy cleans up', () => {
    // Modal fixture
    const modal = document.createElement('div');
    modal.id = 'all-modal';
    modal.setAttribute('data-sol-modal', '');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="modal-backdrop"></div><div class="modal__content" role="dialog"><button data-modal-close>X</button></div>';
    const modalTrigger = document.createElement('button');
    modalTrigger.setAttribute('data-modal-open', 'all-modal');
    document.body.appendChild(modal);
    document.body.appendChild(modalTrigger);

    // Tabs fixture
    const tabs = document.createElement('div');
    tabs.setAttribute('data-sol-tabs', '');
    tabs.innerHTML =
      '<div role="tablist"><button role="tab" aria-selected="true">T1</button><button role="tab">T2</button></div><div role="tabpanel">P1</div><div role="tabpanel" hidden>P2</div>';
    document.body.appendChild(tabs);

    // Tooltip fixture
    const tip = document.createElement('button');
    tip.setAttribute('data-sol-tooltip', 'Tip');
    document.body.appendChild(tip);

    const cleanup = initAll();

    // Verify modal works
    modalTrigger.click();
    expect(modal.classList.contains('active')).toBe(true);

    // Verify tabs work
    const tabBtns = tabs.querySelectorAll<HTMLElement>('[role="tab"]');
    tabBtns[1].click();
    expect(tabBtns[1].getAttribute('aria-selected')).toBe('true');

    // Verify tooltip works
    tip.dispatchEvent(new MouseEvent('mouseenter'));
    expect(document.querySelector('.tooltip')).toBeTruthy();

    // Destroy should clean up all enhancers
    cleanup.destroy();

    // Reset modal state for post-destroy check
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    modalTrigger.click();
    expect(modal.classList.contains('active')).toBe(false);
  });
});
