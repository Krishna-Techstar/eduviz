import { z } from "zod";
const algorithmSchema = z.enum([
    "bfs",
    "dfs",
    "dijkstra",
    "bubbleSort",
    "mergeSort",
    "binaryTreeTraversal",
]);
const edgeTriple = z.tuple([z.string(), z.string(), z.number()]);
const graphInput = z.object({
    nodes: z.array(z.string()).min(1, "At least one node is required."),
    edges: z.array(edgeTriple),
    source: z.string().optional(),
    start: z.string().optional(),
});
const sortInput = z.object({
    array: z.array(z.union([z.number(), z.string()])).min(1),
});
function validateTreeNode(x, depth = 0) {
    if (depth > 500)
        return false;
    if (x === null || x === undefined)
        return false;
    if (typeof x !== "object")
        return false;
    const o = x;
    if (!("val" in o))
        return false;
    const v = o.val;
    if (typeof v !== "number" && typeof v !== "string")
        return false;
    if (o.left !== undefined && o.left !== null && !validateTreeNode(o.left, depth + 1))
        return false;
    if (o.right !== undefined && o.right !== null && !validateTreeNode(o.right, depth + 1))
        return false;
    return true;
}
const treeInput = z
    .object({
    tree: z.unknown(),
    order: z.enum(["inorder", "preorder", "postorder"]).optional(),
})
    .superRefine((data, ctx) => {
    if (!validateTreeNode(data.tree)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid binary tree: expected objects with val and optional left/right.",
            path: ["tree"],
        });
    }
});
export const visualizeRequestSchema = z
    .object({
    algorithm: algorithmSchema,
    input: z.record(z.unknown()),
    mode: z.enum(["auto", "manual"]).optional(),
    playback: z
        .object({
        durationMsPerStep: z.number().positive().optional(),
        pauseOnStepTypes: z.array(z.string()).optional(),
    })
        .optional(),
})
    .superRefine((data, ctx) => {
    const { algorithm, input } = data;
    if (algorithm === "bfs" || algorithm === "dfs") {
        const p = graphInput.safeParse(input);
        if (!p.success) {
            p.error.issues.forEach((i) => ctx.addIssue({ ...i, path: ["input", ...i.path] }));
            return;
        }
        const start = p.data.start ?? p.data.source;
        if (!start) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Missing "start" (or "source") for graph traversal.',
                path: ["input"],
            });
        }
        if (start && !p.data.nodes.includes(start)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Start node "${start}" is not in nodes.`,
                path: ["input", "start"],
            });
        }
    }
    else if (algorithm === "dijkstra") {
        const p = graphInput.safeParse(input);
        if (!p.success) {
            p.error.issues.forEach((i) => ctx.addIssue({ ...i, path: ["input", ...i.path] }));
            return;
        }
        const src = p.data.source ?? p.data.start;
        if (!src) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Missing "source" for Dijkstra.',
                path: ["input"],
            });
        }
        if (src && !p.data.nodes.includes(src)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Source node "${src}" is not in nodes.`,
                path: ["input", "source"],
            });
        }
    }
    else if (algorithm === "bubbleSort" || algorithm === "mergeSort") {
        const p = sortInput.safeParse(input);
        if (!p.success) {
            p.error.issues.forEach((i) => ctx.addIssue({ ...i, path: ["input", ...i.path] }));
        }
    }
    else if (algorithm === "binaryTreeTraversal") {
        const p = treeInput.safeParse(input);
        if (!p.success) {
            p.error.issues.forEach((i) => ctx.addIssue({ ...i, path: ["input", ...i.path] }));
        }
    }
});
export const analyzeCodeRequestSchema = z.object({
    code: z.string().min(1, "Code is required."),
    language: z.enum(["cpp", "java", "unknown"]).optional(),
});
//# sourceMappingURL=validators.js.map