import { vi } from 'vitest';
import type { EnhancerCleanup } from '../config/types.js';

/**
 * Verifies that re-calling an enhancer init function does not duplicate listeners.
 * Tests the singleton behavior pattern used across all enhancers.
 *
 * @param initFn - The enhancer init function to test (e.g., initTabs, initModals)
 * @param setupDOM - Callback to create the necessary DOM structure and return the trigger element
 * @param verify - Callback to verify the expected behavior after triggering
 */
export function testSingletonBehavior(
  initFn: () => EnhancerCleanup,
  setupDOM: () => HTMLElement,
  verify: (trigger: HTMLElement) => void
): void {
  const trigger = setupDOM();
  initFn();
  const cleanup = initFn();

  verify(trigger);

  cleanup.destroy();
}

/**
 * Mocks getBoundingClientRect on an HTML element with default positioning values.
 * Useful for tests that require element dimensions and positioning (e.g., tooltips, popovers).
 *
 * @param element - The element to mock getBoundingClientRect on
 * @param overrides - Optional partial DOMRect properties to override defaults
 * @returns The vitest spy instance
 */
export function mockBoundingClientRect(
  element: HTMLElement,
  overrides?: Partial<DOMRect>
): ReturnType<typeof vi.spyOn> {
  const defaultRect: DOMRect = {
    top: 100,
    bottom: 140,
    left: 200,
    right: 300,
    width: 100,
    height: 40,
    x: 200,
    y: 100,
    toJSON: () => ({}),
  };

  return vi
    .spyOn(element, 'getBoundingClientRect')
    .mockReturnValue(Object.assign({}, defaultRect, overrides));
}
