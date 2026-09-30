import { describe, expect, it } from 'vitest';
import sample from '../public/scores.json';
import { strings } from '../src/i18n';
import { agoText, headlineText, levelText, reasonText, summaryText } from '../src/resultText';
import { displayed, isStale, parseScores, STALE_AFTER_MS } from '../src/scores';

const he = strings.he;
const en = strings.en;

describe('parseScores', () => {
  it('reads the sample file', () => {
    const scores = parseScores(sample);
    expect(scores.sample).toBe(true);
    expect(scores.areas.size).toBe(1449);
    expect(scores.areas.get('שדרות, איבים')).toMatchObject({ score: 82, band: 'high' });
  });

  it('rejects a file without areas or a valid updatedAt', () => {
    expect(() => parseScores({})).toThrow();
    expect(() => parseScores({ updatedAt: 'yesterday', areas: {} })).toThrow();
  });

  it('drops malformed areas and clamps scores', () => {
    const scores = parseScores({
      updatedAt: '2026-09-30T18:00:00Z',
      areas: {
        ok: { score: 140, band: 'high', reason: { code: 'policy' } },
        badBand: { score: 10, band: 'purple', reason: { code: 'quietDays', n: 3 } },
        badReason: { score: 10, band: 'low', reason: { code: 'aliens', n: 1 } },
        noReason: { score: 10, band: 'low' },
      },
    });
    expect([...scores.areas.keys()]).toEqual(['ok']);
    expect(scores.areas.get('ok')).toEqual({ score: 100, band: 'high', reason: { code: 'policy', n: 0 } });
    expect(scores.sample).toBe(false);
  });
});

describe('displayed', () => {
  const area = { score: 40, band: 'medium' as const, reason: { code: 'policy' as const, n: 0 }, news: { score: 70, band: 'high' as const } };

  it('uses the news score only when the switch is on', () => {
    expect(displayed(area, false)).toBe(area);
    expect(displayed(area, true)).toEqual({ score: 70, band: 'high' });
  });

  it('falls back to the base score when the file has no news score', () => {
    const { news: _news, ...noNews } = area;
    expect(displayed(noNews, true)).toBe(noNews);
  });
});

describe('isStale (SPEC §5: > 15 min)', () => {
  const t = new Date('2026-09-30T18:00:00Z');
  it('is fresh up to 15 minutes', () => {
    expect(isStale(t, t.getTime() + STALE_AFTER_MS)).toBe(false);
  });
  it('is stale after that', () => {
    expect(isStale(t, t.getTime() + STALE_AFTER_MS + 1)).toBe(true);
  });
});

describe('result text', () => {
  it('matches the design copy', () => {
    expect(levelText(he, 'high')).toBe('רמת סיכון · גבוהה');
    expect(headlineText(he, 'medium')).toBe('אפשר להוריד, רק להשאיר קרוב');
    expect(reasonText(he, { code: 'sirens24h', n: 4 })).toBe('4 אזעקות באזור שלך ב-24 השעות האחרונות');
    expect(reasonText(he, { code: 'sirensWeek', n: 2 })).toBe('שקט ביממה האחרונה, 2 אזעקות השבוע');
    expect(reasonText(he, { code: 'quietDays', n: 7 })).toBe('אין אזעקות באזור שלך כבר 7 ימים');
  });

  it('handles Hebrew singular and dual forms', () => {
    expect(reasonText(he, { code: 'sirens24h', n: 1 })).toBe('אזעקה אחת באזור שלך ב-24 השעות האחרונות');
    expect(reasonText(he, { code: 'quietDays', n: 2 })).toBe('אין אזעקות באזור שלך כבר יומיים');
    expect(reasonText(en, { code: 'sirensWeek', n: 1 })).toBe('Quiet in the last day, one alert this week');
  });

  it('formats "updated … ago"', () => {
    const now = Date.parse('2026-09-30T18:00:00Z');
    expect(agoText('en', new Date(now - 20 * 60_000), now)).toBe('20 minutes ago');
    expect(agoText('en', new Date(now - 3 * 3_600_000), now)).toBe('3 hours ago');
    expect(agoText('he', new Date(now - 3 * 3_600_000), now)).toBe('לפני 3 שעות');
  });

  it('builds a screen-reader summary for every outcome', () => {
    const area = { score: 9, band: 'low' as const, reason: { code: 'quietDays' as const, n: 7 } };
    const result = { kind: 'result' as const, area, updatedAt: new Date(), sample: false };
    expect(summaryText(en, result, false)).toBe('Risk level · Low: 9. Off it goes! Good night. No alerts in your area for 7 days');
    expect(summaryText(he, { kind: 'noData' }, false)).toContain(he.noDataTitle);
    expect(summaryText(he, { kind: 'error' }, false)).toContain(he.errorTitle);
  });
});
