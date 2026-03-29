import type { AlgorithmId } from "../types/algorithms.js";

export interface PatternScore {
  algorithm: AlgorithmId;
  /** Raw score before normalization (for debugging). */
  raw: number;
  /** 0–1 after normalization. */
  weight: number;
}

const norm = (scores: Record<AlgorithmId, number>): Record<AlgorithmId, number> => {
  const vals = Object.values(scores);
  const max = Math.max(...vals, 1e-9);
  const out = { ...scores };
  for (const k of Object.keys(out) as AlgorithmId[]) {
    out[k] = out[k] / max;
  }
  return out;
};

/**
 * Heuristic keyword / structure scoring. Code is never executed — plain text only.
 */
export function scorePatterns(code: string): Record<AlgorithmId, number> {
  const c = code.toLowerCase();

  const scores: Record<AlgorithmId, number> = {
    bfs: 0,
    dfs: 0,
    dijkstra: 0,
    bubbleSort: 0,
    mergeSort: 0,
    binaryTreeTraversal: 0,
  };

  // BFS — queue + neighbor exploration
  if (/\bqueue\b/.test(c)) scores.bfs += 2;
  if (/\b(bfs|breadth)\b/.test(c)) scores.bfs += 3;
  if (/\b(enqueue|push\s*\(|\.push\b)/.test(c)) scores.bfs += 1;
  if (/\bneighbor|adjacent|adj\[/.test(c)) scores.bfs += 1;
  if (/\bwhile\s*\(\s*!\s*queue\./.test(c) || /\bwhile\s*\(\s*!q\./.test(c)) scores.bfs += 1;

  // DFS — stack or recursion depth
  if (/\bstack\b/.test(c)) scores.dfs += 2;
  if (/\b(dfs|depth)\b/.test(c)) scores.dfs += 3;
  if (/\brecursive\b|\bvoid\s+\w+\s*\([^)]*\)\s*\{[^}]*\w+\s*\(/.test(c)) scores.dfs += 1;
  if (/\bpop\s*\(/.test(c) && /\bpush\s*\(/.test(c)) scores.dfs += 1;

  // Dijkstra — priority queue + distance relaxation
  if (/\bpriority_queue\b/.test(code) || /\bPriorityQueue\b/.test(code)) scores.dijkstra += 3;
  if (/\bdijkstra\b/.test(c)) scores.dijkstra += 4;
  if (/\bdist\[|\bdistance\b|\bdis\[/.test(c)) scores.dijkstra += 2;
  if (/\brelax\b/.test(c)) scores.dijkstra += 1;

  // Bubble sort — nested loops + swap
  if (/\bbubble\b/.test(c)) scores.bubbleSort += 4;
  if (/for\s*\([^)]*for\s*\(/.test(c)) scores.bubbleSort += 1;
  if (/\bswap\s*\(/.test(c) || /\bstd::swap\b/.test(code)) scores.bubbleSort += 1;

  // Merge sort — divide & conquer
  if (/\bmerge\s*sort\b/.test(c) || /\bmergesort\b/.test(c)) scores.mergeSort += 4;
  if (/\bmerge\s*\(/.test(c) && /\bmid\b/.test(c)) scores.mergeSort += 2;
  if (/\bdivide\b/.test(c) && /\bconquer\b/.test(c)) scores.mergeSort += 1;

  // Tree traversals
  if (/\b(inorder|preorder|postorder)\b/.test(c)) scores.binaryTreeTraversal += 3;
  if (/\bstruct\s+tree|class\s+tree|treenode|binarytree/i.test(code)) scores.binaryTreeTraversal += 1;
  if (/\bleft\b/.test(c) && /\bright\b/.test(c) && /\bval\b/.test(c)) scores.binaryTreeTraversal += 1;

  return norm(scores);
}

export function patternDetails(code: string): PatternScore[] {
  const scores = scorePatterns(code);
  return (Object.keys(scores) as AlgorithmId[]).map((algorithm) => ({
    algorithm,
    raw: scores[algorithm],
    weight: scores[algorithm],
  }));
}
