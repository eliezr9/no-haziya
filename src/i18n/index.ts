import { en } from './en';
import { he, type Strings } from './he';

export type Lang = 'he' | 'en';
export type { Strings };

export const strings: Record<Lang, Strings> = { he, en };

export const dir = (lang: Lang): 'rtl' | 'ltr' => (lang === 'he' ? 'rtl' : 'ltr');
