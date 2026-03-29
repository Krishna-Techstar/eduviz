/** Mirrors backend visualization step JSON (subset used by the UI). */

export interface BackendHighlight {
  nodes: string[];
  edges: [string, string][];
}

export interface BackendVisualizationStep {
  step: number;
  type: string;
  current: string | number | null;
  visited: string[];
  queue: string[];
  stack: string[];
  distances: Record<string, number | null>;
  array: (number | string)[];
  comparing: [number, number] | null;
  treeSnapshot: unknown | null;
  highlight: BackendHighlight;
  explanation: string;
}

export interface VisualizeMetadata {
  algorithm: string;
  totalSteps: number;
  mode?: string;
  playback?: { durationMsPerStep?: number; pauseOnStepTypes?: string[] };
  complexity?: { time: string; space: string };
}

export interface VisualizeResponse {
  steps: BackendVisualizationStep[];
  metadata: VisualizeMetadata;
}

/** Passed to the page when a run completes via the API. */
export interface VisualizeRunMeta {
  algorithm: string;
  totalSteps: number;
  complexity?: { time: string; space: string };
}

export interface VisualizeRequestBody {
  algorithm: string;
  input: Record<string, unknown>;
  mode?: "auto" | "manual";
  playback?: { durationMsPerStep?: number; pauseOnStepTypes?: string[] };
}
