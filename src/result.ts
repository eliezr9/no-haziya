// Result card (SPEC §2 states 4–6): big number, level, headline, reason, "check again".
// Also used, without a number, for "no data for this area" and "couldn't check".
import type { Outcome } from './check';
import { format, strings } from './i18n';
import { agoText, headlineText, levelText, reasonText } from './resultText';
import { displayed, isStale } from './scores';
import type { Store } from './state';

const COUNT_MS = 600;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initResult(store: Store): void {
  const byId = (id: string) => document.getElementById(id)!;
  const card = byId('result');
  const number = byId('result-number');
  const level = byId('result-level');
  const headline = byId('result-headline');
  const why = byId('result-why');
  const note = byId('result-note');

  let shown: Outcome | null = null;
  let shownScore = -1;
  let frame = 0;

  /** ANIMATIONS.md: "risk number counts up quickly from 0". */
  function countUp(to: number): void {
    cancelAnimationFrame(frame);
    if (reducedMotion.matches) {
      number.textContent = String(to);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / COUNT_MS);
      number.textContent = String(Math.round(to * (1 - (1 - p) ** 3)));
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

      // Reserve the final width (the display font has equal-width digits) so the count-up
      // doesn't reflow the text beside it.
      number.style.minInlineSize = `${String(score).length}ch`;
      if (outcome !== shown) countUp(score); // a fresh answer
      else if (score !== shownScore) {
        cancelAnimationFrame(frame); // news switch flipped: just show the other score
        number.textContent = String(score);
      }
      shownScore = score;
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
  render();
}
