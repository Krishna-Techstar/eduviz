let seq = 0;
export function resetStepSequence() {
    seq = 0;
}
export function nextStepNumber() {
    seq += 1;
    return seq;
}
export function makeStep(partial) {
    const step = partial.step ?? nextStepNumber();
    return {
        step,
        type: partial.type,
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
//# sourceMappingURL=stepFormatter.js.map