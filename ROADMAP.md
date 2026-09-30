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
- [x] Animation (design/ANIMATIONS.md): loops (§A) as CSS keyframes in `styles/scene.css`; transitions (§B):
      new step 'revealing' plays the walk to bed (per-risk: sob + tear / sigh + bra drop + arm flop /
      bra throw + Zzz), moon snaps, then the card pops in — timings in `src/scene/timeline.ts`

## Next
1. [ ] **Fetcher (Raspberry Pi)** — verify Pikud HaOref endpoints, scoring (SPEC §6),
       publish `scores.json` to the site (replaces the sample file; format documented in src/scores.ts)
2. [ ] **News rating** (optional, SPEC §6) — or ship v1 without it
3. [ ] **Polish** — accessibility audit, Lighthouse, share/OG image, final subdomain

## Decided
- **Active alert:** no special mode and no safety instructions; show the regular statistics-based answer (SPEC §6).
- **No data / couldn't check:** the scene keeps the idle standing girl.

## Open decisions
- **Walk to bed (not in the design):** the bed and nightstand snap in as the thought bubble pops, and
  she walks three steps right, in front of the bed. Flipping the news switch mid-walk skips to the new pose.
  Needs a design review.
- **Very old data:** today a stale file still shows its last score plus "updated X ago". Should the
  verdict be hidden after some age (e.g. 6 hours, when the Pi is clearly down)?
- How the Pi uploads `scores.json` to the host (git push / Cloudflare R2 / KV).
- LLM provider for news (or drop news in v1); animation tool (SVG vs Rive).
