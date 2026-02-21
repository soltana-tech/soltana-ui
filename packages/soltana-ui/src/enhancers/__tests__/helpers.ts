import type { EnhancerCleanup } from '../../config/types.js';

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
