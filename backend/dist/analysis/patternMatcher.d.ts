import type { AlgorithmId } from "../types/algorithms.js";
export interface PatternScore {
    algorithm: AlgorithmId;
    /** Raw score before normalization (for debugging). */
    raw: number;
    /** 0–1 after normalization. */
    weight: number;
}
/**
 * Heuristic keyword / structure scoring. Code is never executed — plain text only.
 */
export declare function scorePatterns(code: string): Record<AlgorithmId, number>;
export declare function patternDetails(code: string): PatternScore[];
//# sourceMappingURL=patternMatcher.d.ts.map