// Scene panel (SPEC §2): the pin panel until a location is chosen, then the illustration in
// the pose for the current step. While the answer is being revealed she first walks to bed
// ('going', styles/scene.css) and then lies down in the pose for the risk band.
import { strings, type Strings } from '../i18n';
import { displayed, type Band } from '../scores';
import type { AppState, Store } from '../state';
import { sceneMarkup } from './markup';
import { LIE_DOWN_MS } from './timeline';

export type SceneState = 'idle' | 'checking' | 'going' | Band;

/** "No data" and "couldn't check" have no risk pose, so the girl keeps standing. */
export function sceneState({ step, outcome, news }: AppState): SceneState {
  if (step === 'checking') return 'checking';
  if (step === 'revealing' && outcome?.kind === 'result') return 'going';
  if (step === 'result' && outcome?.kind === 'result') return displayed(outcome.area, news).band;
  return 'idle';
}

/** The band the scene is heading to (or showing), if there is a score. */
function sceneBand({ outcome, news }: AppState): Band | undefined {
  return outcome?.kind === 'result' ? displayed(outcome.area, news).band : undefined;
}

const LABEL: Record<SceneState, keyof Strings> = {
  idle: 'sceneIdle',
  checking: 'sceneChecking',
  going: 'sceneChecking',
  high: 'sceneHigh',
  medium: 'sceneMedium',
  low: 'sceneLow',
};

export function initScene(store: Store): void {
  const pinPanel = document.getElementById('pin-panel')!;
  const svg = document.getElementById('scene-panel')!;
  svg.innerHTML = sceneMarkup;
  const newsText = svg.querySelector('#news-text')!;

  // The walk: which band it heads to, and whether she has lain down yet.
  let walkBand: Band | undefined;
  let lying = false;
  let timer = 0;

  const render = () => {
    const state = store.get();
    const t = strings[state.lang];
    const hasLocation = state.location !== null;
    pinPanel.hidden = hasLocation;
    svg.toggleAttribute('hidden', !hasLocation);

    let scene = sceneState(state);
    const band = sceneBand(state);
    if (scene === 'going' && band) {
      if (walkBand === undefined) {
        walkBand = band;
        lying = false;
        timer = window.setTimeout(() => {
          lying = true;
          render();
        }, LIE_DOWN_MS[band]);
      } else if (band !== walkBand) {
        lying = true; // news switch flipped mid-walk: skip to the new pose
      }
      if (lying) scene = band;
    } else {
      clearTimeout(timer);
      walkBand = undefined;
    }

    svg.dataset.state = scene;
    if (band) svg.dataset.band = band;
    else delete svg.dataset.band;
    svg.toggleAttribute('data-news', state.news);
    svg.setAttribute('aria-label', t[LABEL[scene]]);
    newsText.textContent = t.newsBlah;
  };
  store.subscribe(render);
  render();
}
