/**
 * Computer Graphics Algorithms Branch
 */

export { generateBresenhamLineSteps, validateBresenhamLineInput } from './bresenhamLine';
export { generateDDALineSteps, validateDDALineInput } from './ddaLine';
export { generateBezierCurveSteps, validateBezierCurveInput } from './bezierCurve';
export { generateBSplineSteps } from './bspline';
export { generateScanLineFillSteps } from './scanLineFill';

export function generateFloodFillSteps(canvas: unknown, x: number, y: number) {
  throw new Error('Not yet implemented');
}

export function generateAffineTransformationSteps(
  points: unknown[],
  transformation: string,
) {
  throw new Error('Not yet implemented');
}

export function generatePolygonRasterizationSteps(polygon: unknown[]) {
  throw new Error('Not yet implemented');
}

export function generateCurveRasterizationSteps(curve: unknown) {
  throw new Error('Not yet implemented');
}
