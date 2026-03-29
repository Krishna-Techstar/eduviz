import type { AlgorithmId } from "../types/algorithms.js";
import type { WeightedAdjacencyList } from "../types/graph.js";
import type { BinaryTreeNode } from "../types/tree.js";
import type { VisualizationStep } from "../models/stepSchema.js";
import { bfs } from "../algorithms/bfs.js";
import { dfs } from "../algorithms/dfs.js";
import { dijkstra } from "../algorithms/dijkstra.js";
import { bubbleSort, mergeSort } from "../algorithms/sorting.js";
import { binaryTreeTraversal } from "../algorithms/binaryTreeTraversal.js";

export interface GraphStartInput {
  graph: WeightedAdjacencyList;
  start: string;
}

export interface DijkstraInput {
  graph: WeightedAdjacencyList;
  source: string;
}

export interface SortInput {
  array: (number | string)[];
}

export interface TreeInput {
  tree: BinaryTreeNode;
  order?: "inorder" | "preorder" | "postorder";
}

export type EngineInput =
  | ({ algorithm: "bfs" } & GraphStartInput)
  | ({ algorithm: "dfs" } & GraphStartInput)
  | ({ algorithm: "dijkstra" } & DijkstraInput)
  | ({ algorithm: "bubbleSort" } & SortInput)
  | ({ algorithm: "mergeSort" } & SortInput)
  | ({ algorithm: "binaryTreeTraversal" } & TreeInput);

export function runAlgorithm(type: AlgorithmId, input: unknown): VisualizationStep[] {
  switch (type) {
    case "bfs": {
      const g = input as GraphStartInput;
      return bfs(g.graph, g.start);
    }
    case "dfs": {
      const g = input as GraphStartInput;
      return dfs(g.graph, g.start);
    }
    case "dijkstra": {
      const g = input as DijkstraInput;
      return dijkstra(g.graph, g.source);
    }
    case "bubbleSort": {
      const s = input as SortInput;
      return bubbleSort(s.array);
    }
    case "mergeSort": {
      const s = input as SortInput;
      return mergeSort(s.array);
    }
    case "binaryTreeTraversal": {
      const t = input as TreeInput;
      return binaryTreeTraversal(t.tree, t.order);
    }
    default: {
      const _exhaustive: never = type;
      throw new Error(`Unsupported algorithm: ${_exhaustive}`);
    }
  }
}

export const COMPLEXITY: Record<
  AlgorithmId,
  { time: string; space: string }
> = {
  bfs: { time: "O(V + E)", space: "O(V)" },
  dfs: { time: "O(V + E)", space: "O(V)" },
  dijkstra: { time: "O(V^2) (this engine)", space: "O(V)" },
  bubbleSort: { time: "O(n²)", space: "O(1)" },
  mergeSort: { time: "O(n log n)", space: "O(n)" },
  binaryTreeTraversal: { time: "O(n)", space: "O(h)" },
};
