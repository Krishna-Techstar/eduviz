import { makeStep, resetStepSequence } from "../utils/stepFormatter.js";
function hl(nodes, edges) {
    return { nodes, edges };
}
/**
 * BFS on an unweighted graph (edge weights ignored for traversal order).
 */
export function bfs(graph, start) {
    resetStepSequence();
    const steps = [];
    if (!graph.has(start)) {
        throw new Error(`Start node "${start}" is not in the graph.`);
    }
    const visited = new Set();
    const queue = [start];
    steps.push(makeStep({
        type: "init",
        current: start,
        visited: [],
        queue: [...queue],
        explanation: `Initialize BFS from "${start}".`,
        highlight: hl([start], []),
    }));
    while (queue.length > 0) {
        const u = queue.shift();
        if (visited.has(u)) {
            continue;
        }
        visited.add(u);
        const neighbors = (graph.get(u) ?? [])
            .map((e) => e.to)
            .sort((a, b) => a.localeCompare(b));
        steps.push(makeStep({
            type: "visit",
            current: u,
            visited: [...visited],
            queue: [...queue],
            explanation: `Visit "${u}" and enqueue unvisited neighbors.`,
            highlight: hl([u], []),
        }));
        for (const v of neighbors) {
            if (!visited.has(v) && !queue.includes(v)) {
                queue.push(v);
                steps.push(makeStep({
                    type: "enqueue",
                    current: v,
                    visited: [...visited],
                    queue: [...queue],
                    explanation: `Enqueue neighbor "${v}" from "${u}".`,
                    highlight: hl([u, v], [[u, v]]),
                }));
            }
        }
    }
    steps.push(makeStep({
        type: "complete",
        current: null,
        visited: [...visited],
        queue: [],
        explanation: "BFS complete.",
        highlight: hl([...visited], []),
    }));
    return steps;
}
//# sourceMappingURL=bfs.js.map