import { CGAlgorithmStep, Point, CanvasCommand } from '../types';

function edgeIntersections(
  polygon: Point[],
  y: number,
): number[] {
  const xs: number[] = [];
  const n = polygon.length;
  for (let i = 0; i < n; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % n];
    const ymin = Math.min(a.y, b.y);
    const ymax = Math.max(a.y, b.y);
    if (y <= ymin || y > ymax) continue;
    if (Math.abs(b.y - a.y) < 1e-9) continue;
    const x = a.x + ((y - a.y) * (b.x - a.x)) / (b.y - a.y);
    xs.push(x);
  }
  xs.sort((p, q) => p - q);
  return xs;
}

export function generateScanLineFillSteps(polygon: Point[]): CGAlgorithmStep[] {
  const steps: CGAlgorithmStep[] = [];
  let stepNumber = 0;

  if (polygon.length < 3) {
    throw new Error('Polygon needs at least 3 vertices');
  }

  const outline: CanvasCommand[] = polygon.map((p) => ({
    type: 'point' as const,
    properties: { x: p.x, y: p.y, radius: 3 },
    color: '#c026d3',
  }));

  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    outline.push({
      type: 'line',
      properties: { x0: a.x, y0: a.y, x1: b.x, y1: b.y },
      color: '#a855f7',
    });
  }

  steps.push({
    stepNumber: stepNumber++,
    description: 'Polygon outline (scan-line fill)',
    branch: 'computer-graphics',
    algorithmType: 'rasterization',
    state: {
      canvas: outline,
      intermediatePoints: [],
    },
  });

  const ys = polygon.map((p) => p.y);
  const yMin = Math.floor(Math.min(...ys));
  const yMax = Math.ceil(Math.max(...ys));

  const canvas: CanvasCommand[] = [...outline];

  for (let y = yMin; y <= yMax; y += 4) {
    const xs = edgeIntersections(polygon, y + 0.5);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const x0 = xs[k];
      const x1 = xs[k + 1];
      canvas.push({
        type: 'line',
        properties: { x0, y0: y, x1, y1: y },
        color: 'rgba(52, 152, 219, 0.45)',
      });
    }

    steps.push({
      stepNumber: stepNumber++,
      description: `Scan line y ≈ ${y}: fill horizontal spans`,
      branch: 'computer-graphics',
      algorithmType: 'rasterization',
      state: {
        canvas: [...canvas],
        intermediatePoints: [],
      },
    });
  }

  steps.push({
    stepNumber: stepNumber++,
    description: 'Scan-line fill complete',
    branch: 'computer-graphics',
    algorithmType: 'rasterization',
    state: {
      canvas,
      intermediatePoints: [],
    },
  });

  return steps;
}
