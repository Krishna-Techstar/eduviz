/**
 * Builds an undirected weighted adjacency list from edge triples [u, v, w].
 * If the same undirected edge appears more than once, the minimum weight wins.
 */
export function edgeListToAdjacencyList(nodes, edges) {
    const nodeSet = new Set(nodes);
    const graph = new Map();
    for (const id of nodes) {
        graph.set(id, []);
    }
    const upsert = (u, v, w) => {
        const list = graph.get(u);
        const ex = list.find((e) => e.to === v);
        if (!ex)
            list.push({ to: v, weight: w });
        else if (w < ex.weight)
            ex.weight = w;
    };
    for (const [a, b, w] of edges) {
        if (!nodeSet.has(a)) {
            throw new Error(`Edge references unknown node "${a}".`);
        }
        if (!nodeSet.has(b)) {
            throw new Error(`Edge references unknown node "${b}".`);
        }
        if (!Number.isFinite(w)) {
            throw new Error(`Invalid weight between "${a}" and "${b}": must be a finite number.`);
        }
        upsert(a, b, w);
        upsert(b, a, w);
    }
    return { graph, nodeSet };
}
//# sourceMappingURL=inputParser.js.map