import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initTrees } from './tree.js';

function createTree(levels = 2): HTMLElement {
  const tree = document.createElement('div');
  tree.setAttribute('data-sol-tree', '');
  tree.className = 'tree';

  if (levels >= 1) {
    const branch1 = document.createElement('div');
    branch1.className = 'tree-branch tree-node';

    const content1 = document.createElement('div');
    content1.className = 'tree-node-content';
    const toggle1 = document.createElement('button');
    toggle1.className = 'tree-toggle';
    content1.appendChild(toggle1);
    content1.appendChild(document.createTextNode('Folder 1'));
    branch1.appendChild(content1);

    if (levels >= 2) {
      const children1 = document.createElement('div');
      children1.className = 'tree-children';

      const leaf1 = document.createElement('div');
      leaf1.className = 'tree-leaf tree-node';
      const leafContent1 = document.createElement('div');
      leafContent1.className = 'tree-node-content';
      leafContent1.textContent = 'File 1';
      leaf1.appendChild(leafContent1);
      children1.appendChild(leaf1);

      const branch2 = document.createElement('div');
      branch2.className = 'tree-branch tree-node';
      const content2 = document.createElement('div');
      content2.className = 'tree-node-content';
      const toggle2 = document.createElement('button');
      toggle2.className = 'tree-toggle';
      content2.appendChild(toggle2);
      content2.appendChild(document.createTextNode('Subfolder'));
      branch2.appendChild(content2);

      const children2 = document.createElement('div');
      children2.className = 'tree-children';
      const leaf2 = document.createElement('div');
      leaf2.className = 'tree-leaf tree-node';
      const leafContent2 = document.createElement('div');
      leafContent2.className = 'tree-node-content';
      leafContent2.textContent = 'File 2';
      leaf2.appendChild(leafContent2);
      children2.appendChild(leaf2);
      branch2.appendChild(children2);

      children1.appendChild(branch2);
      branch1.appendChild(children1);
    }

    tree.appendChild(branch1);
  }

  document.body.appendChild(tree);
  return tree;
}

