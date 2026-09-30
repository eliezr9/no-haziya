import { afterEach, describe, expect, it, vi } from 'vitest';
import { MIN_CHECKING_MS, withMinDuration } from '../src/check';

describe('withMinDuration', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('holds an instant answer for the minimum time (SPEC: ≈1.2s)', async () => {
    vi.useFakeTimers();
    let done = false;
    const result = withMinDuration(Promise.resolve('low'), MIN_CHECKING_MS).then((v) => {
      done = true;
      return v;
    });
    await vi.advanceTimersByTimeAsync(MIN_CHECKING_MS - 1);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(done).toBe(true);
    await expect(result).resolves.toBe('low');
  });

  it('waits for a slow answer', async () => {
    vi.useFakeTimers();
    let done = false;
    const slow = new Promise((resolve) => setTimeout(() => resolve('high'), 3000));
    const result = withMinDuration(slow, MIN_CHECKING_MS).then((v) => {
      done = true;
      return v;
    });
    await vi.advanceTimersByTimeAsync(2000);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(1000);
    await expect(result).resolves.toBe('high');
  });
});
