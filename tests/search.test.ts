import { describe, expect, it } from 'vitest';
import data from '../public/localities.json';
import { nearest, type Locality } from '../src/search/localities';
import { buildIndex, search } from '../src/search/match';
import { normalize } from '../src/search/normalize';

const localities: Locality[] = data.localities;
const index = buildIndex(localities);
const names = (q: string) => search(index, q).map((m) => m.locality[m.lang]);
const highlighted = (q: string) => {
  const [m] = search(index, q);
  return m ? m.locality[m.lang].slice(...m.highlight) : undefined;
};

describe('normalize', () => {
  it('ignores hyphens, spaces, geresh, quotes and final letters', () => {
    expect(normalize('תל-אביב').text).toBe(normalize('תל אביב').text);
    expect(normalize('ג׳סר א-זרקא').text).toBe(normalize("גסר אזרקא").text);
    expect(normalize('ירושלים').text).toBe(normalize('ירושלימ').text);
    expect(normalize("Ra'anana").text).toBe('raanana');
  });

  it('strips niqqud and accents', () => {
    expect(normalize('חֵיפָה').text).toBe('חיפה');
    expect(normalize('Beér').text).toBe('beer');
  });

  it('maps back to original indices', () => {
    const n = normalize('תל אביב');
    expect(n.map).toEqual([0, 1, 3, 4, 5, 6]);
    expect([...n.wordStarts]).toEqual([0, 2]);
  });
});

describe('search', () => {
  it('matches a substring anywhere (SPEC: צליה → הרצליה)', () => {
    const results = names('צליה');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((n) => n.includes('הרצליה'))).toBe(true);
    expect(highlighted('צליה')).toBe('צליה');
  });

  it('finds every Tel Aviv area and puts them first', () => {
    const results = names('תל אביב');
    expect(results.slice(0, 4).every((n) => n.startsWith('תל אביב'))).toBe(true);
  });

  it('ignores hyphens and final letters in the query', () => {
    expect(names('תלאביב')[0]).toMatch(/^תל אביב/);
    expect(names('ירושלימ')[0]).toMatch(/^ירושלים/);
  });

  it('tolerates typos', () => {
    expect(names('ירושלאים')[0]).toMatch(/^ירושלים/);
    expect(names('herzlia')[0]).toMatch(/^Herz/);
  });

  it('searches English names for Latin queries', () => {
    const [m] = search(index, 'haifa');
    expect(m?.lang).toBe('en');
    expect(m?.locality.he).toMatch(/חיפה/);
  });

  it('prefers exact and prefix matches over substring matches', () => {
    const [first] = names('אילת');
    expect(first).toBe('אילת');
  });

  it('returns nothing for an empty or nonsense query', () => {
    expect(search(index, '  -  ')).toEqual([]);
    expect(search(index, 'קקקקקקקק')).toEqual([]);
  });

  it('respects the limit', () => {
    expect(search(index, 'א', 3)).toHaveLength(3);
  });
});

describe('nearest', () => {
  it('finds the locality closest to a GPS fix', () => {
    // Azrieli Center, Tel Aviv
    expect(nearest(localities, 32.0745, 34.7918)?.he).toMatch(/^תל אביב/);
  });

  it('returns nothing when the user is far from Israel', () => {
    expect(nearest(localities, 51.5072, -0.1276)).toBeUndefined();
  });
});
