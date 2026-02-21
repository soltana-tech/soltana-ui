import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initColorPickers } from './color-picker.js';
import { mockBoundingClientRect } from './test-helpers.js';

function createColorPicker(initialColor = '#d4a843', swatches?: string[]): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-sol-color-picker', '');
  wrapper.className = 'color-picker';

  const trigger = document.createElement('button');
  trigger.className = 'color-picker-trigger';
  trigger.style.setProperty('--cp-trigger-bg', initialColor);
  wrapper.appendChild(trigger);

  const popup = document.createElement('div');
  popup.className = 'color-picker-popup';

  const area = document.createElement('div');
  area.className = 'color-picker-area';
  popup.appendChild(area);

  const hue = document.createElement('div');
  hue.className = 'color-picker-hue';
  popup.appendChild(hue);

  const input = document.createElement('input');
  input.className = 'color-picker-input input';
  input.value = initialColor;
  popup.appendChild(input);

  if (swatches) {
    const swatchContainer = document.createElement('div');
    swatchContainer.className = 'color-picker-swatches';
    swatchContainer.setAttribute('data-swatches', JSON.stringify(swatches));
    popup.appendChild(swatchContainer);
  }

  wrapper.appendChild(popup);
  document.body.appendChild(wrapper);

  mockBoundingClientRect(area, { width: 200, height: 200, left: 0, top: 0 });
  mockBoundingClientRect(hue, { width: 200, height: 20, left: 0, top: 0 });

  return wrapper;
}