describe('initTrees', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns a cleanup handle with destroy()', () => {
    const cleanup = initTrees();
    expect(typeof cleanup.destroy).toBe('function');
    cleanup.destroy();
  });

  it('handles multiple init calls without duplicating listeners', () => {
    const tree = createTree();
    const branch = tree.querySelector<HTMLElement>('.tree-branch')!;

    initTrees();
    const cleanup = initTrees();

    expect(branch.classList.contains('active')).toBe(false);

    const toggle = branch.querySelector<HTMLElement>('.tree-toggle')!;
    toggle.click();

    expect(branch.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('sets ARIA tree role on root element', () => {
    const tree = createTree();
    const cleanup = initTrees();

    expect(tree.getAttribute('role')).toBe('tree');

    cleanup.destroy();
  });

  it('preserves existing role attribute on tree', () => {
    const tree = createTree();
    tree.setAttribute('role', 'navigation');

    const cleanup = initTrees();

    expect(tree.getAttribute('role')).toBe('navigation');

    cleanup.destroy();
  });

  it('sets ARIA treeitem role on nodes', () => {
    const tree = createTree();
    const cleanup = initTrees();

    const nodes = tree.querySelectorAll('.tree-node');
    nodes.forEach((node) => {
      expect(node.getAttribute('role')).toBe('treeitem');
    });

    cleanup.destroy();
  });

  it('sets aria-expanded on branch nodes', () => {
    const tree = createTree();
    const cleanup = initTrees();

    const branch = tree.querySelector<HTMLElement>('.tree-branch')!;
    const content = branch.querySelector<HTMLElement>('.tree-node-content')!;

    expect(content.getAttribute('aria-expanded')).toBe('false');

    cleanup.destroy();
  });

  it('toggles branch on toggle button click', () => {
    const tree = createTree();
    const branch = tree.querySelector<HTMLElement>('.tree-branch')!;
    const toggle = branch.querySelector<HTMLElement>('.tree-toggle')!;
    const content = branch.querySelector<HTMLElement>('.tree-node-content')!;
    const cleanup = initTrees();

    expect(branch.classList.contains('active')).toBe(false);
    expect(content.getAttribute('aria-expanded')).toBe('false');

    toggle.click();

    expect(branch.classList.contains('active')).toBe(true);
    expect(content.getAttribute('aria-expanded')).toBe('true');

    toggle.click();

    expect(branch.classList.contains('active')).toBe(false);
    expect(content.getAttribute('aria-expanded')).toBe('false');

    cleanup.destroy();
  });

  it('toggles branch on content click', () => {
    const tree = createTree();
    const branch = tree.querySelector<HTMLElement>('.tree-branch')!;
    const content = branch.querySelector<HTMLElement>('.tree-node-content')!;
    const cleanup = initTrees();

    expect(branch.classList.contains('active')).toBe(false);

    content.click();

    expect(branch.classList.contains('active')).toBe(true);

    content.click();

    expect(branch.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('initializes branches with active class as expanded', () => {
    const tree = createTree();
    const branch = tree.querySelector<HTMLElement>('.tree-branch')!;
    branch.classList.add('active');

    const cleanup = initTrees();

    const content = branch.querySelector<HTMLElement>('.tree-node-content')!;
    expect(content.getAttribute('aria-expanded')).toBe('true');

    cleanup.destroy();
  });

  it('selects leaf node on click and deselects others', () => {
    const tree = createTree();
    const cleanup = initTrees();

    const leaves = tree.querySelectorAll<HTMLElement>('.tree-leaf .tree-node-content');
    expect(leaves).toHaveLength(2);

    leaves[0].click();
    expect(leaves[0].classList.contains('selected')).toBe(true);
    expect(leaves[1].classList.contains('selected')).toBe(false);

    leaves[1].click();
    expect(leaves[0].classList.contains('selected')).toBe(false);
    expect(leaves[1].classList.contains('selected')).toBe(true);

    cleanup.destroy();
  });

  it('makes first node content focusable', () => {
    const tree = createTree();
    const cleanup = initTrees();

    const firstContent = tree.querySelector<HTMLElement>('.tree-node-content')!;
    expect(firstContent.getAttribute('tabindex')).toBe('0');

    cleanup.destroy();
  });

  it('navigates down with ArrowDown key', () => {
    const tree = createTree();
    const cleanup = initTrees();

    const branch = tree.querySelector<HTMLElement>('.tree-branch')!;
    branch.classList.add('active');

    const contents = Array.from(tree.querySelectorAll<HTMLElement>('.tree-node-content'));
    contents[0].focus();

    tree.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

    expect(document.activeElement).toBe(contents[1]);

    cleanup.destroy();
  });

  it('navigates up with ArrowUp key', () => {
    const tree = createTree();
    const cleanup = initTrees();

    const branch = tree.querySelector<HTMLElement>('.tree-branch')!;
    branch.classList.add('active');

    const contents = Array.from(tree.querySelectorAll<HTMLElement>('.tree-node-content'));
    contents[1].focus();

    tree.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

    expect(document.activeElement).toBe(contents[0]);

    cleanup.destroy();
  });

  it('expands collapsed branch on ArrowRight key', () => {
    const tree = createTree();
    const branch = tree.querySelector<HTMLElement>('.tree-branch')!;
    const content = branch.querySelector<HTMLElement>('.tree-node-content')!;
    const cleanup = initTrees();

    content.focus();
    expect(branch.classList.contains('active')).toBe(false);

    tree.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(branch.classList.contains('active')).toBe(true);

    cleanup.destroy();
  });

  it('moves to first child on ArrowRight when branch is already expanded', () => {
    const tree = createTree();
    const branch = tree.querySelector<HTMLElement>('.tree-branch')!;
    branch.classList.add('active');
    const content = branch.querySelector<HTMLElement>('.tree-node-content')!;
    const cleanup = initTrees();

    content.focus();

    tree.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    const firstChild = branch.querySelector<HTMLElement>(
      ':scope > .tree-children > .tree-node > .tree-node-content'
    )!;
    expect(document.activeElement).toBe(firstChild);

    cleanup.destroy();
  });

  it('collapses expanded branch on ArrowLeft key', () => {
    const tree = createTree();
    const branch = tree.querySelector<HTMLElement>('.tree-branch')!;
    branch.classList.add('active');
    const content = branch.querySelector<HTMLElement>('.tree-node-content')!;
    const cleanup = initTrees();

    content.focus();

    tree.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));

    expect(branch.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('moves to parent branch on ArrowLeft when on child node', () => {
    const tree = createTree();
    const branch = tree.querySelector<HTMLElement>('.tree-branch')!;
    branch.classList.add('active');
    const cleanup = initTrees();

    const nestedBranch = branch.querySelector<HTMLElement>('.tree-children > .tree-branch')!;
    nestedBranch.classList.add('active');

    const deepChildContent = nestedBranch.querySelector<HTMLElement>(
      ':scope > .tree-children > .tree-node > .tree-node-content'
    )!;
    deepChildContent.focus();

    tree.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));

    const nestedBranchContent = nestedBranch.querySelector<HTMLElement>(
      ':scope > .tree-node-content'
    )!;
    expect(document.activeElement).toBe(nestedBranchContent);

    cleanup.destroy();
  });

  it('navigates to first node on Home key', () => {
    const tree = createTree();
    const branch = tree.querySelector<HTMLElement>('.tree-branch')!;
    branch.classList.add('active');
    const cleanup = initTrees();

    const visibleContents = Array.from(
      tree.querySelectorAll<HTMLElement>('.tree-node-content')
    ).filter((node) => {
      const branchInCollapsed = node.closest('.tree-branch:not(.active) > .tree-children');
      return !branchInCollapsed;
    });
    visibleContents[visibleContents.length - 1].focus();

    tree.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));

    expect(document.activeElement).toBe(visibleContents[0]);

    cleanup.destroy();
  });

  it('navigates to last visible node on End key', () => {
    const tree = createTree();
    const branch = tree.querySelector<HTMLElement>('.tree-branch')!;
    branch.classList.add('active');
    const cleanup = initTrees();

    const contents = Array.from(tree.querySelectorAll<HTMLElement>('.tree-node-content'));
    contents[0].focus();

    tree.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));

    const visibleContents = contents.filter((c) => {
      const branchInCollapsed = c.closest('.tree-branch:not(.active) > .tree-children');
      return !branchInCollapsed;
    });

    expect(document.activeElement).toBe(visibleContents[visibleContents.length - 1]);

    cleanup.destroy();
  });

  it('clicks focused node on Enter or Space key', () => {
    const tree = createTree();
    const branch = tree.querySelector<HTMLElement>('.tree-branch')!;
    const content = branch.querySelector<HTMLElement>('.tree-node-content')!;
    const cleanup = initTrees();

    content.focus();
    expect(branch.classList.contains('active')).toBe(false);

    tree.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(branch.classList.contains('active')).toBe(true);

    tree.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

    expect(branch.classList.contains('active')).toBe(false);

    cleanup.destroy();
  });

  it('scopes queries to custom root via options', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const tree = document.createElement('div');
    tree.setAttribute('data-sol-tree', '');
    const node = document.createElement('div');
    node.className = 'tree-node';
    const content = document.createElement('div');
    content.className = 'tree-node-content';
    node.appendChild(content);
    tree.appendChild(node);
    root.appendChild(tree);

    const cleanup = initTrees({ root });

    expect(tree.getAttribute('role')).toBe('tree');

    cleanup.destroy();
  });

  describe('error handling', () => {
    it('handles gracefully when no elements match the tree selector', () => {
      expect(() => initTrees()).not.toThrow();
      const cleanup = initTrees();
      expect(typeof cleanup.destroy).toBe('function');
      cleanup.destroy();
    });

    it('handles gracefully when tree has no branches or leaves', () => {
      const tree = document.createElement('div');
      tree.setAttribute('data-sol-tree', '');
      document.body.appendChild(tree);

      expect(() => initTrees()).not.toThrow();
      const cleanup = initTrees();
      expect(tree.getAttribute('role')).toBe('tree');

      cleanup.destroy();
    });

    it('handles gracefully when branch lacks toggle button', () => {
      const tree = document.createElement('div');
      tree.setAttribute('data-sol-tree', '');

      const branch = document.createElement('div');
      branch.className = 'tree-branch tree-node';
      const content = document.createElement('div');
      content.className = 'tree-node-content';
      content.textContent = 'No toggle';
      branch.appendChild(content);
      tree.appendChild(branch);

      document.body.appendChild(tree);

      expect(() => initTrees()).not.toThrow();
      const cleanup = initTrees();

      content.click();
      expect(branch.classList.contains('active')).toBe(true);

      cleanup.destroy();
    });

    it('handles gracefully when nested branches exist', () => {
      const tree = createTree(2);

      expect(() => initTrees()).not.toThrow();
      const cleanup = initTrees();

      const branches = tree.querySelectorAll('.tree-branch');
      expect(branches.length).toBeGreaterThan(1);

      cleanup.destroy();
    });
  });
});
