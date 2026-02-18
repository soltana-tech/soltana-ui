"""Tests for soltana_matplotlib style integration."""

from __future__ import annotations

import re
from pathlib import Path

import matplotlib.pyplot as plt
import pytest

import soltana_matplotlib

STYLE_DIR = Path(soltana_matplotlib.__file__).parent
THEMES = soltana_matplotlib.THEMES


class TestStyleFiles:
    """Validate that .mplstyle files exist and have valid content."""

    @pytest.mark.parametrize("theme", THEMES)
    def test_file_exists_and_nonempty(self, theme: str) -> None:
        path = STYLE_DIR / f"{theme}.mplstyle"
        assert path.exists(), f"{path} does not exist"
        assert path.stat().st_size > 0, f"{path} is empty"

    @pytest.mark.parametrize("theme", THEMES)
    def test_valid_key_value_format(self, theme: str) -> None:
        path = STYLE_DIR / f"{theme}.mplstyle"
        for lineno, line in enumerate(path.read_text().splitlines(), 1):
            if not line.strip() or line.strip().startswith("#"):
                continue
            assert re.match(r"^[\w.-]+:\s*.+", line), (
                f"{theme}.mplstyle:{lineno} invalid format: {line!r}"
            )

    @pytest.mark.parametrize("theme", THEMES)
    def test_no_rgb_syntax(self, theme: str) -> None:
        """Matplotlib cannot parse CSS rgb() — all colors must be hex."""
        text = (STYLE_DIR / f"{theme}.mplstyle").read_text()
        assert "rgb(" not in text, f"{theme}.mplstyle contains rgb() syntax"


class TestUseFunction:
    """Validate the convenience `use()` function."""

    def test_use_dark(self) -> None:
        soltana_matplotlib.use("dark")

    def test_use_defaults_to_dark(self) -> None:
        soltana_matplotlib.use()

    def test_use_light(self) -> None:
        soltana_matplotlib.use("light")

    def test_use_sepia(self) -> None:
        soltana_matplotlib.use("sepia")

    def test_invalid_theme_raises(self) -> None:
        with pytest.raises(ValueError, match="Unknown theme"):
            soltana_matplotlib.use("neon")


class TestDottedStyleResolution:
    """Validate that matplotlib resolves dotted style names via importlib."""

    @pytest.mark.parametrize("theme", THEMES)
    def test_dotted_name(self, theme: str) -> None:
        plt.style.use(f"soltana_matplotlib.{theme}")


class TestStyleApplied:
    """Verify that style values are actually applied to rcParams."""

    def test_dark_facecolor(self) -> None:
        with plt.style.context("soltana_matplotlib.dark"):
            assert plt.rcParams["figure.facecolor"] != "white"

    def test_light_text_color(self) -> None:
        with plt.style.context("soltana_matplotlib.light"):
            assert plt.rcParams["text.color"] != "white"
