import { describe, expect, it } from 'vitest';
import type { Outcome } from '../src/check';
import { sceneState } from '../src/scene/scene';
import { LIE_DOWN_MS, revealMs, SETTLE_MS } from '../src/scene/timeline';
import type { AppState } from '../src/state';

const base: AppState = { lang: 'he', location: { id: 1, he: 'אילת', en: 'Eilat' }, step: 'idle', outcome: null, news: false };
const result: Outcome = {
  kind: 'result',
  area: { score: 47, band: 'medium', reason: { code: 'sirensWeek', n: 2 }, news: { score: 82, band: 'high' } },
  updatedAt: new Date(),
  sample: true,
};

describe('sceneState', () => {
  it('stands in idle and checking', () => {
    expect(sceneState(base)).toBe('idle');
    expect(sceneState({ ...base, step: 'checking' })).toBe('checking');
  });

  it('lies down in the band of the shown score, news included', () => {
    expect(sceneState({ ...base, step: 'result', outcome: result })).toBe('medium');
    expect(sceneState({ ...base, step: 'result', outcome: result, news: true })).toBe('high');
  });

  it('walks to bed while the answer is revealed', () => {
    expect(sceneState({ ...base, step: 'revealing', outcome: result })).toBe('going');
  });

  it('keeps standing when there is no score to show', () => {
    expect(sceneState({ ...base, step: 'result', outcome: { kind: 'noData' } })).toBe('idle');
    expect(sceneState({ ...base, step: 'result', outcome: { kind: 'error' } })).toBe('idle');
  });
});

describe('revealMs', () => {
  it('plays the walk and the lie-down for the band of the shown score', () => {
    expect(revealMs(result, false)).toBe(LIE_DOWN_MS.medium + SETTLE_MS.medium);
    expect(revealMs(result, true)).toBe(LIE_DOWN_MS.high + SETTLE_MS.high);
  });

  it('has nothing to play without a score', () => {
    expect(revealMs({ kind: 'noData' }, false)).toBe(0);
    expect(revealMs({ kind: 'error' }, false)).toBe(0);
  });

  it('stays within the 2–3s of ANIMATIONS.md', () => {
    for (const band of ['low', 'medium', 'high'] as const) {
      expect(LIE_DOWN_MS[band] + SETTLE_MS[band]).toBeLessThanOrEqual(3000);
    }
  });
});
