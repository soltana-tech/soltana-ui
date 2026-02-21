import { describe, it, expect } from 'vitest';
import { ACCORDION_SELECTOR } from '../accordion.js';
import { MODAL_SELECTOR, MODAL_OPEN_SELECTOR } from '../modal.js';
import { TABS_SELECTOR } from '../tabs.js';
import { TOOLTIP_SELECTOR } from '../tooltip.js';

describe('Enhancer selector constants', () => {
  it.each([
    ['ACCORDION_SELECTOR', ACCORDION_SELECTOR, '[data-sol-accordion]'],
    ['MODAL_SELECTOR', MODAL_SELECTOR, '[data-sol-modal]'],
    ['MODAL_OPEN_SELECTOR', MODAL_OPEN_SELECTOR, '[data-modal-open]'],
    ['TABS_SELECTOR', TABS_SELECTOR, '[data-sol-tabs]'],
    ['TOOLTIP_SELECTOR', TOOLTIP_SELECTOR, '[data-sol-tooltip]'],
  ])('%s exports the expected value', (_name, actual, expected) => {
    expect(actual).toBe(expected);
  });
});
