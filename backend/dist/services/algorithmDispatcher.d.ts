import type { AlgorithmId } from "../types/algorithms.js";
import type { WeightedAdjacencyList } from "../types/graph.js";
import type { BinaryTreeNode } from "../types/tree.js";
import type { VisualizationStep } from "../models/stepSchema.js";
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
export type EngineInput = ({
    algorithm: "bfs";
} & GraphStartInput) | ({
    algorithm: "dfs";
} & GraphStartInput) | ({
    algorithm: "dijkstra";
} & DijkstraInput) | ({
    algorithm: "bubbleSort";
} & SortInput) | ({
    algorithm: "mergeSort";
} & SortInput) | ({
    algorithm: "binaryTreeTraversal";
} & TreeInput);
export declare function runAlgorithm(type: AlgorithmId, input: unknown): VisualizationStep[];
export declare const COMPLEXITY: Record<AlgorithmId, {
    time: string;
    space: string;
}>;
//# sourceMappingURL=algorithmDispatcher.d.ts.map