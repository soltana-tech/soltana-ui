import type { Page } from '@playwright/test';
import type { TierCombination } from './combinations';
import { buildTestDocument } from './assets';

function componentHTML(): string {
  return `
    <main style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
      <h1 class="sr-only">Soltana UI Component Test</h1>

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

      <!-- Code -->
      <section>
        <p>Inline <span class="code">const x = 1</span> code.</p>
        <div class="code-block"><code>function greet() {\n  return "Hello";\n}</code></div>
      </section>

      <!-- Image -->
      <section>
        <div class="img-thumbnail" style="width: 120px; height: 80px; background: var(--surface-3);"></div>
      </section>

      <!-- Link variants -->
      <section>
        <a class="link" href="#">Accent link</a>
        <a class="link-muted" href="#">Muted link</a>
        <a class="link-plain" href="#">Plain link</a>
      </section>

      <!-- Collapsible -->
      <section>
        <div class="collapsible collapsible-bordered">
          <button class="collapsible-trigger">Collapsible</button>
          <div class="collapsible-content"><p>Content</p></div>
        </div>
      </section>

      <!-- Alert Dialog -->
      <section>
        <div class="alert-dialog" style="position: static; transform: none; opacity: 1;">
          <div class="alert-dialog-icon alert-dialog-icon-warning">!</div>
          <div class="alert-dialog-title">Confirm</div>
          <div class="alert-dialog-body">Are you sure?</div>
          <div class="alert-dialog-actions">
            <button class="btn btn-secondary">Cancel</button>
            <button class="btn btn-danger">Delete</button>
          </div>
        </div>
      </section>

      <!-- Carousel (static) -->
      <section>
        <div class="carousel" style="max-width: 320px;">
          <div class="carousel-track">
            <div class="carousel-slide" style="background: var(--surface-3); height: 100px;"></div>
          </div>
          <div class="carousel-dots">
            <button class="carousel-dot active" aria-label="Slide 1"></button>
            <button class="carousel-dot" aria-label="Slide 2"></button>
          </div>
        </div>
      </section>

      <!-- Table Panel -->
      <section>
        <div class="table-panel" style="max-width: 640px;">
          <div class="table-scroll">
            <table class="table">
              <thead><tr><th>Week</th><th>Topic</th><th>Reading</th></tr></thead>
              <tbody>
                <tr>
                  <td><span class="row-overlay"></span>Week 01</td>
                  <td>Introduction</td>
                  <td>Genesis 1</td>
                </tr>
                <tr class="active">
                  <td><span class="row-overlay"></span>Week 02</td>
                  <td>Creation</td>
                  <td>Genesis 2-3</td>
                </tr>
                <tr>
                  <td><span class="row-overlay"></span>Week 03</td>
                  <td>Fall</td>
                  <td>Genesis 4-5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Action List -->
      <section style="max-width: 320px;">
        <div class="action-list">
          <button class="action-item">
            <span class="action-item-label">Day 1</span>
            <span class="action-item-text">Genesis 1</span>
          </button>
          <button class="action-item is-active">
            <span class="action-item-label">Day 2</span>
            <span class="action-item-text">Genesis 2</span>
          </button>
          <button class="action-item is-empty" disabled>
            <span class="action-item-label">Day 3</span>
            <span class="action-item-text is-empty">No reading</span>
          </button>
        </div>
      </section>

      <!-- FAB Extended + Controlled -->
      <div class="fab fab-extended fab-controlled is-visible fab-bottom-right">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        <span class="fab-label">Current</span>
      </div>

    </main>
  `;
}

export async function renderCombination(page: Page, combo: TierCombination): Promise<void> {
  const html = buildTestDocument({
    theme: combo.theme,
    relief: combo.relief,
    finish: combo.finish,
    bodyHTML: componentHTML(),
  });

  await page.setContent(html, { waitUntil: 'domcontentloaded' });
}

export function combinationLabel(combo: TierCombination): string {
  return `${combo.theme}-${combo.relief}-${combo.finish}`;
}
