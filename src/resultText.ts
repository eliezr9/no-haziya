// Turns a result from scores.json into sentences in the current language.
import type { Outcome } from './check';
import { format, type Lang, type Strings } from './i18n';
import { displayed, type Band, type Reason } from './scores';

const BAND_KEY = { low: 'bandLow', medium: 'bandMedium', high: 'bandHigh' } as const;
const HEADLINE_KEY = { low: 'headlineLow', medium: 'headlineMedium', high: 'headlineHigh' } as const;

export const levelText = (t: Strings, band: Band): string => format(t.riskLevel, { band: t[BAND_KEY[band]] });

export const headlineText = (t: Strings, band: Band): string => t[HEADLINE_KEY[band]];

export function reasonText(t: Strings, { code, n }: Reason): string {
  switch (code) {
    case 'sirens24h':
      return n === 1 ? t.sirens24hOne : format(t.sirens24hMany, { n });
    case 'sirensWeek':
      return n === 1 ? t.sirensWeekOne : format(t.sirensWeekMany, { n });
    case 'quietDays':
      return n <= 1 ? t.quietDaysOne : n === 2 ? t.quietDaysTwo : format(t.quietDaysMany, { n });
    case 'policy':
      return t.policy;
  }
}

/** "3 hours ago" / "לפני 3 שעות" */
export function agoText(lang: Lang, updatedAt: Date, now: number = Date.now()): string {
  const minutes = Math.max(0, Math.round((now - updatedAt.getTime()) / 60_000));
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
  const hours = Math.round(minutes / 60);
  const text =
    minutes < 60
      ? rtf.format(-minutes, 'minute')
      : hours < 48
        ? rtf.format(-hours, 'hour')
        : rtf.format(-Math.round(hours / 24), 'day');
  // Chrome's Hebrew data adds the count after words that already say it: "לפני שעתיים (2)".
  return text.replace(/\s*\(\d+\)$/, '');
}

/** One line for screen readers when the answer arrives. */
export function summaryText(t: Strings, outcome: Outcome, news: boolean): string {
  if (outcome.kind === 'noData') return `${t.noDataTitle}. ${t.noDataWhy}`;
  if (outcome.kind === 'error') return `${t.errorTitle}. ${t.errorWhy}`;
  const { score, band } = displayed(outcome.area, news);
  return `${levelText(t, band)}: ${score}%. ${headlineText(t, band)}. ${reasonText(t, outcome.area.reason)}`;
}
