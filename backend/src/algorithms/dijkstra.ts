import type { WeightedAdjacencyList } from "../types/graph.js";
import type { VisualizationStep } from "../models/stepSchema.js";
import { makeStep, resetStepSequence } from "../utils/stepFormatter.js";

function hl(nodes: string[], edges: [string, string][]): VisualizationStep["highlight"] {
  return { nodes, edges };
}

function dnum(d: number | null): number {
  return d === null ? Number.POSITIVE_INFINITY : d;
}

/**
 * Dijkstra's algorithm — deterministic: among equal distances, pick lexicographically smallest node.
 */
export function dijkstra(graph: WeightedAdjacencyList, source: string): VisualizationStep[] {
  resetStepSequence();
  const steps: VisualizationStep[] = [];

  if (!graph.has(source)) {
    throw new Error(`Source node "${source}" is not in the graph.`);
  }

  const nodes = [...graph.keys()].sort((a, b) => a.localeCompare(b));
  const unvisited = new Set(nodes);
  const dist: Record<string, number | null> = {};
  for (const n of nodes) dist[n] = null;
  dist[source] = 0;

  const pqOrder = (): string[] =>
    [...unvisited].sort((a, b) => {
      const da = dnum(dist[a]);
      const db = dnum(dist[b]);
      if (da !== db) return da - db;
      return a.localeCompare(b);
    });

  steps.push(
    makeStep({
      type: "init",
      current: source,
      visited: [],
      queue: pqOrder(),
      distances: { ...dist },
      explanation: `Initialize distances; only "${source}" is 0.`,
      highlight: hl([source], []),
    }),
  );

  while (unvisited.size > 0) {
    let u: string | null = null;
    let best = Number.POSITIVE_INFINITY;
    for (const n of unvisited) {
      const d = dnum(dist[n]);
      if (d < best) {
        best = d;
        u = n;
      } else if (d === best && u !== null && n.localeCompare(u) < 0) {
        u = n;
      } else if (d === best && u === null) {
        u = n;
      }
    }

    if (u === null || best === Number.POSITIVE_INFINITY) {
      steps.push(
        makeStep({
          type: "complete",
          current: null,
          visited: nodes.filter((n) => !unvisited.has(n)),
          queue: [],
          distances: { ...dist },
          explanation: "All remaining nodes are unreachable from the source.",
          highlight: hl([], []),
        }),
      );
      break;
    }

    unvisited.delete(u);

    steps.push(
      makeStep({
        type: "visit",
        current: u,
        visited: nodes.filter((n) => !unvisited.has(n)),
        queue: pqOrder(),
        distances: { ...dist },
        explanation: `Settle "${u}" with distance ${best}.`,
        highlight: hl([u], []),
      }),
    );

    for (const e of graph.get(u) ?? []) {
      if (!unvisited.has(e.to)) continue;
      const alt = dnum(dist[u]) + e.weight;
      if (alt < dnum(dist[e.to])) {
        dist[e.to] = alt;
        steps.push(
          makeStep({
            type: "relax",
            current: e.to,
            visited: nodes.filter((n) => !unvisited.has(n)),
            queue: pqOrder(),
            distances: { ...dist },
            explanation: `Relax (${u}->${e.to}): improved distance to ${alt}.`,
            highlight: hl([u, e.to], [[u, e.to]]),
          }),
        );
      }
    }
  }

  const last = steps[steps.length - 1];
  if (last?.type !== "complete") {
    steps.push(
      makeStep({
        type: "complete",
        current: null,
        visited: [...nodes],
        queue: [],
        distances: { ...dist },
        explanation: "Dijkstra finished.",
        highlight: hl(
          nodes.filter((n) => dist[n] !== null),
          [],
        ),
      }),
    );
  }

  return steps;
}
