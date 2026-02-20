import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { onClickAway } from '../click-away.js';

describe('onClickAway', () => {
  let target: HTMLElement;
  let controller: AbortController;

  beforeEach(() => {
    target = document.createElement('div');
    target.innerHTML = '<button>Inside</button>';
    document.body.appendChild(target);
    controller = new AbortController();
  });

  afterEach(() => {
    controller.abort();
    document.body.innerHTML = '';
  });

  it('fires callback on click outside the target', () => {
    const callback = vi.fn();
    onClickAway(target, callback, controller.signal);

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not fire callback on click inside the target', () => {
    const callback = vi.fn();
    onClickAway(target, callback, controller.signal);

    const inside = target.querySelector('button')!;
    inside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(callback).not.toHaveBeenCalled();
  });

  it('stops listening when signal is aborted', () => {
    const callback = vi.fn();
    onClickAway(target, callback, controller.signal);

    controller.abort();
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(callback).not.toHaveBeenCalled();
  });
});

describe('onClickAway property-based', () => {
  it('callback never fires for inside clicks', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 10 }), (childCount: number) => {
        document.body.innerHTML = '';
        const target = document.createElement('div');
        for (let i = 0; i < childCount; i++) {
          const child = document.createElement('button');
          child.textContent = `Child ${String(i)}`;
          target.appendChild(child);
        }
        document.body.appendChild(target);

        const controller = new AbortController();
        const callback = vi.fn();
        onClickAway(target, callback, controller.signal);

        // Click each child — none should trigger callback
        target.querySelectorAll('button').forEach((btn) => {
          btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        });

        controller.abort();
        expect(callback).not.toHaveBeenCalled();
      })
    );
  });
});
