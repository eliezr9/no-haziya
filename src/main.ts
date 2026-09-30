import '@fontsource/rubik/500.css';
import '@fontsource/rubik/800.css';
import '@fontsource/rubik/900.css';
import '@fontsource/rubik-mono-one/400.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/header.css';
import './styles/controls.css';
import './styles/result.css';
import './styles/scene.css';

import { initControls } from './controls';
import { initFrame } from './frame';
import { initHeader } from './header';
import { initResult } from './result';
import { initScene } from './scene/scene';
import { initTheme } from './theme';
import { detectLang, dir, strings, type Lang, type Strings } from './i18n';
import { createStore, parseSavedLocation } from './state';
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

const store = createStore({
  lang: detectLang(load('nh.lang'), Intl.DateTimeFormat().resolvedOptions().timeZone),
  location: parseSavedLocation(load('nh.location')),
  step: 'idle',
  outcome: null,
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
initFrame(document.getElementById('app')!);
initTheme(store);
initHeader(store);
initControls(store);
initResult(store);
initScene(store);
