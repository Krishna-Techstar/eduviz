import type { WeightedAdjacencyList } from "../types/graph.js";
export type EdgeTriple = [string, string, number];
/**
 * Builds an undirected weighted adjacency list from edge triples [u, v, w].
 * If the same undirected edge appears more than once, the minimum weight wins.
 */
export declare function edgeListToAdjacencyList(nodes: string[], edges: EdgeTriple[]): {
    graph: WeightedAdjacencyList;
    nodeSet: Set<string>;
};
//# sourceMappingURL=inputParser.d.ts.map