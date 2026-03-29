/**
 * Sample data and constants for algorithm visualization
 */

import { Point, GraphEdge, GraphNode } from './types';

// ============================================================================
// SAMPLE ARRAYS (for sorting/searching algorithms)
// ============================================================================

export const SAMPLE_ARRAYS = {
  small: [5, 2, 8, 1, 9],
  medium: [64, 34, 25, 12, 22, 11, 90],
  large: [38, 27, 43, 3, 9, 82, 10, 12, 14, 16, 18, 20, 22, 24, 26],
  reverse: [9, 8, 7, 6, 5, 4, 3, 2, 1],
  nearlysorted: [1, 3, 2, 4, 5, 7, 6, 8, 9, 10],
};

// ============================================================================
// SAMPLE GRAPHS (for BFS, DFS, Dijkstra, MST, etc.)
// ============================================================================

export const SAMPLE_GRAPHS = {
  simple: {
    nodes: [
      { id: 'A', label: 'A' } as GraphNode,
      { id: 'B', label: 'B' } as GraphNode,
      { id: 'C', label: 'C' } as GraphNode,
      { id: 'D', label: 'D' } as GraphNode,
      { id: 'E', label: 'E' } as GraphNode,
    ],
    edges: [
      { source: 'A', target: 'B', weight: 4 } as GraphEdge,
      { source: 'A', target: 'C', weight: 2 } as GraphEdge,
      { source: 'B', target: 'C', weight: 1 } as GraphEdge,
      { source: 'B', target: 'D', weight: 5 } as GraphEdge,
      { source: 'C', target: 'D', weight: 8 } as GraphEdge,
      { source: 'C', target: 'E', weight: 10 } as GraphEdge,
      { source: 'D', target: 'E', weight: 2 } as GraphEdge,
    ],
  },
  weighted: {
    nodes: [
      { id: 'A', label: 'A' } as GraphNode,
      { id: 'B', label: 'B' } as GraphNode,
      { id: 'C', label: 'C' } as GraphNode,
      { id: 'D', label: 'D' } as GraphNode,
      { id: 'E', label: 'E' } as GraphNode,
      { id: 'F', label: 'F' } as GraphNode,
    ],
    edges: [
      { source: 'A', target: 'B', weight: 7 } as GraphEdge,
      { source: 'A', target: 'C', weight: 9 } as GraphEdge,
      { source: 'A', target: 'F', weight: 14 } as GraphEdge,
      { source: 'B', target: 'C', weight: 10 } as GraphEdge,
      { source: 'B', target: 'D', weight: 15 } as GraphEdge,
      { source: 'C', target: 'D', weight: 11 } as GraphEdge,
      { source: 'C', target: 'F', weight: 2 } as GraphEdge,
      { source: 'D', target: 'E', weight: 6 } as GraphEdge,
      { source: 'E', target: 'F', weight: 9 } as GraphEdge,
    ],
  },
  grid: {
    nodes: Array.from({ length: 25 }, (_, i) => ({
      id: i,
      label: String(i),
    })) as GraphNode[],
    edges: generateGridEdges(5, 5),
  },
};

function generateGridEdges(rows: number, cols: number): GraphEdge[] {
  const edges: GraphEdge[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const current = i * cols + j;
      // Right neighbor
      if (j < cols - 1) {
        edges.push({ source: current, target: current + 1 } as GraphEdge);
      }
      // Bottom neighbor
      if (i < rows - 1) {
        edges.push({ source: current, target: current + cols } as GraphEdge);
      }
    }
  }
  return edges;
}

// ============================================================================
// SAMPLE TREES (for tree traversal, AVL operations, etc.)
// ============================================================================

export const SAMPLE_TREES = {
  binary: {
    value: 1,
    left: {
      value: 2,
      left: { value: 4 },
      right: { value: 5 },
    },
    right: {
      value: 3,
      left: { value: 6 },
      right: { value: 7 },
    },
  },
  bst: {
    value: 50,
    left: {
      value: 30,
      left: { value: 20 },
      right: { value: 40 },
    },
    right: {
      value: 70,
      left: { value: 60 },
      right: { value: 80 },
    },
  },
};

