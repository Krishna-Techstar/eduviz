import type { WeightedAdjacencyList } from "../types/graph.js";
import type { VisualizationStep } from "../models/stepSchema.js";
/**
 * Iterative DFS using an explicit stack (deterministic: neighbors sorted descending for stack push order).
 */
export declare function dfs(graph: WeightedAdjacencyList, start: string): VisualizationStep[];
//# sourceMappingURL=dfs.d.ts.map