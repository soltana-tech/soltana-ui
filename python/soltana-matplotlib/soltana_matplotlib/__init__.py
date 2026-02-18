"""Matplotlib styles for the Soltana UI design system."""

from __future__ import annotations

from pathlib import Path

__version__ = "0.1.0"
THEMES: tuple[str, ...] = ("dark", "light", "sepia")
_STYLE_DIR = Path(__file__).parent


def use(theme: str = "dark") -> None:
    """Apply a Soltana theme to matplotlib.

    Args:
        theme: One of "dark", "light", or "sepia".

    Raises:
        ValueError: If *theme* is not a recognized theme name.
    """
    if theme not in THEMES:
        raise ValueError(f"Unknown theme {theme!r}. Available: {', '.join(THEMES)}")
    import matplotlib.pyplot as plt

    plt.style.use(str(_STYLE_DIR / f"{theme}.mplstyle"))
