// scores.json — the one file the Raspberry Pi fetcher publishes (SPEC §5). The site only reads
// and formats it; it never computes risk (CLAUDE.md).
//
// {
//   "updatedAt": "2026-09-30T18:00:00Z",
//   "sample": true,                                  // optional: demo data, not real
//   "areas": {                                       // keyed by Pikud HaOref area name (Locality.he)
//     "שדרות, איבים": {
//       "score": 82, "band": "high",
//       "reason": { "code": "sirens24h", "n": 4 },
//       "news": { "score": 90, "band": "high" }      // optional: same area with the news factor
//     }
//   }
// }

export type Band = 'low' | 'medium' | 'high';
export const BANDS: readonly Band[] = ['low', 'medium', 'high'];

/** Why the score is what it is; the site turns it into a sentence in the current language. */
export type ReasonCode =
  | 'sirens24h' // n sirens in the area in the last 24h
  | 'sirensWeek' // quiet in the last 24h, n sirens in the last 7 days
  | 'quietDays' // no sirens in the area for n days
  | 'policy'; // Home Front Command restrictions in the area

export const REASON_CODES: readonly ReasonCode[] = ['sirens24h', 'sirensWeek', 'quietDays', 'policy'];

export interface Reason {
  code: ReasonCode;
  n: number;
}

export interface Score {
  score: number;
  band: Band;
}

export interface AreaScore extends Score {
  reason: Reason;
  news?: Score;
}

export interface Scores {
  updatedAt: Date;
  sample: boolean;
  areas: Map<string, AreaScore>;
}

/** SPEC §5: warn when the fetcher hasn't published for this long. */
export const STALE_AFTER_MS = 15 * 60_000;

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

function parseScore(v: unknown): Score | undefined {
  if (!isObject(v)) return undefined;
  const { score, band } = v;
  if (typeof score !== 'number' || !Number.isFinite(score)) return undefined;
  if (!BANDS.includes(band as Band)) return undefined;
  return { score: Math.round(Math.min(100, Math.max(0, score))), band: band as Band };
}

function parseArea(v: unknown): AreaScore | undefined {
  const base = parseScore(v);
  if (!base || !isObject(v) || !isObject(v.reason)) return undefined;
  const { code, n } = v.reason;
  if (!REASON_CODES.includes(code as ReasonCode)) return undefined;
  const reason = { code: code as ReasonCode, n: typeof n === 'number' ? Math.max(0, Math.round(n)) : 0 };
  const news = parseScore(v.news);
  return news ? { ...base, reason, news } : { ...base, reason };
}

/** Throws if the file as a whole is unusable; silently drops malformed areas. */
export function parseScores(json: unknown): Scores {
  if (!isObject(json) || !isObject(json.areas)) throw new Error('scores.json: missing areas');
  const updatedAt = new Date(typeof json.updatedAt === 'string' ? json.updatedAt : NaN);
  if (Number.isNaN(updatedAt.getTime())) throw new Error('scores.json: bad updatedAt');
  const areas = new Map<string, AreaScore>();
  for (const [name, value] of Object.entries(json.areas)) {
    const area = parseArea(value);
    if (area) areas.set(name, area);
  }
  return { updatedAt, sample: json.sample === true, areas };
}

export async function loadScores(): Promise<Scores> {
  // no-cache: always revalidate with the CDN, so a new publish is seen right away
  const res = await fetch(`${import.meta.env.BASE_URL}scores.json`, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`scores.json: HTTP ${res.status}`);
  return parseScores(await res.json());
}

/** The score to show: the news-adjusted one when the switch is on and the file has it. */
export const displayed = (area: AreaScore, news: boolean): Score => (news && area.news) || area;

export const isStale = (updatedAt: Date, now: number = Date.now()): boolean =>
  now - updatedAt.getTime() > STALE_AFTER_MS;
