import type { BackendVisualizationStep } from "./types";
import type {
  DSAlgorithmStep,
  DSEngineSnapshot,
  GraphEdge,
  GraphNode,
  TreeNode,
} from "@/lib/algorithms/types";

export type GraphContext = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

function toSnapshot(s: BackendVisualizationStep): DSEngineSnapshot {
  return {
    stepType: s.type,
    current: s.current,
    visited: s.visited.map(String),
    queue: s.queue.map(String),
    stack: s.stack.map(String),
    distances: s.distances,
    array: s.array,
    comparing: s.comparing,
    explanation: s.explanation,
    highlightNodes: s.highlight.nodes.map(String),
    highlightEdges: s.highlight.edges.map(([a, b]) => [String(a), String(b)]),
  };
}

function toNumArray(arr: (number | string)[]): number[] {
  return arr.map((x) => (typeof x === "number" ? x : Number(x)));
}

export function mapSortSteps(
  steps: BackendVisualizationStep[],
  algorithmLabel: string,
): DSAlgorithmStep[] {
  return steps.map((s, idx) => {
    const values = toNumArray(s.array.length ? s.array : [0]);
    const hi: number[] = [];
    if (s.comparing) {
      hi.push(s.comparing[0], s.comparing[1]);
    }
    return {
      stepNumber: idx,
      description: s.explanation || `${algorithmLabel} — ${s.type}`,
      branch: "data-structures",
      dataStructure: "array",
      engineSnapshot: toSnapshot(s),
      state: {
        arrays: [
          {
            id: "main",
            values,
            highlightedIndices: [...new Set(hi)].filter((i) => i >= 0 && i < values.length),
          },
        ],
        highlightedIndices: [...new Set(hi)],
      },
    };
  });
}

export function mapGraphSteps(
  steps: BackendVisualizationStep[],
  ctx: GraphContext,
  algorithm: string,
  algorithmLabel: string,
): DSAlgorithmStep[] {
  const { nodes: baseNodes, edges: baseEdges } = ctx;

  const fringeMode: "queue" | "stack" | "none" =
    algorithm === "bfs" ? "queue" : algorithm === "dfs" ? "stack" : "none";

  return steps.map((s, idx) => {
    const visited = new Set(s.visited.map(String));
    const cur = s.current != null ? String(s.current) : null;

    const nodes: GraphNode[] = baseNodes.map((n) => {
      const id = String(n.id);
      let color: GraphNode["color"] = "unvisited";
      if (cur === id) color = "current";
      else if (visited.has(id)) color = "visited";
      return {
        ...n,
        visited: visited.has(id),
        color,
        distance:
          s.distances[id] != null && s.distances[id] !== undefined
            ? (s.distances[id] as number)
            : undefined,
      };
    });

    const highlightedEdges: GraphEdge[] = s.highlight.edges.map(([a, b]) => {
      const w =
        baseEdges.find(
          (e) =>
            (String(e.source) === a && String(e.target) === b) ||
            (String(e.source) === b && String(e.target) === a),
        )?.weight ?? 1;
      return { source: a, target: b, weight: w, highlighted: true };
    });

    return {
      stepNumber: idx,
      description: s.explanation || `${algorithmLabel} — ${s.type}`,
      branch: "data-structures",
      dataStructure: "graph",
      engineSnapshot: toSnapshot(s),
      state: {
        graph: {
          nodes,
          edges: baseEdges,
          queue: s.queue.map(String),
          stack: s.stack.map(String),
          highlightedEdges,
          fringeMode,
        },
        highlightedNodes: s.highlight.nodes.map(String),
      },
    };
  });
}

function snapshotToTreeNode(node: unknown, path = "r"): TreeNode | undefined {
  if (node === null || node === undefined) return undefined;
  if (typeof node !== "object") return undefined;
  const o = node as Record<string, unknown>;
  const val = o.val ?? o.value;
  return {
    id: path,
    value: val as string | number,
    left: o.left ? snapshotToTreeNode(o.left, `${path}L`) : undefined,
    right: o.right ? snapshotToTreeNode(o.right, `${path}R`) : undefined,
    visited: false,
  };
}

export function mapTreeSteps(
  steps: BackendVisualizationStep[],
  algorithmLabel: string,
): DSAlgorithmStep[] {
  return steps.map((s, idx) => {
    const snap = s.treeSnapshot ?? null;
    const root = snapshotToTreeNode(snap);
    const cur = s.current != null ? String(s.current) : null;

    const markVisited = (n: TreeNode | undefined): TreeNode | undefined => {
      if (!n) return undefined;
      const isCur = cur != null && String(n.value) === cur;
      return {
        ...n,
        visited: isCur || n.visited,
        left: markVisited(n.left),
        right: markVisited(n.right),
      };
    };

    return {
      stepNumber: idx,
      description: s.explanation || `${algorithmLabel} — ${s.type}`,
      branch: "data-structures",
      dataStructure: "tree",
      engineSnapshot: toSnapshot(s),
      state: {
        tree: {
          root: root ? markVisited(root) : undefined,
          highlightedNodes: s.highlight.nodes,
        },
      },
    };
  });
}

export function mapBackendSteps(
  steps: BackendVisualizationStep[],
  algorithm: string,
  graphCtx: GraphContext | null,
): DSAlgorithmStep[] {
  const label =
    algorithm === "bubbleSort"
      ? "Bubble sort"
      : algorithm === "mergeSort"
        ? "Merge sort"
        : algorithm === "bfs"
          ? "BFS"
          : algorithm === "dfs"
            ? "DFS"
            : algorithm === "dijkstra"
              ? "Dijkstra"
              : algorithm === "binaryTreeTraversal"
                ? "Binary tree traversal"
                : algorithm;

  if (algorithm === "bubbleSort" || algorithm === "mergeSort") {
    return mapSortSteps(steps, label);
  }

  if (algorithm === "bfs" || algorithm === "dfs" || algorithm === "dijkstra") {
    if (!graphCtx) {
      throw new Error("Graph context is required for this algorithm.");
    }
    return mapGraphSteps(steps, graphCtx, algorithm, label);
  }

  if (algorithm === "binaryTreeTraversal") {
    return mapTreeSteps(steps, label);
  }

  throw new Error(`Unsupported algorithm for mapping: ${algorithm}`);
}
