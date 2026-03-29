import { analyzeCodeRequestSchema } from "../utils/validators.js";
import { analyzeCode } from "../analysis/codeAnalyzer.js";
export function analyzeCodeHandler(req, res) {
    const parsed = analyzeCodeRequestSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            error: "Validation failed",
            details: parsed.error.flatten(),
        });
        return;
    }
    const { code, language } = parsed.data;
    const result = analyzeCode(code, { language: language ?? "unknown" });
    if ("error" in result) {
        res.status(422).json(result);
        return;
    }
    res.json({
        algorithm: result.algorithm,
        confidence: result.confidence,
        patterns: result.patterns,
    });
}
//# sourceMappingURL=analyzeController.js.map