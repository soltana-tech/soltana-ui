import type { Page } from '@playwright/test';
import { buildTestDocument } from './assets';

export interface SoltanaPageOptions {
  bodyHTML?: string;
  initialAttrs?: {
    theme?: string;
    relief?: string;
    finish?: string;
  };
}

/**
 * Set up a page with the Soltana CSS + UMD JS bundle loaded.
 * The global `window.SoltanaUI` object is available via page.evaluate().
 */
export async function setupSoltanaPage(
  page: Page,
  options: SoltanaPageOptions = {}
): Promise<void> {
  const attrs = options.initialAttrs ?? {};

  const html = buildTestDocument({
    theme: attrs.theme,
    relief: attrs.relief,
    finish: attrs.finish,
    bodyHTML: options.bodyHTML,
    includeJS: true,
  });

  await page.setContent(html, { waitUntil: 'domcontentloaded' });
}
