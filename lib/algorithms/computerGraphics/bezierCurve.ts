import { CGAlgorithmStep, Point, CanvasCommand } from '../types';

/**
 * Bezier Curve Algorithm
 * Generates smooth curves using De Casteljau's algorithm
 * Time: O(n * steps), Space: O(n)
 */

export function generateBezierCurveSteps(controlPoints: Point[]): CGAlgorithmStep[] {
  const steps: CGAlgorithmStep[] = [];
  let stepNumber = 0;

  if (controlPoints.length < 2) {
    throw new Error('Bezier curve requires at least 2 control points');
  }

  // Initial state
  steps.push({
    stepNumber: stepNumber++,
    description: `Initialize Bezier curve with ${controlPoints.length} control points`,
    pseudoCode: 'for t = 0 to 1:\n  point = deCasteljau(t)',
    branch: 'computer-graphics',
    algorithmType: 'curve-generation',
    state: {
      canvas: controlPoints.map((p, i) => ({
        type: 'point' as const,
        properties: { x: p.x, y: p.y, radius: 4 },
        color: 'red',
      })),
      controlPoints: controlPoints,
      intermediatePoints: [],
    },
  });

  // Draw control polygon
  const controlPolygonCommands: CanvasCommand[] = controlPoints.map((p, i) => ({
    type: 'point',
    properties: { x: p.x, y: p.y, radius: 4 },
    color: 'red',
  }));

  for (let i = 0; i < controlPoints.length - 1; i++) {
    controlPolygonCommands.push({
      type: 'line',
      properties: {
        x0: controlPoints[i].x,
        y0: controlPoints[i].y,
        x1: controlPoints[i + 1].x,
        y1: controlPoints[i + 1].y,
      },
      color: 'lightgray',
    });
  }

  steps.push({
    stepNumber: stepNumber++,
    description: `Draw control polygon connecting ${controlPoints.length} points`,
    pseudoCode: 'for each pair of points: drawLine()',
    branch: 'computer-graphics',
    algorithmType: 'curve-generation',
    state: {
      canvas: controlPolygonCommands,
      controlPoints: controlPoints,
      intermediatePoints: [],
    },
  });

  const curvePoints: Point[] = [];
  const resolution = 20; // Number of points to sample along curve

  // Generate curve points
  for (let i = 0; i <= resolution; i++) {
    const t = i / resolution;
    const point = deCasteljau(controlPoints, t);
    curvePoints.push(point);

    const canvasCommands: CanvasCommand[] = [...controlPolygonCommands];

    // Draw intermediate control polygons
    let tempPoints = [...controlPoints];
    let level = 0;

    while (tempPoints.length > 1) {
      for (let j = 0; j < tempPoints.length - 1; j++) {
        const p1 = tempPoints[j];
        const p2 = tempPoints[j + 1];
        const inter = lerp(p1, p2, t);

        canvasCommands.push({
          type: 'point',
          properties: { x: inter.x, y: inter.y, radius: 2 },
          color: `rgba(100, 100, 255, ${0.5 - level * 0.1})`,
        });

        if (j < tempPoints.length - 2) {
          canvasCommands.push({
            type: 'line',
            properties: {
              x0: p1.x,
              y0: p1.y,
              x1: p2.x,
              y1: p2.y,
            },
            color: `rgba(100, 100, 255, ${0.3 - level * 0.1})`,
          });
        }
      }

      tempPoints = Array.from({ length: tempPoints.length - 1 }, (_, j) =>
        lerp(tempPoints[j], tempPoints[j + 1], t)
      );
      level++;
    }

    // Draw all curve points so far
    for (const cp of curvePoints) {
      canvasCommands.push({
        type: 'point',
        properties: { x: cp.x, y: cp.y, radius: 2 },
        color: 'blue',
      });
    }

    // Draw connecting line segments
    for (let j = 0; j < curvePoints.length - 1; j++) {
      canvasCommands.push({
        type: 'line',
        properties: {
          x0: curvePoints[j].x,
          y0: curvePoints[j].y,
          x1: curvePoints[j + 1].x,
          y1: curvePoints[j + 1].y,
        },
        color: 'blue',
      });
    }

    // Current evaluation point
    canvasCommands.push({
      type: 'point',
      properties: { x: point.x, y: point.y, radius: 3 },
      color: 'green',
    });

    steps.push({
      stepNumber: stepNumber++,
      description: `Evaluate Bezier at t=${t.toFixed(2)}: point (${point.x.toFixed(1)}, ${point.y.toFixed(1)})`,
      pseudoCode: `t = ${t.toFixed(2)}\npoint = deCasteljau(t)`,
      branch: 'computer-graphics',
      algorithmType: 'curve-generation',
      state: {
        canvas: canvasCommands,
        controlPoints: controlPoints,
        intermediatePoints: curvePoints,
        highlightedPoint: point,
      },
    });
  }

  // Final state
  steps.push({
    stepNumber: stepNumber++,
    description: `Bezier curve complete with ${curvePoints.length} sampled points`,
    pseudoCode: 'Curve generated',
    complexity: {
      time: `O(n * ${resolution})`,
      space: 'O(n)',
    },
    branch: 'computer-graphics',
    algorithmType: 'curve-generation',
    state: {
      canvas: [
        ...controlPolygonCommands,
        ...curvePoints.map((p) => ({
          type: 'point' as const,
          properties: { x: p.x, y: p.y, radius: 2 },
          color: 'blue',
        })),
        ...Array.from({ length: curvePoints.length - 1 }, (_, i) => ({
          type: 'line' as const,
          properties: {
            x0: curvePoints[i].x,
            y0: curvePoints[i].y,
            x1: curvePoints[i + 1].x,
            y1: curvePoints[i + 1].y,
          },
          color: 'blue',
        })),
      ],
      controlPoints: controlPoints,
      intermediatePoints: curvePoints,
    },
  });

  return steps;
}

// De Casteljau's algorithm
function deCasteljau(points: Point[], t: number): Point {
  if (points.length === 1) {
    return points[0];
  }

  const newPoints: Point[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    newPoints.push(lerp(points[i], points[i + 1], t));
  }

  return deCasteljau(newPoints, t);
}

// Linear interpolation
function lerp(p1: Point, p2: Point, t: number): Point {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  };
}

export function validateBezierCurveInput(input: {
  controlPoints?: unknown;
}): { valid: boolean; error?: string } {
  if (!Array.isArray(input.controlPoints)) {
    return { valid: false, error: 'Control points must be an array' };
  }

  const isValidPoint = (p: unknown): boolean => {
    if (typeof p !== 'object' || p === null) return false;
    const point = p as any;
    return typeof point.x === 'number' && typeof point.y === 'number';
  };

  if (!input.controlPoints.every(isValidPoint)) {
    return { valid: false, error: 'All control points must have x and y coordinates' };
  }

  if (input.controlPoints.length < 2) {
    return { valid: false, error: 'At least 2 control points are required' };
  }

  return { valid: true };
}
