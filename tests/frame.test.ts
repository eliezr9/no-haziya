import { describe, expect, it } from 'vitest';
import { wavePath } from '../src/frame';

const points = (d: string) =>
  [...d.matchAll(/Q[\d.-]+ [\d.-]+ ([\d.-]+) ([\d.-]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);

describe('wavePath', () => {
  it('matches the design at 390×844 (poster 362×816, wave inset 10)', () => {
    const d = wavePath(362, 816, 10);
    expect(d.startsWith('M10 10 Q')).toBe(true);
    expect(d.endsWith(' Z')).toBe(true);
    // 342px wide → round(342/14) = 24 segments; 796px tall → 57 segments
    expect(points(d)).toHaveLength(24 + 57 + 24 + 57);
  });

  it('passes through all four corners and closes where it started', () => {
    const pts = points(wavePath(300, 500, 10));
    for (const corner of [
      [290, 10],
      [290, 490],
      [10, 490],
      [10, 10],
    ]) {
      expect(pts).toContainEqual(corner);
    }
    expect(pts.at(-1)).toEqual([10, 10]);
  });

  it('keeps at least two segments per side on tiny boxes', () => {
    expect(points(wavePath(30, 30, 10))).toHaveLength(8);
  });
});
