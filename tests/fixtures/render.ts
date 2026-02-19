import fs from 'node:fs';
import path from 'node:path';
import type { Page } from '@playwright/test';
import type { TierCombination } from './combinations';

const CSS_PATH = path.resolve('packages/soltana-ui/dist/soltana-ui.css');

let cssCache: string | null = null;

function getCSS(): string {
  if (!cssCache) {
    cssCache = fs.readFileSync(CSS_PATH, 'utf-8');
  }
  return cssCache;
}

function componentHTML(): string {
  return `
    <main style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">

      <!-- Buttons -->
      <section>
        <button class="btn">Default</button>
        <button class="btn btn-primary">Primary</button>
        <button class="btn btn-secondary">Secondary</button>
        <button class="btn btn-ghost">Ghost</button>
        <button class="btn btn-outline">Outline</button>
        <button class="btn btn-danger">Danger</button>
        <button class="btn btn-success">Success</button>
      </section>

      <!-- Inputs -->
      <section>
        <input class="input" type="text" placeholder="Text input" />
        <label><span class="sr-only">Example select</span><select class="select"><option>Select</option></select></label>
        <textarea class="textarea" placeholder="Textarea"></textarea>
      </section>

      <!-- Card -->
      <section>
        <div class="card" style="max-width: 320px;">
          <div class="card-header">Card Header</div>
          <div class="card-body">Card body content with some text.</div>
          <div class="card-footer">Card Footer</div>
        </div>
      </section>

      <!-- Card Flat -->
      <section>
        <div class="card card-flat" style="max-width: 320px;">
          <div class="card-body">Flat card content.</div>
        </div>
      </section>

      <!-- Badges -->
      <section>
        <span class="badge">Default</span>
        <span class="badge badge-primary">Primary</span>
        <span class="badge badge-success">Success</span>
        <span class="badge badge-warning">Warning</span>
        <span class="badge badge-error">Error</span>
        <span class="badge badge-pill">Pill</span>
      </section>

      <!-- Alert -->
      <section>
        <div class="alert">Default alert message.</div>
        <div class="alert alert-success">Success alert.</div>
        <div class="alert alert-warning">Warning alert.</div>
        <div class="alert alert-error">Error alert.</div>
      </section>

      <!-- Nav -->
      <section>
        <nav class="nav">
          <a class="nav-item active" href="#">Home</a>
          <a class="nav-item" href="#">About</a>
          <a class="nav-item" href="#">Contact</a>
        </nav>
      </section>

      <!-- Toggle -->
      <section>
        <button class="toggle active">On</button>
        <button class="toggle">Off</button>
        <button class="toggle disabled" disabled>Disabled</button>
      </section>

    </main>
  `;
}

export async function renderCombination(page: Page, combo: TierCombination): Promise<void> {
  const css = getCSS();

  const html = `<!DOCTYPE html>
<html lang="en"
  data-theme="${combo.theme}"
  data-relief="${combo.relief}"
  data-finish="${combo.finish}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Soltana UI Test</title>
  <style>${css}</style>
</head>
<body>
  ${componentHTML()}
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'domcontentloaded' });
}

export function combinationLabel(combo: TierCombination): string {
  return `${combo.theme}-${combo.relief}-${combo.finish}`;
}
