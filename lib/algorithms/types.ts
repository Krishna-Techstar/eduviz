/**
 * Core type system for EduViz algorithm visualization
 * Supports both Data Structures and Computer Graphics algorithms
 */

// ============================================================================
// GENERIC STEP SYSTEM (Used by both branches)
// ============================================================================

export interface AlgorithmStep {
  stepNumber: number;
  description: string;
  pseudoCode?: string;
  complexity?: {
    time?: string;
    space?: string;
  };
}

// ============================================================================
// BRANCH 1: DATA STRUCTURES & ALGORITHMS
// ============================================================================

export type DataStructureType = 'array' | 'graph' | 'tree' | 'linkedlist';

/** Mirrors backend step fields for UI (queue, stack, distances, etc.). */
export interface DSEngineSnapshot {
  stepType: string;
  current: string | number | null;
  visited: string[];
  queue: string[];
  stack: string[];
  distances: Record<string, number | null>;
  array: (number | string)[];
  comparing: [number, number] | null;
  explanation: string;
  highlightNodes: string[];
  highlightEdges: [string, string][];
}

export interface DSAlgorithmStep extends AlgorithmStep {
  branch: 'data-structures';
  dataStructure: DataStructureType;
  state: DSVisualizationState;
  /** Present when steps were produced by the EduViz API engine. */
  engineSnapshot?: DSEngineSnapshot;
}

// Visualization state for data structures
export interface DSVisualizationState {
  arrays?: ArrayState[];
  graph?: GraphState;
  tree?: TreeState;
  linkedList?: LinkedListState;
  highlightedIndices?: number[];
  highlightedNodes?: (string | number)[];
  currentValue?: any;
  comparisons?: Array<{ a: any; b: any; result: string }>;
}

// Array sorting/searching visualization
export interface ArrayState {
  id: string;
  values: number[];
  highlightedIndices?: number[];
  sortedIndices?: number[];
  color?: 'default' | 'comparing' | 'sorted' | 'pivot';
}

// Graph visualization (for BFS, DFS, Dijkstra, etc.)
export interface GraphNode {
  id: string | number;
  label: string;
  x?: number;
  y?: number;
  distance?: number;
  parent?: string | number;
  visited?: boolean;
  inQueue?: boolean;
  color?: 'default' | 'current' | 'visited' | 'unvisited';
}

export interface GraphEdge {
  source: string | number;
  target: string | number;
  weight?: number;
  highlighted?: boolean;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  mstEdges?: GraphEdge[]; // For MST algorithms
  queue?: (string | number)[]; // For BFS
  stack?: (string | number)[]; // For DFS
  /** Edges to emphasize (e.g. relax / traverse) */
  highlightedEdges?: GraphEdge[];
  /** Which fringe structure the algorithm uses (for on-canvas legend). */
  fringeMode?: 'queue' | 'stack' | 'none';
}

// Tree visualization
export interface TreeNode {
  id: string | number;
  value: any;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
  visited?: boolean;
  color?: 'default' | 'current' | 'visited';
}

export interface TreeState {
  root?: TreeNode;
  order?: (string | number)[]; // For traversal order
  highlightedNodes?: (string | number)[];
}

// Linked list visualization
export interface LinkedListNode {
  id: string | number;
  value: any;
  next?: string | number;
  highlighted?: boolean;
  color?: 'default' | 'current' | 'visited';
}

export interface LinkedListState {
  nodes: LinkedListNode[];
  head?: string | number;
}

// Data Structures algorithm metadata
export interface DSAlgorithmMetadata {
  id: string;
  name: string;
  category: 'sorting' | 'searching' | 'graph' | 'dynamic-programming' | 'tree';
  dataStructure: DataStructureType;
  description: string;
  timeComplexity: {
    best?: string;
    average?: string;
    worst?: string;
  };
  spaceComplexity: string;
  prerequisites?: string[];
}

// ============================================================================
// BRANCH 2: COMPUTER GRAPHICS ALGORITHMS
// ============================================================================

export type GraphicsAlgorithmType = 'line-drawing' | 'curve-generation' | 'rasterization' | 'transformation';

export interface CGAlgorithmStep extends AlgorithmStep {
  branch: 'computer-graphics';
  algorithmType: GraphicsAlgorithmType;
  state: CGVisualizationState;
}

// Canvas-based visualization state
export interface CGVisualizationState {
  canvas: CanvasCommand[];
  intermediatePoints?: Point[];
  controlPoints?: Point[];
  highlightedPoint?: Point;
  pixelGrid?: PixelData[];
}

// Canvas drawing command for serialization
export interface CanvasCommand {
  type: 'line' | 'point' | 'circle' | 'polygon' | 'pixel';
  properties: Record<string, any>;
  color?: string;
  highlighted?: boolean;
}

// 2D point
export interface Point {
  x: number;
  y: number;
  id?: string;
  type?: 'start' | 'end' | 'control' | 'intermediate';
}

// Pixel data for rasterization
export interface PixelData {
  x: number;
  y: number;
  filled: boolean;
  color?: string;
}

// Computer Graphics algorithm metadata
export interface CGAlgorithmMetadata {
  id: string;
  name: string;
  algorithmType: GraphicsAlgorithmType;
  description: string;
  applications: string[];
  complexity: {
    time?: string;
    space?: string;
  };
  prerequisites?: string[];
}

// ============================================================================
// UNIFIED ALGORITHM DEFINITIONS
// ============================================================================

export type AlgorithmType = 'data-structures' | 'computer-graphics';
export type Algorithm = DSAlgorithmStep | CGAlgorithmStep;

export interface AlgorithmDefinition {
  metadata: DSAlgorithmMetadata | CGAlgorithmMetadata;
  execute: (input: any) => Algorithm[];
  validateInput?: (input: any) => { valid: boolean; error?: string };
}

// ============================================================================
// USER INPUT TYPES
// ============================================================================

export interface AlgorithmInput {
  algorithmId: string;
  branch: AlgorithmType;
  parameters: Record<string, any>;
}

export interface DSAlgorithmInput extends AlgorithmInput {
  branch: 'data-structures';
  parameters: {
    array?: number[];
    graph?: { nodes: any[]; edges: any[] };
    tree?: any;
    linkedList?: any;
    [key: string]: any;
  };
}

export interface CGAlgorithmInput extends AlgorithmInput {
  branch: 'computer-graphics';
  parameters: {
    points?: Point[];
    controlPoints?: Point[];
    lines?: Array<{ start: Point; end: Point }>;
    canvasWidth?: number;
    canvasHeight?: number;
    [key: string]: any;
  };
}
