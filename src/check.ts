/** SPEC §2 state 3: "checking" stays up at least this long, even if the answer is instant. */
export const MIN_CHECKING_MS = 1200;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Resolves with `work`'s value, but never sooner than `ms`. */
export async function withMinDuration<T>(work: Promise<T>, ms: number): Promise<T> {
  const [value] = await Promise.all([work, delay(ms)]);
  return value;
}

/**
 * Placeholder: the next step reads the pre-built scores.json and returns the result
 * for the chosen area. Never compute risk here (CLAUDE.md).
 */
export async function checkRisk(): Promise<void> {}
