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

describe('useSoltana integration', () => {
  function TestComponent({ onValue }: { onValue: (v: SoltanaContextValue) => void }) {
    const value = useSoltana({ theme: 'dark', relief: 'flat', finish: 'frosted' });
    onValue(value);
    return null;
  }

  it('sets data attributes on document.documentElement', () => {
    render(<TestComponent onValue={vi.fn()} />);

    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(root.getAttribute('data-relief')).toBe('flat');
    expect(root.getAttribute('data-finish')).toBe('frosted');
  });

  it('returns correct config state from real instance', () => {
    const onValue = (v: SoltanaContextValue) => {
      if (v.instance) {
        expect(v.config.theme).toBe('dark');
        expect(v.config.relief).toBe('flat');
        expect(v.config.finish).toBe('frosted');
      }
    };
    render(<TestComponent onValue={onValue} />);
  });

  it('returns a real instance with functional setters', () => {
    let captured: SoltanaContextValue | null = null;
    function Capture() {
      const value = useSoltana({ theme: 'dark' });
      captured = value;
      return null;
    }

    render(<Capture />);

    expect(captured!.instance).not.toBeNull();
    expect(typeof captured!.instance!.setTheme).toBe('function');
    expect(typeof captured!.instance!.setRelief).toBe('function');
    expect(typeof captured!.instance!.setFinish).toBe('function');
    expect(typeof captured!.instance!.destroy).toBe('function');
  });

  it('updates config and DOM on setTheme()', () => {
    const values: SoltanaContextValue[] = [];
    function Tracker() {
      const value = useSoltana({ theme: 'dark' });
      values.push(value);
      return null;
    }

    render(<Tracker />);

    act(() => {
      values[values.length - 1].instance!.setTheme('sepia');
    });

    expect(root.getAttribute('data-theme')).toBe('sepia');
    const latest = values[values.length - 1];
    expect(latest.config.theme).toBe('sepia');
  });

  it('removes data attributes on unmount via destroy()', () => {
    const { unmount } = render(<TestComponent onValue={vi.fn()} />);

    expect(root.getAttribute('data-theme')).toBe('dark');

    unmount();

    expect(root.getAttribute('data-theme')).toBeNull();
    expect(root.getAttribute('data-relief')).toBeNull();
    expect(root.getAttribute('data-finish')).toBeNull();
  });
});

describe('SoltanaProvider + useSoltanaContext integration', () => {
  it('provides real config to consumers', () => {
    let captured: SoltanaContextValue | null = null;

    function Consumer() {
      captured = useSoltanaContext();
      return null;
    }

    render(
      <SoltanaProvider config={{ theme: 'light', relief: 'glassmorphic', finish: 'tinted' }}>
        <Consumer />
      </SoltanaProvider>
    );

    expect(captured).not.toBeNull();
    expect(captured!.config.theme).toBe('light');
    expect(captured!.config.relief).toBe('glassmorphic');
    expect(captured!.config.finish).toBe('tinted');
    expect(captured!.instance).not.toBeNull();

    expect(root.getAttribute('data-theme')).toBe('light');
    expect(root.getAttribute('data-relief')).toBe('glassmorphic');
    expect(root.getAttribute('data-finish')).toBe('tinted');
  });
});
