# Animations

The PNGs in `screens/` are still frames. This file describes the motion.

**Style for everything: South Park–like cutout.** Parts snap between a few poses with short, fast moves
(steps / quick ease-out), not smooth floaty tweening. Keep each piece a separate SVG group so it can move alone.

**Reduced motion** (`prefers-reduced-motion: reduce`): skip every transition and loop; show the final frame only.

---

## A. Loops that already exist in `Screen.dc.html`

These are real SVG `<animate>` tags in the file — copy the exact values from there.

| Where | What | Timing |
|---|---|---|
| 3 · Checking | Three dots in the thought bubble blink one after another (opacity 1 → 0.2 → 1) | 1.2s loop, staggered 0.2s |
| 3 · Checking | Button spinner rotates | 0.9s loop |
| News on | TV glow opacity flickers irregularly | 2.6s loop, uneven keyTimes |
| News on | TV glow color cycles blue → white → warm orange → blue → green → purple | 4.2s loop |
| News on | "בלה בלה…" bubble floats a few px up/down | 3.4s loop |
| News on | Text inside the bubble wobbles ±3° | 1.4s loop |
| 4 + 5 | Iron Dome truck rolls in from the right, stops behind the bed | 1.8s once, ease-out, then stays |
| 5 · Medium | Radar dish spins (scaleX 1 → 0.12 → -1 → 0.12 → 1) | 2.4s loop, starts after the truck stops |
| 4 · High | Interceptor launch: smoke puff grows and fades, missile flies from the launcher up-right and disappears past the top of the frame; flame flickers | every 5s, flight ≈1.5s, flame 0.16s loop |

## B. Transitions still to build (not in the design file yet)

Only the **final frames** of screens 4/5/6 were designed. The motion between screen 3 and the result
is described here and must be built. Target: the whole sequence ≈ 2–3s, then the result card appears.

### Shared start (all three results)
1. Thought bubble pops away (scale to 0, ~0.15s).
2. Girl turns and walks to the bed: 2–3 snappy step poses.
3. She hops in and lies on her back; blanket snaps over her in one frame.
4. Moon changes expression (snap, no morph).

### 4 · High risk
- She lies down still wearing the bra (darker shape under the shirt stays).
- Eye stays open; tear stream appears; small sob bounce of the head (2–3 quick bumps).
- Moon: worried. Then the Iron Dome truck rolls in and launches start.

### 5 · Medium risk
- Before lying down: a relieved sigh (shoulders drop, sigh bubbles rise).
- Reaches under the shirt, pulls the bra out, drops it on the floor beside the bed.
- Lies down; eye goes half-closed; arm flops over the edge of the bed.
- Moon: worried. Truck rolls in, radar starts spinning.

### 6 · Low risk
- Hand goes into the shirt, pulls the bra out (still wearing pajamas).
- Throws it into the air: bra flies in an arc with a dashed motion trail and ends where the final frame shows it.
- Lies down smiling; "Zzz" letters pop in one by one.
- Moon: falls asleep (eyes snap closed, small "z z").

### Result card
- Slides / pops in after the scene settles (~0.2s), risk number counts up quickly from 0.

### Changing location
- Picking a new city resets instantly to screen 2 (no reverse animation needed).
