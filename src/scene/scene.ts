// Scene panel (SPEC §2): the pin panel until a location is chosen, then the illustration in
// the pose for the current step. Still frames only; motion comes in the animation step.
import { strings, type Strings } from '../i18n';
import { displayed } from '../scores';
import type { AppState, Store } from '../state';
import { sceneMarkup } from './markup';

export type SceneState = 'idle' | 'checking' | 'high' | 'medium' | 'low';

/** "No data" and "couldn't check" have no risk pose, so the girl keeps standing. */
export function sceneState({ step, outcome, news }: AppState): SceneState {
  if (step === 'checking') return 'checking';
  if (step === 'result' && outcome?.kind === 'result') return displayed(outcome.area, news).band;
  return 'idle';
}

const LABEL: Record<SceneState, keyof Strings> = {
  idle: 'sceneIdle',
  checking: 'sceneChecking',
  high: 'sceneHigh',
  medium: 'sceneMedium',
  low: 'sceneLow',
};

export function initScene(store: Store): void {
  const pinPanel = document.getElementById('pin-panel')!;
  const svg = document.getElementById('scene-panel')!;
  svg.innerHTML = sceneMarkup;
  const newsText = svg.querySelector('#news-text')!;

  const render = () => {
    const state = store.get();
    const t = strings[state.lang];
    const hasLocation = state.location !== null;
    pinPanel.hidden = hasLocation;
    svg.toggleAttribute('hidden', !hasLocation);
    const scene = sceneState(state);
    svg.dataset.state = scene;
    svg.toggleAttribute('data-news', state.news);
    svg.setAttribute('aria-label', t[LABEL[scene]]);
    newsText.textContent = t.newsBlah;
  };
  store.subscribe(render);
  render();
}
