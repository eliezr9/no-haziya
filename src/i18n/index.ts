import { en } from './en';
import { he, type Strings } from './he';

export type Lang = 'he' | 'en';
export type { Strings };

export const strings: Record<Lang, Strings> = { he, en };

export const dir = (lang: Lang): 'rtl' | 'ltr' => (lang === 'he' ? 'rtl' : 'ltr');

export const otherLang = (lang: Lang): Lang => (lang === 'he' ? 'en' : 'he');

const ISRAEL_TIME_ZONES = new Set(['Asia/Jerusalem', 'Asia/Tel_Aviv']);

/** SPEC §1: a saved manual choice wins; otherwise Hebrew only when the browser is on Israel time. */
export function detectLang(saved: unknown, timeZone: string | undefined): Lang {
  if (saved === 'he' || saved === 'en') return saved;
  return timeZone && ISRAEL_TIME_ZONES.has(timeZone) ? 'he' : 'en';
}

/** Fills `{name}` placeholders. */
export const format = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
