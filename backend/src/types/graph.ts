export interface WeightedEdge {
  to: string;
  weight: number;
}

/** Adjacency list: node id -> outgoing weighted edges */
export type WeightedAdjacencyList = Map<string, WeightedEdge[]>;
