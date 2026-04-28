// Deterministic seeded PRNG so jitter is stable across frames.
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const sketchyRectPath = (
  x: number,
  y: number,
  w: number,
  h: number,
  radius = 18,
  seed = 1,
  jitter = 1.6,
): string => {
  const rand = mulberry32(seed);
  const j = (s: number) => (rand() - 0.5) * 2 * s;

  const segs = 14; // segments per long side
  const points: Array<[number, number]> = [];

  // top side (left → right)
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const px = x + radius + (w - 2 * radius) * t + j(jitter);
    const py = y + j(jitter);
    points.push([px, py]);
  }
  // right side (top → bottom)
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    const px = x + w + j(jitter);
    const py = y + radius + (h - 2 * radius) * t + j(jitter);
    points.push([px, py]);
  }
  // bottom side (right → left)
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    const px = x + w - radius - (w - 2 * radius) * t + j(jitter);
    const py = y + h + j(jitter);
    points.push([px, py]);
  }
  // left side (bottom → top)
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    const px = x + j(jitter);
    const py = y + h - radius - (h - 2 * radius) * t + j(jitter);
    points.push([px, py]);
  }
  // close
  points.push(points[0]);

  // build smoothed path with quadratic curves through midpoints
  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const [nx, ny] = points[i + 1];
    const mx = (px + nx) / 2;
    const my = (py + ny) / 2;
    d += ` Q ${px.toFixed(2)} ${py.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
  }
  d += " Z";
  return d;
};

export const sketchyLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  seed = 1,
  jitter = 1.4,
): string => {
  const rand = mulberry32(seed);
  const j = (s: number) => (rand() - 0.5) * 2 * s;
  const segs = 12;
  let d = `M ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    const x = x1 + (x2 - x1) * t + j(jitter);
    const y = y1 + (y2 - y1) * t + j(jitter);
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
};

export const sinusoidPath = (
  cx: number,
  cy: number,
  width: number,
  amplitude: number,
  frequency: number,
  phase: number,
  steps = 80,
): string => {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = cx - width / 2 + width * t;
    const y = cy + Math.sin(t * Math.PI * 2 * frequency + phase) * amplitude;
    d += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
};

// Curved arrow path between two points, with control point above the midpoint.
export const curvedArrow = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  curvature = 80,
): string => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - curvature;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
};
