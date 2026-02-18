export interface RouteConfig {
  path: string;
  render: () => HTMLElement;
  onActivate?: (params: URLSearchParams) => void;
  onDeactivate?: () => void;
}

type AfterNavigateHook = (path: string) => void;

/**
 * DOM-preserving hash router.
 *
 * Routes use path-based hashes (e.g. `#/components/buttons?relief=lifted`).
 * Rendered elements are cached after first creation and toggled via display
 * rather than destroyed and recreated.
 */
export class Router {
  private container: HTMLElement;
  private routes = new Map<string, RouteConfig>();
  private cache = new Map<string, HTMLElement>();
  private activePath: string | null = null;
  private afterNavigateHooks: AfterNavigateHook[] = [];
  private defaultPath = '/getting-started';

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Router container #${containerId} not found`);
    this.container = el;
    this.bind();
  }

  /** Register a route. Path should start with `/` (e.g. `/components/buttons`). */
  register(config: RouteConfig): void {
    this.routes.set(config.path, config);
  }

  /** Register a hook called after every navigation. */
  onAfterNavigate(hook: AfterNavigateHook): void {
    this.afterNavigateHooks.push(hook);
  }

  /** Set the fallback path when no hash is present. */
  setDefaultPath(path: string): void {
    this.defaultPath = path;
  }

  /** Read the current hash and navigate. */
  start(): void {
    const { path } = this.parseHash();
    const target = this.routes.has(path) ? path : this.defaultPath;
    this.navigate(target);
  }

  /** Navigate to a path. Updates hash and toggles views. */
  navigate(path: string, params?: URLSearchParams): void {
    const config = this.routes.get(path);
    if (!config) return;

    // Deactivate previous route
    if (this.activePath && this.activePath !== path) {
      const prev = this.routes.get(this.activePath);
      const prevEl = this.cache.get(this.activePath);
      if (prevEl) prevEl.style.display = 'none';
      prev?.onDeactivate?.();
    }

    // Render or retrieve cached element
    let el = this.cache.get(path);
    if (!el) {
      el = config.render();
      el.dataset.routePath = path;
      this.container.appendChild(el);
      this.cache.set(path, el);
    }
    el.style.display = '';

    this.activePath = path;

    // Update hash without triggering hashchange handler
    const hash = params?.toString() ? `#${path}?${params.toString()}` : `#${path}`;
    if (location.hash !== hash) {
      history.replaceState(null, '', hash);
    }

    // Activate
    const resolvedParams = params ?? this.parseHash().params;
    config.onActivate?.(resolvedParams);

    for (const hook of this.afterNavigateHooks) {
      hook(path);
    }

    window.scrollTo({ top: 0 });
  }

  /** Get the currently active route path. */
  getActivePath(): string | null {
    return this.activePath;
  }

  /** Get all registered route paths. */
  getRoutePaths(): string[] {
    return [...this.routes.keys()];
  }

  /** Update query params on the current route without full re-navigation. */
  updateParams(params: URLSearchParams): void {
    if (!this.activePath) return;
    const hash = params.toString()
      ? `#${this.activePath}?${params.toString()}`
      : `#${this.activePath}`;
    history.replaceState(null, '', hash);
  }

  /** Parse the current hash into path and query params. */
  parseHash(): { path: string; params: URLSearchParams } {
    const raw = location.hash.slice(1); // remove leading #
    const qIdx = raw.indexOf('?');
    if (qIdx === -1) {
      return { path: raw || this.defaultPath, params: new URLSearchParams() };
    }
    return {
      path: raw.slice(0, qIdx),
      params: new URLSearchParams(raw.slice(qIdx + 1)),
    };
  }

  private bind(): void {
    window.addEventListener('hashchange', () => {
      const { path } = this.parseHash();
      if (this.routes.has(path) && path !== this.activePath) {
        this.navigate(path);
      }
    });
  }
}

/**
 * Wraps a string-returning page renderer into an HTMLElement factory.
 * Provides backward compatibility during migration from TabRouter.
 */
export function migrationShim(renderer: () => string): () => HTMLElement {
  return () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderer();
    return wrapper;
  };
}
