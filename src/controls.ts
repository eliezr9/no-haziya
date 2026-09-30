// Main button (SPEC §2 states 1–3), "check again" on the result card, and the news switch.
// Buttons use aria-disabled rather than `disabled`, so they stay focusable; focus is handed
// between the main button and "check again" as one replaces the other.
import { announce } from './announce';
import { checkRisk, delay, MIN_CHECKING_MS, withMinDuration } from './check';
import { strings } from './i18n';
import { summaryText } from './resultText';
import { revealMs } from './scene/timeline';
import type { Store } from './state';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initControls(store: Store): void {
  const button = document.getElementById('check-btn') as HTMLButtonElement;
  const label = document.getElementById('check-btn-label')!;
  const spinner = button.querySelector<SVGElement>('.spinner')!;
  const checkAgain = document.getElementById('check-again') as HTMLButtonElement;
  const newsSwitch = document.getElementById('news-switch') as HTMLButtonElement;

  let run = 0; // lets a newer run (or a city change) supersede an older one

  async function check(): Promise<void> {
    const { location } = store.get();
    if (!location) return;
    const id = ++run;
    const fromCard = document.activeElement === checkAgain;
    store.set({ step: 'checking', outcome: null });
    if (fromCard) button.focus();
    announce(strings[store.get().lang].checking);

    const outcome = await withMinDuration(checkRisk(location), MIN_CHECKING_MS);
    if (id !== run || store.get().step !== 'checking') return; // city changed meanwhile

    // The scene walks her to bed first (ANIMATIONS.md §B); the card pops in once it settles.
    const reveal = reducedMotion.matches ? 0 : revealMs(outcome, store.get().news);
    if (reveal > 0) {
      store.set({ step: 'revealing', outcome });
      await delay(reveal);
      if (id !== run || store.get().step !== 'revealing') return;
    }

    const fromButton = document.activeElement === button;
    store.set({ step: 'result', outcome });
    if (fromButton) checkAgain.focus();
    const { lang, news } = store.get();
    announce(summaryText(strings[lang], outcome, news));
  }

  button.addEventListener('click', () => {
    if (store.get().step === 'idle') void check();
  });

  checkAgain.addEventListener('click', () => {
    if (store.get().step === 'result') void check();
  });

  newsSwitch.addEventListener('click', () => {
    const { location, news } = store.get();
    if (location) store.set({ news: !news });
  });

  function render(): void {
    const { lang, location, step, news } = store.get();
    const t = strings[lang];
    const checking = location !== null && (step === 'checking' || step === 'revealing');

    button.hidden = location !== null && step === 'result'; // the result card takes its place
    button.setAttribute('aria-disabled', String(!location || checking));
    button.classList.toggle('is-empty', !location);
    spinner.toggleAttribute('hidden', !checking);
    label.textContent = checking ? t.checking : t.checkButton;

    newsSwitch.setAttribute('aria-disabled', String(!location));
    newsSwitch.setAttribute('aria-checked', String(location !== null && news));
  }

  store.subscribe(render);
  render();
}
