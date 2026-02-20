import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
