import type { SandboxState } from './sandbox-state';

export interface ComponentEntry {
  id: string;
  name: string;
  description: string;
  category?: string;
  renderPreview: (state: SandboxState) => string;
  hasPlayground?: boolean;
}

export interface ComponentGroup {
  category: string;
  entries: ComponentEntry[];
}

const registry = new Map<string, ComponentEntry>();

export function registerComponent(entry: ComponentEntry): void {
  registry.set(entry.id, entry);
}

export function getComponent(id: string): ComponentEntry | undefined {
  return registry.get(id);
}

export function getAllComponents(): ComponentEntry[] {
  return [...registry.values()];
}

/** Returns components grouped by category, both levels sorted alphabetically. */
export function getComponentsByCategory(): ComponentGroup[] {
  const groups = new Map<string, ComponentEntry[]>();

  for (const entry of registry.values()) {
    const cat = entry.category ?? 'Uncategorized';
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(entry);
  }

  return [...groups.keys()]
    .sort((a, b) => a.localeCompare(b))
    .map((cat) => ({
      category: cat,
      entries: groups.get(cat)!.sort((a, b) => a.name.localeCompare(b.name)),
    }));
}
