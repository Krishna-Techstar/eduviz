import { CGAlgorithmStep, Point, CanvasCommand } from '../types';

/**
 * Bresenham's Line Algorithm
 * Draws a line using integer arithmetic only
 * Time: O(max(dx, dy)), Space: O(1)
 */

export function generateBresenhamLineSteps(
  start: Point,
  end: Point
): CGAlgorithmStep[] {
  const steps: CGAlgorithmStep[] = [];
  let stepNumber = 0;

  const x0 = Math.round(start.x);
  const y0 = Math.round(start.y);
  const x1 = Math.round(end.x);
  const y1 = Math.round(end.y);

  // Initial state
  steps.push({
    stepNumber: stepNumber++,
    description: `Initialize Bresenham's line algorithm from (${x0}, ${y0}) to (${x1}, ${y1})`,
    pseudoCode: 'dx = |x1 - x0|\ndy = |y1 - y0|',
    branch: 'computer-graphics',
    algorithmType: 'line-drawing',
    state: {
      canvas: [],
      controlPoints: [start, end],
      intermediatePoints: [],
    },
  });

  const pixels: Point[] = [];
  const canvasCommands: CanvasCommand[] = [];

  // Add endpoints
  canvasCommands.push({
    type: 'point',
    properties: { x: x0, y: y0, radius: 3 },
    color: 'red',
  });
  canvasCommands.push({
    type: 'point',
    properties: { x: x1, y: y1, radius: 3 },
    color: 'red',
  });

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;

  steps.push({
    stepNumber: stepNumber++,
    description: `Calculate differences: dx=${dx}, dy=${dy}, sx=${sx}, sy=${sy}`,
    pseudoCode: 'sx = x0 < x1 ? 1 : -1\nsy = y0 < y1 ? 1 : -1',
    branch: 'computer-graphics',
    algorithmType: 'line-drawing',
    state: {
      canvas: canvasCommands,
      controlPoints: [start, end],
      intermediatePoints: [],
    },
  });

  let err = (dx > dy ? dx : -dy) / 2;
  let x = x0;
  let y = y0;

  while (true) {
    pixels.push({ x, y });

    canvasCommands.push({
      type: 'pixel',
      properties: { x, y },
      color: 'blue',
    });

    steps.push({
      stepNumber: stepNumber++,
      description: `Plot point (${x}, ${y})`,
      pseudoCode: 'pixels.add((x, y))',
      branch: 'computer-graphics',
      algorithmType: 'line-drawing',
      state: {
        canvas: [...canvasCommands],
        controlPoints: [start, end],
        intermediatePoints: pixels,
        highlightedPoint: { x, y },
      },
    });

    if (x === x1 && y === y1) break;

    const e2 = err;
    if (e2 > -dx) {
      err -= dy;
      x += sx;

      steps.push({
        stepNumber: stepNumber++,
        description: `Error check: move X to ${x} (e2=${e2}, -dx=${-dx})`,
        pseudoCode: 'if e2 > -dx: x += sx; err -= dy',
        branch: 'computer-graphics',
        algorithmType: 'line-drawing',
        state: {
          canvas: [...canvasCommands],
          controlPoints: [start, end],
          intermediatePoints: pixels,
        },
      });
    }

    if (e2 < dy) {
      err += dx;
      y += sy;

      steps.push({
        stepNumber: stepNumber++,
        description: `Error check: move Y to ${y} (e2=${e2}, dy=${dy})`,
        pseudoCode: 'if e2 < dy: y += sy; err += dx',
        branch: 'computer-graphics',
        algorithmType: 'line-drawing',
        state: {
          canvas: [...canvasCommands],
          controlPoints: [start, end],
          intermediatePoints: pixels,
        },
      });
    }
  }

  // Draw connecting line
  canvasCommands.push({
    type: 'line',
    properties: { x0, y0, x1, y1 },
    color: 'blue',
  });

  // Final state
  steps.push({
    stepNumber: stepNumber++,
    description: `Line complete. ${pixels.length} pixels plotted`,
    pseudoCode: 'Line drawn',
    complexity: {
      time: `O(${Math.max(dx, dy)})`,
      space: 'O(1)',
    },
    branch: 'computer-graphics',
    algorithmType: 'line-drawing',
    state: {
      canvas: canvasCommands,
      controlPoints: [start, end],
      intermediatePoints: pixels,
    },
  });

  return steps;
}

export function validateBresenhamLineInput(input: {
  start?: unknown;
  end?: unknown;
}): { valid: boolean; error?: string } {
  const isValidPoint = (p: unknown): boolean => {
    if (typeof p !== 'object' || p === null) return false;
    const point = p as any;
    return typeof point.x === 'number' && typeof point.y === 'number';
  };

  if (!isValidPoint(input.start)) {
    return { valid: false, error: 'Start point must have x and y coordinates' };
  }
  if (!isValidPoint(input.end)) {
    return { valid: false, error: 'End point must have x and y coordinates' };
  }

  return { valid: true };
}
