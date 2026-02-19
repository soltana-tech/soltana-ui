import type { Page, ConsoleMessage } from '@playwright/test';

export interface TierAttributes {
  theme: string | null;
  relief: string | null;
  finish: string | null;
}

/** Read all three data-* tier attributes from <html>. */
export async function getTierAttributes(page: Page): Promise<TierAttributes> {
  return page.evaluate(() => {
    const root = document.documentElement;
    return {
      theme: root.getAttribute('data-theme'),
      relief: root.getAttribute('data-relief'),
      finish: root.getAttribute('data-finish'),
    };
  });
}

/** Read a computed CSS custom property value from an element (defaults to <html>). */
export async function getComputedCSSProperty(
  page: Page,
  property: string,
  selector = 'html'
): Promise<string> {
  return page.evaluate(
    ({ prop, sel }) => {
      const el = document.querySelector(sel);
      if (!el) return '';
      return getComputedStyle(el).getPropertyValue(prop).trim();
    },
    { prop: property, sel: selector }
  );
}

/** Read an inline style property value from <html>. */
export async function getInlineStyleProperty(page: Page, property: string): Promise<string> {
  return page.evaluate((prop) => document.documentElement.style.getPropertyValue(prop), property);
}

async function captureConsole(
  page: Page,
  type: string,
  action: () => Promise<void>
): Promise<string[]> {
  const messages: string[] = [];
  const handler = (msg: ConsoleMessage): void => {
    if (msg.type() === type) messages.push(msg.text());
  };
  page.on('console', handler);
  await action();
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(r)));
  page.off('console', handler);
  return messages;
}

export function captureWarnings(page: Page, action: () => Promise<void>): Promise<string[]> {
  return captureConsole(page, 'warning', action);
}

export function captureErrors(page: Page, action: () => Promise<void>): Promise<string[]> {
  return captureConsole(page, 'error', action);
}

export interface ChangeEventDetail {
  type: string;
  value: unknown;
}

/**
 * Listen for a soltana:change CustomEvent, execute an action, and return the event detail.
 * Sets up listener before the action to avoid race conditions.
 */
export async function captureChangeEvent(
  page: Page,
  action: () => Promise<void>
): Promise<ChangeEventDetail> {
  // Install a one-shot listener that stores the detail
  await page.evaluate(() => {
    (window as any).__soltanaChangeDetail = null;
    document.documentElement.addEventListener(
      'soltana:change',
      (e) => {
        (window as any).__soltanaChangeDetail = (e as CustomEvent).detail;
      },
      { once: true }
    );
  });

  await action();

  return page.evaluate(() => (window as any).__soltanaChangeDetail) as Promise<ChangeEventDetail>;
}
