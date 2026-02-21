import { it, expect } from 'vitest';

type InitFn = (opts?: { root?: Element }) => { destroy: () => void };

export function testDestroyPreventsInteraction(
  init: InitFn,
  createDOM: () => HTMLElement,
  triggerAction: (el: HTMLElement) => void,
  verifyInactive: (el: HTMLElement) => void
): void {
  it('destroy() prevents further interaction', () => {
    const el = createDOM();
    const cleanup = init();
    cleanup.destroy();
    triggerAction(el);
    verifyInactive(el);
  });
}

export function testIdempotentInit(
  init: InitFn,
  createDOM: () => HTMLElement,
  act: (el: HTMLElement) => void
): void {
  it('handles multiple init calls without duplicating listeners', () => {
    const el = createDOM();
    init();
    const cleanup = init();
    act(el);
    cleanup.destroy();
  });
}

export function testNoMatchGraceful(init: InitFn): void {
  it('handles gracefully when no matching elements exist', () => {
    expect(() => init()).not.toThrow();
    init().destroy();
  });
}

export function testCustomRoot(
  init: InitFn,
  setupInRoot: (root: HTMLElement) => void,
  verify: (root: HTMLElement) => void
): void {
  it('scopes queries to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    setupInRoot(root);
    const cleanup = init({ root });
    verify(root);
    cleanup.destroy();
  });
}
