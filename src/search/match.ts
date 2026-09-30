import type { Locality } from './localities';
import { hasHebrew, normalize, type Normalized } from './normalize';

export interface Match {
  locality: Locality;
  /** which name matched — Hebrew queries search Hebrew names, anything else English names */
  lang: 'he' | 'en';
  /** [start, end) in the displayed name to highlight */
  highlight: [number, number];
}

interface Entry {
  locality: Locality;
  he: Normalized;
  en: Normalized;
}

export type SearchIndex = Entry[];

export function buildIndex(localities: Locality[]): SearchIndex {
  return localities.map((locality) => ({
    locality,
    he: normalize(locality.he),
    en: normalize(locality.en),
  }));
}

/** Typos allowed for a query of this (normalized) length. */
const maxTypos = (len: number) => (len < 3 ? 0 : len < 6 ? 1 : 2);

/**
 * Best approximate occurrence of `q` anywhere in `t` (Sellers' algorithm: edit distance
 * with a free start and end in `t`). Returns the distance and the matched [start, end).
 */
function fuzzyFind(q: string, t: string): { dist: number; start: number; end: number } {
  const n = t.length;
  let prev = new Array<number>(n + 1).fill(0);
  let prevStart = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= q.length; i++) {
    const cur = new Array<number>(n + 1);
    const curStart = new Array<number>(n + 1);
    cur[0] = i;
    curStart[0] = 0;
    for (let j = 1; j <= n; j++) {
      const sub = prev[j - 1]! + (q[i - 1] === t[j - 1] ? 0 : 1);
      const del = prev[j]! + 1;
      const ins = cur[j - 1]! + 1;
      if (sub <= del && sub <= ins) {
        cur[j] = sub;
        curStart[j] = prevStart[j - 1]!;
      } else if (del <= ins) {
        cur[j] = del;
        curStart[j] = prevStart[j]!;
      } else {
        cur[j] = ins;
        curStart[j] = curStart[j - 1]!;
      }
    }
    prev = cur;
    prevStart = curStart;
  }
  let best = { dist: Infinity, start: 0, end: 0 };
  for (let j = 1; j <= n; j++) {
    if (prev[j]! < best.dist) best = { dist: prev[j]!, start: prevStart[j]!, end: j };
  }
  return best;
}

const FUZZY = 4;

/** Lower rank = better; FUZZY and above are typo matches. Undefined if it doesn't match at all. */
function rank(q: string, name: Normalized): { rank: number; start: number; end: number } | undefined {
  const t = name.text;
  const at = t.indexOf(q);
  if (at !== -1) {
    if (t === q) return { rank: 0, start: 0, end: q.length };
    if (at === 0) return { rank: 1, start: 0, end: q.length };
    // prefer a match at the start of any word ("צפון" in "תל אביב - צפון")
    for (const ws of name.wordStarts) {
      if (t.startsWith(q, ws)) return { rank: 2, start: ws, end: ws + q.length };
    }
    return { rank: 3, start: at, end: at + q.length };
  }
  const k = maxTypos(q.length);
  if (k === 0) return undefined;
  const f = fuzzyFind(q, t);
  if (f.dist > k) return undefined;
  return { rank: FUZZY - 1 + f.dist, start: f.start, end: f.end };
}

export function search(index: SearchIndex, query: string, limit = 5): Match[] {
  const q = normalize(query).text;
  if (!q) return [];
  const lang = hasHebrew(query) ? 'he' : 'en';

  const hits: { match: Match; rank: number }[] = [];
  for (const entry of index) {
    const name = entry[lang];
    const r = rank(q, name);
    if (!r) continue;
    const start = name.map[r.start]!;
    const end = name.map[r.end - 1]! + 1;
    hits.push({ rank: r.rank, match: { locality: entry.locality, lang, highlight: [start, end] } });
  }

  // Typo matches only help when nothing matches as typed ("צליה" shouldn't suggest "דליה").
  const exact = hits.filter((h) => h.rank < FUZZY);
  const pool = exact.length > 0 ? exact : hits;

  const collator = new Intl.Collator(lang);
  pool.sort(
    (a, b) =>
      a.rank - b.rank ||
      a.match.locality[lang].length - b.match.locality[lang].length ||
      collator.compare(a.match.locality[lang], b.match.locality[lang]),
  );
  return pool.slice(0, limit).map((h) => h.match);
}
