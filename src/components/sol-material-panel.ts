import { SoltanaElement } from './base/SoltanaElement.js';

/**
 * Material Panel — Elegant sidebar for material system selection
 *
 * Provides user control over base materials (neuro/glass/hybrid),
 * surface treatments, and ornamental styles. Persists to localStorage.
 */
export class SolMaterialPanel extends SoltanaElement {
  private _isOpen = false;
  private _material: 'neuro' | 'glass' | 'hybrid' = 'neuro';
  private _surface = 'polished';
  private _ornaments = new Set<string>();

  static get observedAttributes(): string[] {
    return ['open', 'position'];
  }

  constructor() {
    super();
    this._loadFromStorage();
  }

  get open(): boolean {
    return this._isOpen;
  }

  set open(value: boolean) {
    this._isOpen = value;
    this.toggleAttribute('open', value);
    if (this.isConnected) this.render();
  }

  attributeChangedCallback(name: string, _oldValue: string | null, _newValue: string | null): void {
    if (name === 'open') {
      this._isOpen = this.hasAttribute('open');
    }
    if (this.isConnected) this.render();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._applyMaterial();
  }

  private _loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('soltana-material');
      if (stored) {
        const data = JSON.parse(stored) as {
          material?: 'neuro' | 'glass' | 'hybrid';
          surface?: string;
          ornaments?: string[];
        };
        this._material = data.material ?? 'neuro';
        this._surface = data.surface ?? 'polished';
        this._ornaments = new Set(data.ornaments ?? []);
      }
    } catch {
      // Use defaults on error
    }
  }

  private _saveToStorage(): void {
    try {
      localStorage.setItem(
        'soltana-material',
        JSON.stringify({
          material: this._material,
          surface: this._surface,
          ornaments: Array.from(this._ornaments),
        })
      );
    } catch {
      // Storage unavailable
    }
  }

  private _applyMaterial(): void {
    const root = document.documentElement;

    // Remove existing material classes
    root.classList.remove('material-neuro', 'material-glass', 'material-hybrid');
    root.removeAttribute('data-material');
    root.removeAttribute('data-surface');
    root.removeAttribute('data-ornament');

    // Apply new material
    root.classList.add(`material-${this._material}`);
    root.setAttribute('data-material', this._material);
    root.setAttribute('data-surface', this._surface);

    if (this._ornaments.size > 0) {
      root.setAttribute('data-ornament', Array.from(this._ornaments).join(' '));
    }

    this._saveToStorage();
  }

  private _handleMaterialChange(material: 'neuro' | 'glass' | 'hybrid'): void {
    this._material = material;
    this._applyMaterial();
    this.render();
  }

  private _handleSurfaceChange(surface: string): void {
    this._surface = surface;
    this._applyMaterial();
    this.render();
  }

  private _handleOrnamentToggle(ornament: string): void {
    if (this._ornaments.has(ornament)) {
      this._ornaments.delete(ornament);
    } else {
      this._ornaments.add(ornament);
    }
    this._applyMaterial();
    this.render();
  }

  private _toggle(): void {
    this.open = !this._isOpen;
  }

  protected render(): void {
    const position = this.getAttribute('position') ?? 'right';
    const isOpen = this._isOpen;

    const styles = `
      :host {
        display: block;
        position: fixed;
        top: 0;
        ${position}: 0;
        height: 100vh;
        z-index: 9999;
        pointer-events: none;
      }

      .panel-container {
        display: flex;
        flex-direction: ${position === 'left' ? 'row' : 'row-reverse'};
        height: 100%;
        pointer-events: auto;
      }

      .toggle-btn {
        position: relative;
        width: 48px;
        height: 48px;
        margin-top: 1rem;
        background: linear-gradient(145deg, var(--glass-gradient-start, rgb(255 255 255 / 50%)), var(--glass-gradient-end, rgb(238 240 245 / 40%)));
        backdrop-filter: blur(12px);
        border: 1px solid var(--glass-border, rgb(146 156 176 / 15%));
        border-radius: ${position === 'left' ? '0 var(--radius-lg) var(--radius-lg) 0' : 'var(--radius-lg) 0 0 var(--radius-lg)'};
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
          0 4px 16px var(--glass-shadow, rgb(85 97 120 / 10%)),
          inset 0 1px 0 var(--glass-inner-glow, rgb(255 255 255 / 45%));
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .toggle-btn:hover {
        transform: scale(1.05);
        box-shadow:
          0 6px 24px var(--glass-shadow, rgb(85 97 120 / 15%)),
          inset 0 1px 0 var(--glass-inner-glow, rgb(255 255 255 / 55%));
      }

      .toggle-btn svg {
        width: 24px;
        height: 24px;
        fill: none;
        stroke: var(--text-primary, #1e2128);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        transition: transform 0.3s ease;
      }

      .toggle-btn.open svg {
        transform: rotate(180deg);
      }

      .panel {
        width: 320px;
        height: 100%;
        background: linear-gradient(145deg, var(--glass-gradient-start, rgb(255 255 255 / 50%)), var(--glass-gradient-end, rgb(238 240 245 / 40%)));
        backdrop-filter: blur(20px);
        border-${position === 'left' ? 'right' : 'left'}: 1px solid var(--glass-border, rgb(146 156 176 / 15%));
        box-shadow:
          ${position === 'left' ? '4px' : '-4px'} 0 24px var(--glass-shadow, rgb(85 97 120 / 10%)),
          inset 0 1px 0 var(--glass-inner-glow, rgb(255 255 255 / 45%));
        transform: translateX(${isOpen ? '0' : position === 'left' ? '-100%' : '100%'});
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow-y: auto;
        overflow-x: hidden;
      }

      .panel-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-default, rgb(85 97 120 / 12%));
        position: relative;
      }

      .panel-header::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 20%;
        right: 20%;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--gold-400, #d4a843), transparent);
        opacity: 0.4;
      }

      .panel-title {
        font-family: var(--font-serif);
        font-size: 1.25rem;
        font-weight: var(--font-semibold);
        letter-spacing: var(--tracking-elegant);
        color: var(--text-primary, #1e2128);
        margin: 0;
        text-align: center;
      }

      .panel-subtitle {
        font-size: 0.75rem;
        color: var(--text-muted, #7e8594);
        text-align: center;
        margin-top: 0.25rem;
        letter-spacing: var(--tracking-refined);
      }

      .panel-section {
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid var(--border-subtle, rgb(85 97 120 / 7%));
      }

      .section-title {
        font-family: var(--font-sans);
        font-size: 0.75rem;
        font-weight: var(--font-semibold);
        text-transform: uppercase;
        letter-spacing: var(--tracking-elegant);
        color: var(--text-tertiary, #5c6375);
        margin: 0 0 1rem 0;
      }

      .material-options {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .material-option {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        background: var(--surface-1, #fff);
        border: 1px solid var(--border-default, rgb(85 97 120 / 12%));
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .material-option:hover {
        border-color: var(--border-strong, rgb(85 97 120 / 20%));
        box-shadow: 0 2px 8px var(--glass-shadow, rgb(85 97 120 / 10%));
      }

      .material-option.selected {
        border-color: var(--accent-primary, #576378);
        background: var(--state-hover, rgb(85 97 120 / 6%));
        box-shadow:
          0 0 0 2px var(--state-focus-ring, rgb(87 99 120 / 35%)),
          0 2px 8px var(--glass-shadow, rgb(85 97 120 / 10%));
      }

      .material-radio {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid var(--border-strong, rgb(85 97 120 / 20%));
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .material-option.selected .material-radio {
        border-color: var(--accent-primary, #576378);
      }

      .material-option.selected .material-radio::after {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--accent-primary, #576378);
      }

      .material-info {
        flex: 1;
      }

      .material-name {
        font-weight: var(--font-medium);
        color: var(--text-primary, #1e2128);
        font-size: 0.875rem;
      }

      .material-desc {
        font-size: 0.75rem;
        color: var(--text-muted, #7e8594);
        margin-top: 0.125rem;
      }

      .surface-select {
        width: 100%;
        padding: 0.625rem 1rem;
        background: var(--surface-1, #fff);
        border: 1px solid var(--border-default, rgb(85 97 120 / 12%));
        border-radius: var(--radius-lg);
        font-family: var(--font-sans);
        font-size: 0.875rem;
        color: var(--text-primary, #1e2128);
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238a7e6a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.75rem center;
        background-size: 1rem;
      }

      .surface-select:focus {
        outline: none;
        border-color: var(--accent-primary, #576378);
        box-shadow: 0 0 0 3px var(--state-focus-ring, rgb(87 99 120 / 35%));
      }

      .ornament-options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .ornament-option {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        border-radius: var(--radius-md);
        transition: background 0.2s ease;
      }

      .ornament-option:hover {
        background: var(--state-hover, rgb(85 97 120 / 6%));
      }

      .ornament-checkbox {
        width: 16px;
        height: 16px;
        border: 2px solid var(--border-strong, rgb(85 97 120 / 20%));
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.2s ease;
      }

      .ornament-option.checked .ornament-checkbox {
        background: var(--accent-primary, #576378);
        border-color: var(--accent-primary, #576378);
      }

      .ornament-option.checked .ornament-checkbox::after {
        content: '';
        width: 8px;
        height: 6px;
        border-left: 2px solid white;
        border-bottom: 2px solid white;
        transform: rotate(-45deg) translateY(-1px);
      }

      .ornament-label {
        font-size: 0.875rem;
        color: var(--text-primary, #1e2128);
      }

      .preview-section {
        padding: 1.25rem 1.5rem;
      }

      .preview-card {
        padding: 1rem;
        border-radius: var(--radius-lg);
        text-align: center;
        font-size: 0.875rem;
        color: var(--text-secondary, #3a3f4c);
        transition: all 0.3s ease;
      }

      .preview-card.neuro {
        background: var(--neuro-bg, #e2e5ed);
        box-shadow:
          4px 4px 10px var(--neuro-shadow-dark, rgb(140 150 170 / 35%)),
          -4px -4px 10px var(--neuro-shadow-light, rgb(255 255 255 / 88%));
      }

      .preview-card.glass {
        background: var(--glass-bg, rgb(255 255 255 / 35%));
        backdrop-filter: blur(12px);
        border: 1px solid var(--glass-border, rgb(146 156 176 / 15%));
        box-shadow: 0 4px 16px var(--glass-shadow, rgb(85 97 120 / 10%));
      }

      .preview-card.hybrid {
        background: linear-gradient(145deg, var(--glass-gradient-start, rgb(255 255 255 / 50%)), var(--glass-gradient-end, rgb(238 240 245 / 30%)));
        backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border, rgb(146 156 176 / 15%));
        box-shadow:
          4px 4px 10px var(--neuro-shadow-dark, rgb(140 150 170 / 35%)),
          -3px -3px 8px var(--neuro-shadow-light, rgb(255 255 255 / 88%));
      }

      .preview-label {
        font-size: 0.75rem;
        color: var(--text-muted, #7e8594);
        margin-top: 0.75rem;
        text-align: center;
      }

      /* Baroque frame decoration */
      .panel-header::before {
        content: '';
        position: absolute;
        top: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid var(--gold-400, #d4a843);
        background: var(--surface-1, #fff);
        box-shadow: 0 0 8px rgb(212 168 67 / 20%);
      }
    `;

    const html = `
      <div class="panel-container">
        <button class="toggle-btn ${isOpen ? 'open' : ''}" aria-label="Toggle material panel">
          <svg viewBox="0 0 24 24">
            <path d="M${position === 'left' ? '9 18l6-6-6-6' : '15 18l-6-6 6-6'}"/>
          </svg>
        </button>
        <div class="panel">
          <div class="panel-header">
            <h2 class="panel-title">Material System</h2>
            <p class="panel-subtitle">Customize your experience</p>
          </div>

          <div class="panel-section">
            <h3 class="section-title">Base Material</h3>
            <div class="material-options">
              <div class="material-option ${this._material === 'neuro' ? 'selected' : ''}" data-material="neuro">
                <div class="material-radio"></div>
                <div class="material-info">
                  <div class="material-name">Neumorphic</div>
                  <div class="material-desc">Polished stone surfaces</div>
                </div>
              </div>
              <div class="material-option ${this._material === 'glass' ? 'selected' : ''}" data-material="glass">
                <div class="material-radio"></div>
                <div class="material-info">
                  <div class="material-name">Glassmorphic</div>
                  <div class="material-desc">Crystal transparency</div>
                </div>
              </div>
              <div class="material-option ${this._material === 'hybrid' ? 'selected' : ''}" data-material="hybrid">
                <div class="material-radio"></div>
                <div class="material-info">
                  <div class="material-name">Hybrid</div>
                  <div class="material-desc">Glass with soft shadows</div>
                </div>
              </div>
            </div>
          </div>

          <div class="panel-section">
            <h3 class="section-title">Surface Type</h3>
            <select class="surface-select">
              <option value="polished" ${this._surface === 'polished' ? 'selected' : ''}>Polished</option>
              <option value="frosted" ${this._surface === 'frosted' ? 'selected' : ''}>Frosted</option>
              <option value="stained" ${this._surface === 'stained' ? 'selected' : ''}>Stained Glass</option>
              <option value="matte" ${this._surface === 'matte' ? 'selected' : ''}>Matte</option>
              <option value="metallic" ${this._surface === 'metallic' ? 'selected' : ''}>Metallic</option>
            </select>
          </div>

          <div class="panel-section">
            <h3 class="section-title">Ornamental Style</h3>
            <div class="ornament-options">
              <div class="ornament-option ${this._ornaments.has('baroque') ? 'checked' : ''}" data-ornament="baroque">
                <div class="ornament-checkbox"></div>
                <span class="ornament-label">Baroque Flourishes</span>
              </div>
              <div class="ornament-option ${this._ornaments.has('carved') ? 'checked' : ''}" data-ornament="carved">
                <div class="ornament-checkbox"></div>
                <span class="ornament-label">Carved Frames</span>
              </div>
              <div class="ornament-option ${this._ornaments.has('faceted') ? 'checked' : ''}" data-ornament="faceted">
                <div class="ornament-checkbox"></div>
                <span class="ornament-label">Faceted Edges</span>
              </div>
              <div class="ornament-option ${this._ornaments.has('gilt') ? 'checked' : ''}" data-ornament="gilt">
                <div class="ornament-checkbox"></div>
                <span class="ornament-label">Gilt Accents</span>
              </div>
            </div>
          </div>

          <div class="preview-section">
            <h3 class="section-title">Preview</h3>
            <div class="preview-card ${this._material}">
              Sample Card
            </div>
            <p class="preview-label">Current: ${this._material} / ${this._surface}</p>
          </div>
        </div>
      </div>
    `;

    this.setContent(styles, html);
    this._attachEventListeners();
  }

  private _attachEventListeners(): void {
    // Toggle button
    const toggleBtn = this.shadow.querySelector('.toggle-btn');
    toggleBtn?.addEventListener('click', () => {
      this._toggle();
    });

    // Material options
    const materialOptions = this.shadow.querySelectorAll('.material-option');
    materialOptions.forEach((option) => {
      option.addEventListener('click', () => {
        const material = (option as HTMLElement).dataset.material as 'neuro' | 'glass' | 'hybrid';
        this._handleMaterialChange(material);
      });
    });

    // Surface select
    const surfaceSelect = this.shadow.querySelector('.surface-select');
    if (surfaceSelect) {
      surfaceSelect.addEventListener('change', () => {
        this._handleSurfaceChange((surfaceSelect as HTMLSelectElement).value);
      });
    }

    // Ornament options
    const ornamentOptions = this.shadow.querySelectorAll('.ornament-option');
    ornamentOptions.forEach((option) => {
      option.addEventListener('click', () => {
        const ornament = (option as HTMLElement).dataset.ornament;
        if (ornament) {
          this._handleOrnamentToggle(ornament);
        }
      });
    });
  }
}

customElements.define('sol-material-panel', SolMaterialPanel);
