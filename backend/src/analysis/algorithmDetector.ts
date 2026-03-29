import type { AlgorithmId } from "../types/algorithms.js";
import { scorePatterns } from "./patternMatcher.js";

const MIN_CONFIDENCE = 0.35;

export interface DetectionOk {
  algorithm: AlgorithmId;
  confidence: number;
}

export interface DetectionFail {
  error: string;
}

export type DetectionResult = DetectionOk | DetectionFail;

/**
 * Picks the best-scoring algorithm from pattern scores. Returns a structured error if ambiguous/low confidence.
 */
export function detectAlgorithm(code: string): DetectionResult {
  const trimmed = code.trim();
  if (!trimmed) {
    return { error: "Algorithm not recognized. Please select manually." };
  }

  const scores = scorePatterns(trimmed);
  const ranked = (Object.keys(scores) as AlgorithmId[])
    .map((id) => ({ id, score: scores[id] }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  const best = ranked[0];
  const second = ranked[1];

  if (!best || best.score < MIN_CONFIDENCE) {
    return { error: "Algorithm not recognized. Please select manually." };
  }

  if (second && Math.abs(best.score - second.score) < 0.08 && best.score < 0.55) {
    return { error: "Algorithm not recognized. Please select manually." };
  }

  return { algorithm: best.id, confidence: Math.min(1, Number(best.score.toFixed(2))) };
}
