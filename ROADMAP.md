# Roadmap

Working checklist. One step at a time; after each step, stop and show the preview (and
screenshots) for review before starting the next. Details live in SPEC.md and design/.

## Done
- [x] Project setup: Vite + TypeScript + Vitest, fonts, design tokens, RTL shell
- [x] Header: location chip, smart search (SPEC §7), GPS, language toggle
- [x] Main button (idle / disabled / checking ≥1.2s) and news switch (UI only)

## Next
1. [ ] **Preview hosting** — Cloudflare **Pages** (not Workers) auto-deploy on push; confirm the live URL works on a phone
2. [ ] **Poster frame** — wavy inner border, final spacing vs. `design/screens/`
3. [ ] **Result card + data contract**
   - define `scores.json` (per area: score, band, reason, `updatedAt`) + sample file
   - result card (number counts up, band, headline, reason, "check again")
   - stale-data warning (`updatedAt` > 15 min); unknown area / fetch error states
4. [ ] **Scene, still frames** — port SVG from `design/Screen.dc.html`: standing/thinking,
       checking dots, high / medium / low poses, moon, Iron Dome, news glow + "בלה בלה…"
5. [ ] **Animation** — existing loops (ANIMATIONS.md §A), then transitions (§B); reduced motion
6. [ ] **Fetcher (Raspberry Pi)** — verify Pikud HaOref endpoints, scoring (SPEC §6),
       publish `scores.json` to the site
7. [ ] **News rating** (optional, SPEC §6) — or ship v1 without it
8. [ ] **Polish** — accessibility audit, Lighthouse, share/OG image, final subdomain

## Decided
- **Active alert:** no special mode and no safety instructions; show the regular statistics-based answer (SPEC §6).

## Open decisions
- How the Pi uploads `scores.json` to the host (git push / Cloudflare R2 / KV).
- Final host subdomain; LLM provider for news (or drop news in v1); animation tool (SVG vs Rive).
