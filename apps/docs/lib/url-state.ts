import type { SandboxState } from './sandbox-state';
import { serializeState, deserializeState } from './sandbox-state';

/**
 * Read sandbox state from the current URL hash query params.
 * Hash format: `#/components/buttons?relief=lifted&finish=frosted`
 */
export function readStateFromUrl(): Partial<SandboxState> {
  const hash = location.hash.slice(1);
  const qIdx = hash.indexOf('?');
  if (qIdx === -1) return {};
  return deserializeState(new URLSearchParams(hash.slice(qIdx + 1)));
}

/**
 * Write sandbox state into the URL hash query params.
 * Uses `replaceState` to avoid polluting browser history.
 */
export function writeStateToUrl(state: SandboxState): void {
  const hash = location.hash.slice(1);
  const qIdx = hash.indexOf('?');
  const path = qIdx === -1 ? hash : hash.slice(0, qIdx);
  const params = serializeState(state);
  const newHash = params.toString() ? `#${path}?${params.toString()}` : `#${path}`;
  history.replaceState(null, '', newHash);
}

/** Copy the full URL (including hash + query params) to clipboard. */
export async function copyShareUrl(): Promise<void> {
  await navigator.clipboard.writeText(location.href);
}
