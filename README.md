# Soltana UI

A CSS-first design system with a 3-tier configuration model:
**theme**, **relief**, and **finish**.

## Features

- **3-tier architecture**: Composable theme (color scheme), relief
  (shadow model), and finish (surface treatment) tiers
- **Per-element overrides**: Apply tier configurations to individual
  elements via utility classes
- **Runtime registration**: Register custom themes, reliefs, and finishes at runtime
- **16 accessible enhancers**: Modals, tabs, tooltips, accordions,
  carousels, and more
- **Charting integration**: Theme bridges for ECharts, Plotly, and Mermaid

## Documentation

Full documentation is available at the docs site (see `apps/docs`).

## AI Agent Reference

Machine-readable reference formats are provided for AI agents:

- `.claude/agents/reference.yaml` — YAML format for development with
  ~1,300 utility classes, component patterns, and API surface
- `/llms.txt` and `/llms-full.txt` — Served from the docs site for
  web-based agent access

These files are auto-generated on build and stay in sync with the codebase.
