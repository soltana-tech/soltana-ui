import type { SandboxState } from './sandbox-state';

export interface ComponentEntry {
  id: string;
  name: string;
  description: string;
  renderPreview: (state: SandboxState) => string;
  hasPlayground?: boolean;
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
