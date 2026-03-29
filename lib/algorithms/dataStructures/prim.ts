import { DSAlgorithmStep, GraphEdge, GraphNode } from '../types';

export function generatePrimSteps(
  nodes: GraphNode[],
  edges: GraphEdge[],
  start: string | number,
): DSAlgorithmStep[] {
  const steps: DSAlgorithmStep[] = [];
  let stepNumber = 0;
  const startId = String(start);
  const inTree = new Set<string>([startId]);

  steps.push({
    stepNumber: stepNumber++,
    description: `Prim: start from ${startId}`,
    branch: 'data-structures',
    dataStructure: 'graph',
    state: {
      graph: {
        nodes: nodes.map((n) => ({
          ...n,
          color: String(n.id) === startId ? 'current' : 'unvisited',
        })),
        edges,
      },
    },
  });

  while (inTree.size < nodes.length) {
    let best: GraphEdge | null = null;
    let bestW = Infinity;

    for (const e of edges) {
      const u = String(e.source);
      const v = String(e.target);
      const w = typeof e.weight === 'number' ? e.weight : 1;
      const uIn = inTree.has(u);
      const vIn = inTree.has(v);
      if (uIn === vIn) continue;
      if (w < bestW) {
        bestW = w;
        best = e;
      }
    }

    if (!best) break;

    const u = String(best.source);
    const v = String(best.target);
    const add = inTree.has(u) ? v : u;
    inTree.add(add);

    steps.push({
      stepNumber: stepNumber++,
      description: `Add cheapest edge (${u}, ${v}) weight ${bestW} → include ${add}`,
      branch: 'data-structures',
      dataStructure: 'graph',
      state: {
        graph: {
          nodes: nodes.map((n) => ({
            ...n,
            color: inTree.has(String(n.id)) ? 'visited' : 'unvisited',
          })),
          edges: edges.map((ed) =>
            ed.source === best!.source && ed.target === best!.target
              ? { ...ed, highlighted: true }
              : ed,
          ),
        },
      },
    });
  }

  steps.push({
    stepNumber: stepNumber++,
    description: 'Prim MST complete',
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
