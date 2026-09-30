import type { ChosenLocality } from './search/localities';
import { loadScores, type AreaScore } from './scores';

/** SPEC §2 state 3: "checking" stays up at least this long, even if the answer is instant. */
export const MIN_CHECKING_MS = 1200;

export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Resolves with `work`'s value, but never sooner than `ms`. */
export async function withMinDuration<T>(work: Promise<T>, ms: number): Promise<T> {
  const [value] = await Promise.all([work, delay(ms)]);
  return value;
}

export type Outcome =
  | { kind: 'result'; area: AreaScore; updatedAt: Date; sample: boolean }
  | { kind: 'noData' } // the file has no entry for this area
  | { kind: 'error' }; // couldn't load or read the file

/** Looks the area up in the pre-built scores.json. Never computes risk here (CLAUDE.md). */
export async function checkRisk(location: ChosenLocality): Promise<Outcome> {
  try {
    const scores = await loadScores();
    const area = scores.areas.get(location.he);
    return area ? { kind: 'result', area, updatedAt: scores.updatedAt, sample: scores.sample } : { kind: 'noData' };
  } catch {
    return { kind: 'error' };
  }
}
