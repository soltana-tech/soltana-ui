import fs from 'node:fs';
import path from 'node:path';
import { getCSS } from './assets';

const MERMAID_JS_PATH = path.resolve('packages/mermaid/node_modules/mermaid/dist/mermaid.min.js');
const THEME_DIR = path.resolve('packages/tokens/dist/mermaid');

let mermaidJsCache: string | null = null;
const themeJsonCache = new Map<string, string>();

export function getMermaidJS(): string {
  if (!mermaidJsCache) mermaidJsCache = fs.readFileSync(MERMAID_JS_PATH, 'utf-8');
  return mermaidJsCache;
}

export function getThemeJSON(theme: string): string {
  let cached = themeJsonCache.get(theme);
  if (!cached) {
    cached = fs.readFileSync(path.join(THEME_DIR, `${theme}.json`), 'utf-8');
    themeJsonCache.set(theme, cached);
  }
  return cached;
}

export interface MermaidDocumentOptions {
  theme: string;
  diagram: string;
  width?: number;
  height?: number;
}

export function buildMermaidTestDocument(options: MermaidDocumentOptions): string {
  const { theme, diagram, width = 800, height = 600 } = options;
  const css = getCSS();
  const mermaidJs = getMermaidJS();
  const themeJson = getThemeJSON(theme);

  return `<!DOCTYPE html>
<html lang="en" data-theme="${theme}" data-relief="flat" data-finish="matte">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mermaid Test — ${theme}</title>
  <style>${css}</style>
  <style>
    body { margin: 0; padding: 0; background: var(--surface-bg); }
    #diagram { width: ${width}px; min-height: ${height}px; }
  </style>
</head>
<body>
  <pre id="diagram" class="mermaid">${diagram}</pre>
  <script>${mermaidJs}</script>
  <script>
    (function() {
      var themeData = ${themeJson};
      mermaid.initialize({
        startOnLoad: true,
        theme: 'base',
        themeVariables: themeData.themeVariables || themeData
      });
      window.__mermaidReady = false;
      mermaid.run().then(function() {
        window.__mermaidReady = true;
      });
    })();
  </script>
</body>
</html>`;
}
