import '@fontsource/rubik/400.css';
import '@fontsource/rubik/700.css';
import '@fontsource/rubik-mono-one/400.css';
import './styles/tokens.css';
import './styles/base.css';

import { dir, strings, type Lang, type Strings } from './i18n';

function applyLang(lang: Lang): void {
  const root = document.documentElement;
  root.lang = lang;
  root.dir = dir(lang);
  const t = strings[lang];
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    el.textContent = t[el.dataset.i18n as keyof Strings];
  });
}

// Language detection + manual toggle come in a later step (SPEC §1).
applyLang('he');
