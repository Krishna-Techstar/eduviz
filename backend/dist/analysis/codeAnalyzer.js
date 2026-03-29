import { detectAlgorithm } from "./algorithmDetector.js";
import { patternDetails } from "./patternMatcher.js";
/**
 * Pattern-only analysis — never executes user code.
 */
export function analyzeCode(code, _options = {}) {
    const patterns = patternDetails(code);
    const det = detectAlgorithm(code);
    if ("error" in det) {
        return { error: det.error, patterns };
    }
    return { algorithm: det.algorithm, confidence: det.confidence, patterns };
}
//# sourceMappingURL=codeAnalyzer.js.map