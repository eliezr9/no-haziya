// Result card (SPEC §2 states 4–6): big number, level, headline, reason, "check again".
// Also used, without a number, for "no data for this area" and "couldn't check".
import type { Outcome } from './check';
import { format, strings } from './i18n';
import { agoText, headlineText, levelText, reasonText } from './resultText';
import { displayed, isStale } from './scores';
import type { Store } from './state';

const COUNT_MS = 600;
/** Re-render this often so "updated … ago" keeps up with the clock while the card is open. */
const TICK_MS = 30_000;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initResult(store: Store): void {
  const byId = (id: string) => document.getElementById(id)!;
  const card = byId('result');
  const number = byId('result-number');
  const digits = byId('result-digits');
  const level = byId('result-level');
  const headline = byId('result-headline');
  const why = byId('result-why');
  const note = byId('result-note');

  let shown: Outcome | null = null;
  let target = -1; // score the number is heading to
  let current = 0; // what the number shows right now (mid-animation too)
  let frame = 0;

  function show(n: number): void {
    current = n;
    digits.textContent = String(n);
  }

  /** ANIMATIONS.md: the number counts quickly (from 0 on a fresh answer, or from the
   *  shown score when the news switch flips), easing out. */
  function countTo(to: number, from: number): void {
    cancelAnimationFrame(frame);
    target = to;
    // Reserve the widest width either end needs (the display font has equal-width digits)
    // so the count doesn't reflow the text beside it; +0.55ch for the smaller "%".
    const len = Math.max(String(from).length, String(to).length);
    number.style.minInlineSize = `${len + 0.55}ch`;
    if (reducedMotion.matches || from === to) {
      show(to);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / COUNT_MS);
      show(Math.round(from + (to - from) * (1 - (1 - p) ** 3)));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  function render(): void {
    const { lang, location, step, outcome, news } = store.get();
    const t = strings[lang];
    const visible = location !== null && step === 'result' && outcome !== null;
    card.hidden = !visible;
    if (!visible) {
      cancelAnimationFrame(frame);
      shown = null;
      return;
    }

    if (outcome.kind === 'result') {
      const { score, band } = displayed(outcome.area, news);
      card.dataset.band = band;
      number.hidden = false;
      level.hidden = false;
      level.textContent = levelText(t, band);
      headline.textContent = headlineText(t, band);
      why.textContent = reasonText(t, outcome.area.reason);

      const noteText = outcome.sample
        ? t.sampleData
        : isStale(outcome.updatedAt)
          ? format(t.staleData, { ago: agoText(lang, outcome.updatedAt) })
          : '';
      note.textContent = noteText;
      note.hidden = !noteText;

      if (outcome !== shown) countTo(score, 0); // a fresh answer
      else if (score !== target) countTo(score, current); // news switch flipped
    } else {
      delete card.dataset.band;
      number.hidden = true;
      level.hidden = true;
      note.hidden = true;
      headline.textContent = outcome.kind === 'noData' ? t.noDataTitle : t.errorTitle;
      why.textContent = outcome.kind === 'noData' ? t.noDataWhy : t.errorWhy;
    }
    shown = outcome;
  }

  store.subscribe(render);
  setInterval(render, TICK_MS);
  render();
}
