/**
 * Central playground shell that wraps a Sandbox instance with a component
 * selector and recipe presets. Manages Sandbox lifecycle on component change.
 */

import { Sandbox } from './Sandbox';
import { getAllComponents, getComponent, getComponentsByCategory } from '../lib/component-registry';
import { readStateFromUrl } from '../lib/url-state';
import { createDefaultState } from '../lib/sandbox-state';
import type { SandboxState } from '../lib/sandbox-state';
import { RECIPES } from '@soltana/config';
import type { RecipeName } from '@soltana/config';
import { CustomSelect } from './CustomSelect';
import type { SelectGroup } from './CustomSelect';

export class CentralPlayground {
  private element: HTMLElement;
  private sandboxMount: HTMLElement;
  private componentSelect: CustomSelect;
  private recipeSelect: CustomSelect;
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
        this.selectComponent(value);
      },
      'Select component'
    );

    const componentLabel = document.createElement('div');
    componentLabel.className = 'flex flex-col gap-1';
    componentLabel.innerHTML = '<span class="text-sm font-medium text-secondary">Component</span>';
    componentLabel.appendChild(this.componentSelect.getElement());

    // Recipe presets
    const recipeGroups = this.buildRecipeGroups();
    this.recipeSelect = new CustomSelect(
      recipeGroups,
      '',
      (value) => {
        const recipeName = value as RecipeName;
        if (!recipeName || !this.sandbox) return;
        const recipe = RECIPES[recipeName];
        this.sandbox.setState({
          theme: recipe.theme,
          relief: recipe.relief,
          finish: recipe.finish,
        });
        this.updateUrl();
      },
      'Apply recipe preset'
    );

    const recipeLabel = document.createElement('div');
    recipeLabel.className = 'flex flex-col gap-1';
    recipeLabel.innerHTML = '<span class="text-sm font-medium text-secondary">Recipe</span>';
    recipeLabel.appendChild(this.recipeSelect.getElement());

    header.appendChild(componentLabel);
    header.appendChild(recipeLabel);
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

  private buildRecipeGroups(): SelectGroup[] {
    return [
      {
        label: 'Recipes',
        items: [
          { value: '', label: '— None —' },
          ...Object.entries(RECIPES).map(([key, recipe]) => ({
            value: key,
            label: recipe.name,
          })),
        ],
      },
    ];
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
      this.componentSelect.setValue(target);
      this.selectComponent(target, urlState);
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
