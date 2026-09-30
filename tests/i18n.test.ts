import { describe, expect, it } from 'vitest';
import { detectLang, dir, format, otherLang, strings } from '../src/i18n';

describe('i18n', () => {
  it('has the same keys in every language', () => {
    expect(Object.keys(strings.en).sort()).toEqual(Object.keys(strings.he).sort());
  });

  it('has no empty strings', () => {
    for (const t of Object.values(strings)) {
      for (const value of Object.values(t)) expect(value.trim()).not.toBe('');
    }
  });

  it('maps Hebrew to RTL and English to LTR', () => {
    expect(dir('he')).toBe('rtl');
    expect(dir('en')).toBe('ltr');
    expect(otherLang('he')).toBe('en');
  });

  it('fills placeholders', () => {
    expect(format('{n} הצעות', { n: 3 })).toBe('3 הצעות');
  });
});

describe('detectLang (SPEC §1)', () => {
  it('uses Hebrew on Israel time', () => {
    expect(detectLang(undefined, 'Asia/Jerusalem')).toBe('he');
  });

  it('uses English elsewhere or when the time zone is unknown', () => {
    expect(detectLang(undefined, 'Europe/London')).toBe('en');
    expect(detectLang(undefined, undefined)).toBe('en');
  });

  it('lets a saved manual choice win', () => {
    expect(detectLang('en', 'Asia/Jerusalem')).toBe('en');
    expect(detectLang('he', 'America/New_York')).toBe('he');
  });

  it('ignores a corrupt saved value', () => {
    expect(detectLang('fr', 'Asia/Jerusalem')).toBe('he');
  });
});
