import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { SoltanaProvider, useSoltana, useSoltanaContext } from './index.js';
import type { SoltanaContextValue } from './types.js';

const root = document.documentElement;

function cleanup() {
  root.removeAttribute('data-theme');
  root.removeAttribute('data-relief');
  root.removeAttribute('data-finish');
  root.removeAttribute('style');
}

afterEach(cleanup);

describe('useSoltana', () => {
  function TestComponent({ onValue }: { onValue: (v: SoltanaContextValue) => void }) {
    const value = useSoltana();
    onValue(value);
    return null;
  }

  it('returns a valid SoltanaContextValue shape', () => {
    const onValue = vi.fn();
    render(<TestComponent onValue={onValue} />);

    const value = onValue.mock.calls[onValue.mock.calls.length - 1][0] as SoltanaContextValue;
    expect(value).toBeDefined();
    expect(value.config).toBeDefined();
    expect(value.instance).toBeDefined();
    expect(typeof value.config.theme).toBe('string');
    expect(typeof value.config.relief).toBe('string');
    expect(typeof value.config.finish).toBe('string');
  });

  it('returns a real instance with all expected methods', () => {
    const onValue = vi.fn();
    render(<TestComponent onValue={onValue} />);

    const value = onValue.mock.calls[onValue.mock.calls.length - 1][0] as SoltanaContextValue;
    expect(value.instance).not.toBeNull();
    expect(typeof value.instance!.getState).toBe('function');
    expect(typeof value.instance!.setTheme).toBe('function');
    expect(typeof value.instance!.setRelief).toBe('function');
    expect(typeof value.instance!.setFinish).toBe('function');
    expect(typeof value.instance!.setOverrides).toBe('function');
    expect(typeof value.instance!.removeOverrides).toBe('function');
    expect(typeof value.instance!.registerTheme).toBe('function');
    expect(typeof value.instance!.registerRelief).toBe('function');
    expect(typeof value.instance!.registerFinish).toBe('function');
    expect(typeof value.instance!.reinitEnhancers).toBe('function');
    expect(typeof value.instance!.reset).toBe('function');
    expect(typeof value.instance!.destroy).toBe('function');
  });

  it('accepts and applies config options', () => {
    function ConfiguredComponent({ onValue }: { onValue: (v: SoltanaContextValue) => void }) {
      const value = useSoltana({ theme: 'sepia', relief: 'flat' });
      onValue(value);
      return null;
    }

    const onValue = vi.fn();
    render(<ConfiguredComponent onValue={onValue} />);

    expect(root.getAttribute('data-theme')).toBe('sepia');
    expect(root.getAttribute('data-relief')).toBe('flat');
  });

  it('cleans up on unmount', () => {
    const onValue = vi.fn();
    const { unmount } = render(<TestComponent onValue={onValue} />);

    const hadTheme = root.hasAttribute('data-theme');
    unmount();

    if (hadTheme) {
      expect(root.hasAttribute('data-theme')).toBe(false);
    }
  });

  it('instance methods are callable without throwing', () => {
    const onValue = vi.fn();
    render(<TestComponent onValue={onValue} />);

    const value = onValue.mock.calls[onValue.mock.calls.length - 1][0] as SoltanaContextValue;

    expect(() => value.instance!.getState()).not.toThrow();
    expect(() => {
      value.instance!.setTheme('dark');
    }).not.toThrow();
    expect(() => {
      value.instance!.setRelief('flat');
    }).not.toThrow();
    expect(() => {
      value.instance!.setFinish('matte');
    }).not.toThrow();
  });
});

describe('SoltanaProvider + useSoltanaContext', () => {
  function Consumer({ onValue }: { onValue: (v: SoltanaContextValue) => void }) {
    const value = useSoltanaContext();
    onValue(value);
    return null;
  }

  it('provides valid context to children', () => {
    const onValue = vi.fn();
    render(
      <SoltanaProvider>
        <Consumer onValue={onValue} />
      </SoltanaProvider>
    );

    const value = onValue.mock.calls[onValue.mock.calls.length - 1][0] as SoltanaContextValue;
    expect(value).toBeDefined();
    expect(value.config).toBeDefined();
    expect(value.instance).toBeDefined();
    expect(typeof value.config.theme).toBe('string');
    expect(typeof value.config.relief).toBe('string');
    expect(typeof value.config.finish).toBe('string');
  });

  it('throws when useSoltanaContext is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally empty - suppressing React error boundary warnings
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

  it('propagates real config changes through context', () => {
    const onValue = vi.fn();
    render(
      <SoltanaProvider config={{ theme: 'dark' }}>
        <Consumer onValue={onValue} />
      </SoltanaProvider>
    );

    const initialValue = onValue.mock.calls[
      onValue.mock.calls.length - 1
    ][0] as SoltanaContextValue;

    act(() => {
      initialValue.instance!.setTheme('sepia');
    });

    const updatedValue = onValue.mock.calls[
      onValue.mock.calls.length - 1
    ][0] as SoltanaContextValue;
    expect(updatedValue.config.theme).toBe('sepia');
  });

  it('cleans up event listener on unmount', () => {
    const onValue = vi.fn();
    const { unmount } = render(
      <SoltanaProvider>
        <Consumer onValue={onValue} />
      </SoltanaProvider>
    );

    const callCount = onValue.mock.calls.length;
    unmount();

    act(() => {
      document.documentElement.dispatchEvent(
        new CustomEvent('soltana:change', { detail: { type: 'theme', value: 'light' } })
      );
    });

    expect(onValue.mock.calls.length).toBe(callCount);
  });
});
