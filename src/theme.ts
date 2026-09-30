// Light / dark toggle in the header. Default follows the system (prefers-color-scheme);
// a manual choice is saved and wins. Choosing the theme the system already uses drops the
// saved choice, so the site goes back to following the system.
// index.html applies a saved choice before first paint (no flash of the wrong theme).
import { strings } from './i18n';
import type { Store } from './state';
import { load, save } from './storage';

export type Theme = 'light' | 'dark';

const KEY = 'nh.theme';

export const parseTheme = (v: unknown): Theme | null => (v === 'light' || v === 'dark' ? v : null);

/** The saved override after a toggle, or null to follow the system again. */
export function toggledOverride(current: Theme, system: Theme): Theme | null {
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  return next === system ? null : next;
}

const MOON =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';
const SUN =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';

export function initTheme(store: Store): void {
  const root = document.documentElement;
  const button = document.getElementById('theme-toggle') as HTMLButtonElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  let override = parseTheme(load(KEY));

  // One theme-color meta that follows the effective theme (the static ones only follow the system).
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove());
  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  document.head.append(meta);

  const system = (): Theme => (systemDark.matches ? 'dark' : 'light');
  const current = (): Theme => override ?? system();

  function render(): void {
    if (override) root.dataset.theme = override;
    else delete root.dataset.theme;
    const dark = current() === 'dark';
    const t = strings[store.get().lang];
    button.innerHTML = dark ? SUN : MOON; // shows where a tap takes you
    button.setAttribute('aria-label', dark ? t.themeToLight : t.themeToDark);
    meta.content = getComputedStyle(document.body).backgroundColor;
  }

  button.addEventListener('click', () => {
    override = toggledOverride(current(), system());
    save(KEY, override);
    render();
  });
  systemDark.addEventListener('change', render);
  store.subscribe((s, prev) => s.lang !== prev.lang && render());
  render();
}
