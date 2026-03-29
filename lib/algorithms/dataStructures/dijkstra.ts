import { DSAlgorithmStep, GraphEdge, GraphNode } from '../types';

function buildAdj(
  nodes: GraphNode[],
  edges: GraphEdge[],
): Map<string, Array<{ to: string; w: number }>> {
  const m = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of nodes) m.set(String(n.id), []);
  for (const e of edges) {
    const w = typeof e.weight === 'number' ? e.weight : 1;
    const s = String(e.source);
    const t = String(e.target);
    m.get(s)!.push({ to: t, w });
    m.get(t)!.push({ to: s, w });
  }
  return m;
}

export function generateDijkstraSteps(
  nodes: GraphNode[],
  edges: GraphEdge[],
  source: string | number,
): DSAlgorithmStep[] {
  const steps: DSAlgorithmStep[] = [];
  let stepNumber = 0;
  const src = String(source);
  const ids = nodes.map((n) => String(n.id));
  const adj = buildAdj(nodes, edges);

  const dist: Record<string, number> = {};
  for (const id of ids) dist[id] = Infinity;
  dist[src] = 0;

  const unvisited = new Set(ids);

  const colorNodes = (current: string | null, visited: Set<string>) =>
    nodes.map((n) => {
      const id = String(n.id);
      let color: GraphNode['color'] = 'unvisited';
      if (current === id) color = 'current';
      else if (visited.has(id)) color = 'visited';
      return {
        ...n,
        visited: visited.has(id),
        color,
        distance: dist[id] === Infinity ? undefined : dist[id],
      };
    });

  const visited = new Set<string>();

  steps.push({
    stepNumber: stepNumber++,
    description: `Initialize: dist[${src}] = 0`,
    branch: 'data-structures',
    dataStructure: 'graph',
    state: {
      graph: {
        nodes: colorNodes(null, visited),
        edges,
      },
    },
  });

  while (unvisited.size > 0) {
    let u: string | null = null;
    let best = Infinity;
    for (const id of unvisited) {
      const d = dist[id];
      if (d < best) {
        best = d;
        u = id;
      } else if (d === best && u !== null && id.localeCompare(u) < 0) {
        u = id;
      } else if (d === best && u === null) {
        u = id;
      }
    }
    if (u === null || best === Infinity) break;

    unvisited.delete(u);
    visited.add(u);

    steps.push({
      stepNumber: stepNumber++,
      description: `Settle ${u} with distance ${best}`,
      branch: 'data-structures',
      dataStructure: 'graph',
      state: {
        graph: {
          nodes: colorNodes(u, visited),
          edges,
        },
      },
    });

    for (const { to, w } of adj.get(u) ?? []) {
      if (!unvisited.has(to)) continue;
      const alt = dist[u] + w;
      if (alt < dist[to]) {
        dist[to] = alt;
        steps.push({
          stepNumber: stepNumber++,
          description: `Relax edge ${u}→${to}: new dist ${alt}`,
          branch: 'data-structures',
          dataStructure: 'graph',
          state: {
            graph: {
              nodes: colorNodes(u, visited),
              edges: edges.map((e) => {
                const hs =
                  (String(e.source) === u && String(e.target) === to) ||
                  (String(e.source) === to && String(e.target) === u);
                return hs ? { ...e, highlighted: true } : e;
              }),
            },
          },
        });
      }
    }
  }

  steps.push({
    stepNumber: stepNumber++,
    description: 'Dijkstra complete',
    branch: 'data-structures',
    dataStructure: 'graph',
    state: {
      graph: {
        nodes: colorNodes(null, visited),
        edges,
      },
    },
  });

  return steps;
}
