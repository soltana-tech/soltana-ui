import { VALID_RELIEFS, VALID_FINISHES } from '@soltana/config/validation';
import type { TierName } from '@soltana/config';

interface VariantMatrixConfig {
  renderCell: (classes: string) => string;
  rowAxis?: TierName;
  colAxis?: TierName;
}

const TIER_VALUES: Record<string, readonly string[]> = {
  theme: ['dark', 'light', 'sepia'],
  relief: VALID_RELIEFS,
  finish: VALID_FINISHES,
};

/**
 * Renders a grid of component previews across two tier axes.
 * Each cell applies the appropriate per-element utility classes.
 */
export class VariantMatrix {
  private config: VariantMatrixConfig;
  private element: HTMLElement;

  constructor(config: VariantMatrixConfig) {
    this.config = config;
    this.element = this.build();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  private build(): HTMLElement {
    const rowAxis = this.config.rowAxis ?? 'relief';
    const colAxis = this.config.colAxis ?? 'finish';
    const rows = TIER_VALUES[rowAxis];
    const cols = TIER_VALUES[colAxis];

    const container = document.createElement('div');
    container.className = 'variant-matrix';

    // Header row
    const headerRow = document.createElement('div');
    headerRow.className = 'variant-matrix__header';
    headerRow.style.gridTemplateColumns = `8rem repeat(${String(cols.length)}, 1fr)`;

    const cornerCell = document.createElement('div');
    cornerCell.className = 'variant-matrix__corner';
    cornerCell.textContent = `${rowAxis} \\ ${colAxis}`;
    headerRow.appendChild(cornerCell);

    for (const col of cols) {
      const colHeader = document.createElement('div');
      colHeader.className = 'variant-matrix__col-header';
      colHeader.textContent = col;
      headerRow.appendChild(colHeader);
    }
    container.appendChild(headerRow);

    // Data rows
    for (const row of rows) {
      const rowEl = document.createElement('div');
      rowEl.className = 'variant-matrix__row';
      rowEl.style.gridTemplateColumns = `8rem repeat(${String(cols.length)}, 1fr)`;

      const rowHeader = document.createElement('div');
      rowHeader.className = 'variant-matrix__row-header';
      rowHeader.textContent = row;
      rowEl.appendChild(rowHeader);

      for (const col of cols) {
        const cell = document.createElement('div');
        cell.className = `variant-matrix__cell ${rowAxis}-${row} ${colAxis}-${col}`;
        cell.innerHTML = this.config.renderCell(`${rowAxis}-${row} ${colAxis}-${col}`);
        rowEl.appendChild(cell);
      }

      container.appendChild(rowEl);
    }

    return container;
  }
}
