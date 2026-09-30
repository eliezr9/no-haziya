// Builds public/localities.json from the Home Front Command localities list,
// as packaged by pikud-haoref-api (Apache-2.0, https://github.com/eladnava/pikud-haoref-api).
// Run: npm run data:localities
import { writeFile } from 'node:fs/promises';

const VERSION = '5.0.3';
const SOURCE = `https://unpkg.com/pikud-haoref-api@${VERSION}/cities.json`;
const OUT = new URL('../public/localities.json', import.meta.url);

const res = await fetch(SOURCE);
if (!res.ok) throw new Error(`${SOURCE}: HTTP ${res.status}`);
const cities = await res.json();

const round = (n) => Math.round(n * 1e4) / 1e4;

// `he` is the alert-area name Pikud HaOref uses in alerts — the key for scores.json.
const localities = cities
  .filter((c) => c.value !== 'all' && c.name && c.name_en)
  .map((c) => ({ id: c.id, he: c.name.trim(), en: c.name_en.trim(), lat: round(c.lat), lng: round(c.lng) }))
  .sort((a, b) => a.id - b.id);

await writeFile(OUT, JSON.stringify({ source: SOURCE, localities }) + '\n');
console.log(`Wrote ${localities.length} localities to public/localities.json`);
