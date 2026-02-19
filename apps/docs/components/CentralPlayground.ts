/**
 * Central playground shell that wraps a Sandbox instance with a component
 * selector. Manages Sandbox lifecycle on component change.
 */

import { Sandbox } from './Sandbox';
import { getAllComponents, getComponent, getComponentsByCategory } from '../lib/component-registry';
import { readStateFromUrl } from '../lib/url-state';
import { createDefaultState } from '../lib/sandbox-state';
import type { SandboxState } from '../lib/sandbox-state';
import { CustomSelect } from './CustomSelect';
import type { SelectGroup } from './CustomSelect';

export class CentralPlayground {
  private element: HTMLElement;
  private sandboxMount: HTMLElement;
  private componentSelect: CustomSelect;
  private sandbox: Sandbox | null = null;
  private activeComponentId: string | null = null;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'central-playground';

    // Header row
    const header = document.createElement('div');
    header.className = 'central-playground__header';

    // Component selector
    const componentGroups = this.buildComponentGroups();
    const firstComponent = componentGroups[0]?.items[0]?.value ?? '';

    this.componentSelect = new CustomSelect(
      componentGroups,
      firstComponent,
      (value) => {
        this.selectComponent(value, this.sandbox?.getState());
      },
      'Select component'
    );

    const componentLabel = document.createElement('div');
    componentLabel.className = 'flex flex-col gap-1';
    componentLabel.innerHTML = '<span class="text-sm font-medium text-secondary">Component</span>';
    componentLabel.appendChild(this.componentSelect.getElement());

    header.appendChild(componentLabel);
    this.element.appendChild(header);

    // Sandbox mount point
    this.sandboxMount = document.createElement('div');
    this.sandboxMount.className = 'central-playground__sandbox';
    this.element.appendChild(this.sandboxMount);

    this.loadFromUrl();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  private buildComponentGroups(): SelectGroup[] {
    return getComponentsByCategory().map(({ category, entries }) => ({
      label: category,
      items: entries.map((entry) => ({ value: entry.id, label: entry.name })),
    }));
  }

  loadFromUrl(): void {
    const urlState = readStateFromUrl();
    const hash = location.hash.slice(1);
    const qIdx = hash.indexOf('?');
    const params = qIdx === -1 ? new URLSearchParams() : new URLSearchParams(hash.slice(qIdx + 1));
    const componentId = params.get('component');

    const components = getAllComponents();
    const target =
      componentId && getComponent(componentId) ? componentId : (components[0]?.id ?? null);

    if (target) {
      // URL tier params take priority (shared links); otherwise preserve current state
      const hasTierParams = Object.keys(urlState).length > 0;
      const tierState = hasTierParams ? urlState : this.sandbox?.getState();
      this.componentSelect.setValue(target);
      this.selectComponent(target, tierState);
    }
  }

  private selectComponent(id: string, initialState?: Partial<SandboxState>): void {
    const entry = getComponent(id);
    if (!entry) return;

    // Destroy previous sandbox
    if (this.sandbox) {
      this.sandboxMount.innerHTML = '';
      this.sandbox = null;
    }

    this.activeComponentId = id;

    const state = { ...createDefaultState(), ...initialState };

    this.sandbox = new Sandbox({
      id: `playground-${id}`,
      renderPreview: entry.renderPreview,
      initialState: state,
    });

    this.sandbox.onStateChange(() => {
      this.updateUrl();
    });

    this.sandboxMount.appendChild(this.sandbox.getElement());
    this.updateUrl();
  }

  private updateUrl(): void {
    if (!this.sandbox || !this.activeComponentId) return;
    const state = this.sandbox.getState();

    // Build params with component ID + tier state
    const hash = location.hash.slice(1);
    const qIdx = hash.indexOf('?');
    const path = qIdx === -1 ? hash : hash.slice(0, qIdx);
    const params = new URLSearchParams();
    params.set('component', this.activeComponentId);
    if (state.theme) params.set('theme', state.theme);
    if (state.relief) params.set('relief', state.relief);
    if (state.finish) params.set('finish', state.finish);
    const newHash = `#${path}?${params.toString()}`;
    if (location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }
  }
}
