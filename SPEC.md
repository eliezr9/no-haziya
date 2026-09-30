# No-Haziya — Product Spec (v1)

> "Can I sleep without a bra tonight?" — a free, cozy, illustrated website that estimates tonight's
> rocket/missile-alert risk for the user's location in Israel, and answers with a cartoon.
>
> **This is a fun estimate, not safety guidance.** Users must always follow Home Front Command (Pikud HaOref) instructions.

---

## 1. Goals & constraints

- **Free to run**: no paid domain, no paid servers. Free subdomain (e.g. `no-haziya.pages.dev`).
- **Accessible & mobile-first**: most users check from bed on a phone.
- **Bilingual**: Hebrew (RTL) is the default. English (LTR) is the default when the browser time zone is not `Asia/Jerusalem`. A manual `עב / EN` toggle always wins and is remembered locally.
- **Zero server load per visit**: the site never computes risk per request (see §5).
- **Privacy**: no accounts, no tracking. The chosen city is stored only in the browser (`localStorage`).

## 2. Screens & flow

The approved visual design lives on the claude.ai design canvas "No-Haziya style directions"
(day + night rows, news off / news on). Its source and screen exports are in **`design/`** —
read `design/README.md` first. Every screen shares one layout:

1. Header row: location chip (or search box) + language toggle `EN`/`עב`.
2. Title `NO-HAZIYA` + subtitle `אפשר לישון הלילה בלי חזייה?`.
3. Scene panel (the illustration).
4. Main button **or** result card.
5. News switch `להתחשב גם בחדשות` (iOS-style, site-styled).
6. Disclaimer: `האתר נועד לכיף ואין להתייחס להערכתו כהנחיית בטיחות. יש להישמע להנחיות פיקוד העורף.`

| # | State | What the user sees |
|---|-------|--------------------|
| 1 | **No location yet** | Empty search box. Scene panel shows only a big location pin + `נא לבחור מיקום`. Tapping the panel focuses the search box. Main button disabled. News switch off + disabled. |
| 1a | **Picking first location** | Search box focused with suggestions dropdown; background stays on the pin panel until a city is actually chosen. |
| 2 | **Location chosen (idle)** | Location chip (e.g. `תל אביב - יפו`). Girl standing, thinking, thought bubble with a bed. Button `אפשר לשחרר הלילה?` (EN: `Can I take it off tonight?`). |
| 2b | **Changing location** | Tapping the chip turns it into the focused search box + dropdown. Choosing a new city **resets** any result back to state 2. |
| 3 | **Checking** | Thought bubble shows 3 blinking dots; button becomes disabled with spinner + `בודקים את הלילה…`. **Minimum display time ≈1.2s** even if the answer is instant. |
| 4 | **High risk** | Girl lying on her back in bed, face in profile toward the ceiling, crying (open eye + blue tear stream to the pillow, tired marks under the eye). Bra visible as a slightly darker shape under the pajama top. Moon worried. Iron Dome battery rolls in, launches a cute interceptor every ~5s that flies out of the top of the frame. |
| 5 | **Medium risk** | Lying on her back, sleepy half-lid eye looking up, tired marks, sigh bubbles rising. Arm dangles slightly off the bed; pink bra on the floor beside the bed. Moon worried. Iron Dome battery rolls in, radar dish spinning. |
| 6 | **Low risk** | Lying on her back, happy closed eye + smile, "Zzz". Pink bra flying through the air with a motion trail. Moon asleep. No battery. |

**Result card** (replaces the main button in 4/5/6): big risk number (0–100), `רמת סיכון · גבוהה/בינונית/נמוכה`, a short headline, a one-line reason (e.g. "4 alerts in your area in the last 24 hours"), and a round "check again" button.

**News switch ON** (any state after a location is chosen): a flickering, color-shifting TV glow from the left side of the scene + a floating `בלה בלה…` speech bubble from the same side.

Pillow has no face. Pajama top has a single cream stripe (lying pose) / two stripes (standing pose).

## 3. Visual style

