// Header row: location chip / search combobox + language toggle (SPEC §2 states 1, 1a, 2, 2b).
// The search follows the ARIA 1.2 combobox pattern: focus stays in the input, arrows move
// aria-activedescendant through the options, Enter picks, Escape closes.
import { format, otherLang, strings } from './i18n';
import { loadLocalities, nearest, type Locality } from './search/localities';
import { buildIndex, search, type Match, type SearchIndex } from './search/match';
import type { Store } from './state';

const byId = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

const PIN_ICON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
const GPS_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>';

export function initHeader(store: Store): void {
  const chip = byId<HTMLButtonElement>('loc-chip');
  const chipName = byId('loc-chip-name');
  const searchBox = byId('loc-search-box');
  const input = byId<HTMLInputElement>('loc-search');
  const dropdown = byId('loc-dropdown');
  const message = byId('loc-message');
  const listbox = byId('loc-listbox');
  const status = byId('loc-status');
  const langToggle = byId<HTMLButtonElement>('lang-toggle');

  let searching = false; // 2b: the chip has turned into the search box
  let open = false;
  let localities: Locality[] | undefined;
  let index: SearchIndex | undefined;
  let loadFailed = false;
  let matches: Match[] = [];
  let active = 0; // option index; matches.length is the GPS option
  let gpsNote: 'locating' | 'locateFailed' | 'noneNearby' | undefined;

  const t = () => strings[store.get().lang];
  const announce = (text: string) => (status.textContent = text);

  function ensureLoaded(): void {
    if (localities || !open) return;
    loadLocalities().then(
      (list) => {
        localities = list;
        index = buildIndex(list);
        loadFailed = false;
        if (open) refresh();
      },
      () => {
        loadFailed = true;
        render();
      },
    );
  }

  function refresh(): void {
    matches = index ? search(index, input.value) : [];
    active = 0;
    render();
  }

  function optionEl(id: string, selected: boolean): HTMLLIElement {
    const li = document.createElement('li');
    li.id = id;
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', String(selected));
    return li;
  }

  function renderOptions(): void {
    const tr = t();
    listbox.replaceChildren(
      ...matches.map((m, i) => {
        const li = optionEl(`loc-opt-${i}`, i === active);
        li.dataset.index = String(i);
        const name = m.locality[m.lang];
        const [start, end] = m.highlight;
        const label = document.createElement('span');
        label.className = 'option-name';
        label.lang = m.lang;
        const mark = document.createElement('mark');
        mark.textContent = name.slice(start, end);
        label.append(name.slice(0, start), mark, name.slice(end));
        li.innerHTML = PIN_ICON;
        li.append(label);
        if (i === 0) {
          const pill = document.createElement('span');
          pill.className = 'pill';
          pill.textContent = tr.bestMatch;
          li.append(pill);
        }
        return li;
      }),
    );
    const gps = optionEl('loc-opt-gps', active === matches.length);
    gps.className = 'gps';
    gps.dataset.index = String(matches.length);
    gps.innerHTML = GPS_ICON;
    const gpsLabel = document.createElement('span');
    gpsLabel.textContent = gpsNote === 'locating' ? tr.locating : tr.useMyLocation;
    gps.append(gpsLabel);
    listbox.append(gps);
  }

  function messageText(): string {
    const tr = t();
    if (gpsNote && gpsNote !== 'locating') return tr[gpsNote];
    if (loadFailed) return tr.loadFailed;
    if (!input.value.trim()) return '';
    if (!index) return tr.loadingPlaces;
    return matches.length === 0 ? tr.noResults : '';
  }

  function render(): void {
    const { lang, location } = store.get();
    const tr = strings[lang];

    const showChip = location !== null && !searching;
    chip.hidden = !showChip;
    searchBox.hidden = showChip;
    if (location) {
      chipName.textContent = location[lang];
      chip.setAttribute('aria-label', `${tr.changeLocation}: ${location[lang]}`);
    }

    const other = strings[otherLang(lang)];
    langToggle.textContent = other.langShort;
    langToggle.lang = otherLang(lang);
    langToggle.setAttribute('aria-label', other.switchToThis);

    dropdown.hidden = !open;
    input.setAttribute('aria-expanded', String(open));
    if (open) {
      renderOptions();
      input.setAttribute('aria-activedescendant', active < matches.length ? `loc-opt-${active}` : 'loc-opt-gps');
    } else {
      input.removeAttribute('aria-activedescendant');
    }
    const msg = messageText();
    message.textContent = msg;
    message.hidden = !msg;
  }

  function openList(): void {
    if (open) return;
    open = true;
    gpsNote = undefined;
    ensureLoaded();
    refresh();
  }

  function close(): void {
    open = false;
    render();
  }

  function choose(loc: Locality): void {
    const { lang } = store.get();
    open = false;
    searching = false;
    input.value = '';
    // set() re-renders via the subscription below, so the chip exists before we focus it
    store.set({ location: { id: loc.id, he: loc.he, en: loc.en } });
    chip.focus();
    announce(format(strings[lang].chosen, { name: loc[lang] }));
  }

  function useGps(): void {
    if (!('geolocation' in navigator)) {
      gpsNote = 'locateFailed';
      render();
      announce(t().locateFailed);
      return;
    }
    gpsNote = 'locating';
    render();
    announce(t().locating);
    const fail = (note: 'locateFailed' | 'noneNearby') => {
      gpsNote = note;
      render();
      announce(t()[note]);
    };
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        loadLocalities().then(
          (list) => {
            const loc = nearest(list, pos.coords.latitude, pos.coords.longitude);
            if (loc) choose(loc);
            else fail('noneNearby');
          },
          () => fail('locateFailed'),
        );
      },
      () => fail('locateFailed'),
      { timeout: 10_000, maximumAge: 10 * 60_000 },
    );
  }

  function pick(i: number): void {
    const m = matches[i];
    if (m) choose(m.locality);
    else useGps();
  }

  function move(delta: number): void {
    const count = matches.length + 1;
    active = (active + delta + count) % count;
    render();
    byId(input.getAttribute('aria-activedescendant') ?? '')?.scrollIntoView({ block: 'nearest' });
  }

  // --- events ---

  input.addEventListener('focus', openList);
  input.addEventListener('click', openList);

  input.addEventListener('input', () => {
    gpsNote = undefined;
    if (!open) openList();
    else refresh();
    if (index && input.value.trim()) {
      const tr = t();
      announce(
        matches.length === 0
          ? tr.noResults
          : matches.length === 1
            ? tr.resultsOne
            : format(tr.resultsMany, { n: matches.length }),
      );
    }
  });

  input.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        if (!open) openList();
        else move(e.key === 'ArrowDown' ? 1 : -1);
        break;
      case 'Enter':
        if (open) {
          e.preventDefault();
          pick(active);
        }
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          close();
        } else if (store.get().location) {
          searching = false;
          render();
          chip.focus();
        } else {
          input.value = '';
        }
        break;
    }
  });

  // Keep focus in the input while tapping options, so the combobox doesn't close first.
  dropdown.addEventListener('mousedown', (e) => e.preventDefault());
  listbox.addEventListener('click', (e) => {
    const li = (e.target as Element).closest<HTMLElement>('[role="option"]');
    if (li?.dataset.index) pick(Number(li.dataset.index));
  });

  input.addEventListener('blur', () => {
    open = false;
    searching = false; // back to the chip if a location is already chosen
    render();
  });

  chip.addEventListener('click', () => {
    searching = true;
    input.value = '';
    render();
    input.focus();
  });

  langToggle.addEventListener('click', () => store.set({ lang: otherLang(store.get().lang) }));

  store.subscribe(render);
  render();
}