describe('initColorPickers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initColorPickers();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('handles multiple init calls without duplicating listeners', () => {
    const wrapper = createColorPicker();
    const trigger = wrapper.querySelector<HTMLElement>('.color-picker-trigger')!;

    initColorPickers();
    const cleanup = initColorPickers();

    trigger.click();

    const popup = wrapper.querySelector('.color-picker-popup');
    expect(popup!.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('toggles popup on trigger click', () => {
    const wrapper = createColorPicker();
    const trigger = wrapper.querySelector<HTMLElement>('.color-picker-trigger')!;
    const popup = wrapper.querySelector<HTMLElement>('.color-picker-popup')!;
    const cleanup = initColorPickers();

    expect(popup.classList.contains('active')).toBe(false);

    trigger.click();
    expect(popup.classList.contains('active')).toBe(true);

    trigger.click();
    expect(popup.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('creates area thumb element if missing', () => {
    const wrapper = createColorPicker();
    const area = wrapper.querySelector('.color-picker-area')!;

    expect(area.querySelector('.color-picker-area-thumb')).toBeNull();

    const cleanup = initColorPickers();

    const thumb = area.querySelector('.color-picker-area-thumb');
    expect(thumb).not.toBeNull();

    cleanup.destroy();
  });

  it('creates hue slider thumb element if missing', () => {
    const wrapper = createColorPicker();
    const hue = wrapper.querySelector('.color-picker-hue')!;

    expect(hue.querySelector('.color-picker-slider-thumb')).toBeNull();

    const cleanup = initColorPickers();

    const thumb = hue.querySelector('.color-picker-slider-thumb');
    expect(thumb).not.toBeNull();

    cleanup.destroy();
  });

  it('updates color on area pointer interaction', () => {
    const wrapper = createColorPicker();
    const area = wrapper.querySelector<HTMLElement>('.color-picker-area')!;
    const input = wrapper.querySelector<HTMLInputElement>('.color-picker-input')!;
    const cleanup = initColorPickers();

    const initialValue = input.value;

    area.dispatchEvent(
      new MouseEvent('pointerdown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    );

    expect(input.value).not.toBe(initialValue);
    expect(input.value).toMatch(/^#[0-9a-fA-F]{6}$/);

    cleanup.destroy();
  });

  it('updates hue on slider pointer interaction', () => {
    const wrapper = createColorPicker();
    const hue = wrapper.querySelector<HTMLElement>('.color-picker-hue')!;
    const input = wrapper.querySelector<HTMLInputElement>('.color-picker-input')!;
    const cleanup = initColorPickers();

    const initialValue = input.value;

    hue.dispatchEvent(
      new MouseEvent('pointerdown', {
        bubbles: true,
        clientX: 50,
        clientY: 10,
      })
    );

    expect(input.value).not.toBe(initialValue);
    expect(input.value).toMatch(/^#[0-9a-fA-F]{6}$/);

    cleanup.destroy();
  });

  it('updates color on valid hex input change', () => {
    const wrapper = createColorPicker();
    const input = wrapper.querySelector<HTMLInputElement>('.color-picker-input')!;
    const trigger = wrapper.querySelector<HTMLElement>('.color-picker-trigger')!;
    const cleanup = initColorPickers();

    input.value = '#ff5733';
    input.dispatchEvent(new Event('change', { bubbles: true }));

    const bgValue = trigger.style.getPropertyValue('--cp-trigger-bg');
    expect(bgValue).toBe('#ff5733');

    cleanup.destroy();
  });

  it('ignores invalid hex input', () => {
    const wrapper = createColorPicker('#d4a843');
    const input = wrapper.querySelector<HTMLInputElement>('.color-picker-input')!;
    const cleanup = initColorPickers();

    input.value = 'invalid';
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(input.value).toBe('invalid');

    cleanup.destroy();
  });

  it('creates swatch buttons from data-swatches attribute', () => {
    const wrapper = createColorPicker('#d4a843', ['#ff0000', '#00ff00', '#0000ff']);
    const cleanup = initColorPickers();

    const swatches = wrapper.querySelectorAll('.color-picker-swatch');
    expect(swatches).toHaveLength(3);

    expect(swatches[0].getAttribute('aria-label')).toBe('#ff0000');
    expect(swatches[1].getAttribute('aria-label')).toBe('#00ff00');
    expect(swatches[2].getAttribute('aria-label')).toBe('#0000ff');

    cleanup.destroy();
  });

  it('updates color on swatch click', () => {
    const wrapper = createColorPicker('#d4a843', ['#ff0000', '#00ff00']);
    const input = wrapper.querySelector<HTMLInputElement>('.color-picker-input')!;
    const cleanup = initColorPickers();

    const swatches = wrapper.querySelectorAll<HTMLButtonElement>('.color-picker-swatch');
    swatches[0].click();

    expect(input.value).toBe('#ff0000');

    cleanup.destroy();
  });

  it('dispatches color-change event on color update', () => {
    const wrapper = createColorPicker();
    const area = wrapper.querySelector<HTMLElement>('.color-picker-area')!;
    const cleanup = initColorPickers();

    let eventFired = false;
    let eventDetail: { hex: string; hsv: unknown } | null = null;

    wrapper.addEventListener('color-change', (e: Event) => {
      eventFired = true;
      eventDetail = (e as CustomEvent<{ hex: string; hsv: unknown }>).detail;
    });

    area.dispatchEvent(
      new MouseEvent('pointerdown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    );

    expect(eventFired).toBe(true);
    expect(eventDetail).not.toBeNull();
    expect(eventDetail!.hex).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(eventDetail!.hsv).toHaveProperty('h');
    expect(eventDetail!.hsv).toHaveProperty('s');
    expect(eventDetail!.hsv).toHaveProperty('v');

    cleanup.destroy();
  });

  it('closes popup on Escape key', () => {
    const wrapper = createColorPicker();
    const trigger = wrapper.querySelector<HTMLElement>('.color-picker-trigger')!;
    const popup = wrapper.querySelector<HTMLElement>('.color-picker-popup')!;
    const cleanup = initColorPickers();

    trigger.click();
    expect(popup.classList.contains('active')).toBe(true);

    popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(popup.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('scopes queries to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-sol-color-picker', '');
    const trigger = document.createElement('button');
    trigger.className = 'color-picker-trigger';
    wrapper.appendChild(trigger);
    const popup = document.createElement('div');
    popup.className = 'color-picker-popup';
    wrapper.appendChild(popup);
    root.appendChild(wrapper);

    const cleanup = initColorPickers({ root });

    trigger.click();
    expect(popup.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  describe('error handling', () => {
    it('handles gracefully when no elements match the color picker selector', () => {
      expect(() => initColorPickers()).not.toThrow();
      const cleanup = initColorPickers();
      expect(typeof cleanup.destroy).toBe('function');
      cleanup.destroy();
    });

    it('handles gracefully when color picker lacks trigger element', () => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-sol-color-picker', '');
      const popup = document.createElement('div');
      popup.className = 'color-picker-popup';
      wrapper.appendChild(popup);
      document.body.appendChild(wrapper);

      expect(() => initColorPickers()).not.toThrow();
      const cleanup = initColorPickers();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });

    it('handles gracefully when color picker lacks popup element', () => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-sol-color-picker', '');
      const trigger = document.createElement('button');
      trigger.className = 'color-picker-trigger';
      wrapper.appendChild(trigger);
      document.body.appendChild(wrapper);

      expect(() => initColorPickers()).not.toThrow();
      const cleanup = initColorPickers();
      expect(typeof cleanup.destroy).toBe('function');

      cleanup.destroy();
    });

    it('handles gracefully when data-swatches contains invalid JSON', () => {
      const wrapper = createColorPicker();
      const popup = wrapper.querySelector('.color-picker-popup')!;
      const swatchContainer = document.createElement('div');
      swatchContainer.className = 'color-picker-swatches';
      swatchContainer.setAttribute('data-swatches', 'invalid-json');
      popup.appendChild(swatchContainer);

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        /* no-op */
      });

      expect(() => initColorPickers()).not.toThrow();
      const cleanup = initColorPickers();

      expect(consoleWarnSpy).toHaveBeenCalled();

      const swatches = wrapper.querySelectorAll('.color-picker-swatch');
      expect(swatches).toHaveLength(0);

      cleanup.destroy();
      consoleWarnSpy.mockRestore();
    });
  });
});
