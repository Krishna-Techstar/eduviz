import { CGAlgorithmStep, Point, CanvasCommand } from '../types';

function catmullRom(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const t2 = t * t;
  const t3 = t2 * t;
  const x =
    0.5 *
    (2 * p1.x +
      (-p0.x + p2.x) * t +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
  const y =
    0.5 *
    (2 * p1.y +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
  return { x, y };
}

function padControlPoints(pts: Point[]): Point[] {
  if (pts.length >= 4) return pts;
  if (pts.length === 3) return [pts[0], pts[0], pts[1], pts[2]];
  if (pts.length === 2) return [pts[0], pts[0], pts[1], pts[1]];
  return [pts[0], pts[0], pts[0], pts[0]];
}

export function generateBSplineSteps(controlPoints: Point[]): CGAlgorithmStep[] {
  const steps: CGAlgorithmStep[] = [];
  let stepNumber = 0;
  const pts = padControlPoints(controlPoints);

  const base: CanvasCommand[] = pts.map((p) => ({
    type: 'point' as const,
    properties: { x: p.x, y: p.y, radius: 4 },
    color: 'red',
  }));

  steps.push({
    stepNumber: stepNumber++,
    description: `Catmull–Rom spline (smooth B-spline style) with ${controlPoints.length} control points`,
    branch: 'computer-graphics',
    algorithmType: 'curve-generation',
    state: {
      canvas: base,
      controlPoints,
      intermediatePoints: [],
    },
  });

  const curve: Point[] = [];
  const segments = Math.max(1, pts.length - 3);
  const res = 8;

  for (let s = 0; s < segments; s++) {
    const p0 = pts[s];
    const p1 = pts[s + 1];
    const p2 = pts[s + 2];
    const p3 = pts[s + 3];
    for (let i = 0; i <= res; i++) {
      curve.push(catmullRom(p0, p1, p2, p3, i / res));
    }
  }

  const canvas: CanvasCommand[] = [...base];
  let built = 0;
  for (let i = 0; i < curve.length - 1; i++) {
    canvas.push({
      type: 'line',
      properties: {
        x0: curve[i].x,
        y0: curve[i].y,
        x1: curve[i + 1].x,
        y1: curve[i + 1].y,
      },
      color: '#2563eb',
    });
    built++;
    if (built % 4 === 0 || i === curve.length - 2) {
      steps.push({
        stepNumber: stepNumber++,
        description: `Curve segment batch (up to point ${i + 1})`,
        branch: 'computer-graphics',
        algorithmType: 'curve-generation',
        state: {
          canvas: [...canvas],
          controlPoints,
          intermediatePoints: curve.slice(0, i + 2),
        },
      });
    }
  }

  return steps;
}
