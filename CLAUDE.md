# CLAUDE.md — No-Haziya

## Overview
No-Haziya ("Can I sleep without a bra tonight?") is a free, cozy, illustrated static website that
estimates tonight's rocket/missile-alert risk for the user's location in Israel and answers with an
animated cartoon. A fetcher on a Raspberry Pi pre-computes `scores.json` for all alert areas every few
minutes; the site just reads that file and looks up the chosen area. It's a fun estimate, never safety
guidance — the Pikud HaOref disclaimer is always visible.

**Details live in `SPEC.md`** (screens, tokens, architecture, risk formula, search). **Visual source of
truth: `design/README.md` and `design/ANIMATIONS.md`** (plus `design/Screen.dc.html` and `design/screens/`).
Read them before UI work; don't copy them here.

## Tech stack
- **Vite + vanilla TypeScript** (no UI framework), plain CSS with custom properties.
- **Inline SVG** for the scene, each body part its own `<g>`; motion via CSS keyframes
  (`steps()` / short ease-out for the South Park cutout feel) + Web Animations API for sequences.
  Existing SMIL loops in `Screen.dc.html` may be copied as-is.
- **Vitest** for pure logic (search, score lookup, state machine).
- **Cloudflare Pages** (free `*.pages.dev`, auto-deploy on push); GitHub Pages as fallback.

Why: one screen + a small state machine doesn't need React. Zero-runtime output keeps the bundle tiny
for phones, inline SVG lets every part animate independently, and Vite gives TS + a static `dist/` free.

## Folder structure
    design/          reference only — never shipped or imported
    public/          fonts, localities.json, sample scores.json
    src/
      main.ts        entry, wires state → DOM
      state.ts       screen state machine (empty/searchfirst/idle/search/loading/high/medium/low)
      i18n/          he.ts, en.ts — all user-facing strings
      search/        name normalization + fuzzy matching
      scene/         SVG parts and per-state animations
      styles/        tokens.css (SPEC §3 tokens), base.css
    tests/           Vitest specs
    fetcher/         Raspberry Pi job that builds scores.json (not part of the site bundle)

## Coding rules
- **Hebrew RTL first.** `<html lang="he" dir="rtl">` by default; use logical CSS properties
  (`margin-inline-start`, `inset-inline-end`), never left/right. English/LTR per SPEC §1 rules.
  No hard-coded strings in components — everything goes through `i18n/`.
- **Mobile-first.** Base styles for ~360px; widen with `min-width` media queries. Tap targets ≥ 44px.
- **Accessibility.** Semantic HTML, real `<button>`s, visible focus, labelled search combobox
  (ARIA combobox/listbox pattern), `aria-live` for the result, `role="img"` + `aria-label` on the scene,
  WCAG AA contrast in both themes. Honor `prefers-reduced-motion` (final frame only) and
  `prefers-color-scheme` (no toggles).
- **Design tokens only.** Colors from SPEC §3 as CSS variables in `styles/tokens.css`
  (light + dark); no raw hex elsewhere. Fonts: Rubik Mono One (title/number), Rubik (UI).
- Match the final frames in `design/screens/` exactly; reuse shapes/positions from `Screen.dc.html`.
- Privacy: no trackers, no accounts; only the city and language go in `localStorage`.

## How to work
- **Never compute risk per request.** The site only reads the pre-built `scores.json`; scoring
  lives in `fetcher/`. No per-visit API calls to Pikud HaOref, news or LLMs from the browser.
- Work in **small steps**: one screen state, one component or one animation at a time.
- **Commit after each step** with a clear message; keep the build green (`npm run build`, `npm test`).
- Check the result against the matching PNG in `design/screens/` (light + dark, news on/off).
- When SPEC and design disagree or something is unclear, ask — don't guess. Update SPEC §8 if an
  open question gets resolved.
