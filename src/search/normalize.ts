const FINAL_LETTERS: Record<string, string> = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' };
const KEEP = /[a-z0-9א-ת]/;
// Geresh/quotes are dropped but don't start a new word ("ג'סר" is one word).
const WORD_BREAK = /[\s\-–—־()/,.]/;

export interface Normalized {
  /** Search form: lower-case letters/digits only, Hebrew final letters folded, no niqqud/accents. */
  text: string;
  /** index in `text` → index of the source character in the original string */
  map: number[];
  /** indices in `text` where a word starts in the original (after a space, hyphen, etc.) */
  wordStarts: Set<number>;
}

/** Drops spaces, hyphens, geresh, quotes and marks, so "תל-אביב", "תל אביב" and "תלאביב" match. */
export function normalize(input: string): Normalized {
  const chars: string[] = [];
  const map: number[] = [];
  const wordStarts = new Set<number>();
  let atWordStart = true;
  let i = 0;
  for (const original of input) {
    for (const ch of original.normalize('NFD').toLowerCase()) {
      const folded = FINAL_LETTERS[ch] ?? ch;
      if (KEEP.test(folded)) {
        if (atWordStart) wordStarts.add(chars.length);
        chars.push(folded);
        map.push(i);
        atWordStart = false;
      } else if (WORD_BREAK.test(ch)) {
        atWordStart = true;
      }
    }
    i += original.length;
  }
  return { text: chars.join(''), map, wordStarts };
}

export const hasHebrew = (s: string): boolean => /[א-ת]/.test(s);
