import type { VisualizationStep } from "../models/stepSchema.js";

let seq = 0;

export function resetStepSequence(): void {
  seq = 0;
}

export function nextStepNumber(): number {
  seq += 1;
  return seq;
}

type StepInput = Partial<VisualizationStep> &
  Pick<VisualizationStep, "type"> & {
    step?: number;
  };

export function makeStep(partial: StepInput): VisualizationStep {
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
