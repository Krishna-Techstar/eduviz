import type { Request, Response } from "express";
import { visualizeRequestSchema } from "../utils/validators.js";
import { edgeListToAdjacencyList } from "../utils/inputParser.js";
import { COMPLEXITY, runAlgorithm } from "../services/algorithmDispatcher.js";
import type { AlgorithmId } from "../types/algorithms.js";
import type { VisualizationMetadata } from "../models/stepSchema.js";

function buildEngineInput(algorithm: AlgorithmId, raw: Record<string, unknown>) {
  switch (algorithm) {
    case "bfs":
    case "dfs": {
      const nodes = raw.nodes as string[];
      const edges = raw.edges as [string, string, number][];
      const start = (raw.start ?? raw.source) as string;
      const { graph } = edgeListToAdjacencyList(nodes, edges);
      return { graph, start };
    }
    case "dijkstra": {
      const nodes = raw.nodes as string[];
      const edges = raw.edges as [string, string, number][];
      const source = (raw.source ?? raw.start) as string;
      const { graph } = edgeListToAdjacencyList(nodes, edges);
      return { graph, source };
    }
    case "bubbleSort":
    case "mergeSort": {
      return { array: raw.array as (number | string)[] };
    }
    case "binaryTreeTraversal": {
      return {
        tree: raw.tree as import("../types/tree.js").BinaryTreeNode,
        order: raw.order as "inorder" | "preorder" | "postorder" | undefined,
      };
    }
    default: {
      const _x: never = algorithm;
      throw new Error(`Unhandled algorithm: ${_x}`);
    }
  }
}

export function visualizeHandler(req: Request, res: Response): void {
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

    const metadata: VisualizationMetadata = {
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
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    res.status(400).json({ error: message });
  }
}
