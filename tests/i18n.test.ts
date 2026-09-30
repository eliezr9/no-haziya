import { describe, expect, it } from 'vitest';
import { dir, strings } from '../src/i18n';

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
  });
});
