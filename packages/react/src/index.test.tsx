import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { SoltanaProvider, useSoltana, useSoltanaContext } from './index.js';
import type { SoltanaContextValue } from './types.js';

// Mock soltana-ui module
const mockGetState = vi.fn();
const mockDestroy = vi.fn();
const mockInitSoltana = vi.fn();

vi.mock('soltana-ui', () => ({
  initSoltana: (...args: unknown[]) => mockInitSoltana(...args) as unknown,
}));

function createMockInstance(overrides?: Partial<ReturnType<typeof mockGetState>>) {
  const state = {
    theme: 'dark',
    relief: 'neumorphic',
    finish: 'matte',
    overrides: {},
    ...overrides,
  };
  mockGetState.mockReturnValue({ ...state });
  mockDestroy.mockReset();
  mockInitSoltana.mockReturnValue({
    getState: mockGetState,
    destroy: mockDestroy,
    setTheme: vi.fn(),
    setRelief: vi.fn(),
    setFinish: vi.fn(),
    applyRecipe: vi.fn(),
    registerRecipe: vi.fn(),
    setOverrides: vi.fn(),
    removeOverrides: vi.fn(),
    registerTheme: vi.fn(),
    registerRelief: vi.fn(),
    registerFinish: vi.fn(),
    reinitEnhancers: vi.fn(),
    reset: vi.fn(),
  });
}

beforeEach(() => {
  createMockInstance();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useSoltana', () => {
  function TestComponent({ onValue }: { onValue: (v: SoltanaContextValue) => void }) {
    const value = useSoltana();
    onValue(value);
    return null;
  }

  it('calls initSoltana on mount', () => {
    const onValue = vi.fn();
    render(<TestComponent onValue={onValue} />);

    expect(mockInitSoltana).toHaveBeenCalledOnce();
  });

  it('returns config from instance.getState()', () => {
    const onValue = vi.fn();
    render(<TestComponent onValue={onValue} />);

    const lastCall = onValue.mock.calls[onValue.mock.calls.length - 1][0] as SoltanaContextValue;
    expect(lastCall.config).toEqual({
      theme: 'dark',
      relief: 'neumorphic',
      finish: 'matte',
      overrides: {},
    });
  });

  it('calls destroy on unmount', () => {
    const onValue = vi.fn();
    const { unmount } = render(<TestComponent onValue={onValue} />);

    unmount();

    expect(mockDestroy).toHaveBeenCalledOnce();
  });

  it('updates state on soltana:change', () => {
    const onValue = vi.fn();
    render(<TestComponent onValue={onValue} />);

    // Simulate a config change
    mockGetState.mockReturnValue({
      theme: 'light',
      relief: 'flat',
      finish: 'frosted',
      overrides: {},
    });

    act(() => {
      document.documentElement.dispatchEvent(
        new CustomEvent('soltana:change', { detail: { type: 'theme', value: 'light' } })
      );
    });

    const lastCall = onValue.mock.calls[onValue.mock.calls.length - 1][0] as SoltanaContextValue;
    expect(lastCall.config.theme).toBe('light');
  });

  it('passes config to initSoltana', () => {
    function ConfiguredComponent() {
      useSoltana({ theme: 'sepia', relief: 'flat' });
      return null;
    }

    render(<ConfiguredComponent />);

    expect(mockInitSoltana).toHaveBeenCalledWith({ theme: 'sepia', relief: 'flat' });
  });
});

describe('SoltanaProvider + useSoltanaContext', () => {
  function Consumer({ onValue }: { onValue: (v: SoltanaContextValue) => void }) {
    const value = useSoltanaContext();
    onValue(value);
    return null;
  }

  it('provides context to children', () => {
    const onValue = vi.fn();
    render(
      <SoltanaProvider>
        <Consumer onValue={onValue} />
      </SoltanaProvider>
    );

    const lastCall = onValue.mock.calls[onValue.mock.calls.length - 1][0] as SoltanaContextValue;
    expect(lastCall.config).toBeDefined();
    expect(lastCall.instance).toBeDefined();
  });

  it('throws when useSoltanaContext is used outside provider', () => {
    // Suppress React error boundary console output
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {
      /* suppress */
    });

    function Orphan() {
      useSoltanaContext();
      return null;
    }

    expect(() => render(<Orphan />)).toThrow(
      'useSoltanaContext must be used within a <SoltanaProvider>'
    );

    spy.mockRestore();
  });

  it('propagates soltana:change events through context', () => {
    const onValue = vi.fn();
    render(
      <SoltanaProvider>
        <Consumer onValue={onValue} />
      </SoltanaProvider>
    );

    // Simulate a config change via the event
    mockGetState.mockReturnValue({
      theme: 'sepia',
      relief: 'glassmorphic',
      finish: 'glossy',
      overrides: {},
    });

    act(() => {
      document.documentElement.dispatchEvent(
        new CustomEvent('soltana:change', { detail: { type: 'theme', value: 'sepia' } })
      );
    });

    const lastCall = onValue.mock.calls[onValue.mock.calls.length - 1][0] as SoltanaContextValue;
    expect(lastCall.config.theme).toBe('sepia');
    expect(lastCall.config.relief).toBe('glassmorphic');
  });

  it('cleans up event listener and destroys instance on provider unmount', () => {
    const onValue = vi.fn();
    const { unmount } = render(
      <SoltanaProvider>
        <Consumer onValue={onValue} />
      </SoltanaProvider>
    );

    unmount();
    expect(mockDestroy).toHaveBeenCalledOnce();

    // After unmount, dispatching events should not cause errors or updates
    const callCount = onValue.mock.calls.length;
    act(() => {
      document.documentElement.dispatchEvent(
        new CustomEvent('soltana:change', { detail: { type: 'theme', value: 'light' } })
      );
    });
    expect(onValue.mock.calls.length).toBe(callCount);
  });
});
