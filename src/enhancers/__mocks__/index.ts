import { vi } from 'vitest';

export const mockEnhancerDestroy = vi.fn();
export const initAll = vi.fn(() => ({ destroy: mockEnhancerDestroy }));
