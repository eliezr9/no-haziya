import { describe, expect, it } from 'vitest';
import type { Outcome } from '../src/check';
import { sceneState } from '../src/scene/scene';
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

  it('keeps standing when there is no score to show', () => {
    expect(sceneState({ ...base, step: 'result', outcome: { kind: 'noData' } })).toBe('idle');
    expect(sceneState({ ...base, step: 'result', outcome: { kind: 'error' } })).toBe('idle');
  });
});
