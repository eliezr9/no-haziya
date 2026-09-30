// Timing of the walk-to-bed transition (design/ANIMATIONS.md §B). The motion itself is CSS
// (styles/scene.css); these numbers must match the delays there.
import type { Outcome } from '../check';
import { displayed, type Band } from '../scores';

/** From the answer arriving until she lies down: bubble pops, walk, per-risk moves, hop. */
export const LIE_DOWN_MS: Record<Band, number> = { high: 900, medium: 1950, low: 1200 };

/** From lying down until the scene has settled and the result card pops in. */
export const SETTLE_MS: Record<Band, number> = { high: 800, medium: 800, low: 1100 };

/** How long the scene plays before the result card shows. No score → no transition. */
export function revealMs(outcome: Outcome, news: boolean): number {
  if (outcome.kind !== 'result') return 0;
  const { band } = displayed(outcome.area, news);
  return LIE_DOWN_MS[band] + SETTLE_MS[band];
}
