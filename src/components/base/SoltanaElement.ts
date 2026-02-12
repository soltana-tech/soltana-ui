// ---------------------------------------------------------------------------
// SoltanaElement — Base class for all Soltana Web Components
// ---------------------------------------------------------------------------
// Shared functionality: design token injection, theme observation,
// material system support, lifecycle management, and ARIA defaults.
// ---------------------------------------------------------------------------

/** CSS custom properties injected into every component's Shadow DOM */
const sharedTokenStyles = `
  :host {
    /* Font families */
    --font-sans: 'Raleway', ui-sans-serif, system-ui, -apple-system, sans-serif;
    --font-serif: 'Cinzel', 'Georgia', 'Times New Roman', serif;
    --font-display: 'Cinzel Decorative', 'Cinzel', serif;
    --font-mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace;

    /* Font weights */
    --font-light: 300;
    --font-regular: 400;
    --font-medium: 500;
    --font-semibold: 600;
    --font-bold: 700;
    --font-extrabold: 800;

    /* Tracking */
    --tracking-refined: 0.02em;
    --tracking-elegant: 0.04em;
    --tracking-display: 0.08em;
    --tracking-inscriptional: 0.12em;

    /* Transitions */
    --transition-fast: 75ms;
    --transition-normal: 150ms;
    --transition-slow: 300ms;

    /* Radii */
    --radius-sm: 0.25rem;
    --radius-md: 0.5rem;
    --radius-default: 0.625rem;
    --radius-lg: 0.875rem;
    --radius-xl: 1.125rem;
    --radius-2xl: 1.25rem;
    --radius-full: 9999px;

    /* Theme-aware tokens (inherited from document) */
    color: var(--text-primary);
    font-family: var(--font-sans);
    font-size: 1rem;
    line-height: 1.65;
    letter-spacing: var(--tracking-refined);

    /* Metallic gradient tokens */
    --gold-gradient: linear-gradient(145deg, #fde68a, #d4a843, #b8860b, #d4a843, #fde68a);
    --gold-gradient-subtle: linear-gradient(145deg, #fcd34d, #d4a843, #fcd34d);
    --silver-gradient: linear-gradient(145deg, #d8dde6, #929cb0, #6e7a92, #929cb0, #d8dde6);
    --bronze-gradient: linear-gradient(145deg, #f0cd9e, #cd8d3a, #a06e2b, #cd8d3a, #f0cd9e);
    --copper-gradient: linear-gradient(145deg, #f5c4a1, #d97e4a, #b86536, #d97e4a, #f5c4a1);
    --platinum-gradient: linear-gradient(145deg, #dce1ea, #a8b3c7, #6d7b94, #a8b3c7, #dce1ea);

    /* Material system tokens (default to neumorphic) */
    --material-bg: var(--neuro-bg);
    --material-shadow-light: var(--neuro-shadow-light);
    --material-shadow-dark: var(--neuro-shadow-dark);
    --material-shadow-mid: var(--neuro-shadow-mid);
    --material-highlight: var(--neuro-highlight);
    --material-border: var(--border-default);
    --material-blur: 0px;
    --material-saturation: 100%;
  }

  /* Material attribute overrides */
  :host([material="glass"]) {
    --material-bg: var(--glass-bg);
    --material-shadow-light: var(--glass-inner-glow);
    --material-shadow-dark: var(--glass-shadow);
    --material-shadow-mid: var(--glass-shadow);
    --material-highlight: var(--glass-inner-glow);
    --material-border: var(--glass-border);
    --material-blur: 16px;
    --material-saturation: 140%;
  }

  :host([material="hybrid"]) {
    --material-bg: linear-gradient(145deg, var(--glass-gradient-start), var(--glass-gradient-end));
    --material-shadow-light: var(--neuro-shadow-light);
    --material-shadow-dark: var(--neuro-shadow-dark);
    --material-shadow-mid: var(--neuro-shadow-mid);
    --material-highlight: var(--glass-inner-glow);
    --material-border: var(--glass-border);
    --material-blur: 12px;
    --material-saturation: 120%;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export abstract class SoltanaElement extends HTMLElement {
  protected shadow: ShadowRoot;
  private _themeObserver: MutationObserver | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  /** Current theme from the document root */
  getTheme(): string {
    return document.documentElement.getAttribute('data-theme') ?? 'dark';
  }

  /** Current material from the element or document root */
  getMaterial(): string {
    return (
      this.getAttribute('material') ??
      document.documentElement.getAttribute('data-material') ??
      'neuro'
    );
  }

  /** Current ornament from the element or document root */
  getOrnament(): string {
    return (
      this.getAttribute('ornament') ?? document.documentElement.getAttribute('data-ornament') ?? ''
    );
  }

  /** Override in subclasses to react to theme changes */
  protected onThemeChange(_theme: string): void {
    // Default no-op; subclasses can override
  }

  /** Override in subclasses to react to material changes */
  protected onMaterialChange(_material: string): void {
    // Default no-op; subclasses can override
  }

  connectedCallback(): void {
    this._themeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') {
          this.onThemeChange(this.getTheme());
        }
        if (mutation.attributeName === 'data-material') {
          this.onMaterialChange(this.getMaterial());
          if (this.isConnected) this.render();
        }
      }
    });

    this._themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-material', 'data-ornament'],
    });

    this.render();
  }

  disconnectedCallback(): void {
    this._themeObserver?.disconnect();
    this._themeObserver = null;
  }

  /** Get the shared token styles string for injection into shadow DOM */
  protected getSharedStyles(): string {
    return sharedTokenStyles;
  }

  /** Render component — must be implemented by subclasses */
  protected abstract render(): void;

  /** Helper to update shadow DOM content */
  protected setContent(styles: string, html: string): void {
    this.shadow.innerHTML = `
      <style>${this.getSharedStyles()}${styles}</style>
      ${html}
    `;
  }

  /** Helper to get material-specific CSS classes */
  protected getMaterialClasses(): string {
    const material = this.getMaterial();
    const ornament = this.getOrnament();
    const classes: string[] = [];

    if (material && material !== 'neuro') {
      classes.push(`material-${material}`);
    }

    if (ornament) {
      ornament.split(' ').forEach((o) => {
        if (o.trim()) classes.push(`ornament-${o.trim()}`);
      });
    }

    return classes.join(' ');
  }
}
