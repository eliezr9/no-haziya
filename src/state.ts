import type { Outcome } from './check';
import type { Lang } from './i18n';
import type { ChosenLocality } from './search/localities';

/** With no location the screen is "empty" (SPEC state 1) whatever the step says. */
export type Step = 'idle' | 'checking' | 'result';

export interface AppState {
  lang: Lang;
  location: ChosenLocality | null;
  step: Step;
  /** Set when step is 'result'. */
  outcome: Outcome | null;
  /** News switch — not saved; only the city and language are stored locally. */
  news: boolean;
}

type Listener = (state: AppState, prev: AppState) => void;

export interface Store {
  get(): AppState;
  set(patch: Partial<AppState>): void;
  subscribe(listener: Listener): () => void;
}

export function createStore(initial: AppState): Store {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => state,
    set(patch) {
      const prev = state;
      state = { ...state, ...patch };
      listeners.forEach((l) => l(state, prev));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/** Accepts only a well-formed saved location; anything else counts as "no location yet". */
export function parseSavedLocation(value: unknown): ChosenLocality | null {
  if (typeof value !== 'object' || value === null) return null;
  const { id, he, en } = value as Record<string, unknown>;
  return typeof id === 'number' && typeof he === 'string' && typeof en === 'string' ? { id, he, en } : null;
}
