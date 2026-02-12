import type { SoltanaInstance, Theme, Material, Surface, Ornament } from '../../src/config';

interface OptionConfig {
  value: string;
  label: string;
  icon?: string;
}

const THEME_OPTIONS: OptionConfig[] = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'sepia', label: 'Sepia', icon: '📜' },
];

const MATERIAL_OPTIONS: OptionConfig[] = [
  { value: 'neuro', label: 'Neumorphic' },
  { value: 'glass', label: 'Glassmorphic' },
  { value: 'hybrid', label: 'Hybrid' },
];

const SURFACE_OPTIONS: OptionConfig[] = [
  { value: 'polished', label: 'Polished' },
  { value: 'frosted', label: 'Frosted' },
  { value: 'stained', label: 'Stained' },
  { value: 'metallic', label: 'Metallic' },
];

const ORNAMENT_OPTIONS: OptionConfig[] = [
  { value: 'none', label: 'None' },
  { value: 'baroque', label: 'Baroque' },
  { value: 'carved', label: 'Carved' },
  { value: 'faceted', label: 'Faceted' },
  { value: 'gilt', label: 'Gilt' },
];

/**
 * Settings panel for the 4-tier design system.
 * Uses the initSoltana() API to control theme, material, surface, and ornament.
 */
export class SettingsPanel {
  private container: HTMLElement | null = null;
  private isOpen = false;
  private soltana: SoltanaInstance;

  constructor(soltana: SoltanaInstance) {
    this.soltana = soltana;
    this.injectStyles();
    this.render();
    this.bind();
  }

  private injectStyles(): void {
    if (document.getElementById('settings-panel-styles')) return;

    const style = document.createElement('style');
    style.id = 'settings-panel-styles';
    style.textContent = `
      .settings-panel {
        position: fixed;
        top: 60px;
        right: 16px;
        width: 320px;
        max-height: calc(100vh - 80px);
        overflow-y: auto;
        background: var(--material-bg, var(--surface-2));
        backdrop-filter: blur(var(--material-blur, 16px)) saturate(var(--material-saturation, 140%));
        border: 1px solid var(--material-border, var(--border-default));
        border-radius: var(--radius-xl);
        box-shadow: var(--material-shadow);
        z-index: 1000;
        transform: translateX(calc(100% + 20px));
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        pointer-events: none;
      }

      .settings-panel.open {
        transform: translateX(0);
        opacity: 1;
        pointer-events: auto;
      }

      .settings-panel__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--border-subtle);
      }

      .settings-panel__title {
        font-family: var(--font-serif);
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
      }

      .settings-panel__close {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: var(--radius-sm);
        transition: color 0.2s, background 0.2s;
      }

      .settings-panel__close:hover {
        color: var(--text-primary);
        background: var(--state-hover);
      }

      .settings-panel__body {
        padding: 1rem 1.25rem;
      }

      .settings-section {
        margin-bottom: 1.5rem;
      }

      .settings-section:last-child {
        margin-bottom: 0;
      }

      .settings-section__label {
        display: block;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-tertiary);
        margin-bottom: 0.5rem;
      }

      .settings-options {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .settings-option {
        flex: 1 1 auto;
        min-width: 80px;
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;
        font-weight: 500;
        text-align: center;
        background: var(--surface-3);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .settings-option:hover {
        background: var(--state-hover);
        border-color: var(--border-default);
        color: var(--text-primary);
      }

      .settings-option.active {
        background: var(--accent-primary);
        border-color: var(--accent-primary);
        color: var(--text-inverse);
        box-shadow: 0 2px 8px rgb(var(--accent-primary-rgb, 79 70 229) / 30%);
      }

      .settings-panel__footer {
        padding: 0.75rem 1.25rem;
        border-top: 1px solid var(--border-subtle);
        display: flex;
        justify-content: flex-end;
      }

      .settings-reset {
        font-size: 0.75rem;
        color: var(--text-tertiary);
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
        transition: color 0.2s, background 0.2s;
      }

      .settings-reset:hover {
        color: var(--text-primary);
        background: var(--state-hover);
      }

      .settings-trigger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: var(--surface-3);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .settings-trigger:hover {
        background: var(--state-hover);
        color: var(--text-primary);
        border-color: var(--border-default);
      }

      .settings-trigger.active {
        background: var(--accent-primary);
        border-color: var(--accent-primary);
        color: var(--text-inverse);
      }

      .settings-trigger svg {
        width: 18px;
        height: 18px;
      }
    `;
    document.head.appendChild(style);
  }