- Poster-inspired layout: rust frame, cream body, wavy inner border, chunky display title; storybook palette; dark-brown ink outlines.
- Fonts: `Rubik Mono One` (title/number), `Rubik` (UI, Hebrew + English).
- **Light / dark mode follow the OS setting** (`prefers-color-scheme`), no toggle.
- **Reduced motion follows the OS setting** (`prefers-reduced-motion`): skip straight to the final pose. No toggle.

Design tokens:

| Token | Light | Dark |
|---|---|---|
| frame | `#c8562b` | `#8f3a1c` |
| body | `#f2e3c6` | `#211a16` |
| wave | `#f4a259` | `#8a4a26` |
| title | `#c8562b` | `#e8743f` |
| subtitle | `#1f4a5a` | `#7fb7be` |
| primary button bg / text | `#1f4a5a` / `#f2e3c6` | `#f4a259` / `#211a16` |
| ink (outlines) | `#3b2418` | `#120c09` |
| scene panel | `#1f4a5a` | `#1f4a5a` |
| risk high / med / low | `#b8401c` / `#9a5a1e` / `#1f6a5a` | `#ff8a5c` / `#f4c06a` / `#8fd3d0` |

Character palette: skin `#f4c7a0`, hair `#c8562b`, pajamas `#7fb7be` (bra-under-shirt `#5a979f`), blanket `#d9534f`, bra `#e8a0a0`, wood `#b5733d`, battery olive `#8f9a5a`.

## 4. Characters & animation

- Characters generated with AI, then vectorized and **split into separate parts** (head, eye, arm, blanket, bra, tear…).
- Animation style: **South Park–like cutout** — simple, fast, snappy moves between a few poses, not smooth tweening.
- Implementation: SVG + CSS/JS (or Rive). Keep each result's final frame identical to the design canvas.

## 5. Architecture

```
[Fetcher on Raspberry Pi 5, in Israel]  --every few min-->  scores.json  --->  static site on free host (CDN)
   pulls Pikud HaOref data (+ optional news)                (one file,        browser reads the file,
   computes a score per alert area                           all areas)       looks up the user's area
```

- The Pikud HaOref site usually blocks non-Israeli IPs, so the fetcher runs on the user's Raspberry Pi 5 (fallback: a community mirror such as Tzeva Adom).
- `scores.json` contains, per alert area: score, band, reason fields, and `updatedAt`.
- The site shows a gentle warning if `updatedAt` is stale (e.g. > 15 min).
- Hosting candidates: Cloudflare Pages / Netlify / GitHub Pages (auto-deploy on push).

## 6. Risk calculation (0–100)

Inputs per alert area:
- Home Front Command **defense-policy level** for the area — biggest weight.
- **Actual sirens** in the area: last 24h and last 7 days (decaying weight).
- **Early warnings** (התראה מקדימה) — counted separately, much lower weight than sirens.
- Time since the last siren in the region.
- Nationwide trend (escalating or calming).
- **News toggle (optional)**: headlines from a few Israeli news feeds every 15–30 min, rated 0–10 for "tension" by an LLM (free tier); **capped at ~20 points** of the total.

Rules:
- **Active alert right now → skip the verdict** and show "Go to the shelter".
- Bands: `0–30` low, `31–65` medium, `66–100` high. Weights to be tuned with real historical data.

## 7. Location search

- Data: the official Home Front Command localities list (every city, village, kibbutz), Hebrew + English names, each mapped to its alert area.
- Smart matching: substring anywhere (`צליה` → `הרצליה`), typo-tolerant fuzzy search, ignore final letters / hyphens / geresh / spaces, works in both languages.
- Dropdown: best match tagged `הכי מתאים`, then other matches, then `שימוש במיקום הנוכחי שלי` (GPS, optional, with permission).

## 8. Open questions / to verify

- [ ] Confirm current Pikud HaOref endpoints (alert history, policy levels, localities list) and their geo-blocking.
- [ ] Real sub-area names for large cities (placeholders in the design).
- [ ] Choose final host and subdomain.
- [ ] Choose LLM provider for the news rating (free tier) — or ship v1 without the news toggle.
- [ ] Final character art + animation tool (SVG/CSS vs Rive).
