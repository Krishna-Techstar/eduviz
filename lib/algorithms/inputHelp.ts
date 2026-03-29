/** Short instructions shown in the Input panel per algorithm id. */
export const ALGORITHM_INPUT_HELP: Record<string, string> = {
  'bubble-sort':
    'Enter numbers separated by commas, e.g. 5, 2, 8, 1. Use sample buttons to fill quickly.',
  'selection-sort': 'Comma-separated numbers, e.g. 64, 34, 25, 12, 22.',
  'insertion-sort': 'Comma-separated numbers, e.g. 5, 2, 8, 1.',
  'merge-sort': 'Comma-separated numbers.',
  'quick-sort': 'Comma-separated numbers (at least 2 for a meaningful run).',
  bfs: 'Uses the built-in sample graph (nodes A–E). Enter the start node id (e.g. A).',
  dfs: 'Same sample graph. Enter start node id (e.g. A).',
  dijkstra: 'Weighted sample graph. Enter source node id (e.g. A).',
  kruskal: 'Runs on the built-in weighted sample graph (no extra input).',
  prim: 'Weighted sample graph. Enter the starting node id (e.g. A).',
  'binary-tree':
    'Uses the built-in sample tree. Choose traversal order; no array input.',
  'bresenham-line':
    'Optional: x0,y0,x1,y1 (e.g. 50,50,300,250). Leave empty for defaults.',
  'dda-line': 'Optional: x0,y0,x1,y1. Leave empty for defaults.',
  'bezier-curve': 'Uses built-in control points from the app (or extend later).',
  bspline: 'Uses built-in control points; optional format same as line.',
  'scan-line-fill': 'Uses built-in polygon from constants.',
};
