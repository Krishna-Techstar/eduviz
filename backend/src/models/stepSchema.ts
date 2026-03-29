import type { AlgorithmId } from "../types/algorithms.js";

/** Edge pair [from, to] for highlight (unweighted display). */
export type EdgePair = [string, string];

export interface StepHighlight {
  nodes: string[];
  edges: EdgePair[];
}

/**
 * Unified visualization step. Fields not used by an algorithm are empty defaults
 * so the frontend can rely on a stable shape.
 */
export interface VisualizationStep {
  step: number;
  type: string;
  current: string | number | null;
  visited: string[];
  queue: string[];
  stack: string[];
  /** `null` means unreachable / infinity (JSON-safe; avoids Infinity serialization). */
  distances: Record<string, number | null>;
  array: (number | string)[];
  comparing: [number, number] | null;
  treeSnapshot: unknown | null;
  highlight: StepHighlight;
  explanation: string;
}

export interface VisualizationMetadata {
  algorithm: AlgorithmId;
  totalSteps: number;
  mode?: "auto" | "manual";
  playback?: {
    durationMsPerStep?: number;
    pauseOnStepTypes?: string[];
  };
  complexity?: {
    time: string;
    space: string;
  };
}

export function emptyStep(partial: Partial<VisualizationStep>): VisualizationStep {
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