  private render(): void {
    // Create trigger button in header
    const headerActions = document.querySelector('.docs-header__actions');
    if (headerActions && !document.getElementById('settings-trigger')) {
      const trigger = document.createElement('button');
      trigger.id = 'settings-trigger';
      trigger.className = 'settings-trigger';
      trigger.setAttribute('aria-label', 'Design System Settings');
      trigger.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      `;
      headerActions.appendChild(trigger);
    }

    // Create panel
    if (!document.getElementById('settings-panel')) {
      const panel = document.createElement('div');
      panel.id = 'settings-panel';
      panel.className = 'settings-panel';
      panel.innerHTML = this.buildPanelHTML();
      document.body.appendChild(panel);
      this.container = panel;
    }

    this.updateActiveStates();
  }

  private buildPanelHTML(): string {
    return `
      <div class="settings-panel__header">
        <h3 class="settings-panel__title">Design System</h3>
        <button class="settings-panel__close" aria-label="Close settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="settings-panel__body">
        ${this.buildSection('Color Mode', 'theme', THEME_OPTIONS)}
        ${this.buildSection('Material', 'material', MATERIAL_OPTIONS)}
        ${this.buildSection('Surface', 'surface', SURFACE_OPTIONS)}
        ${this.buildSection('Ornament', 'ornament', ORNAMENT_OPTIONS)}
      </div>
      <div class="settings-panel__footer">
        <button class="settings-reset" data-action="reset">Reset to Defaults</button>
      </div>
    `;
  }

  private buildSection(label: string, tier: string, options: OptionConfig[]): string {
    const optionsHTML = options
      .map(
        (opt) => `
        <button class="settings-option" data-tier="${tier}" data-value="${opt.value}">
          ${opt.icon ? `<span>${opt.icon}</span> ` : ''}${opt.label}
        </button>
      `
      )
      .join('');

    return `
      <div class="settings-section">
        <span class="settings-section__label">${label}</span>
        <div class="settings-options">${optionsHTML}</div>
      </div>
    `;
  }

  private bind(): void {
    // Trigger button
    const trigger = document.getElementById('settings-trigger');
    trigger?.addEventListener('click', () => {
      this.toggle();
    });

    // Close button
    this.container?.querySelector('.settings-panel__close')?.addEventListener('click', () => {
      this.close();
    });

    // Option buttons
    this.container?.querySelectorAll('.settings-option').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const tier = target.dataset.tier;
        const value = target.dataset.value;
        if (tier && value) {
          this.handleOptionClick(tier, value);
        }
      });
    });

    // Reset button
    this.container?.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
      this.soltana.reset();
      this.updateActiveStates();
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (
        this.isOpen &&
        !this.container?.contains(target) &&
        !target.closest('#settings-trigger')
      ) {
        this.close();
      }
    });
  }

  private handleOptionClick(tier: string, value: string): void {
    switch (tier) {
      case 'theme':
        this.soltana.setTheme(value as Theme);
        break;
      case 'material':
        this.soltana.setMaterial(value as Material);
        break;
      case 'surface':
        this.soltana.setSurface(value as Surface);
        break;
      case 'ornament':
        this.soltana.setOrnament(value as Ornament);
        break;
    }
    this.updateActiveStates();
  }

  private updateActiveStates(): void {
    const state = this.soltana.getState();

    this.container?.querySelectorAll('.settings-option').forEach((btn) => {
      const el = btn as HTMLElement;
      const tier = el.dataset.tier as keyof typeof state;
      const value = el.dataset.value;
      el.classList.toggle('active', state[tier] === value);
    });
  }

  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    this.isOpen = true;
    this.container?.classList.add('open');
    document.getElementById('settings-trigger')?.classList.add('active');
  }

  close(): void {
    this.isOpen = false;
    this.container?.classList.remove('open');
    document.getElementById('settings-trigger')?.classList.remove('active');
  }
}
