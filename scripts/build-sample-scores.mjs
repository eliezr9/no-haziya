// Writes public/scores.json with SAMPLE data (flagged "sample": true) so the site can be
// previewed before the Raspberry Pi fetcher exists. Deterministic: same input, same file.
// Run: npm run data:sample-scores
import { readFile, writeFile } from 'node:fs/promises';

const { localities } = JSON.parse(await readFile(new URL('../public/localities.json', import.meta.url), 'utf8'));

// Fixed demo areas matching the design's three result screens.
const DEMO = {
  'שדרות, איבים': { score: 82, band: 'high', reason: { code: 'sirens24h', n: 4 } },
  'תל אביב - מרכז העיר': { score: 47, band: 'medium', reason: { code: 'sirensWeek', n: 2 } },
  'אילת': { score: 9, band: 'low', reason: { code: 'quietDays', n: 7 } },
};

const band = (score) => (score <= 30 ? 'low' : score <= 65 ? 'medium' : 'high');
const hash = (n, salt) => (Math.imul(n ^ salt, 2654435761) >>> 0) % 1000;

function sample(id) {
  const h = hash(id, 0x5eed) / 1000;
  const k = hash(id, 0xbeef);
  if (h < 0.15) return { score: 66 + (k % 30), band: 'high', reason: k % 4 ? { code: 'sirens24h', n: 1 + (k % 6) } : { code: 'policy', n: 0 } };
  if (h < 0.4) return { score: 31 + (k % 35), band: 'medium', reason: { code: 'sirensWeek', n: 1 + (k % 4) } };
  return { score: 3 + (k % 28), band: 'low', reason: { code: 'quietDays', n: 2 + (k % 13) } };
}

const areas = {};
for (const { id, he } of localities) {
  const entry = DEMO[he] ?? sample(id);
  const newsScore = Math.min(100, entry.score + (hash(id, 0x2e75) % 12));
  areas[he] = { ...entry, news: { score: newsScore, band: band(newsScore) } };
}

const out = { updatedAt: new Date().toISOString(), sample: true, areas };
await writeFile(new URL('../public/scores.json', import.meta.url), JSON.stringify(out) + '\n');
console.log(`Wrote SAMPLE scores for ${Object.keys(areas).length} areas to public/scores.json`);
