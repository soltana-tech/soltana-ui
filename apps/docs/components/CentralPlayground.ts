/**
 * Central playground shell that wraps a Sandbox instance with a component
 * selector and recipe presets. Manages Sandbox lifecycle on component change.
 */

import { Sandbox } from './Sandbox';
import { getAllComponents, getComponent } from '../lib/component-registry';
import { readStateFromUrl } from '../lib/url-state';
import { createDefaultState } from '../lib/sandbox-state';
import type { SandboxState } from '../lib/sandbox-state';
import { RECIPES } from '@soltana/config';
import type { RecipeName } from '@soltana/config';

export class CentralPlayground {
  private element: HTMLElement;
  private sandboxMount: HTMLElement;
  private componentSelect: HTMLSelectElement;
  private recipeSelect: HTMLSelectElement;
  private sandbox: Sandbox | null = null;
  private activeComponentId: string | null = null;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'central-playground';

    // Header row
    const header = document.createElement('div');
    header.className = 'central-playground__header';

    // Component selector
    this.componentSelect = document.createElement('select');
    this.componentSelect.className = 'select';
    this.componentSelect.setAttribute('aria-label', 'Select component');
    this.populateComponentOptions();

    const componentLabel = document.createElement('label');
    componentLabel.innerHTML = '<span>Component</span>';
    componentLabel.appendChild(this.componentSelect);

    // Recipe presets
    this.recipeSelect = document.createElement('select');
    this.recipeSelect.className = 'select';
    this.recipeSelect.setAttribute('aria-label', 'Apply recipe preset');
    this.populateRecipeOptions();

    const recipeLabel = document.createElement('label');
    recipeLabel.innerHTML = '<span>Recipe</span>';
    recipeLabel.appendChild(this.recipeSelect);

    header.appendChild(componentLabel);
    header.appendChild(recipeLabel);
    this.element.appendChild(header);

    // Sandbox mount point
    this.sandboxMount = document.createElement('div');
    this.sandboxMount.className = 'central-playground__sandbox';
    this.element.appendChild(this.sandboxMount);

    this.bind();
    this.loadFromUrl();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  private populateComponentOptions(): void {
    const components = getAllComponents();
    for (const entry of components) {
      const opt = document.createElement('option');
      opt.value = entry.id;
      opt.textContent = entry.name;
      this.componentSelect.appendChild(opt);
    }
  }

  private populateRecipeOptions(): void {
    const none = document.createElement('option');
    none.value = '';
    none.textContent = '— None —';
    this.recipeSelect.appendChild(none);

    for (const [key, recipe] of Object.entries(RECIPES)) {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = recipe.name;
      this.recipeSelect.appendChild(opt);
    }
  }

  private bind(): void {
    this.componentSelect.addEventListener('change', () => {
      this.selectComponent(this.componentSelect.value);
    });

    this.recipeSelect.addEventListener('change', () => {
      const recipeName = this.recipeSelect.value as RecipeName;
      if (!recipeName || !this.sandbox) return;
      const recipe = RECIPES[recipeName];
      this.sandbox.setState({
        theme: recipe.theme,
        relief: recipe.relief,
        finish: recipe.finish,
        ornament: recipe.ornament,
      });
      this.updateUrl();
    });
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
      this.componentSelect.value = target;
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
    if (state.ornament) params.set('ornament', state.ornament);
    const newHash = `#${path}?${params.toString()}`;
    if (location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }
  }
}
