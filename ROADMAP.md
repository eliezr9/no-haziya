# Roadmap

Working checklist. One step at a time; after each step, stop and show the preview (and
screenshots) for review before starting the next. Details live in SPEC.md and design/.

## Done
- [x] Project setup: Vite + TypeScript + Vitest, fonts, design tokens, RTL shell
- [x] Header: location chip, smart search (SPEC §7), GPS, language toggle
- [x] Main button (idle / disabled / checking ≥1.2s) and news switch (UI only)
- [x] Poster frame: wavy border (redrawn per screen size), spacing matched to design/screens at 390×844
- [x] Result card + `scores.json` contract (src/scores.ts); SAMPLE data from
      `npm run data:sample-scores` — demo areas: שדרות, איבים (high), תל אביב - מרכז העיר (medium), אילת (low)
- [x] Preview hosting: https://no-haziya.pages.dev (Cloudflare Pages, auto-deploys on push to main)
- [x] Scene, still frames — `src/scene/` (markup ported from `design/Screen.dc.html`, variant a):
      standing/thinking, checking dots, high / medium / low poses, moon, Iron Dome, news glow + bubble

## Next
1. [ ] **Animation** — existing loops (ANIMATIONS.md §A), then transitions (§B); reduced motion
2. [ ] **Fetcher (Raspberry Pi)** — verify Pikud HaOref endpoints, scoring (SPEC §6),
       publish `scores.json` to the site (replaces the sample file; format documented in src/scores.ts)
3. [ ] **News rating** (optional, SPEC §6) — or ship v1 without it
4. [ ] **Polish** — accessibility audit, Lighthouse, share/OG image, final subdomain

## Decided
- **Active alert:** no special mode and no safety instructions; show the regular statistics-based answer (SPEC §6).
- **No data / couldn't check:** the scene keeps the idle standing girl.

## Open decisions
- **Very old data:** today a stale file still shows its last score plus "updated X ago". Should the
  verdict be hidden after some age (e.g. 6 hours, when the Pi is clearly down)?
- How the Pi uploads `scores.json` to the host (git push / Cloudflare R2 / KV).
- LLM provider for news (or drop news in v1); animation tool (SVG vs Rive).
