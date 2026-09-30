// Main button (SPEC §2 states 1–3) and the news switch.
// Both use aria-disabled rather than `disabled`, so they stay focusable and a keyboard
// user's focus isn't dropped when the button turns into "checking…".
import { announce } from './announce';
import { checkRisk, MIN_CHECKING_MS, withMinDuration } from './check';
import { strings } from './i18n';
import type { Store } from './state';

export function initControls(store: Store): void {
  const button = document.getElementById('check-btn') as HTMLButtonElement;
  const label = document.getElementById('check-btn-label')!;
  const spinner = button.querySelector<SVGElement>('.spinner')!;
  const newsSwitch = document.getElementById('news-switch') as HTMLButtonElement;

  let run = 0; // lets a newer run (or a city change) supersede an older one

  async function check(): Promise<void> {
    const id = ++run;
    store.set({ step: 'checking' });
    announce(strings[store.get().lang].checking);
    await withMinDuration(checkRisk(), MIN_CHECKING_MS);
    if (id !== run || store.get().step !== 'checking') return; // city changed meanwhile
    store.set({ step: 'idle' }); // TODO(result card): show the result instead
  }

  button.addEventListener('click', () => {
    const { location, step } = store.get();
    if (location && step === 'idle') void check();
  });

  newsSwitch.addEventListener('click', () => {
    const { location, news } = store.get();
    if (location) store.set({ news: !news });
  });

  function render(): void {
    const { lang, location, step, news } = store.get();
    const t = strings[lang];
    const checking = location !== null && step === 'checking';

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
