export function emptyStep(partial) {
    return {
        step: partial.step ?? 0,
        type: partial.type ?? "state",
        current: partial.current ?? null,
        visited: partial.visited ?? [],
        queue: partial.queue ?? [],
        stack: partial.stack ?? [],
        distances: partial.distances ?? {},
        array: partial.array ?? [],
        comparing: partial.comparing ?? null,
        treeSnapshot: partial.treeSnapshot ?? null,
        highlight: partial.highlight ?? { nodes: [], edges: [] },
        explanation: partial.explanation ?? "",
    };
}
//# sourceMappingURL=stepSchema.js.map