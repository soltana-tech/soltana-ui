import fs from 'node:fs';
import path from 'node:path';

const CSS_PATH = path.resolve('packages/soltana-ui/dist/soltana-ui.css');
const JS_PATH = path.resolve('packages/soltana-ui/dist/soltana-ui.umd.cjs');

let cssCache: string | null = null;
let jsCache: string | null = null;

export function getCSS(): string {
  if (!cssCache) cssCache = fs.readFileSync(CSS_PATH, 'utf-8');
  return cssCache;
}

export function getJS(): string {
  if (!jsCache) jsCache = fs.readFileSync(JS_PATH, 'utf-8');
  return jsCache;
}

export interface TestDocumentOptions {
  theme?: string;
  relief?: string;
  finish?: string;
  bodyHTML?: string;
  includeJS?: boolean;
}

export function buildTestDocument(options: TestDocumentOptions = {}): string {
  const { theme, relief, finish, bodyHTML = '', includeJS = false } = options;
  const css = getCSS();

  const attrs = [
    theme && `data-theme="${theme}"`,
    relief && `data-relief="${relief}"`,
    finish && `data-finish="${finish}"`,
  ]
    .filter(Boolean)
    .join(' ');

  const scriptTag = includeJS ? `<script>${getJS()}</script>` : '';

  return `<!DOCTYPE html>
<html lang="en" ${attrs}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Soltana Test</title>
  <style>${css}</style>
</head>
<body>
  ${bodyHTML}
  ${scriptTag}
</body>
</html>`;
}
