/** SVG icons for sidebar navigation items, keyed by route path. */

const icon = (d: string): string =>
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

export const SIDEBAR_ICONS: Record<string, string> = {
  // Learn
  '/learn/introduction': icon(
    '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'
  ),
  '/learn/themes': icon(
    '<circle cx="13.5" cy="6.5" r="2.5"/><path d="M17 2.1a7 7 0 0 1 4 12.3l-7.8 7.8a2 2 0 0 1-2.8 0L2 13.6a7 7 0 0 1 9.9-9.9z"/><circle cx="7.5" cy="11.5" r="2.5" opacity="0.5"/>'
  ),
  '/learn/reliefs': icon(
    '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>'
  ),
  '/learn/finishes': icon(
    '<path d="M12 3l1.5 4.5H18l-3.6 2.7 1.4 4.3L12 11.8l-3.8 2.7 1.4-4.3L6 7.5h4.5z"/><path d="M5 19l2-5"/><path d="M19 19l-2-5"/>'
  ),
  '/learn/composition': icon(
    '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
  ),

  // Explore
  '/explore': icon(
    '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>'
  ),
  '/explore/components': icon(
    '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'
  ),
  '/playground': icon('<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>'),
  '/explore/layout': icon(
    '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>'
  ),
  '/explore/typography': icon(
    '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9.5" y1="20" x2="14.5" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>'
  ),
  '/explore/colors': icon('<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>'),
  '/explore/examples': icon(
    '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>'
  ),

  // API Reference
  '/api/core': icon('<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>'),
  '/api/config': icon(
    '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>'
  ),
  '/api/behavior': icon('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),
  '/api/plugins': icon(
    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'
  ),
};
