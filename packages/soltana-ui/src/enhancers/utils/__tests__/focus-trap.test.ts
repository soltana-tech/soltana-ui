import { describe, it, expect, vi, beforeEach } from 'vitest';
import fc from 'fast-check';
import { trapFocus, FOCUSABLE } from '../focus-trap.js';

function createContainer(focusableCount: number): HTMLElement {
  const container = document.createElement('div');
  for (let i = 0; i < focusableCount; i++) {
    const btn = document.createElement('button');
    btn.textContent = `Button ${String(i)}`;
    container.appendChild(btn);
  }
  document.body.appendChild(container);
  return container;
}

function makeKeyboardEvent(shiftKey: boolean): KeyboardEvent {
  return new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true });
}

describe('trapFocus', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('wraps focus from last to first on Tab', () => {
    const container = createContainer(3);
    const buttons = container.querySelectorAll('button');
    (buttons[2] as HTMLElement).focus();

    const event = makeKeyboardEvent(false);
    const preventSpy = vi.spyOn(event, 'preventDefault');

    trapFocus(container, event);

    expect(preventSpy).toHaveBeenCalled();
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('wraps focus from first to last on Shift+Tab', () => {
    const container = createContainer(3);
    const buttons = container.querySelectorAll('button');
    (buttons[0] as HTMLElement).focus();

    const event = makeKeyboardEvent(true);
    const preventSpy = vi.spyOn(event, 'preventDefault');

    trapFocus(container, event);

    expect(preventSpy).toHaveBeenCalled();
    expect(document.activeElement).toBe(buttons[2]);
  });

  it('does nothing with zero focusable elements', () => {
    const container = document.createElement('div');
    container.innerHTML = '<p>No buttons here</p>';
    document.body.appendChild(container);

    const event = makeKeyboardEvent(false);
    const preventSpy = vi.spyOn(event, 'preventDefault');

    trapFocus(container, event);

    expect(preventSpy).not.toHaveBeenCalled();
  });

  it('does not prevent default when focus is in the middle', () => {
    const container = createContainer(3);
    const buttons = container.querySelectorAll('button');
    (buttons[1] as HTMLElement).focus();

    const event = makeKeyboardEvent(false);
    const preventSpy = vi.spyOn(event, 'preventDefault');

    trapFocus(container, event);

    expect(preventSpy).not.toHaveBeenCalled();
  });

  it('exports the FOCUSABLE selector string', () => {
    expect(FOCUSABLE).toContain('button');
    expect(FOCUSABLE).toContain('a[href]');
    expect(FOCUSABLE).toContain('input');
  });
});

describe('trapFocus property-based', () => {
  it('focus never escapes container', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        fc.boolean(),
        (count: number, shiftKey: boolean) => {
          document.body.innerHTML = '';
          const container = createContainer(count);
          const buttons = Array.from(container.querySelectorAll('button'));

          // Focus last element for forward Tab, first for backward
          const focusIdx = shiftKey ? 0 : count - 1;
          buttons[focusIdx].focus();

          trapFocus(container, makeKeyboardEvent(shiftKey));

          expect(container.contains(document.activeElement)).toBe(true);
        }
      )
    );
  });
});
