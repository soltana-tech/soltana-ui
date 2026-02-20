// ---------------------------------------------------------------------------
// Color Picker Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-color-picker] elements.
// HSV-based color selection with 2D area, hue slider, and swatches.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';
import { onClickAway } from './utils/click-away.js';

export const COLOR_PICKER_SELECTOR = '[data-sol-color-picker]';

/** Singleton guard — aborted and replaced on each `init*()` call. */
let _controller: AbortController | null = null;

// ---- HSV color model ----

interface HSV {
  h: number; // 0-360
  s: number; // 0-1
  v: number; // 0-1
}

function hsvToRgb(hsv: HSV): [number, number, number] {
  const { h, s, v } = hsv;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
}

function hexToHsv(hex: string): HSV {
  const match = hex.replace('#', '').match(/.{2}/g);
  if (!match) return { h: 0, s: 0, v: 0 };
  const [r, g, b] = match.map((c) => parseInt(c, 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  if (d > 0) {
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }

  return {
    h,
    s: max === 0 ? 0 : d / max,
    v: max,
  };
}

function hsvToHex(hsv: HSV): string {
  const [r, g, b] = hsvToRgb(hsv);
  return rgbToHex(r, g, b);
}

/**
 * Enhance all `[data-sol-color-picker]` elements with interactive
 * color selection behavior.
 *
 * Expected structure:
 * ```html
 * <div data-sol-color-picker class="color-picker">
 *   <button class="color-picker-trigger" style="background: #d4a843;"></button>
 *   <div class="color-picker-popup">
 *     <div class="color-picker-area"></div>
 *     <div class="color-picker-hue"></div>
 *     <input class="color-picker-input input" value="#d4a843" />
 *     <div class="color-picker-swatches" data-swatches='["#d4a843","#a855f7"]'></div>
 *   </div>
 * </div>
 * ```
 */
export function initColorPickers(options?: EnhancerOptions): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  const { signal } = _controller;

  const root = options?.root ?? document;
  root
    .querySelectorAll<HTMLElement>(options?.selector ?? COLOR_PICKER_SELECTOR)
    .forEach((wrapper) => {
      const triggerEl = wrapper.querySelector<HTMLElement>('.color-picker-trigger');
      const popupEl = wrapper.querySelector<HTMLElement>('.color-picker-popup');
      const area = wrapper.querySelector<HTMLElement>('.color-picker-area');
      const hueSlider = wrapper.querySelector<HTMLElement>('.color-picker-hue');
      const colorInput = wrapper.querySelector<HTMLInputElement>('.color-picker-input');

      if (!triggerEl || !popupEl) return;
      const trigger: HTMLElement = triggerEl;
      const popup: HTMLElement = popupEl;

      // Parse initial color from trigger background or input value
      const initialHex = colorInput?.value ?? '#d4a843';
      let hsv = hexToHsv(initialHex);

      // Area thumb
      let areaThumb = area?.querySelector<HTMLElement>('.color-picker-area-thumb');
      if (area && !areaThumb) {
        areaThumb = document.createElement('div');
        areaThumb.className = 'color-picker-area-thumb';
        area.appendChild(areaThumb);
      }

      // Hue thumb
      let hueThumb = hueSlider?.querySelector<HTMLElement>('.color-picker-slider-thumb');
      if (hueSlider && !hueThumb) {
        hueThumb = document.createElement('div');
        hueThumb.className = 'color-picker-slider-thumb';
        hueSlider.appendChild(hueThumb);
      }

      function updateUI(): void {
        const hex = hsvToHex(hsv);
        const [r, g, b] = hsvToRgb({ h: hsv.h, s: 1, v: 1 });
        const hueColor = rgbToHex(r, g, b);

        trigger.style.setProperty('--cp-trigger-bg', hex);
        if (colorInput) colorInput.value = hex;

        if (area) {
          area.style.setProperty('--cp-area-bg', hueColor);
        }
        if (areaThumb) {
          areaThumb.style.setProperty('--cp-thumb-x', `${String(hsv.s * 100)}%`);
          areaThumb.style.setProperty('--cp-thumb-y', `${String((1 - hsv.v) * 100)}%`);
          areaThumb.style.setProperty('--cp-thumb-bg', hex);
        }
        if (hueThumb) {
          hueThumb.style.setProperty('--cp-hue-x', `${String((hsv.h / 360) * 100)}%`);
        }
      }

      function emitChange(): void {
        wrapper.dispatchEvent(
          new CustomEvent('color-change', {
            bubbles: true,
            detail: { hex: hsvToHex(hsv), hsv: { ...hsv } },
          })
        );
      }

      // Toggle popup
      trigger.addEventListener(
        'click',
        () => {
          popup.classList.toggle('active');
          if (popup.classList.contains('active')) {
            updateUI();
          }
        },
        { signal }
      );

      onClickAway(
        wrapper,
        () => {
          popup.classList.remove('active');
        },
        signal
      );

      // Area drag
      if (area) {
        function handleAreaPointer(e: MouseEvent): void {
          if (!area) return;
          const rect = area.getBoundingClientRect();
          hsv.s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          hsv.v = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
          updateUI();
          emitChange();
        }

        area.addEventListener(
          'pointerdown',
          (e: PointerEvent) => {
            handleAreaPointer(e);
            const onMove = (me: PointerEvent): void => {
              handleAreaPointer(me);
            };
            const onUp = (): void => {
              document.removeEventListener('pointermove', onMove);
              document.removeEventListener('pointerup', onUp);
            };
            document.addEventListener('pointermove', onMove);
            document.addEventListener('pointerup', onUp);
          },
          { signal }
        );
      }

      // Hue drag
      if (hueSlider) {
        function handleHuePointer(e: MouseEvent): void {
          if (!hueSlider) return;
          const rect = hueSlider.getBoundingClientRect();
          hsv.h = Math.max(0, Math.min(360, ((e.clientX - rect.left) / rect.width) * 360));
          updateUI();
          emitChange();
        }

        hueSlider.addEventListener(
          'pointerdown',
          (e: PointerEvent) => {
            handleHuePointer(e);
            const onMove = (me: PointerEvent): void => {
              handleHuePointer(me);
            };
            const onUp = (): void => {
              document.removeEventListener('pointermove', onMove);
              document.removeEventListener('pointerup', onUp);
            };
            document.addEventListener('pointermove', onMove);
            document.addEventListener('pointerup', onUp);
          },
          { signal }
        );
      }

      // Input change
      colorInput?.addEventListener(
        'change',
        () => {
          const val = colorInput.value.trim();
          if (/^#[0-9a-fA-F]{6}$/.test(val)) {
            hsv = hexToHsv(val);
            updateUI();
            emitChange();
          }
        },
        { signal }
      );

      // Swatches
      const swatchContainer = wrapper.querySelector<HTMLElement>('.color-picker-swatches');
      if (swatchContainer) {
        const raw = swatchContainer.getAttribute('data-swatches');
        let colors: string[] = [];
        if (raw) {
          try {
            colors = JSON.parse(raw) as string[];
          } catch {
            console.warn('[soltana] Invalid JSON in data-swatches attribute:', raw);
          }
        }
        colors.forEach((color) => {
          const swatch = document.createElement('button');
          swatch.className = 'color-picker-swatch';
          swatch.style.setProperty('--cp-swatch-bg', color);
          swatch.setAttribute('aria-label', color);
          swatch.addEventListener(
            'click',
            () => {
              hsv = hexToHsv(color);
              updateUI();
              emitChange();
            },
            { signal }
          );
          swatchContainer.appendChild(swatch);
        });
      }

      // Keyboard
      popup.addEventListener(
        'keydown',
        (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            popup.classList.remove('active');
            trigger.focus();
          }
        },
        { signal }
      );

      updateUI();
    });

  return {
    destroy() {
      _controller?.abort();
      _controller = null;
    },
  };
}