// ============================================================================
// SAMPLE CANVAS DATA (for graphics algorithms)
// ============================================================================

export const SAMPLE_CANVAS = {
  width: 400,
  height: 400,
  
  // Line drawing samples
  bresenhamLines: [
    { start: { x: 10, y: 10 }, end: { x: 200, y: 150 } },
    { start: { x: 50, y: 350 }, end: { x: 300, y: 50 } },
  ],
  
  // Curve samples
  bezierPoints: [
    { x: 50, y: 50 },
    { x: 150, y: 150 },
    { x: 250, y: 100 },
    { x: 350, y: 300 },
  ],
  
  bezierControlPoints: [
    { x: 50, y: 250 },
    { x: 150, y: 50 },
    { x: 250, y: 200 },
    { x: 350, y: 50 },
  ],
  
  // Polygon for rasterization
  polygon: [
    { x: 100, y: 50 },
    { x: 250, y: 75 },
    { x: 300, y: 200 },
    { x: 200, y: 300 },
    { x: 75, y: 250 },
  ],
};

// ============================================================================
// ALGORITHM METADATA
// ============================================================================

export const ALGORITHM_CATEGORIES = {
  sorting: 'Sorting',
  searching: 'Searching',
  graph: 'Graph Algorithms',
  'dynamic-programming': 'Dynamic Programming',
  tree: 'Tree Algorithms',
};

export const GRAPHICS_CATEGORIES = {
  'line-drawing': 'Line Drawing',
  'curve-generation': 'Curve Generation',
  rasterization: 'Polygon Rasterization',
  transformation: 'Transformations',
};

// Sorting algorithms metadata
export const SORTING_ALGORITHMS = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    description: 'Simple sorting by repeatedly swapping adjacent elements',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    description: 'Find minimum and swap with current position',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    description: 'Build sorted array by inserting elements one by one',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    description: 'Divide and conquer sorting algorithm',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    description: 'Efficient divide and conquer using pivot',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
  },
];

// Graph algorithms metadata
export const GRAPH_ALGORITHMS = [
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    description: 'Traverse graph level by level',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    description: 'Traverse graph deeply before backtracking',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    description: 'Find shortest path from source to all vertices',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
  },
  {
    id: 'kruskal',
    name: "Kruskal's MST",
    description: 'Find minimum spanning tree using edge sorting',
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V)',
  },
  {
    id: 'prim',
    name: "Prim's MST",
    description: 'Find minimum spanning tree by growing from a vertex',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
  },
  {
    id: 'binary-tree',
    name: 'Binary Tree Traversal',
    description: 'Inorder / preorder / postorder walk (backend)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
  },
];

// Graphics algorithms metadata
export const GRAPHICS_ALGORITHMS = [
  {
    id: 'bresenham-line',
    name: "Bresenham's Line Algorithm",
    description: 'Draw line using integer arithmetic',
    applications: ['Graphics', 'Game engines', 'Display systems'],
  },
  {
    id: 'dda-line',
    name: 'DDA Line Algorithm',
    description: 'Draw line using incremental calculation',
    applications: ['Computer graphics', 'Rasterization'],
  },
  {
    id: 'bezier-curve',
    name: 'Bezier Curve',
    description: 'Generate smooth curves using control points',
    applications: ['Vector graphics', 'Animation', 'Font rendering'],
  },
  {
    id: 'bspline',
    name: 'B-Spline Curve',
    description: 'Generate smooth curves with local control',
    applications: ['CAD', 'Animation', 'Curves'],
  },
  {
    id: 'scan-line-fill',
    name: 'Scan-Line Polygon Fill',
    description: 'Fill polygon using scan line algorithm',
    applications: ['Polygon rasterization', 'Graphics rendering'],
  },
];
