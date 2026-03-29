import { DSAlgorithmStep, GraphEdge, GraphNode } from '../types';

export function generateKruskalSteps(
  nodes: GraphNode[],
  edges: GraphEdge[],
): DSAlgorithmStep[] {
  const steps: DSAlgorithmStep[] = [];
  let stepNumber = 0;

  const parent = new Map<string, string>();
  for (const n of nodes) parent.set(String(n.id), String(n.id));

  const find = (x: string): string => {
    let p = x;
    while (parent.get(p) !== p) p = parent.get(p)!;
    return p;
  };

  const union = (a: string, b: string): boolean => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    parent.set(rb, ra);
    return true;
  };

  const sorted = [...edges].sort(
    (a, b) => (a.weight ?? 1) - (b.weight ?? 1),
  );

  steps.push({
    stepNumber: stepNumber++,
    description: 'Kruskal: edges sorted by weight',
    branch: 'data-structures',
    dataStructure: 'graph',
    state: {
      graph: {
        nodes: nodes.map((n) => ({ ...n, color: 'unvisited' as const })),
        edges,
      },
    },
  });

  for (const e of sorted) {
    const u = String(e.source);
    const v = String(e.target);
    const w = e.weight ?? 1;

    steps.push({
      stepNumber: stepNumber++,
      description: `Try edge (${u}, ${v}) weight ${w}`,
      branch: 'data-structures',
      dataStructure: 'graph',
      state: {
        graph: {
          nodes: nodes.map((n) => ({
            ...n,
            color: String(n.id) === u || String(n.id) === v ? 'current' : 'unvisited',
          })),
          edges: edges.map((ed) =>
            ed.source === e.source && ed.target === e.target
              ? { ...ed, highlighted: true }
              : ed,
          ),
        },
      },
    });

    if (union(u, v)) {
      steps.push({
        stepNumber: stepNumber++,
        description: `Add to MST (connects two components)`,
        branch: 'data-structures',
        dataStructure: 'graph',
        state: {
          graph: {
            nodes: nodes.map((n) => ({ ...n, color: 'visited' as const })),
            edges: edges.map((ed) =>
              ed.source === e.source && ed.target === e.target
                ? { ...ed, highlighted: true }
                : ed,
            ),
          },
        },
      });
    } else {
      steps.push({
        stepNumber: stepNumber++,
        description: `Skip — same component (would form cycle)`,
        branch: 'data-structures',
        dataStructure: 'graph',
        state: {
          graph: {
            nodes: nodes.map((n) => ({ ...n, color: 'unvisited' as const })),
            edges,
          },
        },
      });
    }
  }

  steps.push({
    stepNumber: stepNumber++,
    description: 'Kruskal complete',
    branch: 'data-structures',
    dataStructure: 'graph',
    state: {
      graph: {
        nodes: nodes.map((n) => ({ ...n, color: 'visited' as const })),
        edges,
      },
    },
  });

  return steps;
}
