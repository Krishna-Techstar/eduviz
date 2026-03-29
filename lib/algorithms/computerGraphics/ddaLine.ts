import { CGAlgorithmStep, Point, CanvasCommand } from '../types';

/**
 * DDA (Digital Differential Analyzer) Line Algorithm
 * Draws a line using incremental calculation
 * Time: O(max(dx, dy)), Space: O(1)
 */

export function generateDDALineSteps(
  start: Point,
  end: Point
): CGAlgorithmStep[] {
  const steps: CGAlgorithmStep[] = [];
  let stepNumber = 0;

  const x0 = start.x;
  const y0 = start.y;
  const x1 = end.x;
  const y1 = end.y;

  // Initial state
  steps.push({
    stepNumber: stepNumber++,
    description: `Initialize DDA line algorithm from (${x0.toFixed(1)}, ${y0.toFixed(1)}) to (${x1.toFixed(1)}, ${y1.toFixed(1)})`,
    pseudoCode: 'dx = x1 - x0\ndy = y1 - y0\nsteps = max(|dx|, |dy|)',
    branch: 'computer-graphics',
    algorithmType: 'line-drawing',
    state: {
      canvas: [],
      controlPoints: [start, end],
      intermediatePoints: [],
    },
  });

  const dx = x1 - x0;
  const dy = y1 - y0;
  const steps_count = Math.max(Math.abs(dx), Math.abs(dy));

  const xIncrement = dx / steps_count;
  const yIncrement = dy / steps_count;

  steps.push({
    stepNumber: stepNumber++,
    description: `Calculate increments: xInc=${xIncrement.toFixed(2)}, yInc=${yIncrement.toFixed(2)}, steps=${steps_count}`,
    pseudoCode: 'xIncrement = dx / steps\nyIncrement = dy / steps',
    branch: 'computer-graphics',
    algorithmType: 'line-drawing',
    state: {
      canvas: [
        {
          type: 'point',
          properties: { x: x0, y: y0, radius: 3 },
          color: 'red',
        },
        {
          type: 'point',
          properties: { x: x1, y: y1, radius: 3 },
          color: 'red',
        },
      ],
      controlPoints: [start, end],
      intermediatePoints: [],
    },
  });

  const pixels: Point[] = [];
  let x = x0;
  let y = y0;

  for (let i = 0; i <= steps_count; i++) {
    const roundedX = Math.round(x);
    const roundedY = Math.round(y);

    pixels.push({ x: roundedX, y: roundedY });

    const canvasCommands: CanvasCommand[] = [
      {
        type: 'point',
        properties: { x: x0, y: y0, radius: 3 },
        color: 'red',
      },
      {
        type: 'point',
        properties: { x: x1, y: y1, radius: 3 },
        color: 'red',
      },
    ];

    // Draw all pixels plotted so far
    for (const p of pixels) {
      canvasCommands.push({
        type: 'pixel',
        properties: { x: p.x, y: p.y },
        color: 'blue',
      });
    }

    // Draw current point being plotted
    if (i === steps_count) {
      canvasCommands.push({
        type: 'point',
        properties: { x: roundedX, y: roundedY, radius: 4 },
        color: 'green',
      });
    }

    steps.push({
      stepNumber: stepNumber++,
      description: `Step ${i}: Plot pixel (${roundedX}, ${roundedY}) at position (${x.toFixed(2)}, ${y.toFixed(2)})`,
      pseudoCode: `x += xIncrement\ny += yIncrement\nplot(round(x), round(y))`,
      branch: 'computer-graphics',
      algorithmType: 'line-drawing',
      state: {
        canvas: canvasCommands,
        controlPoints: [start, end],
        intermediatePoints: pixels,
        highlightedPoint: { x: roundedX, y: roundedY },
      },
    });

    x += xIncrement;
    y += yIncrement;
  }

  // Draw connecting line
  const finalCommands: CanvasCommand[] = [
    {
      type: 'point',
      properties: { x: x0, y: y0, radius: 3 },
      color: 'red',
    },
    {
      type: 'point',
      properties: { x: x1, y: y1, radius: 3 },
      color: 'red',
    },
    {
      type: 'line',
      properties: { x0, y0, x1, y1 },
      color: 'blue',
    },
  ];

  for (const p of pixels) {
    finalCommands.push({
      type: 'pixel',
      properties: { x: p.x, y: p.y },
      color: 'blue',
    });
  }

  // Final state
  steps.push({
    stepNumber: stepNumber++,
    description: `Line complete. ${pixels.length} pixels plotted`,
    pseudoCode: 'Line drawn',
    complexity: {
      time: `O(${steps_count})`,
      space: 'O(1)',
    },
    branch: 'computer-graphics',
    algorithmType: 'line-drawing',
    state: {
      canvas: finalCommands,
      controlPoints: [start, end],
      intermediatePoints: pixels,
    },
  });

  return steps;
}

export function validateDDALineInput(input: {
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
