export const ALGORITHM_IDS = [
  "bfs",
  "dfs",
  "dijkstra",
  "bubbleSort",
  "mergeSort",
  "binaryTreeTraversal",
] as const;

export type AlgorithmId = (typeof ALGORITHM_IDS)[number];

export function isAlgorithmId(v: string): v is AlgorithmId {
  return (ALGORITHM_IDS as readonly string[]).includes(v);
}
