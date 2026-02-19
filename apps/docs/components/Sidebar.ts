import type { Router } from './Router';

export interface SidebarSection {
  label: string;
  items: SidebarItem[];
  collapsed?: boolean;
}

export interface SidebarItem {
  label: string;
  path: string;
  icon?: string;
}

const CHEVRON_SVG = `<svg class="sidebar__chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

/**
 * Collapsible sidebar navigation for the documentation site.
 * Renders section groups with expandable item lists and highlights the active route.
 * On mobile (<= 768px), behaves as a slide-in drawer toggled by a hamburger button.
 */
export class Sidebar {
  private router: Router;
  private sections: SidebarSection[];
  private container: HTMLElement;

  constructor(router: Router, sections: SidebarSection[]) {
    this.router = router;
    this.sections = sections;

    this.container = this.buildSidebar();

    this.mount();
    this.bind();
    this.bindMobileDrawer();
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
      if (item.icon) {
        link.innerHTML = `${item.icon}<span>${item.label}</span>`;
      } else {
        link.textContent = item.label;
      }
      li.appendChild(link);
      list.appendChild(li);
    }

    el.appendChild(header);
    el.appendChild(list);
    return el;
  }

  private mount(): void {
    const layoutWrapper = document.getElementById('docs-layout');
    if (layoutWrapper) {
      layoutWrapper.insertBefore(this.container, layoutWrapper.firstChild);
    }
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
          this.closeDrawer();
        }
      });
    });
  }

  private bindMobileDrawer(): void {
    const toggle = document.getElementById('sidebar-toggle');
    const backdrop = document.getElementById('sidebar-backdrop');

    toggle?.addEventListener('click', () => {
      const isOpen = this.container.classList.toggle('sidebar--open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      backdrop?.classList.toggle('active', isOpen);
    });

    backdrop?.addEventListener('click', () => {
      this.closeDrawer();
    });
  }

  private closeDrawer(): void {
    this.container.classList.remove('sidebar--open');
    const toggle = document.getElementById('sidebar-toggle');
    toggle?.setAttribute('aria-expanded', 'false');
    document.getElementById('sidebar-backdrop')?.classList.remove('active');
  }
}
