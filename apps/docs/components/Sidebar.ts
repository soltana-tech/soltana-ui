import type { Router } from './Router';

export interface SidebarSection {
  label: string;
  items: SidebarItem[];
  collapsed?: boolean;
}

export interface SidebarItem {
  label: string;
  path: string;
}

const CHEVRON_SVG = `<svg class="sidebar__chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

const HAMBURGER_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;

const CLOSE_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

/**
 * Collapsible sidebar navigation for the documentation site.
 * Renders section groups with expandable item lists and highlights the active route.
 */
export class Sidebar {
  private router: Router;
  private sections: SidebarSection[];
  private container: HTMLElement;
  private overlay: HTMLElement;
  private hamburger: HTMLButtonElement;
  private isOpen = false;

  constructor(router: Router, sections: SidebarSection[]) {
    this.router = router;
    this.sections = sections;

    this.container = this.buildSidebar();
    this.overlay = this.buildOverlay();
    this.hamburger = this.buildHamburger();

    this.mount();
    this.bind();
  }

  /** Return the sidebar element for insertion into the DOM. */
  getElement(): HTMLElement {
    return this.container;
  }

  /** Update active link state. Called by router after navigation. */
  updateActiveLink(path: string): void {
    this.container.querySelectorAll('.sidebar__link').forEach((link) => {
      const linkPath = (link as HTMLElement).dataset.path;
      link.classList.toggle('sidebar__link--active', linkPath === path);
    });

    // Expand the section containing the active link
    this.container.querySelectorAll('.sidebar__section').forEach((section) => {
      const hasActive = section.querySelector('.sidebar__link--active');
      if (hasActive) {
        section.classList.add('sidebar__section--expanded');
      }
    });
  }

  private buildSidebar(): HTMLElement {
    const aside = document.createElement('aside');
    aside.id = 'docs-sidebar';
    aside.className = 'sidebar';
    aside.setAttribute('aria-label', 'Documentation navigation');

    const nav = document.createElement('nav');
    nav.className = 'sidebar__nav';

    for (const section of this.sections) {
      nav.appendChild(this.buildSection(section));
    }

    aside.appendChild(nav);
    return aside;
  }

  private buildSection(section: SidebarSection): HTMLElement {
    const el = document.createElement('div');
    el.className = 'sidebar__section';
    if (!section.collapsed) {
      el.classList.add('sidebar__section--expanded');
    }

    const header = document.createElement('button');
    header.className = 'sidebar__section-header';
    header.type = 'button';
    header.setAttribute('aria-expanded', String(!section.collapsed));
    header.innerHTML = `<span>${section.label}</span>${CHEVRON_SVG}`;

    const list = document.createElement('ul');
    list.className = 'sidebar__list';

    for (const item of section.items) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.className = 'sidebar__link';
      link.href = `#${item.path}`;
      link.dataset.path = item.path;
      link.textContent = item.label;
      li.appendChild(link);
      list.appendChild(li);
    }

    el.appendChild(header);
    el.appendChild(list);
    return el;
  }

  private buildOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    return overlay;
  }

  private buildHamburger(): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = 'sidebar-hamburger';
    btn.setAttribute('aria-label', 'Toggle navigation');
    btn.innerHTML = HAMBURGER_SVG;
    return btn;
  }

  private mount(): void {
    // Insert hamburger into header actions (before settings trigger)
    const headerActions = document.querySelector('.docs-header__actions');
    if (headerActions) {
      headerActions.insertBefore(this.hamburger, headerActions.firstChild);
    }

    // Insert sidebar and overlay into the layout wrapper
    const layoutWrapper = document.getElementById('docs-layout');
    if (layoutWrapper) {
      layoutWrapper.insertBefore(this.container, layoutWrapper.firstChild);
    }

    document.body.appendChild(this.overlay);
  }

  private bind(): void {
    // Section header toggle
    this.container.querySelectorAll('.sidebar__section-header').forEach((header) => {
      header.addEventListener('click', () => {
        const section = header.parentElement;
        if (!section) return;
        const expanded = section.classList.toggle('sidebar__section--expanded');
        header.setAttribute('aria-expanded', String(expanded));
      });
    });

    // Link clicks
    this.container.querySelectorAll('.sidebar__link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = (link as HTMLElement).dataset.path;
        if (path) {
          this.router.navigate(path);
          this.closeMobile();
        }
      });
    });

    // Hamburger
    this.hamburger.addEventListener('click', () => {
      this.toggleMobile();
    });

    // Overlay click closes sidebar
    this.overlay.addEventListener('click', () => {
      this.closeMobile();
    });

    // Escape key closes mobile sidebar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMobile();
      }
    });
  }

  private toggleMobile(): void {
    if (this.isOpen) {
      this.closeMobile();
    } else {
      this.openMobile();
    }
  }

  private openMobile(): void {
    this.isOpen = true;
    this.container.classList.add('sidebar--open');
    this.overlay.classList.add('sidebar-overlay--visible');
    this.hamburger.innerHTML = CLOSE_SVG;
    this.hamburger.setAttribute('aria-expanded', 'true');
  }

  private closeMobile(): void {
    this.isOpen = false;
    this.container.classList.remove('sidebar--open');
    this.overlay.classList.remove('sidebar-overlay--visible');
    this.hamburger.innerHTML = HAMBURGER_SVG;
    this.hamburger.setAttribute('aria-expanded', 'false');
  }
}
