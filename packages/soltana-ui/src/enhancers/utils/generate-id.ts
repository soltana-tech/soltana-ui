// ---------------------------------------------------------------------------
// ID Generation Utility
// ---------------------------------------------------------------------------
// Generates short random identifiers for ARIA attribute linking.
// ---------------------------------------------------------------------------

/**
 * Generate a short random ID string suitable for ARIA `id` attributes.
 *
 * @internal
 */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 7);
}
