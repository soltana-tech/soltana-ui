import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initAll } from './index.js';
import { mockBoundingClientRect } from './test-helpers.js';

function createCompositeDOM(): void {
  const modal = document.createElement('div');
  modal.id = 'test-modal';
  modal.setAttribute('data-sol-modal', '');
  modal.setAttribute('aria-hidden', 'true');
  const modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'modal-backdrop';
  modal.appendChild(modalBackdrop);
  const modalContent = document.createElement('div');
  modalContent.className = 'modal';
  const modalInner = document.createElement('div');
  modalInner.className = 'modal__content';
  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('data-modal-close', '');
  closeBtn.textContent = 'Close';
  modalInner.appendChild(closeBtn);
  modalContent.appendChild(modalInner);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  const modalTrigger = document.createElement('button');
  modalTrigger.setAttribute('data-modal-open', 'test-modal');
  modalTrigger.textContent = 'Open Modal';
  document.body.appendChild(modalTrigger);

  const tabsContainer = document.createElement('div');
  tabsContainer.setAttribute('data-sol-tabs', '');
  const tablist = document.createElement('div');
  tablist.setAttribute('role', 'tablist');
  const tab1 = document.createElement('button');
  tab1.setAttribute('role', 'tab');
  tab1.setAttribute('aria-selected', 'true');
  tab1.textContent = 'Tab 1';
  const tab2 = document.createElement('button');
  tab2.setAttribute('role', 'tab');
  tab2.textContent = 'Tab 2';
  tablist.appendChild(tab1);
  tablist.appendChild(tab2);
  tabsContainer.appendChild(tablist);
  const panel1 = document.createElement('div');
  panel1.setAttribute('role', 'tabpanel');
  panel1.textContent = 'Panel 1';
  const panel2 = document.createElement('div');
  panel2.setAttribute('role', 'tabpanel');
  panel2.textContent = 'Panel 2';
  panel2.hidden = true;
  tabsContainer.appendChild(panel1);
  tabsContainer.appendChild(panel2);
  document.body.appendChild(tabsContainer);

  const tooltipTarget = document.createElement('button');
  tooltipTarget.setAttribute('data-sol-tooltip', 'Test tooltip');
  tooltipTarget.textContent = 'Hover for tooltip';
  mockBoundingClientRect(tooltipTarget);
  document.body.appendChild(tooltipTarget);

  const accordion = document.createElement('div');
  accordion.setAttribute('data-sol-accordion', '');
  const accordionItem = document.createElement('div');
  accordionItem.className = 'accordion-item';
  const accordionHeader = document.createElement('div');
  accordionHeader.className = 'accordion-header';
  accordionHeader.textContent = 'Accordion Header';
  const accordionBody = document.createElement('div');
  accordionBody.className = 'accordion-body';
  accordionBody.textContent = 'Accordion Body';
  accordionItem.appendChild(accordionHeader);
  accordionItem.appendChild(accordionBody);
  accordion.appendChild(accordionItem);
  document.body.appendChild(accordion);
}

describe('initAll', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.stubGlobal('innerWidth', 1024);
    vi.stubGlobal('innerHeight', 768);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.body.classList.remove('sol-modal-open');
    vi.unstubAllGlobals();
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initAll();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('initializes all enhancers in composite DOM structure', () => {
    createCompositeDOM();
    const cleanup = initAll();

    const tabs = document.querySelectorAll('[role="tab"]');
    expect(tabs[0].id).toContain('tab-0');
    expect(tabs[0].getAttribute('aria-controls')).toBeTruthy();

    const panels = document.querySelectorAll('[role="tabpanel"]');
    expect(panels[0].id).toContain('panel-0');
    expect(panels[0].getAttribute('aria-labelledby')).toBeTruthy();

    const accordionHeader = document.querySelector('.accordion-header');
    expect(accordionHeader?.getAttribute('role')).toBe('button');
    expect(accordionHeader?.getAttribute('tabindex')).toBe('0');
    expect(accordionHeader?.getAttribute('aria-controls')).toBeTruthy();

    const accordionBody = document.querySelector('.accordion-body');
    expect(accordionBody?.getAttribute('role')).toBe('region');
    expect(accordionBody?.getAttribute('aria-labelledby')).toBeTruthy();

    cleanup.destroy();
  });

  it('modal enhancer functions correctly after initAll', () => {
    createCompositeDOM();
    const cleanup = initAll();

    const modal = document.getElementById('test-modal')!;
    const trigger = document.querySelector<HTMLElement>('[data-modal-open]')!;

    trigger.click();

    expect(modal.classList.contains('active')).toBe(true);
    expect(modal.getAttribute('aria-hidden')).toBe('false');
    expect(document.body.classList.contains('sol-modal-open')).toBe(true);

    cleanup.destroy();
  });

  it('tabs enhancer functions correctly after initAll', () => {
    createCompositeDOM();
    const cleanup = initAll();

    const tabs = document.querySelectorAll<HTMLElement>('[role="tab"]');
    const panels = document.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    tabs[1].click();

    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].classList.contains('active')).toBe(true);
    expect(panels[1].hidden).toBe(false);

    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(panels[0].hidden).toBe(true);

    cleanup.destroy();
  });

  it('tooltip enhancer functions correctly after initAll', () => {
    createCompositeDOM();
    const cleanup = initAll();

    const target = document.querySelector<HTMLElement>('[data-sol-tooltip]')!;

    target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    const tooltip = document.querySelector('.tooltip');
    expect(tooltip).not.toBeNull();
    expect(tooltip!.textContent).toBe('Test tooltip');
    expect(tooltip!.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('accordion enhancer functions correctly after initAll', () => {
    createCompositeDOM();
    const cleanup = initAll();

    const header = document.querySelector<HTMLElement>('.accordion-header')!;
    const item = header.closest('.accordion-item')!;

    header.click();

    expect(item.classList.contains('active')).toBe(true);
    expect(header.getAttribute('aria-expanded')).toBe('true');

    cleanup.destroy();
  });

  it('destroy() cleans up all enhancers', () => {
    createCompositeDOM();
    const cleanup = initAll();

    const trigger = document.querySelector<HTMLElement>('[data-modal-open]')!;
    trigger.click();
    expect(document.body.classList.contains('sol-modal-open')).toBe(true);

    const tooltipTarget = document.querySelector<HTMLElement>('[data-sol-tooltip]')!;
    tooltipTarget.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(document.querySelector('.tooltip')).not.toBeNull();

    cleanup.destroy();

    expect(document.body.classList.contains('sol-modal-open')).toBe(false);
    expect(document.querySelector('.tooltip')).toBeNull();
  });

  it('handles gracefully when no enhancer elements exist', () => {
    expect(() => initAll()).not.toThrow();
    const cleanup = initAll();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('scopes initialization to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const modal = document.createElement('div');
    modal.id = 'scoped-modal';
    modal.setAttribute('data-sol-modal', '');
    modal.setAttribute('aria-hidden', 'true');
    root.appendChild(modal);

    const modalTrigger = document.createElement('button');
    modalTrigger.setAttribute('data-modal-open', 'scoped-modal');
    root.appendChild(modalTrigger);

    const outsideModal = document.createElement('div');
    outsideModal.id = 'outside-modal';
    outsideModal.setAttribute('data-sol-modal', '');
    outsideModal.setAttribute('aria-hidden', 'true');
    document.body.appendChild(outsideModal);

    const cleanup = initAll({ root });

    modalTrigger.click();
    expect(modal.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });
});
