/** Map backend `algorithm` id to frontend AlgorithmSelector `algorithmId`. */
export function backendIdToFrontendId(backend: string): string | null {
  const m: Record<string, string> = {
    bubbleSort: "bubble-sort",
    mergeSort: "merge-sort",
    bfs: "bfs",
    dfs: "dfs",
    dijkstra: "dijkstra",
    binaryTreeTraversal: "binary-tree",
  };
  return m[backend] ?? null;
}
