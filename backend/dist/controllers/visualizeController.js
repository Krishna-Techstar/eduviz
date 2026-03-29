import { visualizeRequestSchema } from "../utils/validators.js";
import { edgeListToAdjacencyList } from "../utils/inputParser.js";
import { COMPLEXITY, runAlgorithm } from "../services/algorithmDispatcher.js";
function buildEngineInput(algorithm, raw) {
    switch (algorithm) {
        case "bfs":
        case "dfs": {
            const nodes = raw.nodes;
            const edges = raw.edges;
            const start = (raw.start ?? raw.source);
            const { graph } = edgeListToAdjacencyList(nodes, edges);
            return { graph, start };
        }
        case "dijkstra": {
            const nodes = raw.nodes;
            const edges = raw.edges;
            const source = (raw.source ?? raw.start);
            const { graph } = edgeListToAdjacencyList(nodes, edges);
            return { graph, source };
        }
        case "bubbleSort":
        case "mergeSort": {
            return { array: raw.array };
        }
        case "binaryTreeTraversal": {
            return {
                tree: raw.tree,
                order: raw.order,
            };
        }
        default: {
            const _x = algorithm;
            throw new Error(`Unhandled algorithm: ${_x}`);
        }
    }
}
export function visualizeHandler(req, res) {
    const parsed = visualizeRequestSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            error: "Validation failed",
            details: parsed.error.flatten(),
        });
        return;
    }
    const { algorithm, input, mode, playback } = parsed.data;
    try {
        const engineInput = buildEngineInput(algorithm, input);
        const steps = runAlgorithm(algorithm, engineInput);
        const metadata = {
            algorithm,
            totalSteps: steps.length,
            mode,
            playback: playback
                ? {
                    durationMsPerStep: playback.durationMsPerStep,
                    pauseOnStepTypes: playback.pauseOnStepTypes,
                }
                : undefined,
            complexity: COMPLEXITY[algorithm],
        };
        res.json({ steps, metadata });
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        res.status(400).json({ error: message });
    }
}
//# sourceMappingURL=visualizeController.js.map