import { makeStep, resetStepSequence } from "../utils/stepFormatter.js";
function hl(nodes, edges) {
    return { nodes, edges };
}
/**
 * Iterative DFS using an explicit stack (deterministic: neighbors sorted descending for stack push order).
 */
export function dfs(graph, start) {
    resetStepSequence();
    const steps = [];
    if (!graph.has(start)) {
        throw new Error(`Start node "${start}" is not in the graph.`);
    }
    const visited = new Set();
    const stack = [start];
    steps.push(makeStep({
        type: "init",
        current: start,
        visited: [],
        stack: [...stack],
        explanation: `Initialize DFS from "${start}".`,
        highlight: hl([start], []),
    }));
    while (stack.length > 0) {
        const u = stack.pop();
        if (visited.has(u)) {
            steps.push(makeStep({
                type: "skip",
                current: u,
                visited: [...visited],
                stack: [...stack],
                explanation: `Skip "${u}" — already visited.`,
                highlight: hl([u], []),
            }));
            continue;
        }
        visited.add(u);
        const neighbors = (graph.get(u) ?? [])
            .map((e) => e.to)
            .sort((a, b) => b.localeCompare(a));
        steps.push(makeStep({
            type: "visit",
            current: u,
            visited: [...visited],
            stack: [...stack],
            explanation: `Visit "${u}" and push unvisited neighbors onto the stack.`,
            highlight: hl([u], []),
        }));
        for (const v of neighbors) {
            if (!visited.has(v)) {
                stack.push(v);
                steps.push(makeStep({
                    type: "push",
                    current: v,
                    visited: [...visited],
                    stack: [...stack],
                    explanation: `Push neighbor "${v}" from "${u}".`,
                    highlight: hl([u, v], [[u, v]]),
                }));
            }
        }
    }
    steps.push(makeStep({
        type: "complete",
        current: null,
        visited: [...visited],
        stack: [],
        explanation: "DFS complete.",
        highlight: hl([...visited], []),
    }));
    return steps;
}
//# sourceMappingURL=dfs.js.map