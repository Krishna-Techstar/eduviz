import { detectAlgorithm } from "./algorithmDetector.js";
import { patternDetails } from "./patternMatcher.js";

export interface AnalyzeCodeOptions {
  language?: "cpp" | "java" | "unknown";
}

export interface AnalyzeCodeSuccess {
  algorithm: import("../types/algorithms.js").AlgorithmId;
  confidence: number;
  patterns: ReturnType<typeof patternDetails>;
}

export interface AnalyzeCodeFailure {
  error: string;
  patterns?: ReturnType<typeof patternDetails>;
}

export type AnalyzeCodeResult = AnalyzeCodeSuccess | AnalyzeCodeFailure;

/**
 * Pattern-only analysis — never executes user code.
 */
export function analyzeCode(code: string, _options: AnalyzeCodeOptions = {}): AnalyzeCodeResult {
  const patterns = patternDetails(code);
  const det = detectAlgorithm(code);
  if ("error" in det) {
    return { error: det.error, patterns };
  }
  return { algorithm: det.algorithm, confidence: det.confidence, patterns };
}
