import { z } from "zod";
export declare const visualizeRequestSchema: z.ZodEffects<z.ZodObject<{
    algorithm: z.ZodEnum<["bfs", "dfs", "dijkstra", "bubbleSort", "mergeSort", "binaryTreeTraversal"]>;
    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    mode: z.ZodOptional<z.ZodEnum<["auto", "manual"]>>;
    playback: z.ZodOptional<z.ZodObject<{
        durationMsPerStep: z.ZodOptional<z.ZodNumber>;
        pauseOnStepTypes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        durationMsPerStep?: number | undefined;
        pauseOnStepTypes?: string[] | undefined;
    }, {
        durationMsPerStep?: number | undefined;
        pauseOnStepTypes?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    algorithm: "bfs" | "dfs" | "dijkstra" | "bubbleSort" | "mergeSort" | "binaryTreeTraversal";
    input: Record<string, unknown>;
    mode?: "auto" | "manual" | undefined;
    playback?: {
        durationMsPerStep?: number | undefined;
        pauseOnStepTypes?: string[] | undefined;
    } | undefined;
}, {
    algorithm: "bfs" | "dfs" | "dijkstra" | "bubbleSort" | "mergeSort" | "binaryTreeTraversal";
    input: Record<string, unknown>;
    mode?: "auto" | "manual" | undefined;
    playback?: {
        durationMsPerStep?: number | undefined;
        pauseOnStepTypes?: string[] | undefined;
    } | undefined;
}>, {
    algorithm: "bfs" | "dfs" | "dijkstra" | "bubbleSort" | "mergeSort" | "binaryTreeTraversal";
    input: Record<string, unknown>;
    mode?: "auto" | "manual" | undefined;
    playback?: {
        durationMsPerStep?: number | undefined;
        pauseOnStepTypes?: string[] | undefined;
    } | undefined;
}, {
    algorithm: "bfs" | "dfs" | "dijkstra" | "bubbleSort" | "mergeSort" | "binaryTreeTraversal";
    input: Record<string, unknown>;
    mode?: "auto" | "manual" | undefined;
    playback?: {
        durationMsPerStep?: number | undefined;
        pauseOnStepTypes?: string[] | undefined;
    } | undefined;
}>;
export type VisualizeRequest = z.infer<typeof visualizeRequestSchema>;
export declare const analyzeCodeRequestSchema: z.ZodObject<{
    code: z.ZodString;
    language: z.ZodOptional<z.ZodEnum<["cpp", "java", "unknown"]>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    language?: "cpp" | "java" | "unknown" | undefined;
}, {
    code: string;
    language?: "cpp" | "java" | "unknown" | undefined;
}>;
//# sourceMappingURL=validators.d.ts.map