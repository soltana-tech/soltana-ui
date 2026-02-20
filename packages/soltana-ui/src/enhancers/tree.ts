// ---------------------------------------------------------------------------
// Tree View Enhancer (Singleton)
// ---------------------------------------------------------------------------
// Progressive enhancement for [data-sol-tree] elements.
// Hierarchical expand/collapse with keyboard navigation and ARIA.
// ---------------------------------------------------------------------------

import type { EnhancerCleanup, EnhancerOptions } from '../config/types.js';

export const TREE_SELECTOR = '[data-sol-tree]';

/** Singleton guard — aborted and replaced on each `init*()` call. */
let _controller: AbortController | null = null;

function getVisibleNodes(tree: HTMLElement): HTMLElement[] {
  return Array.from(tree.querySelectorAll<HTMLElement>('.tree-node-content')).filter((node) => {
    // Exclude nodes inside collapsed branches
    const branch = node.closest('.tree-branch:not(.active) > .tree-children');
    return !branch;
  });
}

function toggleBranch(branch: HTMLElement, open: boolean): void {
  branch.classList.toggle('active', open);
  const content = branch.querySelector<HTMLElement>(':scope > .tree-node-content');
  content?.setAttribute('aria-expanded', String(open));
}

/**
 * Enhance all `[data-sol-tree]` elements with expand/collapse and
 * keyboard navigation behavior.
 *
 * Expected structure:
 * ```html
 * <div data-sol-tree class="tree" role="tree">
 *   <div class="tree-branch tree-node" role="treeitem">
 *     <div class="tree-node-content">
 *       <button class="tree-toggle"></button>
 *       Folder
 *     </div>
 *     <div class="tree-children">
 *       <div class="tree-leaf tree-node" role="treeitem">
 *         <div class="tree-node-content">File</div>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 * ```
 */
export function initTrees(options?: EnhancerOptions): EnhancerCleanup {
  _controller?.abort();
  _controller = new AbortController();
  const { signal } = _controller;

  const root = options?.root ?? document;
  root.querySelectorAll<HTMLElement>(options?.selector ?? TREE_SELECTOR).forEach((tree) => {
    // ARIA
    if (!tree.getAttribute('role')) {
      tree.setAttribute('role', 'tree');
    }

    // Setup nodes
    tree.querySelectorAll<HTMLElement>('.tree-node').forEach((node) => {
      if (!node.getAttribute('role')) {
        node.setAttribute('role', 'treeitem');
      }
    });

    // Initialize branches
    tree.querySelectorAll<HTMLElement>('.tree-branch').forEach((branch) => {
      const content = branch.querySelector<HTMLElement>(':scope > .tree-node-content');
      const isOpen = branch.classList.contains('active');
      content?.setAttribute('aria-expanded', String(isOpen));
      content?.setAttribute('tabindex', '-1');

      // Toggle on click
      const toggle = branch.querySelector<HTMLElement>(':scope > .tree-node-content .tree-toggle');
      const handleToggle = (): void => {
        toggleBranch(branch, !branch.classList.contains('active'));
      };

      if (toggle) {
        toggle.addEventListener(
          'click',
          (e) => {
            e.stopPropagation();
            handleToggle();
          },
          { signal }
        );
      }

      content?.addEventListener('click', handleToggle, { signal });
    });

    // Initialize leaves
    tree.querySelectorAll<HTMLElement>('.tree-leaf .tree-node-content').forEach((content) => {
      content.setAttribute('tabindex', '-1');
      content.addEventListener(
        'click',
        () => {
          // Deselect all
          tree.querySelectorAll('.tree-node-content.selected').forEach((sel) => {
            sel.classList.remove('selected');
          });
          content.classList.add('selected');
        },
        { signal }
      );
    });

    // Make first node focusable
    const firstContent = tree.querySelector<HTMLElement>('.tree-node-content');
    if (firstContent) firstContent.setAttribute('tabindex', '0');

    // Keyboard navigation
    tree.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        const focused = document.activeElement as HTMLElement;
        if (!focused.classList.contains('tree-node-content')) return;

        const visible = getVisibleNodes(tree);
        const idx = visible.indexOf(focused);
        if (idx === -1) return;

        const branch = focused.closest('.tree-branch');

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            if (idx < visible.length - 1) visible[idx + 1].focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (idx > 0) visible[idx - 1].focus();
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (branch && !branch.classList.contains('active')) {
              toggleBranch(branch as HTMLElement, true);
            } else if (branch?.classList.contains('active')) {
              // Move to first child
              const firstChild = branch.querySelector<HTMLElement>(
                ':scope > .tree-children > .tree-node > .tree-node-content'
              );
              firstChild?.focus();
            }
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (branch?.classList.contains('active')) {
              toggleBranch(branch as HTMLElement, false);
            } else {
              // Move to parent branch
              const parentBranch = focused.closest('.tree-children')?.closest('.tree-branch');
              const parentContent = parentBranch?.querySelector<HTMLElement>(
                ':scope > .tree-node-content'
              );
              parentContent?.focus();
            }
            break;
          case 'Home':
            e.preventDefault();
            visible[0]?.focus();
            break;
          case 'End':
            e.preventDefault();
            visible[visible.length - 1]?.focus();
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            focused.click();
            break;
        }
      },
      { signal }
    );
  });

  return {
    destroy() {
      _controller?.abort();
      _controller = null;
    },
  };
}
