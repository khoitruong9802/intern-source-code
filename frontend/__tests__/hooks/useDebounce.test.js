import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useDebounce from '../../src/hooks/useDebounce';

vi.useFakeTimers(); // Mock timers for testing the delay

describe('useDebounce', () => {
  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  it('should update the debounced value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'test', delay: 500 },
      }
    );

    // Initially, the value should be the same
    expect(result.current).toBe('test');

    // Change the value
    rerender({ value: 'new value', delay: 500 });

    // Fast-forward timers and check the value again
    act(() => {
      vi.advanceTimersByTime(500); // Simulate the passage of 500ms
    });

    expect(result.current).toBe('new value');
  });

  it('should reset the debounce timer when the value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'test', delay: 500 },
      }
    );

    // Change the value and rerender
    rerender({ value: 'intermediate', delay: 500 });

    // Fast-forward timers, but only halfway
    act(() => {
      vi.advanceTimersByTime(300); // Simulate the passage of 300ms
    });

    // The value should still not have changed
    expect(result.current).toBe('test');

    // Change the value again before the delay completes
    rerender({ value: 'final', delay: 500 });

    // Fast-forward timers fully this time
    act(() => {
      vi.advanceTimersByTime(500); // Simulate the passage of 500ms
    });

    expect(result.current).toBe('final');
  });

  it('should not update if unmounted during debounce period', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'test', delay: 500 },
      }
    );

    // Change the value
    rerender({ value: 'new value', delay: 500 });

    // Unmount the component
    unmount();

    // Fast-forward timers
    act(() => {
      vi.advanceTimersByTime(500); // Simulate the passage of 500ms
    });

    // Since the hook is unmounted, it should not update the value
    expect(result.current).toBe('test');
  });
});
