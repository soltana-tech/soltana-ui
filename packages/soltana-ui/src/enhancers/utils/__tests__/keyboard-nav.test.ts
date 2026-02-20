import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleKeyboardNav } from '../keyboard-nav.js';

function createList(count: number): HTMLElement {
  const container = document.createElement('div');
  for (let i = 0; i < count; i++) {
    const item = document.createElement('button');
    item.className = 'item';
    item.textContent = `Item ${String(i)}`;
    item.tabIndex = 0;
    container.appendChild(item);
  }
  document.body.appendChild(container);
  return container;
}

function keyEvent(key: string): KeyboardEvent {
  return new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
}

describe('handleKeyboardNav', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('moves focus down on ArrowDown (vertical)', () => {
    const container = createList(3);
    const items = container.querySelectorAll<HTMLElement>('.item');
    items[0].focus();

    const event = keyEvent('ArrowDown');
    const handled = handleKeyboardNav(
      { container, itemSelector: '.item', orientation: 'vertical' },
      event
    );

    expect(handled).toBe(true);
    expect(document.activeElement).toBe(items[1]);
  });

  it('moves focus up on ArrowUp (vertical)', () => {
    const container = createList(3);
    const items = container.querySelectorAll<HTMLElement>('.item');
    items[1].focus();

    handleKeyboardNav(
      { container, itemSelector: '.item', orientation: 'vertical' },
      keyEvent('ArrowUp')
    );

    expect(document.activeElement).toBe(items[0]);
  });

  it('wraps from last to first', () => {
    const container = createList(3);
    const items = container.querySelectorAll<HTMLElement>('.item');
    items[2].focus();

    handleKeyboardNav(
      { container, itemSelector: '.item', orientation: 'vertical', wrap: true },
      keyEvent('ArrowDown')
    );

    expect(document.activeElement).toBe(items[0]);
  });

  it('does not wrap when wrap=false', () => {
    const container = createList(3);
    const items = container.querySelectorAll<HTMLElement>('.item');
    items[2].focus();

    handleKeyboardNav(
      { container, itemSelector: '.item', orientation: 'vertical', wrap: false },
      keyEvent('ArrowDown')
    );

    expect(document.activeElement).toBe(items[2]);
  });

  it('handles Home and End keys', () => {
    const container = createList(5);
    const items = container.querySelectorAll<HTMLElement>('.item');
    items[2].focus();

    handleKeyboardNav(
      { container, itemSelector: '.item', orientation: 'vertical' },
      keyEvent('Home')
    );
    expect(document.activeElement).toBe(items[0]);

    handleKeyboardNav(
      { container, itemSelector: '.item', orientation: 'vertical' },
      keyEvent('End')
    );
    expect(document.activeElement).toBe(items[4]);
  });

  it('calls onActivate on Enter', () => {
    const container = createList(3);
    const items = container.querySelectorAll<HTMLElement>('.item');
    items[1].focus();
    const onActivate = vi.fn();

    handleKeyboardNav(
      { container, itemSelector: '.item', orientation: 'vertical', onActivate },
      keyEvent('Enter')
    );

    expect(onActivate).toHaveBeenCalledWith(items[1]);
  });

  it('ignores ArrowDown when orientation is horizontal', () => {
    const container = createList(3);
    const items = container.querySelectorAll<HTMLElement>('.item');
    items[0].focus();

    const handled = handleKeyboardNav(
      { container, itemSelector: '.item', orientation: 'horizontal' },
      keyEvent('ArrowDown')
    );

    expect(handled).toBe(false);
    expect(document.activeElement).toBe(items[0]);
  });

  it('handles ArrowRight/ArrowLeft in horizontal mode', () => {
    const container = createList(3);
    const items = container.querySelectorAll<HTMLElement>('.item');
    items[0].focus();

    handleKeyboardNav(
      { container, itemSelector: '.item', orientation: 'horizontal' },
      keyEvent('ArrowRight')
    );
    expect(document.activeElement).toBe(items[1]);

    handleKeyboardNav(
      { container, itemSelector: '.item', orientation: 'horizontal' },
      keyEvent('ArrowLeft')
    );
    expect(document.activeElement).toBe(items[0]);
  });

  it('returns false for unrelated keys', () => {
    const container = createList(3);
    const items = container.querySelectorAll<HTMLElement>('.item');
    items[0].focus();

    const handled = handleKeyboardNav(
      { container, itemSelector: '.item', orientation: 'vertical' },
      keyEvent('a')
    );

    expect(handled).toBe(false);
  });
});
