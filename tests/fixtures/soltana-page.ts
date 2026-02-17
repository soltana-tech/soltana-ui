import fs from 'node:fs';
import path from 'node:path';
import type { Page } from '@playwright/test';

const CSS_PATH = path.resolve('dist/soltana-ui.css');
const JS_PATH = path.resolve('dist/soltana-ui.umd.cjs');

let cssCache: string | null = null;
let jsCache: string | null = null;

function getCSS(): string {
  if (!cssCache) cssCache = fs.readFileSync(CSS_PATH, 'utf-8');
  return cssCache;
}

function getJS(): string {
  if (!jsCache) jsCache = fs.readFileSync(JS_PATH, 'utf-8');
  return jsCache;
}

export interface SoltanaPageOptions {
  bodyHTML?: string;
  initialAttrs?: {
    theme?: string;
    relief?: string;
    finish?: string;
    ornament?: string;
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
  const css = getCSS();
  const js = getJS();

  const attrs = options.initialAttrs ?? {};
  const attrStr = Object.entries(attrs)
    .map(([k, v]) => `data-${k}="${v}"`)
    .join(' ');

  const html = `<!DOCTYPE html>
<html lang="en" ${attrStr}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Soltana Test</title>
  <style>${css}</style>
</head>
<body>
  ${options.bodyHTML ?? ''}
  <script>${js}</script>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'domcontentloaded' });
}
