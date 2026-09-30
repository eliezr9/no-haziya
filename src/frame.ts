// Wavy inner border of the poster — ported from wave/side() in design/Screen.dc.html.
// The path is rebuilt whenever the poster changes size, so it fits any screen.

const SEGMENT = 14; // px per wave segment (design)
const AMPLITUDE = 4;

function side(x1: number, y1: number, x2: number, y2: number, nx: number, ny: number): string {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const n = Math.max(2, Math.round(len / SEGMENT));
  let d = '';
  for (let i = 0; i < n; i++) {
    const t1 = (i + 1) / n;
    const tm = (i + 0.5) / n;
    const a = i % 2 ? AMPLITUDE : -AMPLITUDE;
    const mx = x1 + (x2 - x1) * tm + nx * a;
    const my = y1 + (y2 - y1) * tm + ny * a;
    const ex = x1 + (x2 - x1) * t1;
    const ey = y1 + (y2 - y1) * t1;
    d += ` Q${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  }
  return d;
}

/** Closed wavy rectangle `inset` px inside a `w`×`h` box. */
export function wavePath(w: number, h: number, inset: number): string {
  const [l, t, r, b] = [inset, inset, w - inset, h - inset];
  return `M${l} ${t}${side(l, t, r, t, 0, 1)}${side(r, t, r, b, 1, 0)}${side(r, b, l, b, 0, 1)}${side(l, b, l, t, 1, 0)} Z`;
}

/** Design: poster edge at 14px, wave at 24px → 10px inside the poster. */
const INSET = 10;

export function initFrame(poster: HTMLElement): void {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.classList.add('wave');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(NS, 'path');
  svg.append(path);
  poster.prepend(svg);

  let last = '';
  const draw = () => {
    const w = poster.offsetWidth;
    const h = poster.offsetHeight;
    const key = `${w}x${h}`;
    if (key === last) return;
    last = key;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    path.setAttribute('d', wavePath(w, h, INSET));
  };
  new ResizeObserver(draw).observe(poster);
  draw();
}
