# Design reference

The approved visual design for No-Haziya. **This folder is a reference, not production code.**

- Live canvas (all screens, day + night, news on/off): claude.ai design canvas **"No-Haziya style directions"**.
- `Screen.dc.html` — the source of the canvas. **One component draws every screen**; the canvas screens only set its props.
- `screens/` — PNG exports of each screen (still frames, day + dark mode, news on/off).
- `ANIMATIONS.md` — how things move: the loops that exist in `Screen.dc.html` and the transitions still to build.

## How to read `Screen.dc.html`

It uses a small template format (not plain HTML):

- `{{name}}` = a value computed in the `<script>` block at the bottom (`renderVals()`).
- `<sc-if value="{{x}}">` = show only when `x` is true.
- `display="{{d.high}}"` on an SVG group = that group is visible only in that state.
- The `<script>` block holds the **design tokens** (`P.light` / `P.dark` colors), the result texts, the smart-search example and the logic that decides what each state shows.

All the illustration is inline SVG in a `viewBox="0 0 326 440"` scene panel. Reuse the shapes, colors and positions; rebuild the logic in the real app's own code.

## Props → screens

| Prop | Values | Meaning |
|---|---|---|
| `theme` | `light`, `dark` | follows the OS `prefers-color-scheme` in the real site |
| `step` | `empty` | 1 · no location yet (pin panel, button + switch disabled) |
| | `searchfirst` | 1a · picking the first location (dropdown open, pin panel stays) |
| | `idle` | 2 · location chosen, girl standing and thinking |
| | `search` | 2b · changing location (dropdown open; picking a city resets the result) |
| | `loading` | 3 · checking (dots in thought bubble, spinner button) |
| | `high` | 4 · high risk (crying, bra under shirt, Iron Dome launching interceptors) |
| | `medium` | 5 · medium risk (sleepy, bra on the floor, Iron Dome radar spinning) |
| | `low` | 6 · low risk (smiling, bra flying, moon asleep) |
| `news` | `off`, `on` | on = flickering TV glow + floating "בלה בלה…" bubble from the left |

Canvas layout: rows are Day/news off, Day/news on, Night/news off, Night/news on; columns follow the steps above.
