import '@fontsource/rubik/500.css';
import '@fontsource/rubik/800.css';
import '@fontsource/rubik/900.css';
import '@fontsource/rubik-mono-one/400.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/header.css';
import './styles/controls.css';

import { initControls } from './controls';
import { initHeader } from './header';
import { detectLang, dir, strings, type Lang, type Strings } from './i18n';
import { createStore, parseSavedLocation, type Store } from './state';
import { load, save } from './storage';

function applyLang(lang: Lang): void {
  const root = document.documentElement;
  root.lang = lang;
  root.dir = dir(lang);
  const t = strings[lang];
  const key = (el: HTMLElement, attr: string) => t[el.dataset[attr] as keyof Strings];
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    el.textContent = key(el, 'i18n');
  });
  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = key(el, 'i18nPlaceholder');
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria-label]').forEach((el) => {
    el.setAttribute('aria-label', key(el, 'i18nAriaLabel'));
  });
}

function initScene(store: Store): void {
  const pinPanel = document.getElementById('pin-panel')!;
  const scenePanel = document.getElementById('scene-panel')!;
  const render = () => {
    const hasLocation = store.get().location !== null;
    pinPanel.hidden = hasLocation;
    scenePanel.hidden = !hasLocation;
  };
  store.subscribe(render);
  render();
}

const store = createStore({
  lang: detectLang(load('nh.lang'), Intl.DateTimeFormat().resolvedOptions().timeZone),
  location: parseSavedLocation(load('nh.location')),
  step: 'idle',
  news: false,
});

store.subscribe((state, prev) => {
  if (state.lang !== prev.lang) {
    applyLang(state.lang);
    save('nh.lang', state.lang); // only a manual toggle gets here, and it always wins (SPEC §1)
  }
  if (state.location !== prev.location) save('nh.location', state.location);
});

applyLang(store.get().lang);
initHeader(store);
initControls(store);
initScene(store);
