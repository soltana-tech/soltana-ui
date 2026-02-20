"""Visual regression tests for Soltana matplotlib themes."""

from __future__ import annotations

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import pytest

import soltana_matplotlib

matplotlib.use("Agg")

THEMES = soltana_matplotlib.THEMES


@pytest.fixture(params=THEMES)
def theme(request: pytest.FixtureRequest) -> str:
    return request.param  # type: ignore[return-value]


@pytest.mark.mpl_image_compare(savefig_kwarg={"dpi": 100})
def test_line(theme: str) -> plt.Figure:
    soltana_matplotlib.use(theme)
    fig, ax = plt.subplots()
    x = np.linspace(0, 2 * np.pi, 100)
    ax.plot(x, np.sin(x), label="sin")
    ax.plot(x, np.cos(x), label="cos")
    ax.set_title("Trigonometric Functions")
    ax.set_xlabel("Radians")
    ax.set_ylabel("Amplitude")
    ax.legend()
    return fig


@pytest.mark.mpl_image_compare(savefig_kwarg={"dpi": 100})
def test_bar(theme: str) -> plt.Figure:
    soltana_matplotlib.use(theme)
    fig, ax = plt.subplots()
    categories = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"]
    values = [23, 45, 31, 52, 38]
    ax.bar(categories, values)
    ax.set_title("Category Scores")
    ax.set_ylabel("Score")
    return fig


@pytest.mark.mpl_image_compare(savefig_kwarg={"dpi": 100})
def test_scatter(theme: str) -> plt.Figure:
    soltana_matplotlib.use(theme)
    rng = np.random.default_rng(42)
    fig, ax = plt.subplots()
    for label, cx, cy in [("Cluster A", 2, 3), ("Cluster B", 5, 6)]:
        x = rng.normal(cx, 0.8, 50)
        y = rng.normal(cy, 0.8, 50)
        ax.scatter(x, y, label=label, alpha=0.7)
    ax.set_title("Cluster Scatter")
    ax.set_xlabel("X")
    ax.set_ylabel("Y")
    ax.legend()
    return fig


@pytest.mark.mpl_image_compare(savefig_kwarg={"dpi": 100})
def test_pie(theme: str) -> plt.Figure:
    soltana_matplotlib.use(theme)
    fig, ax = plt.subplots()
    sizes = [30, 25, 20, 15, 10]
    labels = ["Eng", "Mktg", "Sales", "Ops", "Support"]
    ax.pie(sizes, labels=labels, autopct="%1.0f%%", startangle=90)
    ax.set_title("Department Split")
    return fig


@pytest.mark.mpl_image_compare(savefig_kwarg={"dpi": 100})
def test_box(theme: str) -> plt.Figure:
    soltana_matplotlib.use(theme)
    rng = np.random.default_rng(42)
    fig, ax = plt.subplots()
    data = [rng.normal(loc, 1.0, 50) for loc in [3, 5, 4]]
    ax.boxplot(data, tick_labels=["Control", "Treatment A", "Treatment B"])
    ax.set_title("Treatment Comparison")
    ax.set_ylabel("Response")
    return fig


@pytest.mark.mpl_image_compare(savefig_kwarg={"dpi": 100})
def test_heatmap(theme: str) -> plt.Figure:
    soltana_matplotlib.use(theme)
    rng = np.random.default_rng(42)
    fig, ax = plt.subplots()
    data = rng.integers(0, 100, size=(5, 5))
    im = ax.imshow(data, cmap="viridis")
    ax.set_title("Activity Matrix")
    ax.set_xticks(range(5), ["Mon", "Tue", "Wed", "Thu", "Fri"])
    ax.set_yticks(range(5), [f"W{i + 1}" for i in range(5)])
    fig.colorbar(im, ax=ax)
    return fig


@pytest.mark.mpl_image_compare(savefig_kwarg={"dpi": 100})
def test_histogram(theme: str) -> plt.Figure:
    soltana_matplotlib.use(theme)
    rng = np.random.default_rng(42)
    fig, ax = plt.subplots()
    data = rng.normal(0, 1, 500)
    ax.hist(data, bins=25, edgecolor="none", alpha=0.8)
    ax.set_title("Normal Distribution")
    ax.set_xlabel("Value")
    ax.set_ylabel("Frequency")
    return fig
