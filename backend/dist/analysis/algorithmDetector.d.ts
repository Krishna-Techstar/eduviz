import type { AlgorithmId } from "../types/algorithms.js";
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
export declare function detectAlgorithm(code: string): DetectionResult;
//# sourceMappingURL=algorithmDetector.d.ts.map