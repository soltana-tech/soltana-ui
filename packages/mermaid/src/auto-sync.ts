// ---------------------------------------------------------------------------
// Mermaid Auto-Sync
// ---------------------------------------------------------------------------
// Listens for soltana:change events and re-renders all Mermaid diagrams
// with a fresh theme config. Since Mermaid destructively replaces <pre>
// elements with SVG output, this module snapshots the original source text
// and restores it before each re-render.
// ---------------------------------------------------------------------------

import { buildConfig } from './build-config.js';

/** Minimal Mermaid API surface accepted via dependency injection. */
export interface MermaidLike {
  initialize(config: Record<string, unknown>): void;
  run(opts?: { nodes?: ArrayLike<HTMLElement> }): Promise<void>;
}

/** Snapshot of a diagram's original source anchored to its parent element. */
interface DiagramSnapshot {
  parent: Element;
  source: string;
}

/** Capture the text content of all `pre.mermaid` elements before rendering. */
function snapshotSources(): DiagramSnapshot[] {
  const nodes = document.querySelectorAll<HTMLPreElement>('pre.mermaid');
  const snapshots: DiagramSnapshot[] = [];
  for (const node of nodes) {
    if (node.parentElement) {
      snapshots.push({ parent: node.parentElement, source: node.textContent });
    }
  }
  return snapshots;
}

/** Restore original `<pre class="mermaid">` elements from snapshots. */
function restoreSources(snapshots: DiagramSnapshot[]): HTMLPreElement[] {
  const nodes: HTMLPreElement[] = [];
  for (const { parent, source } of snapshots) {
    // Remove existing Mermaid output (SVG or processed elements)
    const existing = parent.querySelector('.mermaid');
    if (existing) existing.remove();

    const pre = document.createElement('pre');
    pre.className = 'mermaid';
    pre.textContent = source;
    parent.appendChild(pre);
    nodes.push(pre);
  }
  return nodes;
}

/**
 * Initialize Mermaid with the current Soltana theme. Call this once at
 * startup before `mermaid.run()` to apply Soltana theming.
 */
export function initSoltanaMermaid(mermaid: MermaidLike): void {
  mermaid.initialize(buildConfig());
}

/**
 * Auto-sync: initializes Mermaid with a Soltana theme, snapshots all
 * diagram sources, then re-initializes and re-renders on every
 * `soltana:change` event. Returns a handle with `destroy()` to stop.
 *
 * Because Mermaid destructively replaces `<pre class="mermaid">` elements
 * with SVG output, the original diagram source must be preserved and
 * restored before each re-render.
 */
export function autoSync(mermaid: MermaidLike): { destroy(): void } {
  const snapshots = snapshotSources();
  mermaid.initialize(buildConfig());

  const handler = () => {
    mermaid.initialize(buildConfig());
    const nodes = restoreSources(snapshots);
    if (nodes.length > 0) {
      void mermaid.run({ nodes });
    }
  };

  document.documentElement.addEventListener('soltana:change', handler);

  return {
    destroy() {
      document.documentElement.removeEventListener('soltana:change', handler);
    },
  };
}
