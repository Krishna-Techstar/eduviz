import type { WeightedAdjacencyList } from "../types/graph.js";
import type { VisualizationStep } from "../models/stepSchema.js";
/**
 * Dijkstra's algorithm — deterministic: among equal distances, pick lexicographically smallest node.
 */
export declare function dijkstra(graph: WeightedAdjacencyList, source: string): VisualizationStep[];
//# sourceMappingURL=dijkstra.d.ts.map