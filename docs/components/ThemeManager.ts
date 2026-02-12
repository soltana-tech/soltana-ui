const STORAGE_KEY = 'soltana-theme';
type Theme = 'light' | 'dark' | 'sepia';

/** Manages theme switching with localStorage persistence. */
export class ThemeManager {
  private current: Theme;
  private buttons: NodeListOf<HTMLButtonElement>;

  constructor() {
    this.current = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'dark';
    this.buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-set]');
    this.apply(this.current);
    this.bind();
  }

  private apply(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    this.current = theme;

    this.buttons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.themeSet === theme);
    });
  }

  private bind(): void {
    this.buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.themeSet as Theme | undefined;
        if (theme) {
          this.apply(theme);
        }
      });
    });
  }

  getTheme(): Theme {
    return this.current;
  }
}
